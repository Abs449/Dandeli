-- Dandeli website — Supabase schema
-- Run this in the Supabase SQL editor (Project → SQL → New query).
-- It creates the four tables and enables row-level security policies that
-- let the public read services/packages/reviews and submit bookings.

create table if not exists services (
  id serial primary key,
  name text not null,
  short_description text,
  full_description text,
  image text,
  images text[] default '{}',
  price text,
  duration text,
  difficulty text,
  equipment text[] default '{}',
  category text default 'activity',
  display_order int default 0,
  created_at timestamptz default now()
);

create table if not exists packages (
  id serial primary key,
  name text not null,
  price text not null,
  duration text,
  activities text[] default '{}',
  recommended boolean default false,
  image text,
  display_order int default 0
);

create table if not exists reviews (
  id serial primary key,
  name text not null,
  rating int check (rating between 1 and 5),
  review text,
  platform text,
  platform_url text,
  display_order int default 0
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  whatsapp text,
  package_name text,
  preferred_date date,
  adults int default 1,
  children int default 0,
  accommodation boolean default false,
  transportation boolean default false,
  food_package boolean default false,
  special_requests text,
  created_at timestamptz default now()
);

-- RLS: public read for content; anon insert for bookings; nothing else.
alter table services enable row level security;
alter table packages enable row level security;
alter table reviews enable row level security;
alter table bookings enable row level security;

drop policy if exists "public read services" on services;
drop policy if exists "public read packages" on packages;
drop policy if exists "public read reviews" on reviews;
drop policy if exists "anon insert bookings" on bookings;

create policy "public read services" on services for select to anon using (true);
create policy "public read packages" on packages for select to anon using (true);
create policy "public read reviews" on reviews for select to anon using (true);
create policy "anon insert bookings" on bookings for insert to anon with check (true);
