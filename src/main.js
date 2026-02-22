import './style.css';

document.querySelector('#app').innerHTML = `
  <header class="header">
    <div class="logo-container">
      <img src="/logo.svg" alt="COCOS Cafe" />
    </div>
    <button class="cart-button" id="cartBtn" aria-label="Відкрити банкетне меню">
      <svg viewBox="0 0 24 24">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
      <span class="cart-badge" id="cartBadge" style="display: none;">0</span>
    </button>
  </header>

  <nav class="main-nav">
    <button class="nav-tab active" data-tab="kitchen">Кухня</button>
    <button class="nav-tab" data-tab="bar">Бар</button>
  </nav>

  <nav class="category-nav" id="categoryNav"></nav>

  <main class="menu-list" id="menuList">
    <!-- Items will be rendered here -->
    <div style="text-align:center; padding: 40px;">Завантаження меню...</div>
  </main>

  <!-- Banquet Builder Modal -->
  <div class="modal-overlay" id="cartModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">Банкетне Меню</h2>
        <button class="btn-close" id="closeCartBtn">&times;</button>
      </div>
      <div class="modal-body" id="cartBody">
        <!-- Rendered cart state -->
      </div>
      <div class="modal-footer" id="cartFooter">
        <div class="totals">
          <span>Загалом:</span>
          <span id="cartTotal">0 ₴</span>
        </div>
        <p class="price-disclaimer" id="priceDisclaimer" style="display: none;">
          * У загальній сумі не враховано позиції без визначеної ціни.
        </p>
        <button class="btn-submit" id="submitOrderBtn" disabled>Сформувати замовлення</button>
      </div>
    </div>
  </div>
`;

// Application State
const state = {
  menuData: { kitchen: [], bar: [] },
  currentTab: 'kitchen',
  currentCategory: null,
  cart: [],
};

// DOM Elements
const categoryNavEl = document.getElementById('categoryNav');
const menuListEl = document.getElementById('menuList');
const cartBadgeEl = document.getElementById('cartBadge');
const cartModal = document.getElementById('cartModal');
const cartBody = document.getElementById('cartBody');
const cartTotal = document.getElementById('cartTotal');
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const submitOrderBtn = document.getElementById('submitOrderBtn');
const priceDisclaimer = document.getElementById('priceDisclaimer');
const navTabs = document.querySelectorAll('.nav-tab');

// Fetch Data
async function init() {
  try {
    const res = await fetch('./menu.json');
    const data = await res.json();
    state.menuData = data;
    renderCategories();
    renderMenu();
    setupEventListeners();
  } catch (error) {
    console.error('Failed to load menu data:', error);
    menuListEl.innerHTML = '<div style="text-align:center; padding: 40px; color: red;">Помилка завантаження меню. Спробуйте пізніше.</div>';
  }
}

// Render Logic
function renderCategories() {
  const items = state.menuData[state.currentTab];

  // Extract unique categories in order
  const categories = [];
  const seen = new Set();
  items.forEach(item => {
    if (!seen.has(item.category)) {
      seen.add(item.category);
      categories.push(item.category);
    }
  });

  if (categories.length > 0 && (!state.currentCategory || !categories.includes(state.currentCategory))) {
    state.currentCategory = categories[0];
  }

  categoryNavEl.innerHTML = categories.map(cat => `
    <button class="category-pill ${cat === state.currentCategory ? 'active' : ''}" data-category="${cat}">
      ${cat}
    </button>
  `).join('');
}

