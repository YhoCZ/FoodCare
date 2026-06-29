document.addEventListener('DOMContentLoaded', () => {
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  
  if (envelopeWrapper) {
    const notesContainer = envelopeWrapper.querySelector('.envelope-notes');
    let allNotes = Array.from(envelopeWrapper.querySelectorAll('.paper-note'));
    
    let slots = [null, null, null];
    let queue = [];

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

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
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

      clickedNote.classList.add('pull-out');
      
      setTimeout(() => {
        clickedNote.classList.remove('pull-out');
        
        queue.push(clickedNote);
        
        const newNote = queue.shift();
        slots[slotIndex] = newNote;
        
        notesContainer.prepend(clickedNote);
        updateDOMStates();
      }, 500);
    });
  }
});
