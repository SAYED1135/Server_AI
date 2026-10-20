// سيرفر نور - منطق المصادقة (مؤقت باستخدام localStorage)

document.addEventListener('DOMContentLoaded', () => {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  // التبديل بين تبويب تسجيل الدخول وإنشاء الحساب
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

  // تسجيل الدخول
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('servernoor_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('servernoor_current_user', JSON.stringify(user));
      alert('تم تسجيل الدخول بنجاح!');
      window.location.href = 'dashboard.html';
    } else {
      alert('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
  });

  // إنشاء حساب جديد
  formRegister.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    const users = JSON.parse(localStorage.getItem('servernoor_users') || '[]');

    if (users.find(u => u.email === email)) {
      alert('هذا البريد الإلكتروني مستخدم بالفعل.');
      return;
    }

    const newUser = { id: Date.now(), name, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('servernoor_users', JSON.stringify(users));
    localStorage.setItem('servernoor_current_user', JSON.stringify(newUser));

    alert('تم إنشاء حسابك بنجاح!');
    window.location.href = 'dashboard.html';
  });
});