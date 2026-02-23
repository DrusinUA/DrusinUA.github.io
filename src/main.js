import './style.css';

document.querySelector('#app').innerHTML = `
  <header class="header">
    <div class="logo-container">
      <img src="./logo.png" alt="COCOS Cafe" />
    </div>
    <button class="cart-button" id="cartBtn" type="button" aria-label="Відкрити банкетне меню">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
      <span class="cart-badge" id="cartBadge" hidden>0</span>
    </button>
  </header>

  <nav class="main-nav" aria-label="Розділи меню">
    <button class="nav-tab active" data-tab="kitchen" type="button">Кухня</button>
    <button class="nav-tab" data-tab="bar" type="button">Бар</button>
  </nav>

  <section class="social-links" aria-label="Соціальні мережі">
    <a
      class="social-link instagram"
      href="https://www.instagram.com/cocos_cafe_nr?igsh=MW8yZnkycjBrbnVseg=="
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram COCOS Cafe"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect>
        <circle cx="12" cy="12" r="4"></circle>
        <circle cx="17.6" cy="6.4" r="1.2"></circle>
      </svg>
      <span>Instagram</span>
    </a>
    <a
      class="social-link facebook"
      href="https://www.facebook.com/share/1ELWsbeXum/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Facebook COCOS Cafe"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.8 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.6 1.6-1.6h1.3V4.9c-.5-.1-1.4-.2-2.4-.2-2.4 0-4 1.5-4 4.2V11H8v3h2.3v7h3.5z"></path>
      </svg>
      <span>Facebook</span>
    </a>
  </section>

  <nav class="category-nav" id="categoryNav" aria-label="Категорії"></nav>

  <section class="selected-summary" id="selectedSummary" hidden>
    <p class="selected-summary-text">
      Обрано позицій: <strong id="selectedCount">0</strong>
    </p>
    <button class="selected-summary-btn" id="selectedSummaryBtn" type="button">Редагувати</button>
  </section>

  <main class="menu-list" id="menuList">
    <div class="loader-container">
      <div class="loader-spinner" aria-hidden="true"></div>
      Завантаження меню...
    </div>
  </main>

  <div class="modal-overlay" id="cartModal" aria-hidden="true">
    <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="cartModalTitle">
      <div class="modal-header">
        <h2 class="modal-title" id="cartModalTitle">Банкетне меню</h2>
        <button class="btn-close" id="closeCartBtn" type="button" aria-label="Закрити">&times;</button>
      </div>
      <div class="modal-body" id="cartBody"></div>
      <div class="modal-footer" id="cartFooter">
        <div class="totals">
          <span>Загалом:</span>
          <span id="cartTotal">0 ₴</span>
        </div>
        <p class="price-disclaimer" id="priceDisclaimer" hidden>
          * У загальній сумі не враховано позиції без визначеної ціни.
        </p>
        <div class="footer-actions">
          <button class="btn-secondary" id="copyMessageBtn" type="button" disabled>Copy message</button>
          <button class="btn-submit" id="submitOrderBtn" type="button" disabled>Order in Viber</button>
        </div>
        <p class="viber-hint">
          Якщо Viber не відкрився, надішліть повідомлення вручну на:
          <strong id="viberPhoneText">+380972991794</strong>
          <button class="btn-inline-link" id="copyPhoneBtn" type="button">Copy phone number</button>
        </p>
      </div>
    </div>
  </div>

  <div class="copy-fallback-modal" id="copyFallbackModal" hidden>
    <div class="copy-fallback-content" role="dialog" aria-modal="true" aria-labelledby="copyFallbackTitle">
      <h3 id="copyFallbackTitle">Tap Copy, then we’ll open Viber</h3>
      <p class="copy-fallback-text">
        Браузер не дозволив автоматичне копіювання. Натисніть Copy message, потім Open Viber.
      </p>
      <div class="copy-fallback-actions">
        <button class="btn-secondary" id="fallbackCopyBtn" type="button">Copy message</button>
        <button class="btn-submit" id="fallbackOpenViberBtn" type="button">Open Viber</button>
      </div>
      <button class="btn-inline-link close-fallback" id="closeFallbackBtn" type="button">Закрити</button>
    </div>
  </div>

  <div class="status-toast" id="statusToast" role="status" aria-live="polite" aria-atomic="true"></div>
`;

const state = {
  menuData: { kitchen: [], bar: [] },
  currentTab: 'kitchen',
  currentCategory: null,
  cart: [],
};

