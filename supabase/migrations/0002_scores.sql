-- Ranked scores: each player's best on each of the 28 boards.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.

-- The 28 boards. Ids match boardId() in lib/ranked.ts.
create table public.boards (
  id text primary key,
  questions int not null,      -- countries in the game
  base_seconds int not null    -- starting time; every board adds 5 s per right answer
);

insert into public.boards (id, questions, base_seconds)
select m || ':' || a || ':' || p.id, p.questions, p.base_seconds
from unnest(array['flags', 'capitals']) as m,
     unnest(array['choice', 'type']) as a,
     (values
       ('hardcore', 197, 60),
       ('africa', 54, 300),
       ('asia', 49, 300),
       ('europe', 45, 300),
       ('north-america', 23, 300),
       ('south-america', 12, 300),
       ('oceania', 14, 300)
     ) as p (id, questions, base_seconds);

create table public.scores (
  user_id uuid not null references public.profiles (id) on delete cascade,
  board text not null references public.boards (id),
  score int not null,
  correct int not null,
  asked int not null,
  played_ms int not null,
  achieved_at timestamptz not null default now(),
  primary key (user_id, board)
);

-- Leaderboard order: higher score, then more right answers, then whoever got there first.
create index scores_ranking on public.scores (board, score desc, correct desc, achieved_at);

alter table public.boards enable row level security;
alter table public.scores enable row level security;

create policy "Boards are public" on public.boards for select using (true);
create policy "Scores are public" on public.scores for select using (true);

-- Nobody writes scores directly: they only go in through submit_score below.
revoke all on public.boards, public.scores from anon, authenticated;
grant select on public.boards, public.scores to anon, authenticated;

-- Checks a finished ranked game, keeps it if it's the player's best on that board,
-- and returns their best and rank: { improved, score, correct, rank }.
create function public.submit_score(
  p_board text,
  p_score int,
  p_correct int,
  p_asked int,
  p_played_ms int
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  b public.boards;
  allowed_ms int;
  best public.scores;
  improved boolean := false;
  player_rank int;
begin
  if uid is null then
    raise exception 'not_signed_in';
  end if;
  if not exists (select 1 from public.profiles where id = uid) then
    raise exception 'no_username';
  end if;

  select * into b from public.boards where id = p_board;
  if not found then
    raise exception 'unknown_board';
  end if;

  -- Basic checks that the numbers could come from a real game.
  allowed_ms := (b.base_seconds + 5 * p_correct) * 1000;
  if p_asked < 1 or p_asked > b.questions
     or p_correct < 0 or p_correct > p_asked
     or p_score < 0 or p_score % 5 <> 0 or p_score > 25 * p_correct
     -- At most the starting time plus every bonus earned, with a little slack.
     or p_played_ms > allowed_ms + 3000
     -- Each right answer waits 0.7 s before the next question, and each miss 1.8 s.
     or p_played_ms < p_correct * 700 + (p_asked - p_correct) * 1800 - 3000
     -- A game that didn't reach every country ended because time ran out.
     or (p_asked < b.questions and p_played_ms < allowed_ms - 3000)
  then
    raise exception 'impossible_score';
  end if;

  select * into best from public.scores where user_id = uid and board = p_board;
  if not found or p_score > best.score or (p_score = best.score and p_correct > best.correct) then
    insert into public.scores (user_id, board, score, correct, asked, played_ms, achieved_at)
    values (uid, p_board, p_score, p_correct, p_asked, p_played_ms, now())
    on conflict (user_id, board) do update
      set score = excluded.score,
          correct = excluded.correct,
          asked = excluded.asked,
          played_ms = excluded.played_ms,
          achieved_at = excluded.achieved_at;
    improved := true;
    select * into best from public.scores where user_id = uid and board = p_board;
  end if;

  select count(*) + 1 into player_rank
  from public.scores s
  where s.board = p_board
    and (s.score > best.score
      or (s.score = best.score and s.correct > best.correct)
      or (s.score = best.score and s.correct = best.correct and s.achieved_at < best.achieved_at));

  return json_build_object(
    'improved', improved,
    'score', best.score,
    'correct', best.correct,
    'rank', player_rank
  );
end;
$$;

revoke all on function public.submit_score from public, anon;
grant execute on function public.submit_score to authenticated;
