create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text unique,
  avatar_url text, -- for profile photo
  sms_credits integer default 0,
  balance numeric default 0.00,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Keep user data private with RLS
alter table public.users enable row level security;

-- RLS policy to allow users to access only their own data
create policy "Users can access their own data"
  on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own data"
  on public.users
  for update using (auth.uid() = id);
