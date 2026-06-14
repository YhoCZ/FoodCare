/* ============================================
   FOODCARE — Demo Interactiva JS (Prototipo V3)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ==============================================
     ESTADO EN MEMORIA (In-Memory State)
     ============================================== */
  let pantryData = [
    { id: 1, name: 'Pollo', category: 'Carnes', qty: '500 g', cost: 12.50, buyDate: getRelativeDate(-3), date: getRelativeDate(-1) }, // Vencido
    { id: 2, name: 'Leche', category: 'Lácteos', qty: '1 L', cost: 4.50, buyDate: getRelativeDate(-5), date: getRelativeDate(1) }, // Warn
    { id: 3, name: 'Manzanas', category: 'Frutas/Verduras', qty: '1 kg', cost: 5.00, buyDate: getRelativeDate(-2), date: getRelativeDate(5) }, // Safe
    { id: 4, name: 'Arroz', category: 'Despensa Seca', qty: '2 kg', cost: 8.00, buyDate: getRelativeDate(-10), date: getRelativeDate(120) }, // Safe
    { id: 5, name: 'Tupper: Salmón', category: 'Meal Prep', qty: '1 porción', cost: 0, buyDate: getRelativeDate(-1), date: getRelativeDate(2) } // Warn
  ];

  let reportStats = { savedKg: 2.5, savedMoney: 45.00, wastedItems: 1, wastedMoney: 0.00, tuppersPrepared: 3 };
  
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
    const item = pantryData.find(i => i.id === id);
    if (!item) return;
    pantryData = pantryData.filter(i => i.id !== id);
    renderPantry();
    
    reportStats.savedKg += 0.5; // Aproximación
    reportStats.savedMoney += parseFloat(item.cost) || 0;
    updateReportsUI();
  }

  function deleteFood(id, reasonText = "Vencido") {
    const item = pantryData.find(i => i.id === id);
    if (!item) return;
    pantryData = pantryData.filter(i => i.id !== id);
    renderPantry();
    
    reportStats.wastedItems++;
    reportStats.wastedMoney += parseFloat(item.cost) || 0;
    
    notifications.unshift({
      type: 'history',
      title: 'Alimento Desechado',
      text: `${item.name} fue retirado de la despensa. Razón: ${reasonText}`,
      time: 'Justo ahora'
    });

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
    document.getElementById('food-cost').value = item.cost || "0.00";
    document.getElementById('food-buy-date').value = item.buyDate;
    document.getElementById('food-date').value = item.date;
    
    // Reset and show incident section
    document.getElementById('section-incidentes').classList.remove('hidden');
    document.getElementById('incident-type').value = "";
    document.getElementById('incident-partial-group').classList.add('hidden');
    document.getElementById('btn-report-incident').style.display = 'none';

    openModal(modalAddFood);
  }

  document.getElementById('incident-type').addEventListener('change', (e) => {
    const val = e.target.value;
    const btn = document.getElementById('btn-report-incident');
    const partialGrp = document.getElementById('incident-partial-group');
    
    if (!val) {
      btn.style.display = 'none';
      partialGrp.classList.add('hidden');
    } else {
      btn.style.display = 'block';
      if (val === 'partial') {
        partialGrp.classList.remove('hidden');
      } else {
        partialGrp.classList.add('hidden');
      }
    }
  });

  document.getElementById('btn-report-incident').addEventListener('click', () => {
    const id = parseInt(document.getElementById('food-id').value);
    const item = pantryData.find(i => i.id === id);
    if (!item) return;

    const val = document.getElementById('incident-type').value;
    if (val === 'partial') {
      const reduceQty = document.getElementById('incident-qty-reduce').value;
      
      const matchCurr = item.qty.match(/^([\d.]+)\s*(.*)$/);
      const matchReduce = reduceQty.match(/^([\d.]+)/);

      if (matchCurr && matchReduce) {
        let newTotal = parseFloat(matchCurr[1]) - parseFloat(matchReduce[1]);
        if (newTotal <= 0) {
          deleteFood(id, "Consumido totalmente");
          closeModal(modalAddFood);
          return;
        }
        item.qty = `${newTotal} ${matchCurr[2].trim()}`;
        renderPantry();
        alert(`Se dedujeron las unidades consumidas. Nuevo stock: ${item.qty}`);
      } else {
        alert("Asegúrate de ingresar un número válido a reducir.");
        return;
      }
    } else {
      let reasons = { cat: "Se lo comió el gato 😼", stolen: "Alguien se lo comió 😠", lost: "Se extravió / aplastó 💥", spoiled: "Se pudrió antes de tiempo 🦠" };
      deleteFood(id, reasons[val]);
      alert(`Se ha registrado la incidencia: ${reasons[val]}`);
    }
    
    closeModal(modalAddFood);
  });

  function addFoodLogic(name, category, qty, cost, buyDate, expiryDate, id = null) {
    if (id) {
      // Edit
      const index = pantryData.findIndex(i => i.id === parseInt(id));
      if(index >= 0) {
        pantryData[index] = { id: parseInt(id), name, category, qty, cost, buyDate, date: expiryDate };
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
        pantryData.push({ id: Date.now(), name, category, qty, cost, buyDate, date: expiryDate });
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
    const cost = document.getElementById('food-cost').value;
    const bDate = document.getElementById('food-buy-date').value;
    const eDate = document.getElementById('food-date').value;

    addFoodLogic(name, cat, qty, cost, bDate, eDate, id || null);
    formAddFood.reset();
    document.getElementById('section-incidentes').classList.add('hidden');
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
    }, 1500);
  }

  // Open Detailed Recipe
  resultRecipe.addEventListener('click', () => {
    document.getElementById('recipe-detail-title').textContent = "Wok de Pollo y Verduras";
    document.getElementById('recipe-detail-time').innerHTML = "⏱️ 20 min";
    document.getElementById('recipe-detail-diff').innerHTML = "🔥 Fácil";
    document.getElementById('recipe-detail-ingredients').innerHTML = `
      <li>Pollo (500 g)</li>
      <li>Verduras mixtas</li>
      <li>Salsa de Soya</li>
    `;
    
    // Stop any existing timer
    clearInterval(timerInterval);
    document.getElementById('recipe-kitchen-timer').textContent = "20:00";
    document.getElementById('btn-start-kitchen-timer').textContent = "Iniciar Timer";
    
    openModal(document.getElementById('modal-recipe-details'));
  });

  // Kitchen Timer Logic
  let kitchenTimerValue = 20 * 60;
  document.getElementById('btn-start-kitchen-timer').addEventListener('click', (e) => {
    const btn = e.target;
    if (btn.textContent === "Iniciar Timer") {
      btn.textContent = "Pausar";
      timerInterval = setInterval(() => {
        kitchenTimerValue--;
        document.getElementById('recipe-kitchen-timer').textContent = `${Math.floor(kitchenTimerValue/60).toString().padStart(2, '0')}:${(kitchenTimerValue%60).toString().padStart(2, '0')}`;
        if(kitchenTimerValue <= 0) clearInterval(timerInterval);
      }, 1000);
    } else {
      clearInterval(timerInterval);
      btn.textContent = "Iniciar Timer";
    }
  });

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
    
    const wastedMoneyEl = document.getElementById('report-wasted-money');
    if (wastedMoneyEl) {
      wastedMoneyEl.textContent = 'S/ ' + reportStats.wastedMoney.toFixed(2);
      document.getElementById('report-wasted-items').textContent = reportStats.wastedItems + ' alimento(s) perdidos';
    } else {
      // Fallback si no está
      if (document.getElementById('report-wasted')) {
        document.getElementById('report-wasted').textContent = reportStats.wastedItems + ' alimento(s)';
      }
    }
    
    if (document.getElementById('report-tuppers-count')) {
      document.getElementById('report-tuppers-count').textContent = reportStats.tuppersPrepared;
    }
  }

  document.getElementById('btn-consume-now').addEventListener('click', () => {
    pantryData = pantryData.filter(i => !i.name.toLowerCase().includes('pollo'));
    reportStats.savedKg += 0.5; reportStats.savedMoney += 12.50;
    
    notifications.unshift({ type: 'history', title: 'Comida salvada', text: '¡Consumiste el Pollo a tiempo! Ahorraste S/ 12.50', time: 'Justo ahora' });
    
    updateReportsUI();
    renderPantry();
    alert("Marcado como consumido. ¡Buen provecho!");
    resultRecipe.classList.add('hidden');
    closeModal(document.getElementById('modal-recipe-details'));
  });

  document.getElementById('btn-meal-prep').addEventListener('click', () => {
    pantryData = pantryData.filter(i => !i.name.toLowerCase().includes('pollo'));
    addFoodLogic('Tupper: Pollo', 'Meal Prep', '1 porción', 0, getRelativeDate(0), getRelativeDate(3));
    reportStats.savedKg += 0.5;
    reportStats.tuppersPrepared++;
    
    notifications.unshift({ type: 'history', title: 'Tupper Guardado', text: 'Has preparado Pollo. ¡Listo para la semana!', time: 'Justo ahora' });
    
    updateReportsUI();
    alert("¡Guardado en tu Despensa como Meal Prep!");
    resultRecipe.classList.add('hidden');
    
    // Switch to pantry view so user sees it
    const pantryNav = document.querySelector('.nav-item[data-target="view-despensa"]');
    if (pantryNav) pantryNav.click();
    closeModal(document.getElementById('modal-recipe-details'));
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

  // Change profile photo logic
  const btnChangePhoto = document.getElementById('btn-change-photo');
  if (btnChangePhoto) {
    btnChangePhoto.addEventListener('click', () => {
      // Simulate file picker by immediately changing photo to a different random face
      const img = document.getElementById('profile-photo-img');
      img.src = 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70);
      alert('¡Foto de perfil actualizada!');
    });
  }

  document.getElementById('form-edit-profile').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('profile-name-display').textContent = document.getElementById('profile-name').value;
    closeModal(document.getElementById('modal-edit-profile'));
  });

});
