
const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav-links');
if(btn && nav){
  btn.addEventListener('click',()=>{ const open=nav.classList.toggle('show'); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); });
}
document.querySelectorAll('.nav-links a').forEach(a=>{
  a.addEventListener('click',()=>nav?.classList.remove('show'));
});

const form = document.querySelector('#contactForm2');
if(form){
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name = document.querySelector('#name')?.value || 'Calon pelanggan';
    const service = document.querySelector('#service')?.value || 'Paket Undangan Digital';
    const msg = encodeURIComponent(`Halo Sakiinah Invitation, saya ${name}. Saya tertarik dengan ${service}. Mohon info lebih lanjut.`);
    window.open(`https://wa.me/62895622785477?text=${msg}`,'_blank');
  });
}

document.addEventListener('click',(e)=>{
  if(nav && btn && nav.classList.contains('show') && !nav.contains(e.target) && !btn.contains(e.target)){
    nav.classList.remove('show');
  }
});


/* ===== PARALLAX + REVEAL ===== */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealEls = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach((el, i) => {
      el.classList.add(`reveal-delay-${(i % 3) + 1}`);
      observer.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  if (reduceMotion) return;

  let ticking = false;

  const updateParallax = () => {
    const y = window.scrollY || 0;

    document.documentElement.style.setProperty('--hero-orb-1', `${y * 0.10}px`);
    document.documentElement.style.setProperty('--hero-orb-2', `${y * -0.07}px`);
    document.documentElement.style.setProperty('--page-orb-1', `${y * 0.05}px`);
    document.documentElement.style.setProperty('--page-orb-2', `${y * -0.04}px`);

    const hero = document.querySelector('.hero');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      const local = Math.max(-400, Math.min(600, -rect.top));

      const phone = document.querySelector('.parallax-phone');
      if (phone) {
        phone.style.setProperty('--phone-shift', `${local * -0.06}px`);
      }

      const one = document.querySelector('.float-card.one');
      const two = document.querySelector('.float-card.two');
      if (one) one.style.setProperty('--float-one', `${local * 0.05}px`);
      if (two) two.style.setProperty('--float-two', `${local * -0.04}px`);
    }

    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  updateParallax();
})();


/* ===== PWA / INSTALL ===== */
(() => {
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    document.body.classList.add('standalone');
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch(() => {});
    });
  }

  let deferredPrompt = null;
  const installBar = document.querySelector('.app-install');
  const installBtn = document.querySelector('.install-btn');
  const installClose = document.querySelector('.install-close');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBar) installBar.classList.add('show');
  });

  installBtn?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try { await deferredPrompt.userChoice; } catch(e) {}
    deferredPrompt = null;
    installBar?.classList.remove('show');
  });

  installClose?.addEventListener('click', () => {
    installBar?.classList.remove('show');
  });

  window.addEventListener('appinstalled', () => {
    installBar?.classList.remove('show');
    deferredPrompt = null;
  });
})();


/* ===== LOGO LOADER ===== */
(() => {
  const loader = document.getElementById('siteLoader');
  const bar = document.getElementById('loaderProgress');
  const percent = document.getElementById('loaderPercent');
  if (!loader || !bar) return;

  let value = 0;
  const setProgress = (next) => {
    value = Math.max(value, Math.min(100, next));
    bar.style.width = `${value}%`;
    if (percent) percent.textContent = `${Math.round(value)}%`;
  };

  setProgress(12);
  const timer = setInterval(() => {
    if (value < 88) setProgress(value + Math.max(1, (88 - value) * 0.12));
  }, 90);

  const finish = () => {
    clearInterval(timer);
    setProgress(100);
    setTimeout(() => loader.classList.add('is-hidden'), 220);
    setTimeout(() => loader.remove(), 900);
  };

  if (document.readyState === 'complete') finish();
  else window.addEventListener('load', finish, { once:true });
  setTimeout(finish, 4500);
})();

/* ===== SCROLL UP / DOWN ===== */
(() => {
  const up = document.getElementById('scrollUp');
  const down = document.getElementById('scrollDown');
  if (!up || !down) return;

  const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const update = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const max = maxScroll();
    up.disabled = y <= 4;
    down.disabled = y >= max - 4;
  };

  up.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  down.addEventListener('click', () => window.scrollTo({ top:maxScroll(), behavior:'smooth' }));
  window.addEventListener('scroll', update, { passive:true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
})();
