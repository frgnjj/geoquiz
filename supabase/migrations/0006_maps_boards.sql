-- Maps leaderboards: Find it, Name it (multiple choice) and Name it (typed), each with
-- Hardcore, World and the six continents. 24 boards, the same sizes and clocks as Flags and Capitals.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.

insert into public.boards (id, questions, base_seconds)
select 'maps:' || a || ':' || p.id, p.questions, p.base_seconds
from unnest(array['find', 'choice', 'type']) as a,
     (values
       ('hardcore', 197, 60),
       ('world', 197, 300),
       ('africa', 54, 300),
       ('asia', 49, 300),
       ('europe', 45, 300),
       ('north-america', 23, 300),
       ('south-america', 12, 300),
       ('oceania', 14, 300)
     ) as p (id, questions, base_seconds);
