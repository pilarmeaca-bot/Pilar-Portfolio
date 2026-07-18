/**
 * Navbar fija — siempre fixed desde el inicio, sin animación de scroll.
 */
(function () {
  const navWrapper = document.getElementById('nav-wrapper');
  if (!navWrapper) return;

  let navSpacer = document.getElementById('nav-spacer');
  if (!navSpacer) {
    navSpacer = document.createElement('div');
    navSpacer.id = 'nav-spacer';
    navSpacer.className = 'nav-spacer';
    navSpacer.setAttribute('aria-hidden', 'true');
    navWrapper.insertAdjacentElement('afterend', navSpacer);
  }

  function syncSpacer() {
    navSpacer.style.height = `${navWrapper.offsetHeight + 20}px`;
  }

  navWrapper.classList.add('nav-wrapper--fixed');
  syncSpacer();

  window.addEventListener('resize', syncSpacer, { passive: true });
})();

(function initMobileNav() {
  const navWrapper = document.getElementById('nav-wrapper');
  const nav = document.getElementById('main-nav');
  if (!navWrapper || !nav) return;

  let toggle = nav.querySelector('.nav__toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav__toggle';
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'nav-mobile-menu');
    toggle.innerHTML = `
      <span class="nav__toggle-bar" aria-hidden="true"></span>
      <span class="nav__toggle-bar" aria-hidden="true"></span>
      <span class="nav__toggle-bar" aria-hidden="true"></span>
    `;
    nav.appendChild(toggle);
  }

  let menu = document.getElementById('nav-mobile-menu');
  if (!menu) {
    menu = document.createElement('div');
    menu.id = 'nav-mobile-menu';
    menu.className = 'nav__mobile-menu';
    menu.hidden = true;

    const menuInner = document.createElement('div');
    menuInner.className = 'nav__mobile-menu-inner';

    const primaryLinks = nav.querySelector('.nav__links--primary');
    const filterLinks = nav.querySelector('.nav__filters');

    if (primaryLinks) {
      const primaryClone = primaryLinks.cloneNode(true);
      primaryClone.classList.add('nav__links--mobile');
      primaryClone.removeAttribute('role');
      menuInner.appendChild(primaryClone);
    }

    if (filterLinks) {
      const filtersClone = filterLinks.cloneNode(true);
      filtersClone.classList.add('nav__links--mobile', 'nav__filters--mobile');
      filtersClone.removeAttribute('role');
      menuInner.appendChild(filtersClone);
    }

    menu.appendChild(menuInner);
    navWrapper.appendChild(menu);
  }

  const desktopQuery = window.matchMedia('(min-width: 769px)');

  function setMenuOpen(open) {
    navWrapper.classList.toggle('nav-wrapper--menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.body.classList.toggle('nav-menu-open', open);
  }

  toggle.addEventListener('click', () => {
    setMenuOpen(!navWrapper.classList.contains('nav-wrapper--menu-open'));
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a.nav__link, [data-work-filter]')) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navWrapper.classList.contains('nav-wrapper--menu-open')) {
      setMenuOpen(false);
    }
  });

  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) setMenuOpen(false);
  });

  document.dispatchEvent(new CustomEvent('mobile-nav-ready'));
})();

(function initSafariNavLogo() {
  const SAFARI_GIF = 'images/logo only_safari.gif';
  const logoLink = document.querySelector('.nav__logo');
  const video = logoLink?.querySelector('video.nav__logo-img');
  if (!logoLink || !video) return;

  // Safari only (excludes Chrome, Firefox, Edge, Opera, Android browsers)
  const ua = navigator.userAgent;
  const isSafari = /Safari/.test(ua)
    && !/Chrome|CriOS|Chromium|Edg|OPR|FxiOS|Firefox|Android/.test(ua);

  const existing = logoLink.querySelector('img.nav__logo-img--safari-gif');
  if (existing) existing.remove();

  if (!isSafari) {
    logoLink.classList.remove('nav__logo--uses-safari-gif');
    video.hidden = false;
    return;
  }

  const safariImg = document.createElement('img');
  safariImg.className = 'nav__logo-img nav__logo-img--safari-gif';
  safariImg.src = SAFARI_GIF;
  safariImg.alt = '';
  safariImg.width = 37;
  safariImg.height = 37;
  safariImg.setAttribute('aria-hidden', 'true');
  logoLink.appendChild(safariImg);

  logoLink.classList.add('nav__logo--uses-safari-gif');
  video.hidden = true;
})();

