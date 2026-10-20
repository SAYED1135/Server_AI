// سيرفر نور - منطق المصادقة باستخدام Supabase Auth حقيقي

let supabase = null;

document.addEventListener('DOMContentLoaded', () => {
  // انتظار تهيئة Supabase
  const waitForSupabase = setInterval(() => {
    if (typeof getSupabase === 'function') {
      supabase = getSupabase();
      if (supabase) {
        clearInterval(waitForSupabase);
        initAuth();
      }
    }
  }, 100);
});

function initAuth() {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  // التحقق من وجود جلسة موجودة
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      window.location.href = 'dashboard.html';
    }
  });

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
    const btn = document.getElementById('btn-login-submit');
    const originalText = btn.textContent;
    btn.textContent = 'جاري الدخول...';
    btn.disabled = true;

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert('خطأ: ' + error.message);
      btn.textContent = originalText;
      btn.disabled = false;
      return;
    }

    if (data.user) {
      // إنشاء ملف شخصي للمستخدم إذا لم يكن موجوداً
      await ensureProfile(data.user);
      alert('تم تسجيل الدخول بنجاح!');
      window.location.href = 'dashboard.html';
    }
  });

  // إنشاء حساب جديد عبر Supabase
  formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-register-submit');
    const originalText = btn.textContent;
    btn.textContent = 'جاري إنشاء الحساب...';
    btn.disabled = true;

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

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
      btn.textContent = originalText;
      btn.disabled = false;
      return;
    }

    if (data.user) {
      alert('تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.');
      // التبديل إلى تبويب تسجيل الدخول تلقائياً
      tabLogin.click();
    }
    btn.textContent = originalText;
    btn.disabled = false;
  });
}

// التأكد من وجود سجل في جدول profiles للمستخدم
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