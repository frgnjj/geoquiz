-- Lets players delete their own account. Their profile and scores go with it (on delete cascade).
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.

create function public.delete_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_signed_in';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_account from public, anon;
grant execute on function public.delete_account to authenticated;
