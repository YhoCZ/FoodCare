document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('features-pinwheel-container');
  if (!container) return;

  const features = [
    {
      id: 'multicanal',
      title: 'Registro Multicanal',
      description: 'Fotos, voz o boleta. Olvídate del tedioso ingreso manual.',
      emoji: '📸',
      gridClass: 'pinwheel-left',
      delay: '',
      colorClass: 'tupper-blue',
      // Columna: 1: emoji, 2: texto
      layoutClass: 'layout-col',
      order: ['media', 'content']
    },
    {
      id: 'tuppers',
      title: 'Control de Tuppers',
      description: 'Registra comida preparada y consúmela en su punto máximo.',
      emoji: '🍱',
      gridClass: 'pinwheel-top',
      delay: 'reveal-delay-1',
      colorClass: 'tupper-green',
      // Fila: 1: texto, 2: emoji
      layoutClass: 'layout-row',
      order: ['content', 'media']
    },
    {
      id: 'ia',
      title: 'IA que Decide',
      description: 'Sugerencias de recetas y alertas de ofertas locales.',
      emoji: '🤖',
      gridClass: 'pinwheel-bottom',
      delay: 'reveal-delay-2',
      colorClass: 'tupper-yellow',
      // Fila: 1: emoji, 2: texto
      layoutClass: 'layout-row',
      order: ['media', 'content']
    },
    {
      id: 'alertas',
      title: 'Alertas Contextuales',
      description: 'Avisos de caducidad y recordatorios cerca del mercado.',
      emoji: '🔔',
      gridClass: 'pinwheel-right',
      delay: 'reveal-delay-3',
      colorClass: 'tupper-red',
      // Columna: 1: texto, 2: emoji
      layoutClass: 'layout-col',
      order: ['content', 'media']
    }
  ];

  let htmlContent = '';

  features.forEach(feature => {
    // Generar el bloque de contenido y el de media según el orden especificado
    let block1 = '';
    let block2 = '';

    const contentBlock = `
      <div class="tupper-half tupper-content">
        <h3>${feature.title}</h3>
        <p>${feature.description}</p>
      </div>
    `;

    const mediaBlock = `
      <div class="tupper-half tupper-media">
        <div class="tupper-icon">
          <img src="assets/img/tupper-rombo/${feature.id}.png" alt="${feature.title}" class="tupper-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';" />
          <span class="tupper-emoji-fallback" style="display:none;">${feature.emoji}</span>
        </div>
      </div>
    `;

    if (feature.order[0] === 'media') {
      block1 = mediaBlock;
      block2 = contentBlock;
    } else {
      block1 = contentBlock;
      block2 = mediaBlock;
    }

    htmlContent += `
      <div class="tupper-card ${feature.gridClass} ${feature.colorClass} ${feature.layoutClass} reveal ${feature.delay}">
        ${block1}
        ${block2}
      </div>
    `;
  });

  // Agregar el disparador invisible en el centro
  htmlContent += `<div class="pinwheel-center-trigger" title="Haz clic aquí"></div>`;

  container.innerHTML = htmlContent;

  // Lógica de animación de 3 clics (Acercamiento -> Rotación -> Reset)
  const trigger = container.querySelector('.pinwheel-center-trigger');
  let clickState = 0;

  if (trigger) {
    trigger.addEventListener('click', () => {
      clickState = (clickState + 1) % 3;
      
      // X es dinámicamente la mitad del lado del cuadrado definido en CSS
      const X = 'calc(var(--tupper-size) / 3)';
      const negX = 'calc(var(--tupper-size) / -3)';
      
      const topCard = container.querySelector('.pinwheel-top');
      const rightCard = container.querySelector('.pinwheel-right');
      const bottomCard = container.querySelector('.pinwheel-bottom');
      const leftCard = container.querySelector('.pinwheel-left');

      if (clickState === 1) {
        // Clic 1: Acercamiento usando transform directo garantizado
        if(topCard) topCard.style.transform = `translate(${X}, ${X})`;
        if(rightCard) rightCard.style.transform = `translate(${negX}, ${X})`;
        if(bottomCard) bottomCard.style.transform = `translate(${negX}, ${negX})`;
        if(leftCard) leftCard.style.transform = `translate(${X}, ${negX})`;
        
        container.classList.remove('is-rotated');
      } else if (clickState === 2) {
        // Clic 2: Mantener acercamiento y Rotar
        container.classList.add('is-rotated');
      } else {
        // Clic 3 (0): Regresar a estado original (vaciar el estilo inline)
        if(topCard) topCard.style.transform = '';
        if(rightCard) rightCard.style.transform = '';
        if(bottomCard) bottomCard.style.transform = '';
        if(leftCard) leftCard.style.transform = '';
        
        container.classList.remove('is-rotated');
      }
    });
  }
});
