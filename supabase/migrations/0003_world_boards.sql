-- Ranked World: all 197 countries in 5 min, +5 s per right answer, as four more boards.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.

insert into public.boards (id, questions, base_seconds)
select m || ':' || a || ':world', 197, 300
from unnest(array['flags', 'capitals']) as m,
     unnest(array['choice', 'type']) as a;
