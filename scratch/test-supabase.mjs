import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://geczymltkrlvkhkdzhdq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlY3p5bWx0a3Jsdmtoa2R6aGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NDA1NTQsImV4cCI6MjA5OTAxNjU1NH0.osMWw28wc1elgW4mdnxuStFloZnknsXWXlUlCL1Pcgc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection to:', supabaseUrl);
  try {
    const { data, error } = await supabase.from('reader_profiles').select('*').limit(1);
    if (error) {
      console.log('Response Error (table might need to be created):', error.message, error.code);
    } else {
      console.log('Success! Table exists. Data:', data);
    }
  } catch (err) {
    console.error('Network or client error:', err);
  }
}

testConnection();