(function initSafariAboutWave() {
  const SAFARI_SRC = 'images/video/hand_whitebkg.mp4';
  const wave = document.querySelector('video.about__wave');
  const source = wave?.querySelector('source');
  if (!wave || !source) return;

  // Safari only (excludes Chrome, Firefox, Edge, Opera, Android browsers)
  const ua = navigator.userAgent;
  const isSafari = /Safari/.test(ua)
    && !/Chrome|CriOS|Chromium|Edg|OPR|FxiOS|Firefox|Android/.test(ua);

  if (!isSafari) return;

  source.setAttribute('src', SAFARI_SRC);
  source.setAttribute('type', 'video/mp4');
  wave.load();
  wave.play().catch(() => {});
})();

(function initWorkFilterNav() {
  if (!document.querySelector('[data-work-filter]') || document.querySelector('.work-item')) return;

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-work-filter]');
    if (!button) return;
    window.location.href = `work.html?filter=${button.dataset.workFilter}`;
  });
})();

(function initReelModal() {
  const REEL_SRC = 'images/video/Reel.webm';
  const REEL_POSTER = 'images/thumbnail_reel.jpg';
  if (!document.querySelector('a.nav__link[href="/reel"]')) return;

  const modal = document.createElement('div');
  modal.className = 'reel-modal';
  modal.id = 'reel-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="reel-modal__backdrop" data-reel-close tabindex="-1"></div>
    <div class="reel-modal__panel" role="dialog" aria-modal="true" aria-label="Showreel" tabindex="-1">
      <button type="button" class="reel-modal__close" data-reel-close aria-label="Close showreel">×</button>
      <div class="reel-modal__media">
        <div class="reel-modal__frame layout--narrow">
          <img class="reel-modal__poster" src="${REEL_POSTER}" alt="" aria-hidden="true" />
          <video class="reel-modal__video" playsinline preload="metadata">
            <source src="${REEL_SRC}" type="video/webm" />
          </video>
          <button type="button" class="reel-modal__play" aria-label="Play showreel">
            <img src="images/play.svg" alt="" class="reel-modal__play-icon" />
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const video = modal.querySelector('.reel-modal__video');
  const media = modal.querySelector('.reel-modal__media');
  const playButton = modal.querySelector('.reel-modal__play');
  const panel = modal.querySelector('.reel-modal__panel');
  let lastFocused = null;

  function resetReel() {
    video.pause();
    video.currentTime = 0;
    video.removeAttribute('controls');
    media.classList.remove('is-playing');
  }

  function openReel() {
    resetReel();
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('reel-modal-open');
    panel.focus();
  }

  function closeReel() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('reel-modal-open');
    resetReel();
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  playButton.addEventListener('click', (event) => {
    event.stopPropagation();
    video.setAttribute('controls', '');
    media.classList.add('is-playing');
    video.play();
  });

  video.addEventListener('ended', resetReel);

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a.nav__link[href="/reel"]');
    if (!link) return;
    event.preventDefault();
    openReel();
  });

  modal.addEventListener('click', (event) => {
    if (!modal.classList.contains('is-open')) return;
    if (event.target.closest('.reel-modal__media')) return;
    closeReel();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeReel();
  });
})();

