-- ==========================================
-- SUPABASE AUTH SETUP SCRIPT (SAFE UPDATE)
-- ==========================================
-- Run this script in your Supabase SQL Editor.
-- It will safely update your existing 'profiles' table.

DO $$ 
BEGIN 
    -- 1. Add 'role' column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'employee';
    END IF;

    -- 2. Enable RLS if not already enabled
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    -- 3. Create policies if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- 4. Create or Replace the trigger function (always safe to replace)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'employee')
  ON CONFLICT (id) DO NOTHING; -- Safe insert
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Drop and recreate trigger to ensure it's hooked up correctly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- NEXT STEPS
-- ==========================================
-- 1. Go to Authentication -> Users and create your users (manager@test.com, employee@test.com).
-- 2. Go to Table Editor -> profiles table.
-- 3. Change the 'role' of the manager user to 'manager'.
-- 4. IMPORTANT: Update 'src/supabase.js' with your URL and KEY.
