create extension if not exists "pgcrypto";

create type public.user_role as enum ('donor', 'recipient', 'volunteer', 'admin');
create type public.donation_status as enum ('available', 'reserved', 'matched', 'in_transit', 'delivered', 'expired');
create type public.request_status as enum ('pending', 'matched', 'fulfilled', 'cancelled');
create type public.delivery_status as enum ('assigned', 'picking_up', 'in_transit', 'delivered', 'failed');
create type public.urgency_level as enum ('low', 'medium', 'high');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null,
  name text not null,
  phone text,
  avatar_url text,
  address text,
  city text,
  country text default 'USA',
  lat double precision,
  lng double precision,
  rating numeric(3,2) not null default 0,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.food_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  icon text not null,
  created_at timestamptz not null default now()
);

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category_id uuid not null references public.food_categories(id),
  quantity numeric not null check (quantity > 0),
  unit text not null,
  expiry_at timestamptz not null,
  address text not null,
  city text not null default 'Unknown',
  country text not null default 'USA',
  lat double precision,
  lng double precision,
  status public.donation_status not null default 'available',
  is_urgent boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.donation_images (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null references public.donations(id) on delete cascade,
  path text not null,
  created_at timestamptz not null default now()
);

create table public.food_requests (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  quantity numeric not null check (quantity > 0),
  urgency public.urgency_level not null default 'medium',
  notes text,
  address text not null,
  city text not null default 'Unknown',
  country text not null default 'USA',
  lat double precision,
  lng double precision,
  status public.request_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.deliveries (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null references public.donations(id) on delete cascade,
  volunteer_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  status public.delivery_status not null default 'assigned',
  pickup_time timestamptz,
  delivery_time timestamptz,
  proof_image_path text,
  notes text,
  estimated_minutes integer,
  distance_km numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.community_stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null,
  image_url text,
  author text not null,
  role text not null,
  category text not null,
  likes integer not null default 0,
  comments_count integer not null default 0,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.community_tips (
  id uuid primary key default gen_random_uuid(),
  icon text not null,
  title text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table public.community_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date timestamptz not null,
  location text not null,
  attendees integer not null default 0,
  created_at timestamptz not null default now()
);

create index donations_donor_id_idx on public.donations(donor_id);
create index donations_status_idx on public.donations(status);
create index deliveries_volunteer_id_idx on public.deliveries(volunteer_id);

alter table public.profiles enable row level security;
alter table public.food_categories enable row level security;
alter table public.donations enable row level security;
alter table public.donation_images enable row level security;
alter table public.food_requests enable row level security;
alter table public.deliveries enable row level security;
alter table public.community_stories enable row level security;
alter table public.community_tips enable row level security;
alter table public.community_events enable row level security;

create policy "profiles_select_authenticated" on public.profiles for select to authenticated using (true);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);

create policy "categories_public_read" on public.food_categories for select using (true);
create policy "donations_public_read" on public.donations for select using (true);
create policy "donations_insert_donor" on public.donations for insert to authenticated with check (auth.uid() = donor_id);
create policy "donations_update_owner" on public.donations for update to authenticated using (auth.uid() = donor_id);
create policy "donation_images_public_read" on public.donation_images for select using (true);
create policy "donation_images_owner_insert" on public.donation_images for insert to authenticated with check (
  exists(select 1 from public.donations d where d.id = donation_id and d.donor_id = auth.uid())
);

create policy "requests_select_own" on public.food_requests for select to authenticated using (recipient_id = auth.uid());
create policy "requests_insert_own" on public.food_requests for insert to authenticated with check (recipient_id = auth.uid());

create policy "deliveries_select_involved" on public.deliveries for select to authenticated using (
  volunteer_id = auth.uid() or recipient_id = auth.uid()
);

create policy "community_read_stories" on public.community_stories for select using (true);
create policy "community_read_tips" on public.community_tips for select using (true);
create policy "community_read_events" on public.community_events for select using (true);

insert into public.food_categories (name, icon) values
  ('Vegetables', '🥬'),
  ('Fruits', '🍎'),
  ('Bakery', '🍞'),
  ('Dairy', '🧀'),
  ('Prepared Food', '🍱'),
  ('Meat & Seafood', '🥩'),
  ('Canned Goods', '🥫'),
  ('Beverages', '🥤')
on conflict (name) do nothing;

insert into storage.buckets (id, name, public) values ('donation-images', 'donation-images', true)
on conflict (id) do nothing;

create policy "public_read_donation_images" on storage.objects for select using (bucket_id = 'donation-images');
create policy "authenticated_upload_own_donation_images" on storage.objects for insert to authenticated
with check (bucket_id = 'donation-images' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "authenticated_delete_own_donation_images" on storage.objects for delete to authenticated
using (bucket_id = 'donation-images' and auth.uid()::text = (storage.foldername(name))[1]);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, name, phone)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'donor'),
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

