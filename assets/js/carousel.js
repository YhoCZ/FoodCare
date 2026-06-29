document.addEventListener('DOMContentLoaded', () => {
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
});
