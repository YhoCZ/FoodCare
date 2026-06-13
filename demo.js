/* ============================================
   FOODCARE — Demo Interactiva JS (Prototipo V3)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ==============================================
     ESTADO EN MEMORIA (In-Memory State)
     ============================================== */
  let pantryData = [
    { id: 1, name: 'Pollo', category: 'Carnes', qty: '500 g', buyDate: getRelativeDate(-3), date: getRelativeDate(-1) }, // Vencido
    { id: 2, name: 'Leche', category: 'Lácteos', qty: '1 L', buyDate: getRelativeDate(-5), date: getRelativeDate(1) }, // Warn
    { id: 3, name: 'Manzanas', category: 'Frutas/Verduras', qty: '1 kg', buyDate: getRelativeDate(-2), date: getRelativeDate(5) }, // Safe
    { id: 4, name: 'Arroz', category: 'Despensa Seca', qty: '2 kg', buyDate: getRelativeDate(-10), date: getRelativeDate(120) }, // Safe
    { id: 5, name: 'Tupper: Salmón', category: 'Meal Prep', qty: '1 porción', buyDate: getRelativeDate(-1), date: getRelativeDate(2) } // Warn
  ];

  let reportStats = { savedKg: 2.5, savedMoney: 45.00, wastedItems: 1 };
  
  let notifications = [
    { type: 'alert', title: '¡Alerta!', text: 'Tu Leche caduca mañana. Consúmelo pronto para evitar desperdicio.', time: 'Hace 2 horas' },
    { type: 'history', title: 'Comida salvada', text: '¡Consumiste las Manzanas a tiempo! Ahorraste S/ 4.50', time: 'Ayer' }
  ];

  /* ==============================================
     NAVEGACIÓN ENTRE PESTAÑAS
     ============================================== */
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.view');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(nav => nav.classList.remove('active'));
      views.forEach(view => view.classList.remove('active'));
      item.classList.add('active');
      const targetId = item.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
    });
  });

  /* ==============================================
     UTILIDADES
     ============================================== */
  function getRelativeDate(daysOffset) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
  }

  function getSemaphoreStatus(expiryDateStr) {
    const today = new Date(); today.setHours(0,0,0,0);
    const expiryDate = new Date(expiryDateStr); expiryDate.setHours(0,0,0,0);
    const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { id: 'danger', order: 1, text: 'Vencido' };
    if (diffDays <= 3) return { id: 'warn', order: 2, text: `Vence en ${diffDays} día(s)` };
    return { id: 'safe', order: 3, text: `Seguro (${diffDays} días)` };
  }

  /* ==============================================
     RENDERIZADO Y GESTIÓN DE DESPENSA
     ============================================== */
  const foodListEl = document.getElementById('food-list');
  const summaryEl = document.getElementById('pantry-summary');
  
  function renderPantry() {
    foodListEl.innerHTML = '';
    
    // Filtros
    const searchText = document.getElementById('search-food').value.toLowerCase();
    const catVal = document.getElementById('filter-category').value;
    const statVal = document.getElementById('filter-status').value;
    
    let filteredData = pantryData.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchText);
      const matchCat = catVal === 'all' || item.category === catVal;
      const status = getSemaphoreStatus(item.date);
      const matchStat = statVal === 'all' || status.id === statVal;
      return matchSearch && matchCat && matchStat;
    });

    // Ordenar: Danger (1) -> Warn (2) -> Safe (3)
    filteredData.sort((a, b) => {
      return getSemaphoreStatus(a.date).order - getSemaphoreStatus(b.date).order;
    });

    // Render Summary
    let cDanger=0, cWarn=0, cSafe=0;
    pantryData.forEach(item => {
      const s = getSemaphoreStatus(item.date).id;
      if(s==='danger') cDanger++; else if(s==='warn') cWarn++; else cSafe++;
    });
    summaryEl.innerHTML = `
      <span class="summary-chip chip-danger">${cDanger} Vencido(s)</span>
      <span class="summary-chip chip-warn">${cWarn} Por vencer</span>
      <span class="summary-chip chip-safe">${cSafe} Frescos</span>
    `;

    if (filteredData.length === 0) {
      foodListEl.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:20px;">No se encontraron alimentos.</p>`;
      return;
    }

    filteredData.forEach(item => {
      const status = getSemaphoreStatus(item.date);
      const isMealPrep = item.category === 'Meal Prep';
      const colorClass = isMealPrep ? `${status.id} is-tupper` : status.id;
      const icon = isMealPrep ? '🍱' : '🛒';

      const actionBtn = status.id === 'danger'
        ? `<button class="btn-action" data-id="${item.id}" data-action="delete" title="Borrar (Vencido)">🗑️</button>`
        : `<button class="btn-action" data-id="${item.id}" data-action="consume" title="Consumir a tiempo">🍽️</button>`;

      const foodHtml = `
        <div class="food-item ${colorClass}" id="card-${item.id}">
          <div class="food-info">
            <div class="food-icon">${icon}</div>
            <div class="food-details">
              <h4>${item.name} <span style="font-size:0.8rem; font-weight:normal; opacity:0.8;">(${item.qty})</span></h4>
              <p>${item.category} • ${status.text}</p>
            </div>
          </div>
          <div class="food-actions">
            <button class="btn-edit" data-id="${item.id}" title="Editar">✏️</button>
            ${actionBtn}
          </div>
        </div>
      `;
      foodListEl.insertAdjacentHTML('beforeend', foodHtml);
    });

    // Listeners Edit & Actions
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditFood(parseInt(btn.getAttribute('data-id')));
      });
    });

    document.querySelectorAll('.btn-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'));
        const action = btn.getAttribute('data-action');
        
        if (action === 'delete') {
          deleteFood(id);
          alert("Alimento vencido desechado.");
        } else if (action === 'consume') {
          consumeFood(id);
          alert("¡Alimento consumido a tiempo!");
        }
      });
    });
  }

  function consumeFood(id) {
    pantryData = pantryData.filter(item => item.id !== id);
    renderPantry();
    
    reportStats.savedKg += 0.5; // Aproximación
    reportStats.savedMoney += 10.00; // Aproximación
    updateReportsUI();
  }

  function deleteFood(id) {
    pantryData = pantryData.filter(item => item.id !== id);
    renderPantry();
    
    // Simulate adding a waste report
    reportStats.wastedItems++;
    updateReportsUI();
  }

  document.getElementById('search-food').addEventListener('input', renderPantry);
  document.getElementById('filter-category').addEventListener('change', renderPantry);
  document.getElementById('filter-status').addEventListener('change', renderPantry);

  renderPantry();

  /* ==============================================
     MODALES Y ACTION SHEET
     ============================================== */
  function openModal(modal) { modal.classList.remove('hidden'); }
  function closeModal(modal) { modal.classList.add('hidden'); }

  document.querySelectorAll('.btn-close').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(document.getElementById(btn.getAttribute('data-close')));
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  // FAB Center
  const btnAddOptions = document.getElementById('btn-add-options');
  const modalAddOptions = document.getElementById('modal-add-options');
  btnAddOptions.addEventListener('click', () => openModal(modalAddOptions));

  // Opción Escáner
  const startScanner = () => {
    closeModal(modalAddOptions);
    openModal(document.getElementById('modal-scanner'));
    const scannerText = document.querySelector('.scanner-text');
    scannerText.innerHTML = "¡Ojos de lince activados! 🕵️‍♂️<br>Enfocando tus alimentos...";
    
    setTimeout(() => {
      scannerText.innerHTML = "¡Listo! ✨<br>Se ha detectado: Tomates (1 kg).";
      setTimeout(() => {
        closeModal(document.getElementById('modal-scanner'));
        addFoodLogic('Tomates', 'Frutas/Verduras', '1 kg', getRelativeDate(0), getRelativeDate(7));
      }, 1500);
    }, 2000);
  };
  document.getElementById('btn-scan-receipt').addEventListener('click', startScanner);
  document.getElementById('btn-scan-barcode').addEventListener('click', startScanner);

  /* ==============================================
     FORMULARIO MANUAL (ADD / EDIT)
     ============================================== */
  const modalAddFood = document.getElementById('modal-add-food');
  const formAddFood = document.getElementById('form-add-food');
  
  document.getElementById('btn-manual-entry').addEventListener('click', () => {
    closeModal(modalAddOptions);
    document.getElementById('form-food-title').textContent = "Registro Manual";
    formAddFood.reset();
    document.getElementById('food-id').value = "";
    document.getElementById('food-buy-date').value = getRelativeDate(0);
    openModal(modalAddFood);
  });

  function openEditFood(id) {
    const item = pantryData.find(f => f.id === id);
    if(!item) return;
    
    document.getElementById('form-food-title').textContent = "Editar Alimento";
    document.getElementById('food-id').value = item.id;
    document.getElementById('food-name').value = item.name;
    document.getElementById('food-category').value = item.category;
    document.getElementById('food-qty').value = item.qty;
    document.getElementById('food-buy-date').value = item.buyDate;
    document.getElementById('food-date').value = item.date;
    
    openModal(modalAddFood);
  }

  function addFoodLogic(name, category, qty, buyDate, expiryDate, id = null) {
    if (id) {
      // Edit
      const index = pantryData.findIndex(i => i.id === parseInt(id));
      if(index >= 0) {
        pantryData[index] = { id: parseInt(id), name, category, qty, buyDate, date: expiryDate };
      }
    } else {
      // Add or Merge
      const existing = pantryData.findIndex(i => i.name.toLowerCase() === name.toLowerCase() && i.date === expiryDate);
      if (existing >= 0) {
        // Fix string sum for qty (e.g. 1 kg + 2 kg = 3 kg)
        const currentQtyStr = pantryData[existing].qty;
        const matchCurr = currentQtyStr.match(/^([\d.]+)\s*(.*)$/);
        const matchNew = qty.match(/^([\d.]+)\s*(.*)$/);
        
        if (matchCurr && matchNew && matchCurr[2].trim() === matchNew[2].trim()) {
          const total = parseFloat(matchCurr[1]) + parseFloat(matchNew[1]);
          pantryData[existing].qty = `${total} ${matchCurr[2].trim()}`;
        } else {
          pantryData[existing].qty = pantryData[existing].qty + " + " + qty;
        }
      } else {
        pantryData.push({ id: Date.now(), name, category, qty, buyDate, date: expiryDate });
      }
    }
    
    // Disparar alerta automática si el item agregado está próximo a vencer
    const status = getSemaphoreStatus(expiryDate);
    if(status.id === 'warn' || status.id === 'danger') {
      notifications.unshift({
        type: 'alert',
        title: '¡Alerta de Receta!',
        text: `Agregaste ${name} que ${status.text}. Te sugerimos ver IA Recetas para aprovecharlo.`,
        time: 'Justo ahora'
      });
      document.getElementById('noti-badge-count').style.display = 'flex';
      document.getElementById('noti-badge-count').textContent = '!';
      renderNotifications();
    }
    
    renderPantry();
  }

  formAddFood.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('food-id').value;
    const name = document.getElementById('food-name').value;
    const cat = document.getElementById('food-category').value;
    const qty = document.getElementById('food-qty').value;
    const bDate = document.getElementById('food-buy-date').value;
    const eDate = document.getElementById('food-date').value;

    addFoodLogic(name, cat, qty, bDate, eDate, id || null);
    formAddFood.reset();
    closeModal(modalAddFood);
  });

  /* ==============================================
     NOTIFICACIONES
     ============================================== */
  const notiList = document.getElementById('notifications-list');
  function renderNotifications(tab = 'Nuevas') {
    notiList.innerHTML = '';
    const filtered = notifications.filter(n => tab === 'Nuevas' ? n.type === 'alert' : n.type === 'history');
    
    if(filtered.length === 0) {
      notiList.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:20px;">No hay notificaciones aquí.</p>`;
      return;
    }

    filtered.forEach(n => {
      const isHist = n.type === 'history';
      const iconStyle = isHist ? 'background:#e8f5e9; color:#4CAF50;' : '';
      const iconTxt = isHist ? '✅' : '⚠️';
      const borderCls = isHist ? 'history' : 'alert';
      
      notiList.insertAdjacentHTML('beforeend', `
        <div class="notification-item ${borderCls}">
          <div class="noti-icon" style="${iconStyle}">${iconTxt}</div>
          <div class="noti-text">
            <strong>${n.title}</strong>
            <p>${n.text}</p>
            <span class="noti-time">${n.time}</span>
          </div>
        </div>
      `);
    });
  }

  document.getElementById('btn-notifications').addEventListener('click', () => {
    openModal(document.getElementById('modal-notifications'));
    document.getElementById('noti-badge-count').style.display = 'none';
    renderNotifications('Nuevas');
  });

  document.querySelectorAll('.noti-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.noti-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderNotifications(tab.textContent);
    });
  });

  /* ==============================================
     IA RECETAS Y REPORTES
     ============================================== */
  const btnGenerateRecipe = document.getElementById('btn-generate-recipe');
  const btnGenerateCustom = document.getElementById('btn-generate-custom');
  const loaderRecipe = document.getElementById('recipe-loader');
  const resultRecipe = document.getElementById('recipe-result');
  const suggestionsDiv = document.getElementById('recipe-suggestions');
  let timerInterval;

  function simulateGeneration() {
    btnGenerateRecipe.classList.add('hidden');
    btnGenerateCustom.classList.add('hidden');
    resultRecipe.classList.add('hidden');
    loaderRecipe.classList.remove('hidden');

    setTimeout(() => {
      loaderRecipe.classList.add('hidden');
      resultRecipe.classList.remove('hidden');
      btnGenerateRecipe.textContent = "Mezclar al azar de nuevo";
      btnGenerateRecipe.classList.remove('hidden');
      btnGenerateCustom.classList.remove('hidden');
      
      clearInterval(timerInterval);
      let time = 20 * 60;
      const timerEl = document.getElementById('recipe-timer');
      timerEl.textContent = "20:00";
      timerInterval = setInterval(() => {
        time--;
        timerEl.textContent = `${Math.floor(time/60).toString().padStart(2, '0')}:${(time%60).toString().padStart(2, '0')}`;
        if(time <= 0) clearInterval(timerInterval);
      }, 1000);
    }, 1500);
  }

  btnGenerateRecipe.addEventListener('click', simulateGeneration);

  // Custom Ingredients Selection
  const modalCustomRecipe = document.getElementById('modal-custom-recipe');
  const customIngredientsList = document.getElementById('custom-ingredients-list');
  
  btnGenerateCustom.addEventListener('click', () => {
    customIngredientsList.innerHTML = '';
    pantryData.forEach(item => {
      if (item.category !== 'Meal Prep') {
        customIngredientsList.insertAdjacentHTML('beforeend', `
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; background: var(--bg-card); padding: 10px; border-radius: 8px;">
            <input type="checkbox" id="chk-${item.id}" style="width: 20px; height: 20px;">
            <label for="chk-${item.id}" style="flex: 1; font-size: 0.9rem; color: var(--text-main); margin: 0;">${item.name} (${item.qty})</label>
          </div>
        `);
      }
    });
    openModal(modalCustomRecipe);
  });

  document.getElementById('btn-start-custom-recipe').addEventListener('click', () => {
    closeModal(modalCustomRecipe);
    simulateGeneration();
  });

  function updateReportsUI() {
    document.getElementById('report-saved-kg').textContent = reportStats.savedKg.toFixed(1) + ' kg';
    document.getElementById('report-saved-money').textContent = 'S/ ' + reportStats.savedMoney.toFixed(2);
    document.getElementById('report-wasted').textContent = reportStats.wastedItems + ' alimento(s)';
  }

  document.getElementById('btn-consume-now').addEventListener('click', () => {
    // Busca pollo
    pantryData = pantryData.filter(i => !i.name.toLowerCase().includes('pollo'));
    reportStats.savedKg += 0.5; reportStats.savedMoney += 12.50;
    
    notifications.unshift({ type: 'history', title: 'Comida salvada', text: '¡Consumiste el Pollo a tiempo! Ahorraste S/ 12.50', time: 'Justo ahora' });
    
    updateReportsUI();
    renderPantry();
    alert("¡Excelente! Has consumido tus alimentos a tiempo.");
    resultRecipe.classList.add('hidden');
  });

  document.getElementById('btn-meal-prep').addEventListener('click', () => {
    pantryData = pantryData.filter(i => !i.name.toLowerCase().includes('pollo'));
    addFoodLogic('Tupper: Pollo', 'Meal Prep', '1 porción', getRelativeDate(0), getRelativeDate(3));
    reportStats.savedKg += 0.5;
    
    notifications.unshift({ type: 'history', title: 'Tupper Guardado', text: 'Has preparado Pollo. ¡Listo para la semana!', time: 'Justo ahora' });
    
    updateReportsUI();
    alert("¡Meal Prep guardado en tu Despensa!");
    resultRecipe.classList.add('hidden');
  });

  document.getElementById('btn-download-pdf').addEventListener('click', () => {
    alert("Descargando reporte en PDF... (Simulación)");
  });

  /* ==============================================
     PERFIL Y CONFIG
     ============================================== */
  document.getElementById('toggle-darkmode').addEventListener('change', (e) => {
    if(e.target.checked) document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
  });

  document.getElementById('btn-sync-cloud').addEventListener('click', (e) => {
    const btn = e.target;
    btn.textContent = "Sincronizando...";
    setTimeout(() => {
      btn.textContent = "¡Sincronizado!";
      btn.style.background = "var(--green-main)";
      btn.style.color = "white";
    }, 1500);
  });

  document.getElementById('btn-edit-profile').addEventListener('click', () => {
    openModal(document.getElementById('modal-edit-profile'));
  });

  document.getElementById('form-edit-profile').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('profile-name-display').textContent = document.getElementById('profile-name').value;
    closeModal(document.getElementById('modal-edit-profile'));
  });

});
