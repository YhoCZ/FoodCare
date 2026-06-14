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
  
  // Settings State
  let currentDiet = "Omnívora";
  let isImperial = false;
  let currentLang = "es";
  let isVacationMode = false;
  let isOffline = false;

  let notifications = [
    { type: 'alert', title: '¡Alerta!', text: 'Tu Leche caduca mañana. Consúmelo pronto para evitar desperdicio.', time: 'Hace 2 horas' },
    { type: 'history', title: 'Comida salvada', text: '¡Consumiste las Manzanas a tiempo! Ahorraste S/ 4.50', time: 'Ayer' }
  ];

  /* ==============================================
     DICCIONARIO DE IDIOMAS (SIMULADO)
     ============================================== */
  const i18n = {
    es: {
      sugerencias_hoy: "Sugerencias para hoy", diff_all: "Dificultad: Todas", diff_easy: "Principiante", diff_hard: "Avanzado",
      config_title: "Configuraciones de Cuenta", label_diet: "Dieta Preferida:", diet_omni: "Omnívora", diet_veg: "Vegetariana", diet_vegan: "Vegana",
      label_units: "Sistema de Medición:", unit_metric: "Métrico (kg, g, ml)", unit_imperial: "Imperial (lb, oz, fl)",
      label_lang: "Idioma de la App:", alert_title: "Alertas y Vacaciones", vacation_mode: "Modo Vacaciones (Días)",
      btn_sync: "Sincronizar Datos", edit_profile_title: "Editar Perfil", label_name: "Nombre", btn_save: "Guardar Cambios", btn_consume: "Consumir"
    },
    en: {
      sugerencias_hoy: "Today's Suggestions", diff_all: "Difficulty: All", diff_easy: "Beginner", diff_hard: "Advanced",
      config_title: "Account Settings", label_diet: "Preferred Diet:", diet_omni: "Omnivore", diet_veg: "Vegetarian", diet_vegan: "Vegan",
      label_units: "Measurement System:", unit_metric: "Metric (kg, g, ml)", unit_imperial: "Imperial (lb, oz, fl)",
      label_lang: "App Language:", alert_title: "Alerts & Vacation", vacation_mode: "Vacation Mode (Days)",
      btn_sync: "Sync Data", edit_profile_title: "Edit Profile", label_name: "Name", btn_save: "Save Changes", btn_consume: "Consume"
    },
    pt: {
      sugerencias_hoy: "Sugestões de Hoje", diff_all: "Dificuldade: Todas", diff_easy: "Iniciante", diff_hard: "Avançado",
      config_title: "Configurações da Conta", label_diet: "Dieta Preferida:", diet_omni: "Onívoro", diet_veg: "Vegetariano", diet_vegan: "Vegano",
      label_units: "Sistema de Medição:", unit_metric: "Métrico (kg, g, ml)", unit_imperial: "Imperial (lb, oz, fl)",
      label_lang: "Idioma do App:", alert_title: "Alertas e Férias", vacation_mode: "Modo Férias (Dias)",
      btn_sync: "Sincronizar Dados", edit_profile_title: "Editar Perfil", label_name: "Nome", btn_save: "Salvar Alterações", btn_consume: "Consumir"
    }
  };

  function updateLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[lang] && i18n[lang][key]) {
        el.textContent = i18n[lang][key];
      }
    });
    // Titulo Dashboard especial
    if (lang === 'en') document.querySelector('#view-despensa h3').textContent = 'My Pantry';
    else if (lang === 'pt') document.querySelector('#view-despensa h3').textContent = 'Minha Despensa';
    else document.querySelector('#view-despensa h3').textContent = 'Mi Despensa';
  }

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
    if (isVacationMode) return { id: 'safe', order: 3, text: 'Pausado (Vacaciones)' };
    
    const today = new Date(); today.setHours(0,0,0,0);
    const expiryDate = new Date(expiryDateStr); expiryDate.setHours(0,0,0,0);
    const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { id: 'danger', order: 1, text: 'Vencido' };
    if (diffDays <= 3) return { id: 'warn', order: 2, text: `Vence en ${diffDays} día(s)` };
    return { id: 'safe', order: 3, text: `Seguro (${diffDays} días)` };
  }

  function formatQty(qtyStr) {
    if (!isImperial) return qtyStr;
    const match = qtyStr.match(/^([\d.]+)\s*(kg|g|L|ml)(.*)$/i);
    if (!match) return qtyStr; // fallback
    
    let val = parseFloat(match[1]);
    let unit = match[2].toLowerCase();
    
    if (unit === 'kg') return (val * 2.20462).toFixed(1) + ' lb' + match[3];
    if (unit === 'g') return (val * 0.035274).toFixed(1) + ' oz' + match[3];
    if (unit === 'l' || unit === 'ml') return (val * 33.814).toFixed(1) + ' fl oz' + match[3];
    return qtyStr;
  }
  
  function getPreservationTip(category) {
    switch(category) {
      case 'Frutas/Verduras': return 'Envuelve en papel toalla para absorber la humedad y prolongar su frescura.';
      case 'Panadería': return 'Puedes congelar el pan para que dure hasta 3 meses.';
      case 'Carnes': return 'Guarda en la parte más fría del refrigerador o congela si no usarás en 2 días.';
      case 'Lácteos': return 'Mantén los lácteos al fondo del refri, no en la puerta donde la temperatura varía.';
      default: return 'Guarda en un lugar fresco y seco, alejado de la luz solar directa.';
    }
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
          <div class="food-info" style="cursor: pointer;" data-action="view-tip" data-cat="${item.category}">
            <div class="food-icon">${icon}</div>
            <div class="food-details">
              <h4>${item.name} <span style="font-size:0.8rem; font-weight:normal; opacity:0.8;">(${formatQty(item.qty)})</span></h4>
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

    document.querySelectorAll('[data-action="view-tip"]').forEach(info => {
      info.addEventListener('click', (e) => {
        const cat = info.getAttribute('data-cat');
        if (cat !== 'Meal Prep') {
          alert(`💡 Consejo para ${cat}:\n\n${getPreservationTip(cat)}`);
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
    if (isOffline) {
      alert("No se puede contactar con Smart-Chef sin conexión.");
      return;
    }

    const diffFilter = document.getElementById('filter-difficulty').value;
    
    // Diet filtering
    let availableIngredients = pantryData.filter(i => i.category !== 'Meal Prep');
    if (currentDiet === 'Vegetariana') availableIngredients = availableIngredients.filter(i => i.category !== 'Carnes');
    if (currentDiet === 'Vegana') availableIngredients = availableIngredients.filter(i => i.category !== 'Carnes' && i.category !== 'Lácteos');

    // Difficulty filtering mock
    if (diffFilter === 'Avanzado' && availableIngredients.length < 3) {
      alert("No hay recetas avanzadas. Prueba quitando el filtro.");
      return;
    }

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

      // Expiry-based suggestions logic
      const expiring = availableIngredients.filter(i => {
        const s = getSemaphoreStatus(i.date).id;
        return s === 'warn' || s === 'danger';
      });

      let recTitle = "Wok de Pollo y Verduras";
      let recTime = "20 min";
      let recDiff = "Fácil";
      let recIng = `<li>Pollo</li><li>Verduras mixtas</li><li>Salsa de Soya</li>`;
      let recMsg = "";

      if (expiring.length > 0) {
        const names = expiring.map(i => i.name.toLowerCase());
        if (names.some(n => n.includes('espinaca')) && names.some(n => n.includes('huevo'))) {
          recTitle = "Omelette Verde"; recTime = "15 min"; recIng = "<li>Espinaca</li><li>Huevos</li>";
        } else if (names.some(n => n.includes('tomate')) && names.some(n => n.includes('queso'))) {
          recTitle = "Ensalada Caprese"; recTime = "10 min"; recIng = "<li>Tomate</li><li>Queso</li>";
        } else {
          recTitle = `Salteado rápido de ${expiring[0].name}`;
          recIng = `<li>${expiring[0].name}</li><li>Especias</li>`;
        }
      } else {
        recTitle = "Bol Fresco Variado";
        recMsg = "No tienes alimentos por vencer hoy.";
        recIng = "<li>Ingredientes de tu despensa</li>";
      }

      if (currentDiet === 'Vegetariana' && recTitle.includes('Pollo')) {
        recTitle = "Wok de Tofu y Verduras";
        recIng = `<li>Tofu</li><li>Verduras mixtas</li>`;
      }

      document.querySelector('#recipe-result strong').textContent = recTitle;
      if (recMsg) alert(recMsg);

      // Save to DOM elements for modal to read
      resultRecipe.dataset.title = recTitle;
      resultRecipe.dataset.time = recTime;
      resultRecipe.dataset.diff = recDiff;
      resultRecipe.dataset.ing = recIng;

    }, 1500);
  }

  // Open Detailed Recipe
  resultRecipe.addEventListener('click', () => {
    document.getElementById('recipe-detail-title').textContent = resultRecipe.dataset.title || "Wok de Pollo";
    document.getElementById('recipe-detail-time').innerHTML = "⏱️ " + (resultRecipe.dataset.time || "20 min");
    document.getElementById('recipe-detail-diff').innerHTML = "🔥 " + (resultRecipe.dataset.diff || "Fácil");
    document.getElementById('recipe-detail-ingredients').innerHTML = resultRecipe.dataset.ing || "<li>Ingredientes</li>";
    
    
    openModal(document.getElementById('modal-recipe-details'));
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

  document.querySelectorAll('[id="btn-consume-now"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      pantryData = pantryData.filter(i => !i.name.toLowerCase().includes('pollo'));
      reportStats.savedKg += 0.5; reportStats.savedMoney += 12.50;
      
      notifications.unshift({ type: 'history', title: 'Comida salvada', text: '¡Consumiste el Pollo a tiempo! Ahorraste S/ 12.50', time: 'Justo ahora' });
      
      updateReportsUI();
      renderPantry();
      alert("Marcado como consumido Buen provecho.");
      resultRecipe.classList.add('hidden');
      closeModal(document.getElementById('modal-recipe-details'));
    });
  });

  document.querySelectorAll('[id="btn-meal-prep"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      pantryData = pantryData.filter(i => !i.name.toLowerCase().includes('pollo'));
      addFoodLogic('Tupper: Pollo', 'Meal Prep', '1 porción', 0, getRelativeDate(0), getRelativeDate(3));
      reportStats.savedKg += 0.5;
      reportStats.tuppersPrepared++;
      
      notifications.unshift({ type: 'history', title: 'Tupper Guardado', text: 'Has preparado Pollo. ¡Listo para la semana!', time: 'Justo ahora' });
      
      updateReportsUI();
      resultRecipe.classList.add('hidden');
      alert("Guardado como Tupper y directo a Despensa.");
      closeModal(document.getElementById('modal-recipe-details'));
    });
  });

  document.getElementById('btn-share-recipe').addEventListener('click', () => {
    if (isOffline) {
      alert("No se puede generar el enlace sin conexión.");
      return;
    }
    const title = document.getElementById('recipe-detail-title').textContent;
    const text = `Mira esta receta en FoodCare: ${title} - [URL]`;
    
    if (navigator.share) {
      navigator.share({ title: 'FoodCare Recipe', text: text, url: 'https://savora.app/recipe' })
        .catch(console.error);
    } else {
      alert("Simulación de Compartir (WhatsApp/Redes):\n\n" + text);
    }
  });

  document.getElementById('btn-download-pdf').addEventListener('click', () => {
    alert("Descargando reporte en PDF... (Simulación)");
  });

  /* ==============================================
     PERFIL Y CONFIG
     ============================================== */
  document.getElementById('setting-diet').addEventListener('change', (e) => {
    currentDiet = e.target.value;
  });

  document.getElementById('setting-units').addEventListener('change', (e) => {
    isImperial = (e.target.value === 'Imperial');
    renderPantry();
  });

  document.getElementById('setting-lang').addEventListener('change', (e) => {
    updateLanguage(e.target.value);
  });

  document.getElementById('toggle-vacation').addEventListener('change', (e) => {
    const days = document.getElementById('setting-vacation-days').value;
    const statusTxt = document.getElementById('vacation-status-text');
    if (e.target.checked && days > 0) {
      isVacationMode = true;
      document.getElementById('vacation-days-display').textContent = days;
      statusTxt.style.display = 'block';
      alert(`El sistema silenciará las alertas por ${days} días.`);
    } else {
      isVacationMode = false;
      e.target.checked = false;
      statusTxt.style.display = 'none';
      alert("Las alertas de vencimiento vuelven a la normalidad instantáneamente.");
    }
    renderPantry();
  });

  // Debug Panels
  document.getElementById('btn-simulate-cronjob').addEventListener('click', () => {
    // Determine inactivity
    const userInactive = false; // we assume active for now, but we can simulate it
    // For the BDD scenario: 
    if (userInactive) {
      notifications.unshift({ type: 'alert', title: 'Recordatorio', text: 'Tu despensa te extraña, ¡actualízala!', time: 'Justo ahora' });
    } else {
      if (reportStats.wastedItems === 0) {
        notifications.unshift({ type: 'history', title: 'Resumen Semanal', text: `¡Gran semana! Salvaste ${Math.floor(reportStats.savedKg * 2)} alimentos.`, time: 'Justo ahora' });
      } else {
        notifications.unshift({ type: 'alert', title: 'Resumen Semanal', text: `Resumen: Desperdiciaste ${reportStats.wastedItems} alimento(s) esta semana.`, time: 'Justo ahora' });
      }
    }
    alert("Notificación de fin de semana disparada. Revisa la campana 🔔");
    document.getElementById('noti-badge-count').style.display = 'flex';
    document.getElementById('noti-badge-count').textContent = '!';
    renderNotifications();
  });

  document.getElementById('btn-simulate-offline').addEventListener('click', (e) => {
    isOffline = !isOffline;
    if (isOffline) {
      e.target.textContent = "📶 Sin Conexión (Modo Offline Activado)";
      alert("Estás sin conexión. Los cambios se guardarán localmente.");
    } else {
      e.target.textContent = "📶 Simular Sin Conexión";
      alert("Conexión recuperada. Sincronizando preferencias en la nube...");
    }
  });

  document.getElementById('btn-sync-cloud').addEventListener('click', (e) => {
    if (isOffline) {
      alert("No puedes sincronizar estando sin internet.");
      return;
    }
    const btn = e.target;
    const oldText = btn.textContent;
    btn.textContent = "Sincronizando...";
    setTimeout(() => {
      btn.textContent = "¡Sincronizado!";
      btn.style.background = "var(--green-main)";
      btn.style.color = "white";
      setTimeout(() => btn.textContent = oldText, 2000);
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