function renderMenu() {
  const items = state.menuData[state.currentTab].filter(i => i.category === state.currentCategory);

  menuListEl.innerHTML = `
    <div class="category-section">
      <h2 class="category-title">${state.currentCategory || ''}</h2>
      ${items.map(item => `
        <div class="menu-item">
          <div class="item-info">
            <h3 class="item-name">${item.name}</h3>
            ${item.description ? `<p class="item-desc">${item.description}</p>` : ''}
            <div class="item-meta">
              ${item.weight || item.volume ? `<span class="item-weight">${item.weight || item.volume}</span>` : ''}
              <span class="item-price">${item.price !== null ? `${item.price} ₴` : 'Уточнюйте'}</span>
            </div>
          </div>
          <div class="item-actions">
            <button class="btn-add" onclick="addToCart('${item.id}')">+ В банкет</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function updateCartUI() {
  // Update badge
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItems > 0) {
    cartBadgeEl.textContent = totalItems;
    cartBadgeEl.style.display = 'flex';
  } else {
    cartBadgeEl.style.display = 'none';
  }

  // Update cart modal body
  if (state.cart.length === 0) {
    cartBody.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
        <p>Ваше банкетне меню порожнє.</p>
        <p style="font-size: 14px; margin-top: 8px;">Додайте страви з меню, щоб сформувати замовлення.</p>
      </div>
    `;
    submitOrderBtn.disabled = true;
    cartTotal.textContent = '0 ₴';
    priceDisclaimer.style.display = 'none';
    return;
  }

  let totalSum = 0;
  let hasMissingPrices = false;

  const cartItemsHtml = state.cart.map((cartItem, index) => {
    const itemData = findItemData(cartItem.id);
    if (!itemData) return '';

    if (itemData.price !== null) {
      totalSum += itemData.price * cartItem.quantity;
    } else {
      hasMissingPrices = true;
    }

    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${itemData.name}</div>
          <div class="cart-item-price">${itemData.price !== null ? `${itemData.price} ₴` : 'Ціну уточнюйте'}</div>
        </div>
        <div class="quantity-controls">
          <button class="btn-qty" onclick="updateQuantity('${cartItem.id}', -1)">-</button>
          <div class="qty-value">${cartItem.quantity}</div>
          <button class="btn-qty" onclick="updateQuantity('${cartItem.id}', 1)">+</button>
        </div>
      </div>
    `;
  }).join('');

  const formHtml = `
    <div style="margin-top: 24px; border-top: 1px solid #eee; padding-top: 20px;">
      <h3 style="font-size: 16px; margin-bottom: 16px;">Ваші дані</h3>
      <div class="form-group">
        <label>Ім'я *</label>
        <input type="text" id="orderName" class="form-control" placeholder="Ваше ім'я" required oninput="validateForm()">
      </div>
      <div class="form-group">
        <label>Телефон *</label>
        <input type="tel" id="orderPhone" class="form-control" placeholder="+380..." required oninput="validateForm()">
      </div>
      <div class="form-group">
        <label>Дата та час банкету (опціонально)</label>
        <input type="text" id="orderDate" class="form-control" placeholder="Наприклад: 15 травня, 16:00">
      </div>
      <div class="form-group">
        <label>Кількість гостей (опціонально)</label>
        <input type="number" id="orderGuests" class="form-control" placeholder="Наприклад: 12">
      </div>
      <div class="form-group">
        <label>Коментар (опціонально)</label>
        <textarea id="orderNotes" class="form-control" rows="2" placeholder="Особливі побажання..."></textarea>
      </div>
    </div>
  `;

  cartBody.innerHTML = `<div class="cart-list">${cartItemsHtml}</div>` + formHtml;
  cartTotal.textContent = `${totalSum} ₴`;
  priceDisclaimer.style.display = hasMissingPrices ? 'block' : 'none';
  validateForm();
}

// Interactions
window.addToCart = (id) => {
  const existing = state.cart.find(i => i.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ id, quantity: 1 });
  }
  updateCartUI();

  // Minimal visual feedback
  const btn = document.activeElement;
  if (btn && btn.classList.contains('btn-add')) {
    const originalText = btn.textContent;
    btn.textContent = 'Додано ✓';
    btn.style.background = 'var(--color-success)';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = 'var(--color-brand-dark)';
    }, 1000);
  }
};