let toastTimer;
const VIBER_PHONE = '+380972991794';
const VIBER_CHAT_URL = `viber://chat?number=${encodeURIComponent(VIBER_PHONE)}`;

const categoryNavEl = document.getElementById('categoryNav');
const menuListEl = document.getElementById('menuList');
const cartBadgeEl = document.getElementById('cartBadge');
const cartModal = document.getElementById('cartModal');
const cartBody = document.getElementById('cartBody');
const cartTotal = document.getElementById('cartTotal');
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const submitOrderBtn = document.getElementById('submitOrderBtn');
const copyMessageBtn = document.getElementById('copyMessageBtn');
const copyPhoneBtn = document.getElementById('copyPhoneBtn');
const priceDisclaimer = document.getElementById('priceDisclaimer');
const navTabs = document.querySelectorAll('.nav-tab');
const statusToast = document.getElementById('statusToast');
const selectedSummary = document.getElementById('selectedSummary');
const selectedCount = document.getElementById('selectedCount');
const selectedSummaryBtn = document.getElementById('selectedSummaryBtn');
const copyFallbackModal = document.getElementById('copyFallbackModal');
const fallbackCopyBtn = document.getElementById('fallbackCopyBtn');
const fallbackOpenViberBtn = document.getElementById('fallbackOpenViberBtn');
const closeFallbackBtn = document.getElementById('closeFallbackBtn');
const viberPhoneText = document.getElementById('viberPhoneText');

async function init() {
  viberPhoneText.textContent = VIBER_PHONE;
  setupEventListeners();

  try {
    const res = await fetch('./menu.json');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    state.menuData = data;
    renderCategories();
    renderMenu();
    updateCartUI();
  } catch (error) {
    console.error('Failed to load menu data:', error);
    renderMenuError();
    showStatus('Не вдалося завантажити меню. Спробуйте пізніше.', 'error');
  }
}

function renderMenuError() {
  menuListEl.innerHTML = `
    <div class="menu-error">
      Помилка завантаження меню.<br />
      Будь ласка, спробуйте пізніше.
    </div>
  `;
}

function getCategoriesForCurrentTab() {
  const items = state.menuData[state.currentTab] || [];
  const categories = [];
  const seen = new Set();

  items.forEach((item) => {
    if (!seen.has(item.category)) {
      seen.add(item.category);
      categories.push(item.category);
    }
  });

  return categories;
}

function renderCategories() {
  const categories = getCategoriesForCurrentTab();

  if (categories.length === 0) {
    state.currentCategory = null;
    categoryNavEl.innerHTML = '';
    return;
  }

  if (!state.currentCategory || !categories.includes(state.currentCategory)) {
    state.currentCategory = categories[0];
  }

  categoryNavEl.innerHTML = categories.map((cat) => `
    <button
      class="category-pill${cat === state.currentCategory ? ' active' : ''}"
      data-category="${cat}"
      type="button"
      title="${cat}"
      aria-pressed="${cat === state.currentCategory ? 'true' : 'false'}"
    >
      ${cat}
    </button>
  `).join('');
}

