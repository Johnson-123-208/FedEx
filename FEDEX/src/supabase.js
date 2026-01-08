import { createClient } from '@supabase/supabase-js';

// REPLACE THESE WITH YOUR ACTUAL SUPABASE CREDENTIALS
// You can find these in your Supabase Dashboard -> Project Settings -> API
const supabaseUrl = 'https://ookbgjdpulamlmfcdgxg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9va2JnamRwdWxhbWxtZmNkZ3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4Nzc2NDYsImV4cCI6MjA4MzQ1MzY0Nn0.zB78ENU_rq5pf5wtbNhYZC7UftybUzOm3VUDgQr8nm8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
