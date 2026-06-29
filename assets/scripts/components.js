const HERO_HTML = `
  <!-- ============================================
       SPLASH HERO — Full-screen landing with nav at bottom
       ============================================ -->
  <section class="splash-hero" id="inicio">
    <div class="splash-hero__content">
      <div class="splash-hero__text">
        <h1 class="splash-hero__title">
          <span class="splash-hero__title-text">FoodCare</span>
          <img src="favicon.ico" alt="FoodCare Logo" class="splash-hero__title-icon">
        </h1>
        <p class="splash-hero__subtitle">
          Dile adiós al desperdicio de comida y ahorra en tu despensa
        </p>
        <div class="splash-hero__buttons">
          <a href="#" class="store-badge" id="btn-appstore">
            <svg class="store-badge__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            <div class="store-badge__text">
              <span class="store-badge__label">Download on the</span>
              <span class="store-badge__store">App Store</span>
            </div>
          </a>
          <a href="#" class="store-badge" id="btn-googleplay">
            <svg class="store-badge__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
            <div class="store-badge__text">
              <span class="store-badge__label">GET IT ON</span>
              <span class="store-badge__store">Google Play</span>
            </div>
          </a>
        </div>
      </div>
      <div class="splash-hero__phone">
        <img src="assets/images/hero-phone-cutoff.png" alt="FoodCare App en tu teléfono" class="splash-hero__phone-img">
      </div>
    </div>

    <!-- Nav bar starts at the bottom of the hero -->
    <div class="splash-hero__nav-container" id="splash-nav">
      <nav class="site-nav" id="site-nav-inner">
        <a href="index.html" class="site-nav__brand">
          <img src="favicon.ico" alt="FoodCare" class="site-nav__logo-img">
        </a>
        <div class="site-nav__links">
          <a href="como-funciona.html" class="site-nav__link"><span class="desktop-only">Cómo funciona</span><span class="mobile-only nav-two-lines">Cómo<br>funciona</span></a>
          <a href="index.html" class="site-nav__plus-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </a>
          <a href="sobre-nosotros.html" class="site-nav__link"><span class="desktop-only">Sobre Nosotros</span><span class="mobile-only nav-two-lines">Sobre<br>nosotros</span></a>
          <a href="demo.html" class="site-nav__link site-nav__link--cta">Demo</a>
        </div>
        <button class="site-nav__mobile-toggle" id="mobile-toggle" aria-label="Menú">
          <span></span><span></span><span></span>
        </button>
      </nav>
    </div>
  </section>

  <!-- Fixed header (hidden initially, takes over from splash nav on scroll) -->
  <header class="site-header" id="site-header">
    <div class="container">
      <nav class="site-nav">
        <a href="index.html" class="site-nav__brand">
          <img src="favicon.ico" alt="FoodCare" class="site-nav__logo-img">
        </a>
        <div class="site-nav__links">
          <a href="como-funciona.html" class="site-nav__link"><span class="desktop-only">Cómo funciona</span><span class="mobile-only nav-two-lines">Cómo<br>funciona</span></a>
          <a href="index.html" class="site-nav__plus-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </a>
          <a href="sobre-nosotros.html" class="site-nav__link"><span class="desktop-only">Sobre Nosotros</span><span class="mobile-only nav-two-lines">Sobre<br>nosotros</span></a>
          <a href="demo.html" class="site-nav__link site-nav__link--cta">Demo</a>
        </div>
        <button class="site-nav__mobile-toggle" id="mobile-toggle-header" aria-label="Menú">
          <span></span><span></span><span></span>
        </button>
      </nav>
    </div>
  </header>
  <!-- EASTER EGG: ¡Felicidades por encontrar este mensaje secreto inyectado desde components.js! 🥑 -->
`;

const getTableHTML = (page) => {
  let title = '';
  let text = '';

  if (page === 'index') {
    title = '¿Qué hacemos?';
    text = 'Gestiona tus alimentos, recibe alertas antes de que caduquen y descubre recetas con lo que ya tienes.';
  } else if (page === 'como-funciona') {
    title = '¿Cómo funciona FoodCare?';
    text = 'Conoce paso a paso cómo nuestra app te ayuda a gestionar tu despensa de forma inteligente.';
  } else if (page === 'sobre-nosotros') {
    title = 'Sobre Nosotros';
    text = 'Conoce al equipo detrás de FoodCare y nuestra misión de reducir el desperdicio alimentario.';
  }

  return `
  <!-- ============================================
       ¿QUÉ HACEMOS? / DYNAMIC TABLE — Paper note card section
       ============================================ -->
  <section class="que-hacemos" id="que-hacemos">
    <div class="que-hacemos__bg-cream">
      <div class="container">
        <!-- Scattered table items (Food and Tupperware) -->
        <div class="table-item table-item--taper-1" aria-hidden="true">🍱</div>
        <div class="table-item table-item--tomato" aria-hidden="true">🍅</div>
        <div class="table-item table-item--avocado" aria-hidden="true">🥑</div>
        <div class="table-item table-item--carrot" aria-hidden="true">🥕</div>
        <div class="table-item table-item--taper-2" aria-hidden="true">🥣</div>
        <div class="table-item table-item--lettuce" aria-hidden="true">🥬</div>

        <div class="que-hacemos__card">
          <div class="que-hacemos__tape"></div>
          <h2 class="que-hacemos__title">${title}</h2>
          <p class="que-hacemos__text">
            ${text}
          </p>
        </div>
      </div>
    </div>
    <div class="que-hacemos__bg-teal">
      <!-- Table Legs drop down here -->
      <div class="que-hacemos__leg que-hacemos__leg--left"></div>
      <div class="que-hacemos__leg que-hacemos__leg--right"></div>
    </div>
  </section>
  `;
};

// Inyectar HTML síncronamente donde correspondan los placeholders
const heroPlaceholder = document.getElementById('shared-hero-placeholder');
if (heroPlaceholder) {
  heroPlaceholder.outerHTML = HERO_HTML;
}

const tablePlaceholder = document.getElementById('shared-table-placeholder');
if (tablePlaceholder) {
  const page = tablePlaceholder.getAttribute('data-page') || 'index';
  tablePlaceholder.outerHTML = getTableHTML(page);
}