function setActiveCategoryPill(category) {
  const pills = categoryNavEl.querySelectorAll('.category-pill');
  pills.forEach((pill) => {
    const isActive = pill.dataset.category === category;
    pill.classList.toggle('active', isActive);
    pill.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function renderMenu() {
  if (!state.currentCategory) {
    menuListEl.innerHTML = '<div class="menu-empty">Категорії для цього розділу поки не додані.</div>';
    return;
  }

  const allItems = state.menuData[state.currentTab] || [];
  const items = allItems.filter((item) => item.category === state.currentCategory);

  menuListEl.innerHTML = `
    <section class="category-section">
      <h2 class="category-title">${state.currentCategory}</h2>
      ${items.map((item) => `
        <article class="menu-item-row">
          <div class="menu-item-primary">
            <span class="item-name">${item.name}</span>
            <div class="item-leader" aria-hidden="true"></div>
            <span class="item-price">${item.price !== null ? `${item.price} ₴` : 'Уточнюйте'}</span>
          </div>
          ${item.description ? `<div class="item-desc">${item.description}</div>` : ''}
          <div class="item-meta-row">
            ${item.weight || item.volume ? `<span class="item-weight">${item.weight || item.volume}</span>` : '<span></span>'}
            ${renderMenuRowControls(item.id)}
          </div>
        </article>
      `).join('')}
    </section>
  `;
}

function getCartQuantity(id) {
  return state.cart.find((item) => item.id === id)?.quantity ?? 0;
}

function renderMenuRowControls(itemId) {
  const qty = getCartQuantity(itemId);
  if (qty <= 0) {
    return `<button class="btn-add" data-add-id="${itemId}" type="button">+ В банкет</button>`;
  }

  return `
    <div class="inline-qty-wrap">
      <div class="inline-qty-controls" role="group" aria-label="Керування кількістю позиції">
        <button class="btn-menu-qty" data-menu-qty-id="${itemId}" data-change="-1" type="button" aria-label="Зменшити кількість">-</button>
        <span class="menu-qty-value">${qty}</span>
        <button class="btn-menu-qty" data-menu-qty-id="${itemId}" data-change="1" type="button" aria-label="Збільшити кількість">+</button>
      </div>
    </div>
  `;
}

function getOrderFormValues() {
  return {
    name: document.getElementById('orderName')?.value || '',
    phone: document.getElementById('orderPhone')?.value || '',
    eventDate: document.getElementById('orderEventDate')?.value || '',
    eventTime: document.getElementById('orderEventTime')?.value || '',
    guests: document.getElementById('orderGuests')?.value || '',
    notes: document.getElementById('orderNotes')?.value || '',
  };
}

function restoreOrderFormValues(values) {
  if (!values) {
    return;
  }

  const mappings = [
    ['orderName', values.name],
    ['orderPhone', values.phone],
    ['orderEventDate', values.eventDate],
    ['orderEventTime', values.eventTime],
    ['orderGuests', values.guests],
    ['orderNotes', values.notes],
  ];

  mappings.forEach(([id, value]) => {
    const field = document.getElementById(id);
    if (field) {
      field.value = value;
    }
  });
}

function updateCartUI() {
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadgeEl.textContent = totalItems;
  cartBadgeEl.hidden = totalItems === 0;
  selectedCount.textContent = totalItems;
  selectedSummary.hidden = totalItems === 0;

  if (state.cart.length === 0) {
    cartBody.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
        <p>Ваше банкетне меню порожнє.</p>
        <p class="empty-state-help">Додайте страви з меню, щоб сформувати замовлення.</p>
      </div>
    `;
    submitOrderBtn.disabled = true;
    copyMessageBtn.disabled = true;
    cartTotal.textContent = '0 ₴';
    priceDisclaimer.hidden = true;
    return;
  }

  const savedForm = getOrderFormValues();

  let totalSum = 0;
  let hasMissingPrices = false;

  const cartItemsHtml = state.cart.map((cartItem) => {
    const itemData = findItemData(cartItem.id);
    if (!itemData) {
      return '';
    }

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
        <div class="quantity-controls" role="group" aria-label="Кількість позиції">
          <button class="btn-qty" data-qty-id="${cartItem.id}" data-change="-1" type="button">-</button>
          <div class="qty-value">${cartItem.quantity}</div>
          <button class="btn-qty" data-qty-id="${cartItem.id}" data-change="1" type="button">+</button>
        </div>
      </div>
    `;
  }).join('');

  cartBody.innerHTML = `
    <div class="cart-list">${cartItemsHtml}</div>

    <section class="order-form-section">
      <h3 class="order-form-title">Ваші дані</h3>
      <div class="form-group">
        <label for="orderName">Ім'я *</label>
        <input type="text" id="orderName" class="form-control" placeholder="Ваше ім'я" required>
      </div>
      <div class="form-group">
        <label for="orderPhone">Телефон *</label>
        <input type="tel" id="orderPhone" class="form-control" placeholder="+380..." required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="orderEventDate">Дата банкету (опціонально)</label>
          <input type="date" id="orderEventDate" class="form-control">
        </div>
        <div class="form-group">
          <label for="orderEventTime">Час банкету (опціонально)</label>
          <input type="time" id="orderEventTime" class="form-control" step="300">
        </div>
      </div>
      <div class="form-group">
        <label for="orderGuests">Кількість гостей (опціонально)</label>
        <input type="number" id="orderGuests" class="form-control" placeholder="Наприклад: 12" min="1">
      </div>
      <div class="form-group form-group-last">
        <label for="orderNotes">Коментар (опціонально)</label>
        <textarea id="orderNotes" class="form-control" rows="3" placeholder="Особливі побажання..."></textarea>
      </div>
    </section>
    <section class="order-preview-section">
      <h4 class="order-preview-title">Message preview</h4>
      <textarea id="orderPreview" class="order-preview" readonly></textarea>
      <p class="order-preview-note" id="orderPreviewNote">
        Спочатку перевірте текст, потім натисніть <strong>Order in Viber</strong>.
      </p>
    </section>
  `;

  setDateTimeInputConstraints();
  restoreOrderFormValues(savedForm);
  syncTimeInputState();
  cartTotal.textContent = `${totalSum} ₴`;
  priceDisclaimer.hidden = !hasMissingPrices;
  updateOrderPreview();
  validateForm();
}

function findItemData(id) {
  const kitchenItem = state.menuData.kitchen.find((item) => item.id === id);
  if (kitchenItem) {
    return kitchenItem;
  }

  return state.menuData.bar.find((item) => item.id === id);
}

function addToCart(id, sourceButton) {
  const existing = state.cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ id, quantity: 1 });
  }

  renderMenu();
  updateCartUI();
  if (sourceButton) sourceButton.blur();
}

