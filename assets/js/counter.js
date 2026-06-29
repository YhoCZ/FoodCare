document.addEventListener('DOMContentLoaded', () => {
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

  const allCounters = document.querySelectorAll('[data-target]');
  if (allCounters.length === 0) return;

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
});
