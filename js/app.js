// سيرفر نور - سكريبتات الموقع الأساسي

document.addEventListener('DOMContentLoaded', () => {
  // toggle mobile menu
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }

  // smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        // close mobile menu if open
        if (menu) menu.classList.add('hidden');
      }
    });
  });

  // simple console welcome
  console.log('سيرفر نور تم تحميله بنجاح 🚀');
});