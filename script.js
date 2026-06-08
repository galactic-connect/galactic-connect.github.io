document.addEventListener('DOMContentLoaded', () => {
    // Merge translations with terms translations if available
    if (typeof termsTranslations !== 'undefined') {
        translations.en = { ...translations.en, ...termsTranslations.en };
        translations.ru = { ...translations.ru, ...termsTranslations.ru };
    }

    // Config
    const config = {
        botLink: "https://t.me/galactic_connect_bot",
        // You can add more config parameters here
    };

    // Internationalization (i18n)
    const userLang = navigator.language || navigator.userLanguage;
    let currentLang = userLang && userLang.toLowerCase().includes('ru') ? 'ru' : 'en';
    const langToggleBtn = document.getElementById('lang-toggle');
    const elementsToTranslate = document.querySelectorAll('[data-i18n]');
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    function updateContent() {
        // Update Static Text
        elementsToTranslate.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                if (translations[currentLang][key].includes('<')) {
                    el.innerHTML = translations[currentLang][key];
                } else {
                    el.textContent = translations[currentLang][key];
                }
            }
        });
        document.documentElement.lang = currentLang;
        langToggleBtn.textContent = currentLang === 'en' ? 'RU' : 'EN';

        // Update Bot Links
        document.querySelectorAll('[data-bot-link]').forEach(el => {
            el.setAttribute('href', config.botLink);
        });
    }

    // Auto-detect OS for Hero Download Button
    const updateHeroButton = async () => {
        const heroDlBtn = document.getElementById('hero-download-btn');
        const heroDlIcon = document.getElementById('hero-dl-icon');
        const heroDlText = document.getElementById('hero-dl-text');

        if (!heroDlBtn || !heroDlIcon || !heroDlText) return;

        // --- Detect platform and architecture ---
        let platform = '';  // ios | android | macos | windows | linux
        let arch = '';      // x86 | arm (from Client Hints)

        // 1. User-Agent Client Hints (Chromium / Edge / Brave / Opera)
        //    navigator.userAgentData.platform is synchronous low-entropy hint:
        //    Returns: "Windows", "macOS", "Linux", "Android", "Chrome OS"
        if (navigator.userAgentData) {
            const p = navigator.userAgentData.platform.toLowerCase();
            if (p === 'android') platform = 'android';
            else if (p === 'macos') platform = 'macos';
            else if (p === 'windows') platform = 'windows';
            else if (p === 'linux' || p === 'chrome os') platform = 'linux';
            else if (p === 'ios') platform = 'ios';

            // High-entropy: architecture ('x86' or 'arm')
            try {
                const hints = await navigator.userAgentData.getHighEntropyValues(['architecture']);
                arch = hints.architecture; // 'x86' | 'arm'
            } catch (_) { /* not granted or unavailable */ }
        }

        // 2. Fallback: parse UA string (Firefox, Safari, older browsers)
        if (!platform) {
            const ua = navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(ua)) platform = 'ios';
            else if (/android/.test(ua)) platform = 'android';
            else if (/macintosh|mac os x/.test(ua)) platform = 'macos';
            else if (/windows/.test(ua)) platform = 'windows';
            else if (/linux/.test(ua)) platform = 'linux';
        }

        // 3. Fallback for arch when Client Hints unavailable
        if (!arch && platform === 'linux') {
            const ua = navigator.userAgent.toLowerCase();
            arch = /aarch64|arm64/.test(ua) ? 'arm' : 'x86';
        }

        // --- Map platform to download button config ---
        const icons = {
            ios:     '<svg viewBox="0 0 384 512" fill="currentColor" width="24" height="24"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>',
            android: '<svg viewBox="0 0 512 512" fill="currentColor" width="24" height="24"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>',
            macos:   '<svg viewBox="0 0 384 512" fill="currentColor" width="24" height="24"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>',
            windows: '<svg viewBox="0 0 448 512" fill="currentColor" width="24" height="24"><path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 512V268.4H203.8v177.9zm0-380.6v180.1H448V0L203.8 65.8z"/></svg>',
            linux:   '<svg viewBox="0 0 448 512" fill="currentColor" width="24" height="24"><path d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5.2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4.2-.8.7-.6 1.1.3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.6.2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5.1-1.3.6-3.4 1.5-3.2 2.9.1 1 1.8 1.5 2.8 1.4zM420 403.8c-3.6-4-5.3-11.6-7.2-19.7-1.8-8.1-3.9-16.8-10.5-22.4-1.3-1.1-2.6-2.1-4-2.9-1.3-.8-2.7-1.5-4.1-2 9.2-27.3 5.6-54.5-3.7-79.1-11.4-30.1-31.3-56.4-46.5-74.4-17.1-21.5-33.7-41.9-33.4-72C311.1 85.4 315.7.1 234.8 0 132.4-.2 158 103.4 156.9 135.2c-1.7 23.4-6.4 41.8-22.5 64.7-18.9 22.5-45.5 58.8-58.1 96.7-6 17.9-8.8 36.1-6.2 53.3-6.5 5.8-11.4 14.7-16.6 20.2-4.2 4.3-10.3 5.9-17 8.3s-14 6-18.5 14.5c-2.1 3.9-2.8 8.1-2.8 12.4 0 3.9.6 7.9 1.2 11.8 1.2 8.1 2.5 15.7.8 20.8-5.2 14.4-5.9 24.4-2.2 31.7 3.8 7.3 11.4 10.5 20.1 12.3 17.3 3.6 40.8 2.7 59.3 12.5 19.8 10.4 39.9 14.1 55.9 10.4 11.6-2.6 21.1-9.6 25.9-20.2 12.5-.1 26.3-5.4 48.3-6.6 14.9-1.2 33.6 5.3 55.1 4.1.6 2.3 1.4 4.6 2.5 6.7v.1c8.3 16.7 23.8 24.3 40.3 23 16.6-1.3 34.1-11 48.3-27.9 13.6-16.4 36-23.2 50.9-32.2 7.4-4.5 13.4-10.1 13.9-18.3.4-8.2-4.4-17.3-15.5-29.7zM223.7 87.3c9.8-22.2 34.2-21.8 44-.4 6.5 14.2 3.6 30.9-4.3 40.4-1.6-.8-5.9-2.6-12.6-4.9 1.1-1.2 3.1-2.7 3.9-4.6 4.8-11.8-.2-27-9.1-27.3-7.3-.5-13.9 10.8-11.8 23-4.1-2-9.4-3.5-13-4.4-1-6.9-.3-14.6 2.9-21.8zM183 75.8c10.1 0 20.8 14.2 19.1 33.5-3.5 1-7.1 2.5-10.2 4.6 1.2-8.9-3.3-20.1-9.6-19.6-8.4.7-9.8 21.2-1.8 28.1 1 .8 1.9-.2-5.9 5.5-15.6-14.6-10.5-52.1 8.4-52.1zm-13.6 60.7c6.2-4.6 13.6-10 14.1-10.5 4.7-4.4 13.5-14.2 27.9-14.2 7.1 0 15.6 2.3 25.9 8.9 6.3 4.1 11.3 4.4 22.6 9.3 8.4 3.5 13.7 9.7 10.5 18.2-2.6 7.1-11 14.4-22.7 18.1-11.1 3.6-19.8 16-38.2 14.9-3.9-.2-7-1-9.6-2.1-8-3.5-12.2-10.4-20-15-8.6-4.8-13.2-10.4-14.7-15.3-1.4-4.9 0-9 4.2-12.3zm3.3 334c-2.7 35.1-43.9 34.4-75.3 18-29.9-15.8-68.6-6.5-76.5-21.9-2.4-4.7-2.4-12.7 2.6-26.4v-.2c2.4-7.6.6-16-.6-23.9-1.2-7.8-1.8-15 .9-20 3.5-6.7 8.5-9.1 14.8-11.3 10.3-3.7 11.8-3.4 19.6-9.9 5.5-5.7 9.5-12.9 14.3-18 5.1-5.5 10-8.1 17.7-6.9 8.1 1.2 15.1 6.8 21.9 16l19.6 35.6c9.5 19.9 43.1 48.4 41 68.9zm-1.4-25.9c-4.1-6.6-9.6-13.6-14.4-19.6 7.1 0 14.2-2.2 16.7-8.9 2.3-6.2 0-14.9-7.4-24.9-13.5-18.2-38.3-32.5-38.3-32.5-13.5-8.4-21.1-18.7-24.6-29.9s-3-23.3-.3-35.2c5.2-22.9 18.6-45.2 27.2-59.2 2.3-1.7.8 3.2-8.7 20.8-8.5 16.1-24.4 53.3-2.6 82.4.6-20.7 5.5-41.8 13.8-61.5 12-27.4 37.3-74.9 39.3-112.7 1.1.8 4.6 3.2 6.2 4.1 4.6 2.7 8.1 6.7 12.6 10.3 12.4 10 28.5 9.2 42.4 1.2 6.2-3.5 11.2-7.5 15.9-9 9.9-3.1 17.8-8.6 22.3-15 7.7 30.4 25.7 74.3 37.2 95.7 6.1 11.4 18.3 35.5 23.6 64.6 3.3-.1 7 .4 10.9 1.4 13.8-35.7-11.7-74.2-23.3-84.9-4.7-4.6-4.9-6.6-2.6-6.5 12.6 11.2 29.2 33.7 35.2 59 2.8 11.6 3.3 23.7.4 35.7 16.4 6.8 35.9 17.9 30.7 34.8-2.2-.1-3.2 0-4.2 0 3.2-10.1-3.9-17.6-22.8-26.1-19.6-8.6-36-8.6-38.3 12.5-12.1 4.2-18.3 14.7-21.4 27.3-2.8 11.2-3.6 24.7-4.4 39.9-.5 7.7-3.6 18-6.8 29-32.1 22.9-76.7 32.9-114.3 7.2zm257.4-11.5c-.9 16.8-41.2 19.9-63.2 46.5-13.2 15.7-29.4 24.4-43.6 25.5s-26.5-4.8-33.7-19.3c-4.7-11.1-2.4-23.1 1.1-36.3 3.7-14.2 9.2-28.8 9.9-40.6.8-15.2 1.7-28.5 4.2-38.7 2.6-10.3 6.6-17.2 13.7-21.1.3-.2.7-.3 1-.5.8 13.2 7.3 26.6 18.8 29.5 12.6 3.3 30.7-7.5 38.4-16.3 9-.3 15.7-.9 22.6 5.1 9.9 8.5 7.1 30.3 17.1 41.6 10.6 11.6 14 19.5 13.7 24.6zM173.3 148.7c2 1.9 4.7 4.5 8 7.1 6.6 5.2 15.8 10.6 27.3 10.6 11.6 0 22.5-5.9 31.8-10.8 4.9-2.6 10.9-7 14.8-10.4s5.9-6.3 3.1-6.6-2.6 2.6-6 5.1c-4.4 3.2-9.7 7.4-13.9 9.8-7.4 4.2-19.5 10.2-29.9 10.2s-18.7-4.8-24.9-9.7c-3.1-2.5-5.7-5-7.7-6.9-1.5-1.4-1.9-4.6-4.3-4.9-1.4-.1-1.8 3.7 1.7 6.5z"/></svg>',
        };

        const baseUrl = 'https://github.com/galactic-connect/galactic-connect.github.io/releases/latest/download';
        const linuxArch = arch === 'arm' ? 'arm64' : 'amd64';

        const platformConfig = {
            ios:     { key: 'hero_download_ios',     link: 'apple.html' },
            android: { key: 'hero_download_android', link: `${baseUrl}/galactic-android.apk` },
            macos:   { key: 'hero_download_macos',   link: `${baseUrl}/galactic-macos.dmg` },
            windows: { key: 'hero_download_windows', link: `${baseUrl}/galactic-windows.msix` },
            linux:   { key: 'hero_download_linux',   link: `${baseUrl}/galactic-linux-${linuxArch}.deb` },
        };

        const cfg = platformConfig[platform];
        const osLabelKey = cfg ? cfg.key : 'hero_download_default';
        const link = cfg ? cfg.link : '#download';
        const iconHtml = icons[platform] || '';

        heroDlBtn.href = link;
        heroDlText.setAttribute('data-i18n', osLabelKey);
        heroDlText.textContent = translations[currentLang][osLabelKey];
        if (iconHtml) {
            heroDlIcon.innerHTML = iconHtml;
            heroDlBtn.style.display = 'flex';
            heroDlBtn.style.alignItems = 'center';
            heroDlBtn.style.gap = '10px';
        }
    };

    // Initial content update based on detected language
    updateContent();
    updateHeroButton();

    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ru' : 'en';
        updateContent();
        updateHeroButton();
    });

    // Simple scroll animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .section-title, .ua-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add visible class styling dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // Update Copyright Year from External Time API
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        fetch('https://worldtimeapi.org/api/timezone/Etc/UTC')
            .then(response => response.json())
            .then(data => {
                const dateTime = new Date(data.datetime);
                yearSpan.textContent = dateTime.getFullYear();
            })
            .catch(error => {
                console.warn('Time API request failed, using system time:', error);
                yearSpan.textContent = new Date().getFullYear();
            });
    }

    // Google Analytics Event Tracking
    document.addEventListener('click', (e) => {
        // Find the element with GA tracking attributes (could be the clicked element or a parent)
        const target = e.target.closest('[data-ga-event]');

        if (target) {
            const eventName = target.getAttribute('data-ga-event');
            const buttonName = target.getAttribute('data-ga-button');
            const location = target.getAttribute('data-ga-location');

            // Send event to Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    'event_category': location || 'unspecified',
                    'event_label': buttonName || 'unspecified',
                    'button_name': buttonName,
                    'button_location': location
                });

                console.log('GA Event:', {
                    event: eventName,
                    category: location,
                    label: buttonName
                });
            } else {
                console.warn('Google Analytics (gtag) not loaded');
            }
        }
    });
});
