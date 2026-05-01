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
    const updateHeroButton = () => {
        const heroDlBtn = document.getElementById('hero-download-btn');
        const heroDlIcon = document.getElementById('hero-dl-icon');
        const heroDlText = document.getElementById('hero-dl-text');

        if (heroDlBtn && heroDlIcon && heroDlText) {
            const ua = navigator.userAgent.toLowerCase();
            let osLabelKey = 'hero_download_default';
            let link = '#download'; // Default drops down to all-os section
            let iconHtml = '';

            if (/iphone|ipad|ipod/.test(ua)) {
                osLabelKey = 'hero_download_ios';
                link = 'apple.html';
                iconHtml = '<svg viewBox="0 0 384 512" fill="currentColor" width="24" height="24"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>';
            } else if (/android/.test(ua)) {
                osLabelKey = 'hero_download_android';
                link = 'https://play.google.com/store/apps/details?id=com.jetrabbits.galactic';
                iconHtml = '<svg viewBox="0 0 512 512" fill="currentColor" width="24" height="24"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>';
            } else if (/macintosh|mac os x/.test(ua)) {
                osLabelKey = 'hero_download_macos';
                link = 'https://github.com/galactic-connect/galactic-connect.github.io/releases/latest/download/galactic-macos.dmg';
                iconHtml = '<svg viewBox="0 0 384 512" fill="currentColor" width="24" height="24"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>';
            } else if (/windows nt/.test(ua)) {
                osLabelKey = 'hero_download_windows';
                link = 'https://github.com/galactic-connect/galactic-connect.github.io/releases/latest/download/galactic-windows-setup.exe';
                iconHtml = '<svg viewBox="0 0 448 512" fill="currentColor" width="24" height="24"><path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 512V268.4H203.8v177.9zm0-380.6v180.1H448V0L203.8 65.8z"/></svg>';
            }

            heroDlBtn.href = link;
            heroDlText.setAttribute('data-i18n', osLabelKey);
            heroDlText.textContent = translations[currentLang][osLabelKey];
            if (iconHtml) {
                heroDlIcon.innerHTML = iconHtml;
                heroDlBtn.style.display = 'flex';
                heroDlBtn.style.alignItems = 'center';
                heroDlBtn.style.gap = '10px';
            }
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