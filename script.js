document.addEventListener('DOMContentLoaded', () => {
  // Año footer
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  // Mobile nav toggle with ARIA
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('is-open');
    });
  }

  // AOS
  if (window.AOS) {
    AOS.init({
      duration: 500,
      easing: 'ease-out',
      once: true,
      offset: 12
    });
  }

  // Smooth hash scroll respecting sticky nav
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: 'smooth' });
        history.pushState(null, '', `#${id}`);
      }
    });
  });

  // Lazy-load videos: swap data-src* into <source> dynamically when in view
  const lazyVideos = document.querySelectorAll('video.lazy-video');
  const onIntersect = (entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const v = entry.target;
      const webm = v.dataset.srcWebm, mp4 = v.dataset.srcMp4;
      if (webm || mp4) {
        if (webm) {
          const s1 = document.createElement('source');
          s1.src = webm; s1.type = 'video/webm'; v.appendChild(s1);
        }
        if (mp4) {
          const s2 = document.createElement('source');
          s2.src = mp4; s2.type = 'video/mp4'; v.appendChild(s2);
        }
        v.load();
      }
      const tryPlay = () => v.play().catch(()=>{});
      v.addEventListener('canplay', tryPlay, { once:true });
      tryPlay();
      obs.unobserve(v);
    });
  };
  const io = new IntersectionObserver(onIntersect, { rootMargin: '200px 0px' });
  lazyVideos.forEach(v => io.observe(v));
});
