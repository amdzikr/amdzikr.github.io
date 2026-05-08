// ==========================================
// 29K01B — All-in-One Optimized Script
// ==========================================
(function() {
  'use strict';

  // ========== UTILITAS ==========
  // Smooth scroll untuk anchor link
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Lazy load gambar yang belum loading="lazy"
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
  }

  // ========== COPY CODE BLOCK (keyboard accessible) ==========
  function makeCopyable(el) {
    // Beri role dan tabindex agar bisa difokuskan
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', 'Copy code to clipboard');

    function copyAction() {
      const text = el.textContent;
      navigator.clipboard.writeText(text).then(() => {
        const original = el.style.background;
        el.style.background = '#1e40af';
        setTimeout(() => { el.style.background = original; }, 500);
      }).catch(err => console.error('Copy failed', err));
    }

    el.addEventListener('click', copyAction);
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copyAction();
      }
    });
  }

  document.querySelectorAll('.output-box').forEach(makeCopyable);

  // ========== FOOTER HIGHLIGHT (Guidelines button) ==========
  function initFooterHighlight() {
    const btn = document.querySelector('.hu-policy'); // sekarang jadi button atau a, kita cek
    const footer = document.getElementById('footer');
    if (!btn || !footer) return;

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      footer.scrollIntoView({ behavior: 'smooth', block: 'center' });

      footer.classList.remove('highlight-on');
      void footer.offsetWidth; // force reflow
      footer.classList.add('highlight-on');

      // Set fokus ke footer agar screen reader tahu
      footer.setAttribute('tabindex', '-1');
      footer.focus({ preventScroll: true });

      setTimeout(function() {
        footer.classList.remove('highlight-on');
        footer.removeAttribute('tabindex');
      }, 60000); // 1 menit
    });

    // Dukungan keyboard (Enter) jika berupa a, sudah default. Kalau tombol, juga default.
    // Karena kita pake button atau a, sudah ok. Tapi jika a, href="#" harus prevent default.
    if (btn.tagName === 'A') {
      btn.setAttribute('role', 'button'); // tambahkan role biar jelas
      btn.href = 'javascript:void(0)'; // override agar tidak refresh
    }
    // Tambahkan aria-label
    btn.setAttribute('aria-label', 'Highlight footer with animated guidelines');
  }

  initFooterHighlight();

  // ========== GDPR COOKIE CONSENT (3 hari) ==========
  const CONSENT_KEY = 'gdpr_cookie_consent';
  const CONSENT_EXPIRY_DAYS = 3;

  const REGULATED_COUNTRIES = [
    'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR',
    'DE','GR','HU','IE','IT','LV','LT','LU','MT','NL',
    'PL','PT','RO','SK','SI','ES','SE','NO','IS','LI',
    'GB','CH','BR','ZA','KR','JP','AR','CL','CO','PE','UY'
  ];

  async function detectUserCountry() {
    const cached = localStorage.getItem('user_country_code');
    const cachedTime = localStorage.getItem('user_country_time');

    if (cached && cachedTime) {
      const hoursSince = (Date.now() - parseInt(cachedTime)) / (1000 * 60 * 60);
      if (hoursSince < 24) return cached;
    }

    try {
      const res = await fetch('https://ipapi.co/country_code/', {
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const code = (await res.text()).trim().toUpperCase();
        localStorage.setItem('user_country_code', code);
        localStorage.setItem('user_country_time', Date.now().toString());
        return code;
      }
    } catch (e) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (/Europe|London|Paris|Berlin|Amsterdam|Rome|Madrid|Lisbon/.test(tz)) {
        return 'DE';
      }
    }
    return 'ID';
  }

  function requiresBanner(countryCode) {
    return REGULATED_COUNTRIES.includes(countryCode);
  }

  function hasValidConsent() {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return false;
    try {
      const data = JSON.parse(stored);
      const expiry = new Date(data.expiry);
      if (new Date() > expiry) {
        localStorage.removeItem(CONSENT_KEY);
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function saveConsent(status) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + CONSENT_EXPIRY_DAYS);
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      status: status,
      country: localStorage.getItem('user_country_code') || 'UNKNOWN',
      timestamp: new Date().toISOString(),
      expiry: expiry.toISOString()
    }));
  }

  function hideBanner() {
    const banner = document.getElementById('customCookieBanner');
    if (banner) banner.style.display = 'none';
  }

  function showBanner() {
    const banner = document.getElementById('customCookieBanner');
    if (banner && banner.style.display !== 'flex') {
      banner.style.display = 'flex';
    }
  }

  async function initGDPR() {
    if (hasValidConsent()) {
      hideBanner();
      return;
    }

    const country = await detectUserCountry();

    if (requiresBanner(country)) {
      showBanner();

      const acceptBtn = document.getElementById('btnAcceptCookies');
      if (acceptBtn) {
        acceptBtn.onclick = function() {
          saveConsent('accepted');
          hideBanner();
        };
      }

      const rejectBtn = document.getElementById('btnRejectCookies');
      if (rejectBtn) {
        rejectBtn.onclick = function() {
          saveConsent('rejected');
          hideBanner();
        };
      }
    } else {
      hideBanner();
    }
  }

  // Jalankan saat DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGDPR);
  } else {
    initGDPR();
  }

  console.log('🚀 29K01B — Optimized script loaded');

})();