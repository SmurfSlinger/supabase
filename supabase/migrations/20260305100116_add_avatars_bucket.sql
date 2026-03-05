-- Create an avatars bucket for profile images
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Policies for storage.objects
-- Allow anyone to read objects from the public avatars bucket
drop policy if exists "Public read avatars" on storage.objects;
create policy "Public read avatars"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

-- Allow authenticated users to upload to avatars bucket
drop policy if exists "Users can upload avatars" on storage.objects;
create policy "Users can upload avatars"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'avatars');

-- Allow authenticated users to update/delete their own uploaded objects
drop policy if exists "Users can update own avatars" on storage.objects;
create policy "Users can update own avatars"
on storage.objects
for update
to authenticated
using (bucket_id = 'avatars' and owner = auth.uid())
with check (bucket_id = 'avatars' and owner = auth.uid());

drop policy if exists "Users can delete own avatars" on storage.objects;
create policy "Users can delete own avatars"
on storage.objects
for delete
to authenticated
using (bucket_id = 'avatars' and owner = auth.uid());