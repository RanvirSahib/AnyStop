-- AnyStop Supabase PostgreSQL Database Schema
-- Run this in your Supabase Project's SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create a table for public user profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text,
  phone text,
  ticket_no text,
  home_stop text,
  preferred_class text,
  total_searches integer default 0,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS) on profiles
alter table public.profiles enable row level security;

-- 3. Create RLS Policies for secure user access
create policy "Users can view their own profile."
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile."
  on public.profiles for update
  using (auth.uid() = id);

-- 4. Automatically create profile row when a new user signs up in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    name,
    email,
    phone,
    ticket_no,
    home_stop,
    preferred_class,
    avatar_url
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'ticketNo', 'NO. ' || floor(random() * 8999 + 1000)::text),
    coalesce(new.raw_user_meta_data->>'homeStop', 'Chandigarh ISBT-43'),
    coalesce(new.raw_user_meta_data->>'preferredClass', 'All Types'),
    new.raw_user_meta_data->>'avatarUrl'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to execute handle_new_user on every auth.users signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Optional: Table for crowd-sourced spotted buses (synced to Postgres)
create table if not exists public.spotted_buses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  user_name text not null,
  service_name text not null,
  route_label text not null,
  current_location text not null,
  heading_to text not null,
  crowd_level text not null,
  reported_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.spotted_buses enable row level security;

create policy "Anyone can view spotted buses."
  on public.spotted_buses for select
  using (true);

create policy "Authenticated users can submit spotted buses."
  on public.spotted_buses for insert
  with check (auth.role() = 'authenticated');

-- 6. Storage Bucket for User Avatars & Profile Pictures
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Authenticated users can upload avatars."
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Users can update their own avatar."
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid() = owner);

create policy "Users can delete their own avatar."
  on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid() = owner);
