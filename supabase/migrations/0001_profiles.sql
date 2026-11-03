-- Players: one row per account, holding the public username.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.

-- Usernames that can't be picked: reserved names, and words that are offensive anywhere in a name.
create function public.is_blocked_username(name text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select lower(name) in ('admin', 'administrator', 'geoquiz', 'moderator', 'mod', 'support', 'staff', 'official', 'null', 'undefined')
      or lower(name) ~ '(fuck|shit|cunt|nigg|faggot|bitch|whore|slut|rapist|nazi|hitler|porn|pussy|retard|kike|wank)'
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  created_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[A-Za-z0-9_]{3,20}$'),
  constraint username_allowed check (not public.is_blocked_username(username))
);

-- "Ricardo" and "ricardo" count as the same name.
create unique index profiles_username_unique on public.profiles (lower(username));

alter table public.profiles enable row level security;

-- Anyone can see usernames (leaderboards and profiles are public).
create policy "Profiles are public"
  on public.profiles for select
  using (true);

-- Players can only create and rename their own profile.
create policy "Players create their own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Players rename their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Only the username can be written; the join date stays as it was.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant insert (id, username), update (username) on public.profiles to authenticated;
