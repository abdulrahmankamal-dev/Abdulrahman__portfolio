/* ============================================================
   app.js — Portfolio Engine
   Fetches JSON content, renders all sections, handles
   language switching & RTL/LTR, scroll-fade, and nav state.
   ============================================================ */

(function () {
  'use strict';

  /* ── State ─────────────────────────────────────────────────── */
  let currentLang = 'en';
  let contentData = null;

  /* ── SVG Icon Library (inline, no external deps) ───────────── */
  const ICONS = {
    location: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>',
    email: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>',
    phone: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>',
    globe: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 10.5a8.983 8.983 0 01-1.284 3.753m-12.432 0A11.952 11.952 0 0112 13.5c2.998 0 5.74 1.1 7.843 2.918m-15.686 0A8.959 8.959 0 013 10.5c0-1.33.29-2.59.807-3.722"/></svg>',
    age: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>',
    vehicle: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 18.75a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 0h7.5m-7.5 0H4.5m7.5 0h3m-3 0a1.5 1.5 0 1 0 3 0m0 0h1.125c.621 0 1.125-.504 1.125-1.125v-2.625L18 8.25h-3.75l-2.25-3h-4.5L5.25 8.25H3v7.875c0 .621.504 1.125 1.125 1.125H6.75Z"/></svg>',
    code: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/></svg>',
    briefcase: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"/></svg>',
    heart: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>',
    graduation: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15v3.75m0 0v1.5a.75.75 0 001.5 0v-1.5m-1.5 0h1.5"/></svg>',
    language: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"/></svg>',
    download: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>',
    arrow: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>',
    translate: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"/></svg>',
    github: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
    instagram: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
    snapchat: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c3 0 5 2.2 5 5 0 1.6-.5 3.1-.9 4 .6.2 1.4.3 2 .3.4 0 .9-.1 1.3-.3.2-.1.4 0 .5.2.1.2 0 .4-.1.5-1 .7-2.4 1.1-3.4 1.2-.2 0-.3.2-.2.4 1 .9 1.8 2.2 1.6 3.7-.1.7-.6 1.2-1.2 1.5-.5.2-1.1.2-1.6.1-.2 0-.4-.1-.6-.2-.3-.1-.6-.2-.9-.3-.4-.1-.9-.2-1.4-.2s-1 .1-1.4.2c-.3.1-.6.2-.9.3-.2.1-.4.2-.6.2-.5.1-1.1.1-1.6-.1-.6-.3-1.1-.8-1.2-1.5-.2-1.5.6-2.8 1.6-3.7.1-.2 0-.4-.2-.4-1-.1-2.4-.5-3.4-1.2-.1-.1-.2-.3-.1-.5.1-.2.3-.3.5-.2.4.2.9.3 1.3.3.6 0 1.4-.1 2-.3-.4-.9-.9-2.4-.9-4 0-2.8 2-5 5-5z"/></svg>',
    facebook: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z</svg>',
    facebook: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z"/></svg>',
    whatsapp: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'
  };

  /* ── Social Icons Map ──────────────────────────────────────── */
  const SOCIAL_ICONS = {
    github: ICONS.github,
    instagram: ICONS.instagram,
    snapchat: ICONS.snapchat,
    facebook: ICONS.facebook
  };

  /* ── Helpers ────────────────────────────────────────────────── */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const t = (key) => contentData.translations[currentLang][key] || key;
  const p = () => contentData.profile[currentLang];

  function injectAmbientBackground() {
    if ($('.ambient-bg')) return;
    const bg = document.createElement('div');
    bg.className = 'ambient-bg';
    
    let html = `
      <div class="ambient-particle particle-1"></div>
      <div class="ambient-particle particle-2"></div>
      <div class="ambient-particle particle-3"></div>
      <div class="ambient-particle particle-4"></div>
      <div class="ambient-particle particle-5"></div>
    `;

    // Add 15 floating bubbles
    for(let i=1; i<=15; i++) {
        html += `<div class="bubble bubble-${i}"></div>`;
    }
    
    bg.innerHTML = html;
    document.body.prepend(bg);
  }

  /* ── Initialize Application ─────────────────────────────────── */
  function loadContent() {
    try {
      contentData = window.PORTFOLIO_CONTENT;
      
      // If PORTFOLIO_CONTENT is found (e.g. script tag in HTML worked), render immediately
      if (contentData) {
        injectAmbientBackground();
        renderAll();
        initScrollReveal();
        initNavScroll();
        return;
      }
      
      // Fallback: If index.html is cached and missing the script tag, load it dynamically
      const script = document.createElement('script');
      script.src = 'data/content.js?t=' + new Date().getTime(); // Cache buster
      script.onload = () => {
        contentData = window.PORTFOLIO_CONTENT;
        if (!contentData) {
          $('#app').innerHTML = '<div class="container mt-5 text-center text-danger"><h3>Error loading portfolio data</h3><p>PORTFOLIO_CONTENT is still not found.</p></div>';
          return;
        }
        injectAmbientBackground();
        renderAll();
        initScrollReveal();
        initNavScroll();
      };
      script.onerror = () => {
        $('#app').innerHTML = '<div class="container mt-5 text-center text-danger"><h3>Error loading portfolio data</h3><p>Could not load data/content.js file.</p></div>';
      };
      document.head.appendChild(script);
      
    } catch (err) {
      console.error('Failed to load content:', err);
      $('#app').innerHTML = `<div class="container mt-5 text-center text-danger"><h3>Error loading portfolio data</h3><p>${err.message}</p></div>`;
    }
  }

  /* ── Master Render ─────────────────────────────────────────── */
  function renderAll() {
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

    renderNav();
    renderHero();
    renderAbout();
    renderExperience();
    renderSkills();
    renderEducationLanguages();
    renderContact();
    renderFooter();

    // Re-init scroll reveal after re-render
    requestAnimationFrame(() => initScrollReveal());
  }

  /* ── Navigation ────────────────────────────────────────────── */
  function renderNav() {
    const nav = $('#main-nav');
    nav.innerHTML = `
      <div class="container">
        <a class="navbar-brand" href="#hero">
          <span class="navbar-brand-text">${p().name}</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navMenu" aria-controls="navMenu"
                aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav ms-auto me-3 align-items-lg-center">
            <li class="nav-item"><a class="nav-link" href="#about" data-nav="about">${t('nav_about')}</a></li>
            <li class="nav-item"><a class="nav-link" href="#experience" data-nav="experience">${t('nav_experience')}</a></li>
            <li class="nav-item"><a class="nav-link" href="#skills" data-nav="skills">${t('nav_skills')}</a></li>
            <li class="nav-item"><a class="nav-link" href="#education" data-nav="education">${t('nav_education')}</a></li>
            <li class="nav-item"><a class="nav-link" href="#languages" data-nav="languages">${t('nav_languages')}</a></li>
            <li class="nav-item"><a class="nav-link" href="#contact" data-nav="contact">${t('nav_contact')}</a></li>
          </ul>
          <button class="lang-toggle-btn" id="langToggle" aria-label="Switch language">
            ${ICONS.translate}
            <span>${t('lang_toggle')}</span>
          </button>
        </div>
      </div>
    `;

    // RTL: flip ms-auto / me-3
    const ul = nav.querySelector('.navbar-nav');
    if (currentLang === 'ar') {
      ul.classList.remove('ms-auto', 'me-3');
      ul.classList.add('me-auto', 'ms-3');
    }

    // Language toggle
    $('#langToggle').addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'ar' : 'en';
      renderAll();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Close mobile menu on link click
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const collapse = bootstrap.Collapse.getInstance($('#navMenu'));
        if (collapse) collapse.hide();
      });
    });
  }

  /* ── Hero ───────────────────────────────────────────────────── */
  function renderHero() {
    const profile = p();
    const initials = profile.name.split(' ').map(w => w[0]).join('').substring(0, 2);

    $('#hero-section').innerHTML = `
      <div class="hero-decor hero-decor-1"></div>
      <div class="hero-decor hero-decor-2"></div>
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-7 hero-content">
            <div class="hero-badge">
              <span class="dot"></span>
              ${profile.title}
            </div>
            <h1 class="hero-name">${profile.name}</h1>
            <p class="hero-title">${profile.title}</p>
            <div class="hero-location">
              ${ICONS.location}
              <span>${profile.location}</span>
            </div>
            <div class="hero-actions">
              <a href="#contact" class="btn-primary-custom" id="hero-cta-contact">
                ${t('hero_cta_contact')}
                ${ICONS.arrow}
              </a>
            </div>
            <div class="hero-socials">
              ${renderSocialLinks('hero')}
            </div>
          </div>
          <div class="col-lg-5 hero-visual">
            <div class="profile-frame">
              <div class="profile-inner">
                <img src="profile.jpg" alt="${profile.name}" class="profile-img">
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ── About ──────────────────────────────────────────────────── */
  function renderAbout() {
    const profile = p();
    const tr = contentData.translations[currentLang];

    $('#about-section').innerHTML = `
      <div class="container">
        <div class="section-header reveal">
          <h2 class="section-title">${t('section_about')}</h2>
        </div>
        <div class="about-card reveal">
          <p class="about-summary">${profile.summary}</p>
          <div class="about-details reveal-stagger">
            <div class="about-detail-item">
              <div class="about-detail-icon">${ICONS.location}</div>
              <div>
                <div class="about-detail-label">${tr.label_location}</div>
                <div class="about-detail-value">${profile.location}</div>
              </div>
            </div>
            <div class="about-detail-item">
              <div class="about-detail-icon">${ICONS.age}</div>
              <div>
                <div class="about-detail-label">${tr.label_age}</div>
                <div class="about-detail-value">${profile.age}</div>
              </div>
            </div>
            <div class="about-detail-item">
              <div class="about-detail-icon">${ICONS.email}</div>
              <div>
                <div class="about-detail-label">${tr.label_email}</div>
                <div class="about-detail-value"><a href="mailto:${profile.email}">${profile.email}</a></div>
              </div>
            </div>
            <div class="about-detail-item">
              <div class="about-detail-icon">${ICONS.phone}</div>
              <div>
                <div class="about-detail-label">${tr.label_phone}</div>
                <div class="about-detail-value"><a href="tel:${profile.phone.replace(/\s/g, '')}">${profile.phone}</a></div>
              </div>
            </div>
            <div class="about-detail-item">
              <div class="about-detail-icon">${ICONS.globe}</div>
              <div>
                <div class="about-detail-label">${tr.label_website}</div>
                <div class="about-detail-value"><a href="${profile.website}" target="_blank" rel="noopener">${profile.website.replace('https://', '')}</a></div>
              </div>
            </div>
            <div class="about-detail-item">
              <div class="about-detail-icon">${ICONS.vehicle}</div>
              <div>
                <div class="about-detail-label">${tr.label_vehicle}</div>
                <div class="about-detail-value">${profile.vehicle}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ── Experience ─────────────────────────────────────────────── */
  function renderExperience() {
    const experience = contentData.experience[currentLang];
    const tr = contentData.translations[currentLang];

    const items = experience.map(exp => {
      const badgeClass = exp.current ? 'current' : 'previous';
      const badgeLabel = exp.current ? tr.label_current : tr.label_previous;
      const respHTML = exp.responsibilities.map(r => `<li>${r}</li>`).join('');

      return `
        <div class="timeline-item reveal">
          <div class="timeline-dot ${badgeClass}"></div>
          <div class="exp-card">
            <span class="exp-badge ${badgeClass}">${badgeLabel}</span>
            <h3 class="exp-company">${exp.company}</h3>
            <p class="exp-roles">${exp.roles.join(' · ')}</p>
            <p class="exp-location">${ICONS.location} ${exp.location}</p>
            <p class="exp-resp-heading">${tr.label_responsibilities}</p>
            <ul class="exp-resp-list">${respHTML}</ul>
          </div>
        </div>
      `;
    }).join('');

    $('#experience-section').innerHTML = `
      <div class="container">
        <div class="section-header reveal">
          <h2 class="section-title">${t('section_experience')}</h2>
        </div>
        <div class="timeline">${items}</div>
      </div>
    `;
  }

  /* ── Skills ─────────────────────────────────────────────────── */
  function renderSkills() {
    const skills = contentData.skills[currentLang];
    const tr = contentData.translations[currentLang];

    const categories = [
      { key: 'technical', icon: ICONS.code,      label: tr.skills_technical, cssClass: 'technical' },
      { key: 'business',  icon: ICONS.briefcase, label: tr.skills_business,  cssClass: 'business' },
      { key: 'personal',  icon: ICONS.heart,     label: tr.skills_personal,  cssClass: 'personal' }
    ];

    const cards = categories.map(cat => {
      const tags = skills[cat.key].map(s =>
        `<span class="skill-tag ${cat.cssClass}">${s}</span>`
      ).join('');

      return `
        <div class="skill-category reveal">
          <div class="skill-cat-icon ${cat.cssClass}">${cat.icon}</div>
          <h3 class="skill-cat-title">${cat.label}</h3>
          <div class="skill-tags">${tags}</div>
        </div>
      `;
    }).join('');

    $('#skills-section').innerHTML = `
      <div class="container">
        <div class="section-header reveal">
          <h2 class="section-title">${t('section_skills')}</h2>
        </div>
        <div class="skills-grid">${cards}</div>
      </div>
    `;
  }

  /* ── Education & Languages ──────────────────────────────────── */
  function renderEducationLanguages() {
    const edu = contentData.education[currentLang];
    const langs = contentData.languages[currentLang];
    const tr = contentData.translations[currentLang];

    const langItems = langs.map(l => `
      <li>
        <span class="lang-name">${l.name}</span>
        <span class="lang-level">${l.level}</span>
      </li>
    `).join('');

    $('#education-section').innerHTML = `
      <div class="container">
        <div class="section-header reveal">
          <h2 class="section-title">${tr.section_education}</h2>
        </div>
        <div class="edu-lang-grid">
          <div class="edu-card reveal">
            <div class="edu-icon">${ICONS.graduation}</div>
            <h3 class="edu-degree">${edu.degree}</h3>
            <p class="edu-institution">${edu.institution}</p>
            <p class="edu-years">${edu.years}</p>
          </div>
          <div class="lang-card reveal" id="languages">
            <div class="lang-icon">${ICONS.language}</div>
            <h3 class="skill-cat-title" style="margin-bottom:8px;">${tr.section_languages}</h3>
            <ul class="lang-list">${langItems}</ul>
          </div>
        </div>
      </div>
    `;
  }

  /* ── Social Links Helper ─────────────────────────────────────── */
  function renderSocialLinks(context) {
    const socials = contentData.socials || [];
    return socials.map(s => `
      <a href="${s.url}" target="_blank" rel="noopener" class="social-link social-link--${context}" aria-label="${s.label}" title="${s.label}">
        ${SOCIAL_ICONS[s.platform] || ''}
      </a>
    `).join('');
  }

  /* ── Contact ────────────────────────────────────────────────── */
  function renderContact() {
    const contact = contentData.contact[currentLang];
    const tr = contentData.translations[currentLang];

    const infoItems = [
      { icon: ICONS.location, label: tr.label_location, value: contact.location, href: null },
      { icon: ICONS.email, label: tr.label_email, value: contact.email, href: `mailto:${contact.email}` },
      { icon: ICONS.phone, label: tr.label_phone, value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}` },
      { icon: ICONS.globe, label: tr.label_website, value: contact.website, href: `https://${contact.website}` }
    ];

    const infoCards = infoItems.map(item => {
      const val = item.href
        ? `<a href="${item.href}" target="_blank" rel="noopener" class="contact-item-value">${item.value}</a>`
        : `<p class="contact-item-value">${item.value}</p>`;
      return `
        <div class="contact-item reveal">
          <div class="contact-item-icon">${item.icon}</div>
          <p class="contact-item-label">${item.label}</p>
          ${val}
        </div>
      `;
    }).join('');

    $('#contact-section').innerHTML = `
      <div class="container">
        <div class="section-header reveal">
          <h2 class="section-title">${t('section_contact')}</h2>
        </div>

        <div class="contact-grid">${infoCards}</div>

        <!-- Social Links -->
        <div class="contact-social reveal">
          <p class="contact-social-heading">${t('section_social')}</p>
          <div class="social-links-row">
            ${renderSocialLinks('contact')}
          </div>
        </div>

        <!-- Contact Form -->
        <div class="contact-form-wrap reveal">
          <h3 class="contact-form-heading">${t('form_heading')}</h3>
          <form class="contact-form" action="https://formsubmit.co/1f9d9de14c11bcf08bef66855125efa5" method="POST" id="contactForm">
            <input type="hidden" name="_captcha" value="false">
            <input type="hidden" name="_template" value="table">
            <div class="form-row-2">
              <div class="form-group">
                <input type="text" name="name" class="form-input" placeholder="${t('form_name')}" required id="form-name">
              </div>
              <div class="form-group">
                <input type="email" name="email" class="form-input" placeholder="${t('form_email')}" required id="form-email">
              </div>
            </div>
            <div class="form-group">
              <input type="text" name="subject" class="form-input" placeholder="${t('form_subject')}" required id="form-subject">
            </div>
            <div class="form-group">
              <textarea name="message" class="form-input form-textarea" rows="5" placeholder="${t('form_message')}" required id="form-message"></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary-custom" id="form-submit">
                ${ICONS.email}
                ${t('form_send')}
              </button>
              <a href="https://wa.me/${contact.whatsapp}" class="btn-whatsapp" target="_blank" rel="noopener" id="whatsapp-cta">
                ${ICONS.whatsapp}
                ${t('form_whatsapp')}
              </a>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  /* ── Footer ─────────────────────────────────────────────────── */
  function renderFooter() {
    $('#footer').innerHTML = `
      <div class="container">
        <div class="footer-socials">
          ${renderSocialLinks('footer')}
        </div>
        <p>${t('footer_copyright')}</p>
      </div>
    `;
  }

  /* ── Scroll Reveal (IntersectionObserver) ────────────────── */
  function initScrollReveal() {
    const revealElements = $$('.reveal, .reveal-stagger');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => {
      // Reset for re-render
      el.classList.remove('visible');
      observer.observe(el);
    });
  }

  /* ── Nav Scroll Effects ─────────────────────────────────────── */
  function initNavScroll() {
    const nav = $('.navbar-portfolio');
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 30) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }

          // Highlight active nav link
          const sections = ['about', 'experience', 'skills', 'education', 'languages', 'contact'];
          let current = '';
          for (const id of sections) {
            const el = document.getElementById(id) || document.getElementById(id + '-section');
            if (el && el.getBoundingClientRect().top <= 160) {
              current = id;
            }
          }
          $$('[data-nav]').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-nav') === current);
          });

          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ── Boot ────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', loadContent);
})();