function updateQuantity(id, change) {
  const idx = state.cart.findIndex((item) => item.id === id);
  if (idx === -1) {
    return;
  }

  state.cart[idx].quantity += change;
  if (state.cart[idx].quantity <= 0) {
    state.cart.splice(idx, 1);
  }

  renderMenu();
  updateCartUI();
}

function validateForm() {
  const orderState = getOrderState();
  const validationError = getOrderValidationError(orderState);
  const isValid = !validationError;

  submitOrderBtn.disabled = !isValid;
  copyMessageBtn.disabled = !isValid;

  const noteEl = document.getElementById('orderPreviewNote');
  if (noteEl) {
    if (validationError) {
      noteEl.textContent = validationError;
      noteEl.classList.add('is-error');
    } else {
      noteEl.textContent = 'Спочатку перевірте текст, потім натисніть Order in Viber.';
      noteEl.classList.remove('is-error');
    }
  }

  return { isValid, validationError, orderState };
}

function showStatus(message, tone = 'success') {
  clearTimeout(toastTimer);

  statusToast.textContent = message;
  statusToast.classList.remove('success', 'error', 'active');
  statusToast.classList.add(tone, 'active');

  toastTimer = setTimeout(() => {
    statusToast.classList.remove('active');
  }, 3200);
}

function formatOrderDateTime(eventDate, eventTime) {
  if (!eventDate && !eventTime) {
    return '';
  }

  let formattedDate = eventDate;
  if (eventDate) {
    const [year, month, day] = eventDate.split('-');
    if (year && month && day) {
      formattedDate = `${day}.${month}.${year}`;
    }
  }

  if (formattedDate && eventTime) {
    return `${formattedDate}, ${eventTime}`;
  }

  return formattedDate || eventTime;
}

function setDateTimeInputConstraints() {
  const dateInput = document.getElementById('orderEventDate');
  if (dateInput) {
    const now = new Date();
    const localIsoDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    dateInput.min = localIsoDate;
  }

  const timeInput = document.getElementById('orderEventTime');
  if (timeInput) {
    timeInput.step = '300';
  }
}

function syncTimeInputState() {
  const dateInput = document.getElementById('orderEventDate');
  const timeInput = document.getElementById('orderEventTime');
  if (!timeInput) {
    return;
  }

  const hasDate = Boolean(dateInput?.value);
  timeInput.disabled = !hasDate;
  if (!hasDate) {
    timeInput.value = '';
  }
}

function getOrderFormData() {
  const eventDate = document.getElementById('orderEventDate')?.value || '';
  const eventTime = document.getElementById('orderEventTime')?.value || '';

  return {
    name: document.getElementById('orderName')?.value.trim() || '',
    phone: document.getElementById('orderPhone')?.value.trim() || '',
    eventDate,
    eventTime,
    dateTime: formatOrderDateTime(eventDate, eventTime),
    guests: document.getElementById('orderGuests')?.value.trim() || '',
    notes: document.getElementById('orderNotes')?.value.trim() || '',
  };
}

function getOrderState() {
  const form = getOrderFormData();
  let total = 0;

  const items = state.cart.map((cartItem) => {
    const itemData = findItemData(cartItem.id);
    const unitPrice = itemData?.price ?? null;
    const lineTotal = unitPrice !== null ? unitPrice * cartItem.quantity : null;
    if (lineTotal !== null) {
      total += lineTotal;
    }

    return {
      id: cartItem.id,
      name: itemData?.name || 'Невідома позиція',
      quantity: cartItem.quantity,
      unitPrice,
      lineTotal,
      unit: itemData?.weight || itemData?.volume || '',
    };
  });

  return {
    customer: form,
    items,
    total,
  };
}

