(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Mobile menu
  const menuBtn = $('.menu-btn');
  const header = $('.site-header');
  menuBtn.addEventListener('click', () => {
    const open = header.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  $$('.mobile-menu a').forEach((a) => a.addEventListener('click', () => {
    header.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));

  // Symptom list: three cards on small screens until "View all"
  const grid = $('#symptom-grid');
  const viewAll = $('.view-all');
  viewAll.addEventListener('click', () => {
    const open = grid.classList.toggle('is-expanded');
    viewAll.setAttribute('aria-expanded', String(open));
    $('span', viewAll).textContent = open ? 'Show less' : 'View all';
  });

  // Treatment filters: chips and category tiles filter the product row
  const chips = $$('.chip');
  const products = $$('.product');
  const tiles = $$('.tile');

  function setFilter(filter) {
    chips.forEach((c) => {
      const on = c.dataset.filter === filter;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', String(on));
    });
    products.forEach((p) => {
      p.hidden = filter !== 'all' && p.dataset.category !== filter;
    });
    $('#products').scrollTo({ left: 0 });
  }

  chips.forEach((c) => c.addEventListener('click', () => setFilter(c.dataset.filter)));
  tiles.forEach((t) => t.addEventListener('click', (e) => {
    e.preventDefault();
    tiles.forEach((o) => o.classList.toggle('is-active', o === t));
    setFilter(t.dataset.tile);
    $('#treatments').scrollIntoView({ behavior: 'smooth' });
  }));

  // Header: transparent over the hero, solid once the hero has been scrolled past
  const hero = $('.hero');
  const heroVariable = window.matchMedia('(min-width: 768px)').matches ? '--hero-d' : '--hero-m';
  const heroBackground = getComputedStyle(hero).getPropertyValue(heroVariable).match(/url\(["']?(.*?)["']?\)/)?.[1];
  const revealHeroText = () => hero.classList.add('is-image-loaded');
  if (!heroBackground) {
    revealHeroText();
  } else {
    const heroImage = new Image();
    heroImage.addEventListener('load', revealHeroText, { once: true });
    heroImage.addEventListener('error', revealHeroText, { once: true });
    heroImage.src = heroBackground;
    if (heroImage.complete) revealHeroText();
  }
  const syncHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > hero.offsetHeight - header.offsetHeight);
  };
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { syncHeader(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', syncHeader);
  syncHeader();

  // Treatments dropdown: filter from the menu, and open on tap for touch screens
  const menuItem = $('.has-menu');
  const trigger = $('.has-menu > a');
  trigger.addEventListener('click', (e) => {
    if (window.matchMedia('(hover: none)').matches) {
      e.preventDefault();
      const open = menuItem.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(open));
    }
  });
  document.addEventListener('click', (e) => {
    if (!menuItem.contains(e.target)) {
      menuItem.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
  $$('.dropdown a').forEach((a) => a.addEventListener('click', (e) => {
    if (a.getAttribute('href') !== '#treatments') return;
    e.preventDefault();
    setFilter(a.dataset.filter);
    tiles.forEach((o) => o.classList.toggle('is-active', o.dataset.tile === a.dataset.filter));
    menuItem.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    document.activeElement.blur();
    $('#treatments').scrollIntoView({ behavior: 'smooth' });
  }));

  // Reveal each section as it scrolls into view
  const sections = $$('main > section, main > .usp, .site-footer');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  sections.forEach((s) => { s.classList.add('reveal'); io.observe(s); });
})();
