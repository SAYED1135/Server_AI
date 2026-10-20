// تهيئة اتصال Supabase للمنصة الحقيقية
const SUPABASE_URL = 'https://clcclgbmzngonhqjikhq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsY2NsZ2Jtem5nb25ocWppa2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1MDQ2MTMsImV4cCI6MjEwODA4MDYxM30.mUl2a5MgP2et3rWIZBNeZfo2XWEvfdEVhZXl4COYitI';

let supabaseClient = null;
let supabaseReady = false;
let readyCallbacks = [];

function initSupabase() {
  if (typeof supabase === 'undefined') {
    console.warn('مكتبة Supabase غير محملة بعد');
    return false;
  }
  try {
    if (!supabaseClient) {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('تم تهيئة اتصال Supabase بنجاح');
    }
    supabaseReady = true;
    readyCallbacks.forEach(cb => cb());
    readyCallbacks = [];
    return true;
  } catch (err) {
    console.error('فشل تهيئة Supabase:', err);
    return false;
  }
}

function getSupabase() {
  return supabaseClient;
}

function onSupabaseReady(callback) {
  if (supabaseReady) {
    callback();
  } else {
    readyCallbacks.push(callback);
  }
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
    setTimeout(() => {
      if (!supabaseReady) {
        console.error('فشل تحميل مكتبة Supabase بعد 15 ثانية');
      }
    }, 15000);
  }
}