// supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://msfnvmxeohsanzobbqrt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zZm52bXhlb2hzYW56b2JicXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0OTQ2MjQsImV4cCI6MjA2MTA3MDYyNH0.03xsKZvy9ak2ND4xFJef2YYeG9N71UlVjT8kRCt0DG8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);