-- Create Users Table
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  username text unique,
  job_title text,
  bio text,
  avatar_url text, -- For MVP we can use a placeholder or upload
  social_links jsonb, -- Store detailed links: { "linkedin": "...", "twitter": "..." }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Policies for Users
create policy "Public profiles are viewable by everyone."
  on public.users for select
  using ( true );

create policy "Users can insert their own profile."
  on public.users for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.users for update
  using ( auth.uid() = id );

-- Create Scans/Analytics Table
create table public.scans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  ip_address text,
  country text,
  device_type text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.scans enable row level security;

-- Policies for Scans
create policy "Users can view scans of their own profile."
  on public.scans for select
  using ( auth.uid() = user_id );

create policy "Anyone can insert a scan (logging)."
  on public.scans for insert
  with check ( true ); 