function getOrderValidationError(orderState) {
  if (!orderState.customer.name) {
    return 'Вкажіть імʼя клієнта.';
  }
  if (!orderState.customer.phone) {
    return 'Вкажіть телефон клієнта.';
  }
  if (orderState.items.length === 0) {
    return 'Додайте хоча б одну позицію в замовлення.';
  }
  return '';
}

function buildOrderMessage(orderState) {
  const lines = [
    '🥥 COCOS — Банкетне замовлення',
    '',
    `Імʼя: ${orderState.customer.name || '-'}`,
    `Телефон: ${orderState.customer.phone || '-'}`,
    `Дата/час: ${orderState.customer.dateTime || '-'}`,
    `Гостей: ${orderState.customer.guests || '-'}`,
    '',
    'Позиції:',
  ];

  orderState.items.forEach((item) => {
    const priceText = item.unitPrice !== null ? `${item.unitPrice}₴` : 'ціна уточнюється';
    const totalText = item.lineTotal !== null ? `${item.lineTotal}₴` : '-';
    const unitLabel = item.unit ? ` (${item.unit})` : '';
    lines.push(`- ${item.name}${unitLabel} — x${item.quantity} — ${priceText} = ${totalText}`);
  });

  lines.push('');
  lines.push(`Разом: ${orderState.total}₴`);
  lines.push('');
  lines.push('Коментар:');
  lines.push(orderState.customer.notes || '-');

  return lines.join('\n');
}

function updateOrderPreview() {
  const previewEl = document.getElementById('orderPreview');
  if (!previewEl) {
    return;
  }

  const orderState = getOrderState();
  previewEl.value = buildOrderMessage(orderState);
}

function selectPreviewText(text = '') {
  const previewEl = document.getElementById('orderPreview');
  if (!previewEl) {
    return false;
  }

  if (text) {
    previewEl.value = text;
  }

  previewEl.focus({ preventScroll: true });
  previewEl.select();
  previewEl.setSelectionRange(0, previewEl.value.length);
  return true;
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return { ok: true, method: 'navigator.clipboard' };
    }
  } catch (error) {
    // Continue to legacy fallback.
  }

  let tempTextarea = null;
  try {
    const selectedPreview = selectPreviewText(text);
    if (!selectedPreview) {
      tempTextarea = document.createElement('textarea');
      tempTextarea.value = text;
      tempTextarea.readOnly = true;
      tempTextarea.style.position = 'fixed';
      tempTextarea.style.opacity = '0';
      tempTextarea.style.pointerEvents = 'none';
      tempTextarea.style.left = '-9999px';
      document.body.appendChild(tempTextarea);
      tempTextarea.focus({ preventScroll: true });
      tempTextarea.select();
      tempTextarea.setSelectionRange(0, tempTextarea.value.length);
    }

    if (typeof document.execCommand === 'function') {
      const copied = document.execCommand('copy');
      if (copied) {
        if (tempTextarea) tempTextarea.remove();
        return { ok: true, method: 'execCommand' };
      }
    }
  } catch (error) {
    if (tempTextarea) tempTextarea.remove();
    return { ok: false, method: 'manual', error: error?.message || 'execCommand failed' };
  }

  if (tempTextarea) tempTextarea.remove();

  return { ok: false, method: 'manual', error: 'Clipboard API unavailable' };
}

function openViberChat() {
  window.location.href = VIBER_CHAT_URL;
}

function openCopyFallbackModal() {
  copyFallbackModal.hidden = false;
  document.body.classList.add('modal-open');
}

function closeCopyFallbackModal() {
  copyFallbackModal.hidden = true;
  if (!cartModal.classList.contains('active')) {
    document.body.classList.remove('modal-open');
  }
}

async function handleCopyMessage() {
  updateOrderPreview();
  const { isValid, validationError, orderState } = validateForm();
  if (!isValid) {
    showStatus(validationError, 'error');
    return { ok: false };
  }

  const message = buildOrderMessage(orderState);
  const result = await copyToClipboard(message);
  if (result.ok) {
    showStatus('Повідомлення скопійовано.', 'success');
  } else {
    showStatus('Не вдалося скопіювати автоматично. Виділіть текст і скопіюйте вручну.', 'error');
    selectPreviewText(message);
  }

  return result;
}