window.initFooterTime = function initFooterTime() {
  if (window.__footerTimeInit) return;

  const timeEl = document.getElementById('footer-time');
  if (!timeEl) return;

  window.__footerTimeInit = true;

  function updateTime() {
    const ba = new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/Argentina/Buenos_Aires',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    timeEl.textContent = 'BA ' + ba;
  }

  updateTime();
  setInterval(updateTime, 30000);
};

(function initSiteCursor() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (document.querySelector('.site-cursor')) return;

  const cursor = document.createElement('div');
  cursor.className = 'site-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cursor);

  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = 1;
  sampleCanvas.height = 1;
  const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });

  let rafId = 0;
  let pendingX = 0;
  let pendingY = 0;

  function parseRgba(color) {
    if (!color || color === 'transparent') return null;
    const match = color.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);
    if (!match) return null;
    return {
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3]),
      a: match[4] === undefined ? 1 : Number(match[4]),
    };
  }

  function luminance({ r, g, b }) {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  function sampleMediaLuminance(media, clientX, clientY) {
    if (!sampleCtx) return null;
    try {
      const rect = media.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;

      const naturalW = media.videoWidth || media.naturalWidth || media.width;
      const naturalH = media.videoHeight || media.naturalHeight || media.height;
      if (!naturalW || !naturalH) return null;

      const x = Math.min(naturalW - 1, Math.max(0, ((clientX - rect.left) / rect.width) * naturalW));
      const y = Math.min(naturalH - 1, Math.max(0, ((clientY - rect.top) / rect.height) * naturalH));

      sampleCtx.clearRect(0, 0, 1, 1);
      sampleCtx.drawImage(media, x, y, 1, 1, 0, 0, 1, 1);
      const [r, g, b, a] = sampleCtx.getImageData(0, 0, 1, 1).data;
      if (a < 20) return null;
      return luminance({ r, g, b });
    } catch (_) {
      return null;
    }
  }

  function isDarkUnderPoint(clientX, clientY) {
    const stack = document.elementsFromPoint(clientX, clientY);

    for (const el of stack) {
      if (!el || el === cursor || el.classList?.contains('site-cursor')) {
        continue;
      }

      const tag = el.tagName;
      if (tag === 'IMG' || tag === 'VIDEO' || tag === 'CANVAS') {
        const mediaLum = sampleMediaLuminance(el, clientX, clientY);
        if (mediaLum !== null) return mediaLum < 0.45;
        continue;
      }

      const style = window.getComputedStyle(el);
      const bg = parseRgba(style.backgroundColor);
      if (!bg || bg.a < 0.15) continue;
      return luminance(bg) < 0.45;
    }

    const bodyBg = parseRgba(window.getComputedStyle(document.body).backgroundColor)
      || parseRgba(window.getComputedStyle(document.documentElement).backgroundColor);
    return bodyBg ? luminance(bodyBg) < 0.45 : document.body.classList.contains('page-dark');
  }

  function updateCursorContrast() {
    rafId = 0;
    cursor.classList.toggle('is-on-dark', isDarkUnderPoint(pendingX, pendingY));
  }

  window.addEventListener('mousemove', (event) => {
    pendingX = event.clientX;
    pendingY = event.clientY;
    cursor.style.left = `${pendingX}px`;
    cursor.style.top = `${pendingY}px`;
    cursor.classList.add('is-visible');

    if (!rafId) rafId = requestAnimationFrame(updateCursorContrast);
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('is-visible');
    cursor.classList.remove('is-pressed');
  });

  document.addEventListener('mouseenter', () => {
    cursor.classList.add('is-visible');
  });

  window.addEventListener('mousedown', () => {
    cursor.classList.add('is-pressed');
  });

  window.addEventListener('mouseup', () => {
    cursor.classList.remove('is-pressed');
  });

  window.addEventListener('blur', () => {
    cursor.classList.remove('is-pressed');
  });
})();
