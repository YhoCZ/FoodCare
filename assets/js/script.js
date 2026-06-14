/* ============================================
   FOODCARE — Interactive JavaScript
   IHC Audited — Counters, Reveals, Placeholders
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Header Scroll Effect ----------
  const header = document.querySelector('.header');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ---------- Mobile Menu Toggle ----------
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
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

  // ---------- Active Navigation Highlight ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // ---------- Parallax on Hero Elements ----------
  const heroVisual = document.querySelector('.hero-visual');

  if (heroVisual && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.03;
      heroVisual.style.transform = `translateY(${rate}px)`;
    });
  }

  // ---------- Hero H1 Entrance Animation ----------
  const heroH1 = document.querySelector('.hero h1');
  if (heroH1) {
    heroH1.style.opacity = '0';
    heroH1.style.transform = 'translateY(20px)';

    setTimeout(() => {
      heroH1.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroH1.style.opacity = '1';
      heroH1.style.transform = 'translateY(0)';
    }, 200);
  }

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

});
