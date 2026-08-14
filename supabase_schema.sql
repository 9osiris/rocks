-- ============================================================================
-- OSIRIS WATCH — COMPLETE SUPABASE INTERNAL DATABASE SCHEMA & BACKEND ARCHITECTURE
-- Run this script in the Supabase SQL Editor (https://app.supabase.com)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE media_type_enum AS ENUM ('movie', 'tv');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_tier_enum AS ENUM ('Standard Member', 'Pro Cinephile', 'VIP Contributor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    avatar_url TEXT,
    banner_url TEXT,
    bio TEXT DEFAULT '',
    tier user_tier_enum DEFAULT 'Pro Cinephile',
    total_watch_time INT DEFAULT 0, -- in seconds
    movies_watched INT DEFAULT 0,
    series_watched INT DEFAULT 0,
    streak_days INT DEFAULT 1,
    preferences JSONB DEFAULT '{"accent": "ffffff", "provider": "cinesrc", "autoplay": true}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WATCHLISTS TABLE
CREATE TABLE IF NOT EXISTS public.watchlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    media_id TEXT NOT NULL,
    media_type media_type_enum NOT NULL,
    title TEXT NOT NULL,
    poster_path TEXT,
    rating NUMERIC(3,1),
    notes TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_media UNIQUE (user_id, media_id, media_type)
);

-- 5. WATCH PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    media_id TEXT NOT NULL,
    media_type media_type_enum NOT NULL,
    season INT DEFAULT 1,
    episode INT DEFAULT 1,
    current_time NUMERIC(10,2) DEFAULT 0,
    duration NUMERIC(10,2) DEFAULT 0,
    progress_pct NUMERIC(5,2) DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_progress UNIQUE (user_id, media_id, media_type)
);

-- 6. CUSTOM PLAYLISTS TABLE
CREATE TABLE IF NOT EXISTS public.playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    is_public BOOLEAN DEFAULT TRUE,
    share_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PLAYLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.playlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    media_id TEXT NOT NULL,
    media_type media_type_enum NOT NULL,
    title TEXT NOT NULL,
    poster_path TEXT,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_playlist_media UNIQUE (playlist_id, media_id, media_type)
);

-- 8. WATCH HISTORY LOG TABLE
CREATE TABLE IF NOT EXISTS public.watch_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    media_id TEXT NOT NULL,
    media_type media_type_enum NOT NULL,
    title TEXT NOT NULL,
    season INT,
    episode INT,
    watched_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- HIGH-PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_user ON public.watchlists(user_id, media_type);
CREATE INDEX IF NOT EXISTS idx_progress_user ON public.progress(user_id, media_type, media_id);
CREATE INDEX IF NOT EXISTS idx_playlists_user ON public.playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_items_playlist ON public.playlist_items(playlist_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_user ON public.watch_history(user_id, watched_at DESC);

-- ============================================================================
-- AUTOMATED TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function 1: Automatically handle new user sign-up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, username, avatar_url, bio)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_user_meta_data->>'bio', '')
    )
    ON CONFLICT (user_id) DO UPDATE SET
        username = EXCLUDED.username,
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Fire on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function 2: Automatically update timestamp on profile edit
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_progress_updated_at ON public.progress;
CREATE TRIGGER trg_progress_updated_at
    BEFORE UPDATE ON public.progress
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Function 3: RPC function to calculate user statistics internally
CREATE OR REPLACE FUNCTION public.get_user_stats(target_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    v_watch_secs INT;
    v_movies INT;
    v_series INT;
    v_saved INT;
BEGIN
    SELECT COALESCE(SUM(current_time), 0)::INT INTO v_watch_secs
    FROM public.progress WHERE user_id = target_user_id;

    SELECT COUNT(*) INTO v_movies
    FROM public.progress WHERE user_id = target_user_id AND media_type = 'movie' AND progress_pct >= 85;

    SELECT COUNT(*) INTO v_series
    FROM public.progress WHERE user_id = target_user_id AND media_type = 'tv';

    SELECT COUNT(*) INTO v_saved
    FROM public.watchlists WHERE user_id = target_user_id;

    result := jsonb_build_object(
        'total_watch_seconds', v_watch_secs,
        'movies_completed', v_movies,
        'series_episodes_watched', v_series,
        'watchlist_saved_count', v_saved
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 4: Atomic Account Deletion Helper RPC
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    DELETE FROM public.watchlists WHERE user_id = v_user_id;
    DELETE FROM public.progress WHERE user_id = v_user_id;
    DELETE FROM public.playlists WHERE user_id = v_user_id;
    DELETE FROM public.watch_history WHERE user_id = v_user_id;
    DELETE FROM public.profiles WHERE user_id = v_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- DATABASE VIEWS
-- ============================================================================

-- View 1: User Dashboard Summary
CREATE OR REPLACE VIEW public.user_dashboard_summary AS
SELECT 
    p.user_id,
    p.username,
    p.avatar_url,
    p.bio,
    p.tier,
    p.created_at AS joined_at,
    COALESCE(w.watchlist_count, 0) AS total_watchlist_items,
    COALESCE(pr.completed_count, 0) AS total_completed_titles
FROM public.profiles p
LEFT JOIN (
    SELECT user_id, COUNT(*) AS watchlist_count 
    FROM public.watchlists 
    GROUP BY user_id
) w ON w.user_id = p.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS completed_count 
    FROM public.progress 
    WHERE progress_pct >= 85 
    GROUP BY user_id
) pr ON pr.user_id = p.user_id;

-- View 2: Community Trending Picks
CREATE OR REPLACE VIEW public.community_trending_picks AS
SELECT 
    media_id,
    media_type,
    title,
    poster_path,
    COUNT(*) AS total_saves
FROM public.watchlists
GROUP BY media_id, media_type, title, poster_path
ORDER BY total_saves DESC
LIMIT 30;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, User write
CREATE POLICY "Public Profiles Read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users Update Own Profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users Insert Own Profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Watchlists: User access only
CREATE POLICY "Users Manage Own Watchlist" ON public.watchlists FOR ALL USING (auth.uid() = user_id);

-- Progress: User access only
CREATE POLICY "Users Manage Own Progress" ON public.progress FOR ALL USING (auth.uid() = user_id);

-- Playlists: Public read if is_public, User manage
CREATE POLICY "Playlists Read Policy" ON public.playlists FOR SELECT USING (is_public OR auth.uid() = user_id);
CREATE POLICY "Playlists User Manage" ON public.playlists FOR ALL USING (auth.uid() = user_id);

-- Playlist Items: Read if playlist public, User manage
CREATE POLICY "Playlist Items Read" ON public.playlist_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.playlists WHERE id = playlist_id AND (is_public OR user_id = auth.uid()))
);
CREATE POLICY "Playlist Items Manage" ON public.playlist_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.playlists WHERE id = playlist_id AND user_id = auth.uid())
);

-- Watch History: User access only
CREATE POLICY "Users Manage Own History" ON public.watch_history FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- REALTIME PUBSUB SETUP
-- ============================================================================
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.progress;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.watchlists;
EXCEPTION
    WHEN OTHERS THEN null;
END $$;
