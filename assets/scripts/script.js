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
    let ticking = false;

    const handleSplashScroll = () => {
      const splashNavRect = splashNav.getBoundingClientRect();
      const navTop = splashNavRect.top;
      const navHeight = splashNavRect.height;
      
      const isAtTop = navTop <= 16;

      // When nav scrolls out of view (hits the top), show fixed header and hide splash nav
      if (isAtTop) {
        siteHeader.classList.add('visible');
        splashNav.classList.add('hidden');
      } else {
        siteHeader.classList.remove('visible');
        splashNav.classList.remove('hidden');
      }
      
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(handleSplashScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
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
  const featureTabs = document.querySelectorAll('.feature-tab-card');
  if (carouselSlides.length > 0 && featureTabs.length > 0) {
    let currentSlide = 0;
    let carouselInterval;

    const goToSlide = (index) => {
      carouselSlides[currentSlide].classList.remove('active');
      featureTabs[currentSlide].classList.remove('active');
      currentSlide = index;
      carouselSlides[currentSlide].classList.add('active');
      featureTabs[currentSlide].classList.add('active');
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

    featureTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const index = parseInt(tab.getAttribute('data-slide'));
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

  // ---------- Envelope Testimonials Logic (Row Layout) ----------
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  if (envelopeWrapper) {
    const notesContainer = envelopeWrapper.querySelector('.envelope-notes');
    let allNotes = Array.from(envelopeWrapper.querySelectorAll('.paper-note'));
    
    // Maintain 3 visible slots and a queue for hidden notes
    let slots = [null, null, null]; // [left, center, right]
    let queue = [];

    // Initialize: assign first 3 notes to slots, rest to queue
    allNotes.forEach((note, idx) => {
      if (idx < 3) {
        slots[idx] = note;
      } else {
        queue.push(note);
      }
    });

    const updateDOMStates = () => {
      allNotes.forEach(note => note.setAttribute('data-pos', 'hidden'));
      
      if (slots[0]) slots[0].setAttribute('data-pos', 'left');
      if (slots[1]) slots[1].setAttribute('data-pos', 'center');
      if (slots[2]) slots[2].setAttribute('data-pos', 'right');
    };

    // Open envelope automatically when scrolled into view (requires more scrolling now)
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Small delay so user sees it closed first
            setTimeout(() => {
              envelopeWrapper.classList.add('open');
            }, 200);
          }
        });
      }, { threshold: 0.6 });
      observer.observe(envelopeWrapper);
    } else {
      envelopeWrapper.classList.add('open');
    }

    updateDOMStates();

    notesContainer.addEventListener('click', (e) => {
      const clickedNote = e.target.closest('.paper-note');
      if (!clickedNote) return;

      const pos = clickedNote.getAttribute('data-pos');
      if (pos === 'hidden') return;

      let slotIndex = -1;
      if (pos === 'left') slotIndex = 0;
      if (pos === 'center') slotIndex = 1;
      if (pos === 'right') slotIndex = 2;

      if (slotIndex === -1) return;

      // Animate out
      clickedNote.classList.add('pull-out');
      
      setTimeout(() => {
        clickedNote.classList.remove('pull-out');
        
        // Remove from slot, add to end of queue
        queue.push(clickedNote);
        
        // Take first from queue and put in slot
        const newNote = queue.shift();
        slots[slotIndex] = newNote;
        
        notesContainer.prepend(clickedNote);
        updateDOMStates();
      }, 500);
    });
  }

});
