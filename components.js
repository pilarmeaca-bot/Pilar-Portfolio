/**
 * Mount shared HTML components into [data-component] placeholders.
 * Primary source: components/<name>.html
 * Fallback: inline templates when fetch is unavailable (e.g. file://)
 */
(function () {
  const OTHER_PROJECTS = [
    {
      href: 'capn-crunch.html',
      image: 'images/other-projects/CapnCrunch_color.jpg',
      title: "Cap'n Crunch Sponsorship",
    },
    {
      href: 'stream-packages.html',
      image: 'images/other-projects/StreamPackages_color.jpg',
      title: 'Stream Packages & Alerts',
    },
    {
      href: 'fanta.html',
      image: 'images/other-projects/Fanta_color.jpg',
      title: 'Fanta Sponsorship',
    },
    {
      href: 'fortnite.html',
      image: 'images/other-projects/Fortnite_color.jpg',
      title: 'Fortnite Sponsorship',
    },
    {
      href: 'hello-fresh.html',
      image: 'images/other-projects/HelloFresh_color.jpg',
      title: 'HelloFresh / Cookunity Sponsorship',
    },
    {
      href: 'alerts-in-stream.html',
      image: 'images/other-projects/Alerts_color.jpg',
      title: 'In stream Alerts Sponsorship',
    },
  ];

  const FALLBACK_TEMPLATES = {
    'site-footer': `<footer class="site-footer">
  <div class="site-footer__top">
    <span class="site-footer__copy">2026 Pilar Meaca®</span>
    <a href="#top" class="site-footer__back" aria-label="Back to top">
      <img src="images/arrow.svg" alt="" class="site-footer__back-icon" width="137" height="22" />
    </a>
  </div>
  <div class="site-footer__bottom">
    <a href="mailto:pilarmeaca@gmail.com" class="site-footer__link">pilarmeaca@gmail.com</a>
    <a href="https://www.linkedin.com/in/pilar-meaca/" target="_blank" rel="noopener" class="site-footer__link">LinkedIn</a>
    <span class="site-footer__time-wrap">
      <img src="images/world.svg" alt="" class="site-footer__time-icon" width="20" height="20" />
      <span class="site-footer__time" id="footer-time">BA</span>
    </span>
  </div>
</footer>`,
    'other-projects': `<section class="other-projects layout--wide" aria-label="Other projects">
  <p class="other-projects__label">Other projects</p>

  <div class="other-projects__grid"></div>
</section>`,
  };

  function getCurrentPageFile() {
    const path = window.location.pathname;
    const file = path.substring(path.lastIndexOf('/') + 1);
    return file || 'index.html';
  }

  function shuffle(array) {
    const items = [...array];

    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    return items;
  }

  function getRandomOtherProjects(currentHref, count = 3) {
    const pool = OTHER_PROJECTS.filter((project) => project.href !== currentHref);
    return shuffle(pool).slice(0, count);
  }

  function renderOtherProjects() {
    const grid = document.querySelector('.other-projects__grid');
    if (!grid) return;

    const selected = getRandomOtherProjects(getCurrentPageFile(), 3);

    grid.innerHTML = selected.map((project) => `
    <a href="${project.href}" class="other-projects__card" aria-label="${project.title} — view project">
      <img src="${project.image}" alt="${project.title} project" class="other-projects__card-img" />
    </a>`).join('');
  }

  async function loadTemplate(name) {
    try {
      const response = await fetch(`components/${name}.html`);
      if (response.ok) return (await response.text()).trim();
    } catch (_) {
      /* fetch unavailable */
    }

    return FALLBACK_TEMPLATES[name] || '';
  }

  async function mountComponents() {
    const slots = document.querySelectorAll('[data-component]');

    await Promise.all([...slots].map(async (slot) => {
      const name = slot.dataset.component;
      if (!name) return;

      const html = await loadTemplate(name);
      if (html) slot.outerHTML = html;
    }));

    renderOtherProjects();
    initOtherProjectsCursor();

    if (typeof window.initFooterTime === 'function') {
      window.initFooterTime();
    }
  }

  function initOtherProjectsCursor() {
    const cards = document.querySelectorAll('.other-projects__card');
    if (!cards.length) return;

    let cursor = document.querySelector('.other-projects-cursor');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'other-projects-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      cursor.innerHTML = '<img src="images/shared/icon.svg" alt="" />';
      document.body.appendChild(cursor);
    }

    if (cursor.dataset.bound === 'true') return;
    cursor.dataset.bound = 'true';

    window.addEventListener('mousemove', (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    }, { passive: true });

    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        cursor.classList.add('other-projects-cursor--visible');
      });
      card.addEventListener('mouseleave', () => {
        cursor.classList.remove('other-projects-cursor--visible');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountComponents);
  } else {
    mountComponents();
  }
})();
