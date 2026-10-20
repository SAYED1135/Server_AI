// سيرفر نور - منطق المصادقة باستخدام Supabase Auth حقيقي

let supabase = null;
let isSupabaseReady = false;

// عناصر الصفحة
const statusBox = document.getElementById('supabase-status');
const statusIcon = document.getElementById('supabase-status-icon');
const statusText = document.getElementById('supabase-status-text');
const btnLogin = document.getElementById('btn-login-submit');
const btnRegister = document.getElementById('btn-register-submit');

function setButtonsEnabled(enabled) {
  if (btnLogin) {
    btnLogin.disabled = !enabled;
    btnLogin.classList.toggle('opacity-50', !enabled);
    btnLogin.classList.toggle('cursor-not-allowed', !enabled);
  }
  if (btnRegister) {
    btnRegister.disabled = !enabled;
    btnRegister.classList.toggle('opacity-50', !enabled);
    btnRegister.classList.toggle('cursor-not-allowed', !enabled);
  }
}

function updateSupabaseStatus(ready, message) {
  isSupabaseReady = ready;
  const readyInd = document.getElementById('supabase-ready-indicator');
  if (ready) {
    if (statusBox) {
      statusBox.classList.remove('hidden');
      statusBox.className = 'mb-6 p-3 rounded-lg text-sm bg-emerald-50 border border-emerald-200 text-emerald-800';
    }
    if (statusIcon) statusIcon.textContent = '✓';
    if (statusText) statusText.textContent = message || 'تم تحميل خدمات المنصة — الأزرار جاهزة';
    if (readyInd) { readyInd.classList.remove('hidden'); readyInd.classList.add('inline'); }
    setButtonsEnabled(true);
  } else {
    if (statusBox) {
      statusBox.classList.remove('hidden');
      statusBox.className = 'mb-6 p-3 rounded-lg text-sm bg-amber-50 border border-amber-200 text-amber-800';
    }
    if (readyInd) readyInd.classList.add('hidden');
    if (statusIcon) statusIcon.textContent = '⚠️';
    if (statusText) statusText.textContent = message || 'المكتبة غير جاهزة';
    setButtonsEnabled(false);
  }
}

function waitForSupabase() {
  return new Promise((resolve) => {
    // تحقق فوري
    if (typeof getSupabase === 'function') {
      const client = getSupabase();
      if (client) {
        supabase = client;
        updateSupabaseStatus(true, 'تم تحميل خدمات المنصة بنجاح');
        resolve(client);
        return;
      }
    }

    // انتظار عبر 콜백
    if (typeof onSupabaseReady === 'function') {
      onSupabaseReady(() => {
        supabase = getSupabase();
        updateSupabaseStatus(true, 'تم تحميل خدمات المنصة بنجاح');
        resolve(supabase);
      });
    }

    // fallback بعد 10 ثواني
    setTimeout(() => {
      if (!supabase) {
        updateSupabaseStatus(false, 'فشل تحميل خدمات المنصة. يرجى تحديث الصفحة أو التحقق من اتصالك بالإنترنت.');
        resolve(null);
      }
    }, 10000);
  });
}

async function ensureProfile(user) {
  try {
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!existing) {
      await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }
  } catch (err) {
    console.error('خطأ في إنشاء الملف الشخصي:', err);
  }
}

async function initAuth() {
  await waitForSupabase();

  if (!supabase) return;

  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  // التحقق من وجود جلسة موجودة
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      window.location.href = 'dashboard.html';
    }
  } catch (err) {
    console.error('فحص الجلسة:', err);
  }

  // التبديل بين التبويبات
  tabLogin.addEventListener('click', () => {
    tabLogin.classList.replace('bg-slate-100', 'bg-indigo-600');
    tabLogin.classList.replace('text-slate-500', 'text-white');
    tabLogin.classList.add('shadow-lg');
    tabRegister.classList.replace('bg-indigo-600', 'bg-slate-100');
    tabRegister.classList.replace('text-white', 'text-slate-500');
    tabRegister.classList.remove('shadow-lg');
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.classList.replace('bg-slate-100', 'bg-indigo-600');
    tabRegister.classList.replace('text-slate-500', 'text-white');
    tabRegister.classList.add('shadow-lg');
    tabLogin.classList.replace('bg-indigo-600', 'bg-slate-100');
    tabLogin.classList.replace('text-white', 'text-slate-500');
    tabLogin.classList.remove('shadow-lg');
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
  });

  // تسجيل الدخول عبر Supabase
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    btnLogin.textContent = 'جاري الدخول...';
    btnLogin.disabled = true;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        alert('خطأ: ' + error.message);
        btnLogin.textContent = 'تسجيل الدخول';
        btnLogin.disabled = false;
        return;
      }

      if (data.user) {
        await ensureProfile(data.user);
        alert('تم تسجيل الدخول بنجاح!');
        window.location.href = 'dashboard.html';
      }
    } catch (err) {
      alert('خطأ غير متوقع: ' + err.message);
      btnLogin.textContent = 'تسجيل الدخول';
      btnLogin.disabled = false;
    }
  });

  // إنشاء حساب جديد عبر Supabase
  formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    btnRegister.textContent = 'جاري إنشاء الحساب...';
    btnRegister.disabled = true;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (error) {
        alert('خطأ: ' + error.message);
        btnRegister.textContent = 'إنشاء حساب جديد';
        btnRegister.disabled = false;
        return;
      }

      if (data.user) {
        alert('تم إنشاء حسابك بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب، ثم تسجيل الدخول.');
        tabLogin.click();
      }
    } catch (err) {
      alert('خطأ غير متوقع: ' + err.message);
    } finally {
      btnRegister.textContent = 'إنشاء حساب جديد';
      btnRegister.disabled = false;
    }
  });
}

// بدء التهيئة فور تحميل السكربت
waitForSupabase().then(() => {
  if (supabase) {
    initAuth();
  }
});