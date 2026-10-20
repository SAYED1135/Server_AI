// تهيئة اتصال Supabase للمنصة الحقيقية
const SUPABASE_URL = 'https://clcclgbmzngonhqjikhq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsY2NsZ2Jtem5nb25ocWppa2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1MDQ2MTMsImV4cCI6MjEwODA4MDYxM30.mUl2a5MgP2et3rWIZBNeZfo2XWEvfdEVhZXl4COYitI';

let supabaseClient = null;

function initSupabase() {
  if (typeof supabase === 'undefined') {
    console.error('مكتبة Supabase غير محملة.');
    return null;
  }
  if (!supabaseClient) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('تم تهيئة اتصال Supabase بنجاح');
  }
  return supabaseClient;
}

function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = initSupabase();
  }
  return supabaseClient;
}

// تهيئة فورية إذا كانت المكتبة متاحة
if (typeof window !== 'undefined') {
  if (typeof supabase !== 'undefined') {
    initSupabase();
  } else {
    const checkSupabase = setInterval(() => {
      if (typeof supabase !== 'undefined') {
        initSupabase();
        clearInterval(checkSupabase);
      }
    }, 100);
  }
}