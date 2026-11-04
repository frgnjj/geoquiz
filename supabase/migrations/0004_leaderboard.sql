-- The leaderboard: every saved best with its username and rank on its board.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.

-- Rank order matches submit_score: higher score, then more right answers, then whoever got there first.
create view public.leaderboard
with (security_invoker = true)
as
select
  s.board,
  s.user_id,
  p.username,
  s.score,
  s.correct,
  s.asked,
  s.achieved_at,
  row_number() over (
    partition by s.board
    order by s.score desc, s.correct desc, s.achieved_at
  )::int as rank
from public.scores s
join public.profiles p on p.id = s.user_id;

grant select on public.leaderboard to anon, authenticated;
