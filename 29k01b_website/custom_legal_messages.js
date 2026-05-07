// script.js - GDPR Cookie Consent (3 hari masa berlaku)
// Zero bloat, performa 100%, safe AdSense & Google Policies
(function() {
    'use strict';

    // ============================================
    // KONFIGURASI - 3 HARI SAJA
    // ============================================
    const CONSENT_KEY = 'gdpr_cookie_consent';
    const CONSENT_EXPIRY_DAYS = 3;  // ✅ 3 hari sesuai perintah

    // Daftar kode negara yang wajib GDPR / LGPD / CCPA
    const REGULATED_COUNTRIES = [
        'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR',
        'DE','GR','HU','IE','IT','LV','LT','LU','MT','NL',
        'PL','PT','RO','SK','SI','ES','SE','NO','IS','LI',
        'GB','CH','BR','ZA','KR','JP','AR','CL','CO','PE','UY'
    ];

    // ============================================
    // DETEKSI NEGARA (CACHE 24 JAM)
    // ============================================
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
            // Fallback timezone
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (/Europe|London|Paris|Berlin|Amsterdam|Rome|Madrid|Lisbon/.test(tz)) {
                return 'DE';
            }
        }
        return 'ID';
    }

    // ============================================
    // CEK APAKAH PERLU BANNER
    // ============================================
    function requiresBanner(countryCode) {
        return REGULATED_COUNTRIES.includes(countryCode);
    }

    // ============================================
    // CEK APAKAH SUDAH ADA CONSENT (3 HARI)
    // ============================================
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

    // ============================================
    // SIMPAN CONSENT - EXPIRY 3 HARI
    // ============================================
    function saveConsent(status) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + CONSENT_EXPIRY_DAYS); // ✅ 3 hari

        localStorage.setItem(CONSENT_KEY, JSON.stringify({
            status: status,
            country: localStorage.getItem('user_country_code') || 'UNKNOWN',
            timestamp: new Date().toISOString(),
            expiry: expiry.toISOString()
        }));
    }

    // ============================================
    // KONTROL BANNER (div sudah ada di HTML)
    // ============================================
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

    // ============================================
    // MAIN INIT
    // ============================================
    async function initGDPR() {
        // Cek consent valid
        if (hasValidConsent()) {
            hideBanner();
            return;
        }

        const country = await detectUserCountry();

        if (requiresBanner(country)) {
            showBanner();

            // Tombol Accept
            const acceptBtn = document.getElementById('btnAcceptCookies');
            if (acceptBtn) {
                acceptBtn.onclick = function() {
                    saveConsent('accepted');
                    hideBanner();
                };
            }

            // Tombol Reject
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
})();