async function submitOrder() {
  updateOrderPreview();
  const { isValid, validationError } = validateForm();
  if (!isValid) {
    showStatus(validationError, 'error');
    return;
  }

  submitOrderBtn.disabled = true;
  copyMessageBtn.disabled = true;

  const copyResult = await handleCopyMessage();
  if (copyResult.ok) {
    showStatus('Скопійовано. Відкриваємо Viber…', 'success');
    setTimeout(openViberChat, 80);
  } else {
    openCopyFallbackModal();
  }

  validateForm();
}

function openCartModal() {
  closeCopyFallbackModal();
  cartModal.classList.add('active');
  cartModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  updateCartUI();
}

function closeCartModal() {
  cartModal.classList.remove('active');
  cartModal.setAttribute('aria-hidden', 'true');
  closeCopyFallbackModal();
  document.body.classList.remove('modal-open');
}

function handleOrderFormFieldChange(event) {
  const formControl = event.target.closest('.form-control');
  if (!formControl) {
    return;
  }

  if (formControl.id === 'orderEventDate') {
    syncTimeInputState();
  }

  updateOrderPreview();
  validateForm();
}

function setupEventListeners() {
  navTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.dataset.tab === state.currentTab) {
        return;
      }

      navTabs.forEach((btn) => btn.classList.remove('active'));
      tab.classList.add('active');

      state.currentTab = tab.dataset.tab;
      state.currentCategory = null;
      renderCategories();
      renderMenu();
    });
  });

  categoryNavEl.addEventListener('click', (event) => {
    const pill = event.target.closest('.category-pill');
    if (!pill) {
      return;
    }

    const nextCategory = pill.dataset.category;
    if (!nextCategory || nextCategory === state.currentCategory) {
      return;
    }

    state.currentCategory = nextCategory;
    setActiveCategoryPill(nextCategory);
    renderMenu();
  });

  menuListEl.addEventListener('click', (event) => {
    const addBtn = event.target.closest('.btn-add');
    if (addBtn) {
      const itemId = addBtn.dataset.addId;
      if (itemId) {
        addToCart(itemId, addBtn);
      }
      return;
    }

    const menuQtyButton = event.target.closest('.btn-menu-qty');
    if (!menuQtyButton) {
      return;
    }

    const itemId = menuQtyButton.dataset.menuQtyId;
    const change = Number(menuQtyButton.dataset.change);
    if (!itemId || !Number.isFinite(change)) {
      return;
    }

    updateQuantity(itemId, change);
  });

  cartBody.addEventListener('click', (event) => {
    const qtyButton = event.target.closest('.btn-qty');
    if (!qtyButton) {
      return;
    }

    const itemId = qtyButton.dataset.qtyId;
    const change = Number(qtyButton.dataset.change);
    if (!itemId || !Number.isFinite(change)) {
      return;
    }

    updateQuantity(itemId, change);
  });

  cartBody.addEventListener('input', handleOrderFormFieldChange);
  cartBody.addEventListener('change', handleOrderFormFieldChange);

  cartBtn.addEventListener('click', openCartModal);
  selectedSummaryBtn.addEventListener('click', openCartModal);
  closeCartBtn.addEventListener('click', closeCartModal);
  copyMessageBtn.addEventListener('click', handleCopyMessage);
  copyPhoneBtn.addEventListener('click', async () => {
    const result = await copyToClipboard(VIBER_PHONE);
    if (result.ok) {
      showStatus('Номер телефону скопійовано.', 'success');
    } else {
      showStatus('Не вдалося скопіювати номер автоматично.', 'error');
    }
  });
  fallbackCopyBtn.addEventListener('click', handleCopyMessage);
  fallbackOpenViberBtn.addEventListener('click', () => {
    closeCopyFallbackModal();
    openViberChat();
  });
  closeFallbackBtn.addEventListener('click', closeCopyFallbackModal);
  copyFallbackModal.addEventListener('click', (event) => {
    if (event.target === copyFallbackModal) {
      closeCopyFallbackModal();
    }
  });

  cartModal.addEventListener('click', (event) => {
    if (event.target === cartModal) {
      closeCartModal();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !copyFallbackModal.hidden) {
      closeCopyFallbackModal();
    }
    if (event.key === 'Escape' && cartModal.classList.contains('active')) {
      closeCartModal();
    }
  });

  submitOrderBtn.addEventListener('click', submitOrder);
}

init();
