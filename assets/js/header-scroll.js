document.addEventListener('DOMContentLoaded', () => {
  const splashHero = document.querySelector('.splash-hero');
  const isIndex = !!splashHero;

  if (isIndex) {
    document.body.classList.add('is-index');
  }

  const siteHeader = document.getElementById('site-header');
  const splashNav = document.getElementById('splash-nav');

  if (isIndex && siteHeader && splashNav) {
    let ticking = false;

    const handleSplashScroll = () => {
      const splashNavRect = splashNav.getBoundingClientRect();
      const navTop = splashNavRect.top;
      
      const isAtTop = navTop <= 16;

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
    handleSplashScroll();
  }
});