window.updateQuantity = (id, change) => {
  const index = state.cart.findIndex(i => i.id === id);
  if (index !== -1) {
    state.cart[index].quantity += change;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
    }
  }
  updateCartUI();
};

window.validateForm = () => {
  const name = document.getElementById('orderName')?.value.trim();
  const phone = document.getElementById('orderPhone')?.value.trim();
  if (name && phone && state.cart.length > 0) {
    submitOrderBtn.disabled = false;
  } else {
    submitOrderBtn.disabled = true;
  }
};

// Utilities
function findItemData(id) {
  const k = state.menuData.kitchen.find(i => i.id === id);
  if (k) return k;
  return state.menuData.bar.find(i => i.id === id);
}

// Submit Order (Viber Deep Link generation)
function submitOrder() {
  const name = document.getElementById('orderName').value.trim();
  const phone = document.getElementById('orderPhone').value.trim();
  const dateStr = document.getElementById('orderDate').value.trim();
  const guests = document.getElementById('orderGuests').value.trim();
  const notes = document.getElementById('orderNotes').value.trim();

  let message = `🥥 Нове замовлення на банкет 🥥\n\n`;
  message += `👤 Клієнт: ${name}\n`;
  message += `📞 Телефон: ${phone}\n`;
  if (dateStr) message += `📅 Дата/Час: ${dateStr}\n`;
  if (guests) message += `👥 Гостей: ${guests}\n\n`;

  message += `📝 ЗАМОВЛЕННЯ:\n`;

  let totalSum = 0;
  let missingPriceCount = 0;

  state.cart.forEach((cartItem, idx) => {
    const itemData = findItemData(cartItem.id);
    let priceText = "";
    if (itemData.price !== null) {
      const lineTotal = itemData.price * cartItem.quantity;
      totalSum += lineTotal;
      priceText = `${itemData.price} = ${lineTotal} ₴`;
    } else {
      missingPriceCount++;
      priceText = "Ціну уточнювати";
    }
    const unit = itemData.weight || itemData.volume || "";
    message += `${idx + 1}. ${itemData.name} - ${cartItem.quantity}шт ${unit ? `(${unit})` : ''} - ${priceText}\n`;
  });

  message += `\n💰 ЗАГАЛЬНА СУМА: ${totalSum} ₴`;
  if (missingPriceCount > 0) {
    message += `*\n*без урахування позицій без ціни`;
  }

  if (notes) {
    message += `\n\nКоментар: ${notes}`;
  }

  // Generate Viber Forward Link
  const encodedMsg = encodeURIComponent(message);
  const viberUrl = `viber://forward?text=${encodedMsg}`;

  // Fallback copy to clipboard
  try {
    navigator.clipboard.writeText(message);
    alert('Замовлення успішно сформовано!\n\nТекст скопійовано в буфер обміну. Зараз відкриється Viber, щоб ви могли відправити його в кафе COCOS.');
  } catch (err) {
    alert('Замовлення успішно сформовано! Зараз відкриється Viber, щоб ви могли відправити його в кафе COCOS.');
  }

  // Native redirect
  window.location.href = viberUrl;

  // Clean cart after submission (optional, can leave it for the user)
  // state.cart = [];
  // updateCartUI();
  // cartModal.classList.remove('active');
}

// Setup Event Listeners
function setupEventListeners() {
  // Tab Switching
  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      navTabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      state.currentTab = e.target.dataset.tab;
      state.currentCategory = null; // reset category on tab switch
      renderCategories();
      renderMenu();
    });
  });

  // Category Switching (Event Delegation)
  categoryNavEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-pill')) {
      state.currentCategory = e.target.dataset.category;
      renderCategories();
      renderMenu();
    }
  });

  // Modal interactions
  cartBtn.addEventListener('click', () => {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent bg scrolling
  });

  closeCartBtn.addEventListener('click', () => {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Close modal on outside click
  cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      cartModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Submit Order
  submitOrderBtn.addEventListener('click', submitOrder);
}

// Start
init();
