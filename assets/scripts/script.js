/* ============================================
   FOODCARE — Interactive JavaScript
   Redesigned: Splash Hero Nav Animation + Multi-page
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Detect if we're on the index (splash) page ----------
  const splashHero = document.querySelector('.splash-hero');
  const isIndex = !!splashHero;

  if (isIndex) {
    document.body.classList.add('is-index');
  }

  // ---------- Splash Hero → Fixed Header Transition (index only) ----------
  const siteHeader = document.getElementById('site-header');
  const splashNav = document.getElementById('splash-nav');

  if (isIndex && siteHeader && splashNav) {
    const handleSplashScroll = () => {
      // The nav container at the bottom of the hero
      const splashNavRect = splashNav.getBoundingClientRect();

      // When the splash nav scrolls out of view, show the fixed header
      if (splashNavRect.top < 0) {
        siteHeader.classList.add('visible');
        splashNav.classList.add('hidden');
      } else {
        siteHeader.classList.remove('visible');
        splashNav.classList.remove('hidden');
      }
    };

    window.addEventListener('scroll', handleSplashScroll, { passive: true });
    handleSplashScroll(); // Check initial state
  }

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return; // Skip bare # links
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = isIndex ? 20 : 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---------- Scroll Reveal Animation ----------
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- Generic Counter Animation ----------
  // Works for both hero stats and impact metrics
  const animateCounter = (counter) => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000;
    const isFloat = !Number.isInteger(target);
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        if (isFloat) {
          counter.textContent = current.toFixed(1) + suffix;
        } else {
          counter.textContent = Math.floor(current).toLocaleString() + suffix;
        }
        requestAnimationFrame(updateCounter);
      } else {
        if (isFloat) {
          counter.textContent = target.toFixed(1).replace('.0', '') + suffix;
        } else {
          counter.textContent = target.toLocaleString() + suffix;
        }
      }
    };

    updateCounter();
  };

  // Observe all counter elements
  const allCounters = document.querySelectorAll('[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        if (!counter.dataset.animated) {
          counter.dataset.animated = 'true';
          animateCounter(counter);
        }
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  allCounters.forEach(counter => counterObserver.observe(counter));

  // ---------- Video Placeholder Hover Effects ----------
  const videoPlaceholders = document.querySelectorAll('.video-placeholder, .team-video-placeholder');
  videoPlaceholders.forEach(placeholder => {
    placeholder.addEventListener('click', () => {
      // Future: swap placeholder for iframe when video is ready
      // For now, gentle feedback animation
      const playBtn = placeholder.querySelector('.play-btn-large, .team-play-btn');
      if (playBtn) {
        playBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          playBtn.style.transform = 'scale(1)';
        }, 200);
      }
    });
  });

  // ---------- Hero Carousel Logic ----------
  const carouselSlides = document.querySelectorAll('.carousel-slide');
  const carouselDots = document.querySelectorAll('.dot');
  if (carouselSlides.length > 0 && carouselDots.length > 0) {
    let currentSlide = 0;
    let carouselInterval;

    const goToSlide = (index) => {
      carouselSlides[currentSlide].classList.remove('active');
      carouselDots[currentSlide].classList.remove('active');
      currentSlide = index;
      carouselSlides[currentSlide].classList.add('active');
      carouselDots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
      let next = (currentSlide + 1) % carouselSlides.length;
      goToSlide(next);
    };

    const startCarousel = () => {
      carouselInterval = setInterval(nextSlide, 4000);
    };

    const resetCarousel = () => {
      clearInterval(carouselInterval);
      startCarousel();
    };

    carouselDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        goToSlide(index);
        resetCarousel();
      });
    });

    startCarousel();
  }

  // ---------- Splash Hero Entrance Animation ----------
  if (isIndex) {
    const heroTitle = document.querySelector('.splash-hero__title');
    const heroSubtitle = document.querySelector('.splash-hero__subtitle');
    const heroButtons = document.querySelector('.splash-hero__buttons');

    if (heroTitle) {
      heroTitle.style.opacity = '0';
      heroTitle.style.transform = 'translateY(20px)';
      setTimeout(() => {
        heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
      }, 200);
    }
  }

});
