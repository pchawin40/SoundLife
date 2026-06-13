-- SoundLife — Supabase schema v2
-- Run this in the Supabase SQL editor or via `supabase db push`.
-- Catalog tables are public-read (active rows only); analytics tables are
-- public-insert only. Nothing is publicly updatable or deletable.

create extension if not exists pgcrypto;

/* ------------------------------ catalog ------------------------------ */

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null,
  language text not null default 'english',
  region text not null default 'global',
  country text,
  genres text[] not null default '{}',
  moods text[] not null default '{}',
  era text,
  spotify_url text,
  apple_music_url text,
  youtube_music_url text,
  youtube_video_id text,
  traits jsonb not null default '{}',
  scenarios text[] not null default '{}',
  chips jsonb not null default '[]',
  is_active boolean not null default true,
  popularity_score numeric not null default 0,
  explicit boolean not null default false,
  energy_level smallint,
  tempo_level smallint,
  lyric_density smallint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vibe_cards (
  id text primary key,
  emoji text not null default '🎵',
  title text not null,
  subtitle text not null default '',
  traits jsonb not null default '{}',
  feedback text not null default '+ Vibe',
  card_type text,
  gradient text,
  boost_genres text[] default '{}',
  block_genres text[] default '{}',
  boost_languages text[] default '{}',
  boost_regions text[] default '{}',
  why_text text,
  is_active boolean not null default true
);

create table if not exists public.scenarios (
  id text primary key,
  emoji text not null default '🎵',
  label text not null,
  tagline text not null default '',
  base_traits jsonb not null default '{}',
  deck text[] not null default '{}',
  is_active boolean not null default true
);

create table if not exists public.catalog_versions (
  id text primary key,
  version integer not null,
  published_at timestamptz not null default now()
);

/* ----------------------------- analytics ----------------------------- */

create table if not exists public.result_events (
  id uuid primary key default gen_random_uuid(),
  scenario_id text,
  liked_card_ids text[] not null default '{}',
  super_vibe_ids text[] not null default '{}',
  identity text,
  top_traits jsonb not null default '[]',
  top_song_ids text[] not null default '{}',
  language_filter text,
  region_filter text,
  match_percent smallint,
  created_at timestamptz not null default now()
);

create table if not exists public.outbound_click_events (
  id uuid primary key default gen_random_uuid(),
  song_id uuid,
  platform text not null,
  campaign text not null default 'soundlife',
  result_identity text,
  created_at timestamptz not null default now()
);

/* ------------------------------ indexes ------------------------------ */

create unique index if not exists songs_title_artist_key
  on public.songs ((lower(title)), (lower(artist)));

create index if not exists songs_language_idx on public.songs (language);
create index if not exists songs_region_idx on public.songs (region);
create index if not exists songs_genres_idx on public.songs using gin (genres);
create index if not exists songs_moods_idx on public.songs using gin (moods);
create index if not exists songs_scenarios_idx on public.songs using gin (scenarios);
create index if not exists songs_is_active_idx on public.songs (is_active);
create index if not exists songs_popularity_idx on public.songs (popularity_score desc);
create index if not exists vibe_cards_is_active_idx on public.vibe_cards (is_active);
create index if not exists vibe_cards_card_type_idx on public.vibe_cards (card_type);
create index if not exists scenarios_is_active_idx on public.scenarios (is_active);
create index if not exists result_events_created_at_idx on public.result_events (created_at);
create index if not exists outbound_clicks_created_at_idx on public.outbound_click_events (created_at);

/* ------------------------- updated_at trigger ------------------------ */

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists songs_set_updated_at on public.songs;
create trigger songs_set_updated_at
  before update on public.songs
  for each row execute function public.set_updated_at();

/* -------------------------------- RLS -------------------------------- */

alter table public.songs enable row level security;
alter table public.vibe_cards enable row level security;
alter table public.scenarios enable row level security;
alter table public.catalog_versions enable row level security;
alter table public.result_events enable row level security;
alter table public.outbound_click_events enable row level security;

drop policy if exists "public read active songs" on public.songs;
create policy "public read active songs"
  on public.songs for select
  using (is_active = true);

drop policy if exists "public read active vibe cards" on public.vibe_cards;
create policy "public read active vibe cards"
  on public.vibe_cards for select
  using (is_active = true);

drop policy if exists "public read active scenarios" on public.scenarios;
create policy "public read active scenarios"
  on public.scenarios for select
  using (is_active = true);

drop policy if exists "public read catalog versions" on public.catalog_versions;
create policy "public read catalog versions"
  on public.catalog_versions for select
  using (true);

drop policy if exists "public insert result events" on public.result_events;
create policy "public insert result events"
  on public.result_events for insert
  with check (true);

drop policy if exists "public insert outbound clicks" on public.outbound_click_events;
create policy "public insert outbound clicks"
  on public.outbound_click_events for insert
  with check (true);

/* -------------- catalog version bump (run after schema changes) -------------- */
-- insert into public.catalog_versions (id, version) values ('v2', 2)
-- on conflict (id) do update set version = 2, published_at = now();
