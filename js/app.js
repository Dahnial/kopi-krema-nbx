/**
 * ============================================================================
 * KOPI KREMA NBX — FRONTEND CONTROLLER (js/app.js)
 * Standalone Client-Side Single Page Application (SPA) untuk GitHub Pages
 * 4 Prinsip GAS Instant UX: 0ms Switching, Optimistic UI, LocalStorage Cache
 * ============================================================================
 */

// --- DATA MASTER BAWAAN (FALLBACK SEGERA TAMPIL 0MS TANPA BLANK) ---
const DEFAULT_BANNERS = [
  {
    title: 'Authentic Papua Coffee Blend',
    subtitle: 'Kelezatan cita rasa biji kopi arabika pilihan tanah Nabire & Papua Tengah',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Suasana Hangat & Nyaman',
    subtitle: 'Tempat ideal untuk bersantai, bercengkerama, dan menikmati hari',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Artisan Pastry & Signature Meals',
    subtitle: 'Pilihan hidangan lezat pelengkap setiap tegukan kopi spesial Anda',
    image: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=1200&q=80'
  }
];

const DEFAULT_MENU = [
  {
    id: 'MNU-001',
    category: 'Kopi',
    name: 'Kopi Susu Krema Gula Aren',
    desc: 'Espresso Papua blend dipadu susu segar creamy dan sirup aren organik khas.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    stock: 'READY',
    isBestSeller: true,
    isActive: true
  },
  {
    id: 'MNU-002',
    category: 'Kopi',
    name: 'Americano Papua Blend (Hot/Iced)',
    desc: 'Ekstraksi espresso murni dari biji kopi arabika Nabire pilihan.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    stock: 'READY',
    isBestSeller: false,
    isActive: true
  },
  {
    id: 'MNU-003',
    category: 'Kopi',
    name: 'Caramel Macchiato Krema',
    desc: 'Espresso pekat, foam susu lembut, dan lelehan saus karamel artisanal.',
    price: 26000,
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80',
    stock: 'READY',
    isBestSeller: true,
    isActive: true
  },
  {
    id: 'MNU-004',
    category: 'Non-Kopi',
    name: 'Artisan Matcha Latte',
    desc: 'Bubuk matcha murni kualitas premium berpadu susu creamy hangat/dingin.',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
    stock: 'READY',
    isBestSeller: true,
    isActive: true
  },
  {
    id: 'MNU-005',
    category: 'Non-Kopi',
    name: 'Signature Chocolate Dark',
    desc: 'Cokelat kaya rasa dengan sentuhan manis-pahit seimbang khas Papua.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80',
    stock: 'READY',
    isBestSeller: false,
    isActive: true
  },
  {
    id: 'MNU-006',
    category: 'Makanan',
    name: 'Nasi Goreng Spesial Krema',
    desc: 'Nasi goreng racikan rempah istimewa dengan telur mata sapi dan sate ayam.',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    stock: 'READY',
    isBestSeller: true,
    isActive: true
  },
  {
    id: 'MNU-007',
    category: 'Snack',
    name: 'Croissant Butter Artisan',
    desc: 'Pastry renyah berlapis dengan aroma butter Prancis yang memikat.',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    stock: 'READY',
    isBestSeller: false,
    isActive: true
  },
  {
    id: 'MNU-008',
    category: 'Snack',
    name: 'French Fries Truffle Herb',
    desc: 'Kentang goreng renyah berbumbu garam rempah dan aroma truffle istimewa.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    stock: 'READY',
    isBestSeller: false,
    isActive: true
  }
];

// --- GLOBAL STATE ---
const STATE = {
  config: {
    storeStatus: 'OPEN',
    openTime: '10:00',
    closeTime: '22:00',
    waHotline: CONFIG.HOTLINE_WA || '082121210694',
    tableStatus: 'READY',
    bannerList: DEFAULT_BANNERS
  },
  menu: DEFAULT_MENU,
  activeCategory: 'ALL',
  searchQuery: '',
  cart: [],
  currentUser: null,
  adminData: {
    orders: [],
    reservations: [],
    menu: DEFAULT_MENU,
    metrics: {}
  },
  currentSlideIdx: 0,
  slideInterval: null,
  tempProofBase64: null,
  tempProofFilename: '',
  tempProductImageBase64: null,
  tempProductImageFilename: '',
  categoryChartInstance: null
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
  loadCachedData();
  initDarkMode();
  fetchInitialPublicData();
  checkExistingAuthSession();
});

// ============================================================================
// 1. DATA MASTER & OPTIMISTIC CACHE (0ms Cold Start)
// ============================================================================

function loadCachedData() {
  try {
    const cachedMenu = localStorage.getItem('kk_menu_cache');
    const cachedConfig = localStorage.getItem('kk_config_cache');
    const cachedCart = localStorage.getItem('kk_cart');

    if (cachedMenu) {
      const parsedMenu = JSON.parse(cachedMenu);
      if (parsedMenu && parsedMenu.length > 0) STATE.menu = parsedMenu;
    }
    if (cachedConfig) {
      const parsedConfig = JSON.parse(cachedConfig);
      if (parsedConfig) STATE.config = parsedConfig;
    }
    if (cachedCart) STATE.cart = JSON.parse(cachedCart);

    if (!STATE.config.bannerList || STATE.config.bannerList.length === 0) {
      STATE.config.bannerList = DEFAULT_BANNERS;
    }
    if (!STATE.menu || STATE.menu.length === 0) {
      STATE.menu = DEFAULT_MENU;
    }

    renderPublicBanners();
    renderPublicMenu();
    updateCartUI();
    applyStoreStatusUI();
  } catch (e) {
    console.warn('Error reading local cache:', e);
    renderPublicBanners();
    renderPublicMenu();
  }
}

async function fetchInitialPublicData() {
  showLoading();
  try {
    const res = await API.getInitialData();
    hideLoading();
    if (res && res.success && res.data) {
      if (res.data.config) STATE.config = res.data.config;
      if (res.data.menu && res.data.menu.length > 0) STATE.menu = res.data.menu;

      localStorage.setItem('kk_config_cache', JSON.stringify(STATE.config));
      localStorage.setItem('kk_menu_cache', JSON.stringify(STATE.menu));

      renderPublicBanners();
      renderPublicMenu();
      applyStoreStatusUI();
    }
  } catch (err) {
    hideLoading();
    console.warn('Background sync failed:', err);
  }
}

// ============================================================================
// 2. HERO CAROUSEL / SLIDER
// ============================================================================

function renderPublicBanners() {
  const container = document.getElementById('slider-container');
  const dotsBox = document.getElementById('slider-dots');
  if (!container) return;

  const banners = (STATE.config.bannerList && STATE.config.bannerList.length > 0) 
    ? STATE.config.bannerList 
    : DEFAULT_BANNERS;

  container.innerHTML = banners.map((b, i) => `
    <div class="slide-item" style="background-image: url('${b.image}');">
      <div class="slide-overlay"></div>
      <div class="slide-content">
        <span class="slide-badge">Nabire Specialty Coffee</span>
        <h2 class="slide-title">${b.title}</h2>
        <p class="slide-desc">${b.subtitle}</p>
        <button class="btn btn-gold" onclick="scrollToMenu()">
          <i class="fa-solid fa-mug-hot"></i> Jelajahi Menu
        </button>
      </div>
    </div>
  `).join('');

  if (dotsBox) {
    dotsBox.innerHTML = banners.map((_, i) => `
      <div class="slider-dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></div>
    `).join('');
  }

  startSliderAutoPlay();
}

function startSliderAutoPlay() {
  if (STATE.slideInterval) clearInterval(STATE.slideInterval);
  STATE.slideInterval = setInterval(() => {
    const banners = (STATE.config.bannerList && STATE.config.bannerList.length > 0) ? STATE.config.bannerList : DEFAULT_BANNERS;
    const total = banners.length || 1;
    STATE.currentSlideIdx = (STATE.currentSlideIdx + 1) % total;
    updateSlidePosition();
  }, 4500);
}

function goToSlide(idx) {
  STATE.currentSlideIdx = idx;
  updateSlidePosition();
  startSliderAutoPlay();
}

function updateSlidePosition() {
  const container = document.getElementById('slider-container');
  const dots = document.querySelectorAll('.slider-dot');
  if (container) {
    container.style.transform = `translateX(-${STATE.currentSlideIdx * 100}%)`;
  }
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === STATE.currentSlideIdx);
  });
}

function scrollToMenu() {
  const el = document.getElementById('category-pills-bar');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ============================================================================
// 3. ZERO-DELAY MENU FILTER & PUBLIC CATALOG RENDERING
// ============================================================================

function filterCategory(cat) {
  STATE.activeCategory = cat;
  document.querySelectorAll('.category-pill').forEach(pill => {
    pill.classList.toggle('active', pill.getAttribute('data-category') === cat);
  });
  renderPublicMenu();
}

function handleSearchMenu() {
  const input = document.getElementById('input-search-menu');
  STATE.searchQuery = input ? input.value.trim().toLowerCase() : '';
  renderPublicMenu();
}

function renderPublicMenu() {
  const grid = document.getElementById('product-catalog-grid');
  if (!grid) return;

  let items = (STATE.menu && STATE.menu.length > 0) ? STATE.menu : DEFAULT_MENU;
  items = items.filter(m => m.isActive !== false);

  if (STATE.activeCategory !== 'ALL') {
    items = items.filter(m => m.category === STATE.activeCategory);
  }

  if (STATE.searchQuery) {
    items = items.filter(m => 
      (m.name && m.name.toLowerCase().includes(STATE.searchQuery)) ||
      (m.desc && m.desc.toLowerCase().includes(STATE.searchQuery)) ||
      (m.category && m.category.toLowerCase().includes(STATE.searchQuery))
    );
  }

  const badgeEl = document.getElementById('menu-count-badge');
  if (badgeEl) badgeEl.innerText = `${items.length} Menu Pilihan`;

  if (items.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:3rem 1rem; color:var(--text-muted);">
        <i class="fa-solid fa-mug-saucer fa-3x" style="opacity:0.4; margin-bottom:1rem;"></i>
        <h3 style="font-size:1.1rem; color:var(--text-primary);">Menu Tidak Ditemukan</h3>
        <p style="font-size:0.85rem;">Coba cari dengan kata kunci lain atau pilih Semua Menu.</p>
      </div>
    `;
    return;
  }

  const isStoreClosed = (STATE.config.storeStatus === 'CLOSED');

  grid.innerHTML = items.map(item => {
    const isSoldOut = (item.stock === 'SOLD_OUT');
    const isDisabled = isSoldOut || isStoreClosed;

    return `
      <div class="product-card ${isSoldOut ? 'sold-out' : ''}">
        <div class="product-img-box">
          <img src="${item.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80'}" alt="${item.name}" loading="lazy">
          ${item.isBestSeller ? `<div class="bestseller-badge"><i class="fa-solid fa-star"></i> Best Seller</div>` : ''}
          ${isSoldOut ? `<div class="sold-out-overlay"><span class="sold-out-badge">Habis / Sold Out</span></div>` : ''}
        </div>
        <div class="product-info">
          <span class="product-category-tag">${item.category}</span>
          <h3 class="product-name">${item.name}</h3>
          <p class="product-desc">${item.desc || 'Racikan istimewa khas Kopi Krema NBX Nabire.'}</p>
          <div class="product-bottom-row">
            <span class="product-price">Rp ${Number(item.price).toLocaleString('id-ID')}</span>
            <button class="btn-add-cart" 
              title="${isStoreClosed ? 'Toko Sedang Tutup' : (isSoldOut ? 'Menu Habis' : 'Tambah ke Keranjang')}"
              onclick="addToCartOptimistic('${item.id}')"
              ${isDisabled ? 'disabled' : ''}>
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function applyStoreStatusUI() {
  const badge = document.getElementById('header-store-badge');
  const text = document.getElementById('store-status-text');
  const alertBox = document.getElementById('offline-alert-box');
  const isOpen = (STATE.config.storeStatus === 'OPEN');

  if (badge && text) {
    badge.className = 'store-status-badge ' + (isOpen ? 'open' : 'closed');
    text.innerText = isOpen ? `Buka (${STATE.config.openTime || '10:00'} - ${STATE.config.closeTime || '22:00'} WIT)` : 'Tutup (Offline)';
  }

  if (alertBox) {
    alertBox.style.display = isOpen ? 'none' : 'block';
  }

  const tableCta = document.getElementById('table-status-cta');
  if (tableCta) {
    tableCta.innerText = (STATE.config.tableStatus === 'FULL') ? 'Status: Meja Penuh' : 'Status: Meja Tersedia';
  }
}

// ============================================================================
// 4. OPTIMISTIC SHOPPING CART (0ms Feedback)
// ============================================================================

function addToCartOptimistic(productId) {
  if (STATE.config.storeStatus === 'CLOSED') {
    showToast('Toko sedang offline / tutup. Pemesanan tidak dapat dilakukan.', 'error');
    return;
  }

  const item = (STATE.menu && STATE.menu.length > 0 ? STATE.menu : DEFAULT_MENU).find(m => m.id === productId);
  if (!item) return;
  if (item.stock === 'SOLD_OUT') {
    showToast('Mohon maaf, menu ini sedang habis (Sold Out)', 'error');
    return;
  }

  const existing = STATE.cart.find(c => c.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    STATE.cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      qty: 1
    });
  }

  updateCartUI();
  showToast(`✅ ${item.name} ditambahkan!`, 'success');
  localStorage.setItem('kk_cart', JSON.stringify(STATE.cart));
}

function updateCartQty(productId, delta) {
  const item = STATE.cart.find(c => c.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    STATE.cart = STATE.cart.filter(c => c.id !== productId);
  }

  updateCartUI();
  renderCartModalItems();
  localStorage.setItem('kk_cart', JSON.stringify(STATE.cart));
}

function updateCartUI() {
  const totalCount = STATE.cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = STATE.cart.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const badge = document.getElementById('cart-badge-count');
  const barTotal = document.getElementById('cart-bar-total');
  const bar = document.getElementById('floating-cart-bar');

  if (badge) badge.innerText = totalCount;
  if (barTotal) barTotal.innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;

  if (bar) {
    if (totalCount > 0) {
      bar.classList.add('visible');
    } else {
      bar.classList.remove('visible');
    }
  }
}

function openCartModal() {
  if (STATE.cart.length === 0) {
    showToast('Keranjang pesanan masih kosong!', 'info');
    return;
  }
  renderCartModalItems();
  document.getElementById('modal-cart').classList.add('open');
}

function closeCartModal() {
  document.getElementById('modal-cart').classList.remove('open');
}

function renderCartModalItems() {
  const list = document.getElementById('cart-items-list');
  const totalEl = document.getElementById('checkout-total-price');
  if (!list) return;

  const totalPrice = STATE.cart.reduce((sum, item) => sum + (item.qty * item.price), 0);
  if (totalEl) totalEl.innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;

  if (STATE.cart.length === 0) {
    list.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Keranjang belanja kosong.</p>';
    closeCartModal();
    return;
  }

  list.innerHTML = STATE.cart.map(item => `
    <div style="display:flex; align-items:center; justify-content:space-between; padding:0.65rem 0; border-bottom:1px solid var(--border-light);">
      <div style="flex:1;">
        <div style="font-weight:700; font-size:0.95rem;">${item.name}</div>
        <div style="font-size:0.8rem; color:var(--text-secondary);">Rp ${item.price.toLocaleString('id-ID')} / porsi</div>
      </div>
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <button class="btn-icon-only" style="width:28px; height:28px; font-size:0.75rem;" onclick="updateCartQty('${item.id}', -1)">-</button>
        <span style="font-weight:800; min-width:20px; text-align:center;">${item.qty}</span>
        <button class="btn-icon-only" style="width:28px; height:28px; font-size:0.75rem;" onclick="updateCartQty('${item.id}', 1)">+</button>
        <span style="font-weight:700; font-size:0.9rem; margin-left:0.5rem; min-width:70px; text-align:right;">
          Rp ${(item.qty * item.price).toLocaleString('id-ID')}
        </span>
      </div>
    </div>
  `).join('');
}

function handleOrderTypeChange() {
  const type = document.getElementById('order-type').value;
  const addrGroup = document.getElementById('group-delivery-address');
  if (addrGroup) {
    addrGroup.style.display = (type === 'COD') ? 'block' : 'none';
    const addrInput = document.getElementById('order-delivery-address');
    if (addrInput) addrInput.required = (type === 'COD');
  }
}

function handlePaymentMethodChange() {
  const method = document.getElementById('order-payment-method').value;
  const qrisBox = document.getElementById('qris-display-box');
  const uploadBox = document.getElementById('group-upload-proof');

  const isNonCash = (method === 'QRIS' || method === 'TRANSFER');
  if (qrisBox) qrisBox.style.display = (method === 'QRIS') ? 'block' : 'none';
  if (uploadBox) uploadBox.style.display = isNonCash ? 'block' : 'none';
}

function handleProofImageSelected(e) {
  const file = e.target.files[0];
  if (!file) return;

  compressImageClientSide(file, 800, 0.7, function(base64) {
    STATE.tempProofBase64 = base64;
    STATE.tempProofFilename = 'struk_' + Date.now() + '_' + file.name;
    const preview = document.getElementById('proof-preview-box');
    const img = document.getElementById('proof-preview-img');
    if (preview && img) {
      img.src = base64;
      preview.style.display = 'block';
    }
  });
}

// ============================================================================
// 5. CHECKOUT & WHATSAPP DYNAMIC GENERATOR
// ============================================================================

async function handleCheckoutSubmit(e) {
  e.preventDefault();
  if (STATE.cart.length === 0) return;

  const btn = document.getElementById('btn-submit-order');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses Pesanan...';
  showLoading();

  const orderPayload = {
    customerName: document.getElementById('order-cust-name').value.trim(),
    customerPhone: document.getElementById('order-cust-phone').value.trim(),
    orderType: document.getElementById('order-type').value,
    deliveryAddress: document.getElementById('order-delivery-address')?.value.trim() || '',
    paymentMethod: document.getElementById('order-payment-method').value,
    notes: document.getElementById('order-notes')?.value.trim() || '',
    items: STATE.cart,
    totalAmount: STATE.cart.reduce((sum, item) => sum + (item.qty * item.price), 0),
    paymentProofBase64: STATE.tempProofBase64,
    paymentProofFilename: STATE.tempProofFilename
  };

  let waItemsText = orderPayload.items.map(it => `• ${it.name} (${it.qty}x) = Rp ${(it.qty * it.price).toLocaleString('id-ID')}`).join('%0A');
  let waMessage = `*PESANAN BARU — KOPI KREMA NBX*%0A` +
    `----------------------------------------%0A` +
    `*Nama Pemesan:* ${orderPayload.customerName}%0A` +
    `*Nomor WA:* ${orderPayload.customerPhone}%0A` +
    `*Layanan:* ${orderPayload.orderType}%0A` +
    (orderPayload.deliveryAddress ? `*Alamat Antar:* ${orderPayload.deliveryAddress}%0A` : '') +
    `*Metode Bayar:* ${orderPayload.paymentMethod}%0A` +
    (orderPayload.notes ? `*Catatan:* ${orderPayload.notes}%0A` : '') +
    `----------------------------------------%0A` +
    `*Rincian Menu:*%0A${waItemsText}%0A` +
    `----------------------------------------%0A` +
    `*TOTAL TAGIHAN: Rp ${orderPayload.totalAmount.toLocaleString('id-ID')}*%0A%0A` +
    `Halo Kopi Krema NBX, mohon diproses pesanan saya ya. Terima kasih! ☕`;

  const waHotline = (STATE.config.waHotline || '082121210694').replace(/^0/, '62');
  const waUrl = `https://wa.me/${waHotline}?text=${waMessage}`;

  try {
    const res = await API.createOrder(orderPayload);
    hideLoading();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Konfirmasi & Kirim Pesanan';

    STATE.cart = [];
    STATE.tempProofBase64 = null;
    localStorage.removeItem('kk_cart');
    updateCartUI();
    closeCartModal();
    showToast('✅ Pesanan berhasil dicatat! Menghubungkan ke WhatsApp...', 'success');
    window.open(waUrl, '_blank');
  } catch (err) {
    hideLoading();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Konfirmasi & Kirim Pesanan';
    window.open(waUrl, '_blank');
  }
}

// ============================================================================
// 6. RESERVASI MEJA MODAL & SUBMIT
// ============================================================================

function openReservationModal() {
  if (STATE.config.tableStatus === 'FULL') {
    showToast('Mohon maaf, kapasitas meja saat ini sedang FULL / Penuh.', 'error');
    return;
  }
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('res-date');
  if (dateInput) dateInput.value = today;
  document.getElementById('modal-reservation').classList.add('open');
}

function closeReservationModal() {
  document.getElementById('modal-reservation').classList.remove('open');
}

async function handleReservationSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit-res');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim Reservasi...';
  showLoading();

  const resPayload = {
    guestName: document.getElementById('res-name').value.trim(),
    guestPhone: document.getElementById('res-phone').value.trim(),
    resDate: document.getElementById('res-date').value,
    resTime: document.getElementById('res-time').value,
    pax: document.getElementById('res-pax').value,
    tableNo: document.getElementById('res-table-pref').value,
    notes: document.getElementById('res-notes')?.value.trim() || ''
  };

  let waMessage = `*PENGAJUAN RESERVASI MEJA — KOPI KREMA NBX*%0A` +
    `----------------------------------------%0A` +
    `*Nama Tamu:* ${resPayload.guestName}%0A` +
    `*Nomor WA:* ${resPayload.guestPhone}%0A` +
    `*Tanggal:* ${resPayload.resDate}%0A` +
    `*Jam Kedatangan:* ${resPayload.resTime} WIT%0A` +
    `*Jumlah Tamu:* ${resPayload.pax} Orang%0A` +
    `*Area:* ${resPayload.tableNo}%0A` +
    (resPayload.notes ? `*Catatan:* ${resPayload.notes}%0A` : '') +
    `----------------------------------------%0A` +
    `Halo tim Kopi Krema NBX, mohon konfirmasi ketersediaan meja untuk reservasi kami. Terima kasih! 🪑`;

  const waHotline = (STATE.config.waHotline || '082121210694').replace(/^0/, '62');
  const waUrl = `https://wa.me/${waHotline}?text=${waMessage}`;

  try {
    const res = await API.createReservation(resPayload);
    hideLoading();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Ajukan Reservasi';
    closeReservationModal();
    showToast('✅ Reservasi berhasil dicatat! Menghubungkan ke WhatsApp...', 'success');
    window.open(waUrl, '_blank');
  } catch (err) {
    hideLoading();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Ajukan Reservasi';
    closeReservationModal();
    window.open(waUrl, '_blank');
  }
}

// ============================================================================
// 7. AUTENTIKASI & DASHBOARD CONTROLLER (MASTER FALLBACK)
// ============================================================================

function handleAuthButtonClick() {
  if (STATE.currentUser) {
    switchView('dashboard');
  } else {
    openLoginModal();
  }
}

function openLoginModal() {
  document.getElementById('modal-login').classList.add('open');
}

function closeLoginModal() {
  document.getElementById('modal-login').classList.remove('open');
}

function checkExistingAuthSession() {
  const session = localStorage.getItem('kk_auth_user');
  if (session) {
    try {
      STATE.currentUser = JSON.parse(session);
      updateAuthHeaderUI();
    } catch (e) {}
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-login-submit');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memverifikasi...';
  showLoading();

  const u = document.getElementById('login-username').value.trim().toLowerCase();
  const p = document.getElementById('login-password').value.trim();

  // 1. Direct Instant Verification for Master Credentials
  if (u === 'admin' && (p === 'krema123' || p === 'admin')) {
    finishLogin({ username: 'admin', fullName: 'Owner Kopi Krema NBX', role: 'OWNER' });
    return;
  }
  if (u === 'kasir' && (p === 'kasir123' || p === 'kasir')) {
    finishLogin({ username: 'kasir', fullName: 'Staf Kasir Nabire', role: 'KASIR' });
    return;
  }

  // 2. Call API
  try {
    const res = await API.loginUser(u, p);
    hideLoading();
    btn.disabled = false;
    btn.innerText = 'Masuk ke Dashboard';
    if (res && res.success && res.data && res.data.user) {
      finishLogin(res.data.user);
    } else {
      showToast(res ? res.message : 'Username atau password salah', 'error');
    }
  } catch (err) {
    hideLoading();
    btn.disabled = false;
    btn.innerText = 'Masuk ke Dashboard';
    showToast('Koneksi server gagal: ' + err.message, 'error');
  }
}

function finishLogin(userObj) {
  hideLoading();
  const btn = document.getElementById('btn-login-submit');
  if (btn) {
    btn.disabled = false;
    btn.innerText = 'Masuk ke Dashboard';
  }
  STATE.currentUser = userObj;
  localStorage.setItem('kk_auth_user', JSON.stringify(userObj));
  updateAuthHeaderUI();
  closeLoginModal();
  showToast(`Selamat datang, ${userObj.fullName}!`, 'success');
  switchView('dashboard');
}

function logoutAdmin() {
  STATE.currentUser = null;
  localStorage.removeItem('kk_auth_user');
  updateAuthHeaderUI();
  switchView('public');
  showToast('Anda telah keluar dari dashboard.', 'info');
}

function updateAuthHeaderUI() {
  const text = document.getElementById('header-auth-text');
  if (!text) return;
  if (STATE.currentUser) {
    text.innerText = `Dashboard (${STATE.currentUser.role})`;
  } else {
    text.innerText = 'Masuk Kasir';
  }
}

// ============================================================================
// 8. DASHBOARD NAVIGATION & ADMIN TABS
// ============================================================================

function switchView(viewName) {
  document.querySelectorAll('.spa-view').forEach(v => v.classList.remove('active'));
  if (viewName === 'dashboard') {
    if (!STATE.currentUser) {
      openLoginModal();
      return;
    }
    document.getElementById('view-dashboard').classList.add('active');
    document.getElementById('dashboard-user-greeting').innerText = `Hai, ${STATE.currentUser.fullName}`;
    document.getElementById('dashboard-role-badge').innerText = `Peran: ${STATE.currentUser.role}`;

    const isOwner = (STATE.currentUser.role === 'OWNER');
    document.querySelectorAll('.tab-owner-only').forEach(el => {
      el.style.display = isOwner ? 'inline-flex' : 'none';
    });

    refreshDashboardData();
  } else {
    document.getElementById('view-public').classList.add('active');
    renderPublicMenu();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchAdminTab(tabKey) {
  document.querySelectorAll('.admin-tab-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tabKey);
  });
  document.querySelectorAll('.admin-content-pane').forEach(p => p.classList.remove('active'));
  const targetPane = document.getElementById(`pane-${tabKey}`);
  if (targetPane) targetPane.classList.add('active');

  if (tabKey === 'reports') {
    renderCategoryChart();
  }
}

async function refreshDashboardData() {
  renderAdminOrders();
  renderAdminReservations();
  renderAdminProducts();
  renderAdminReports();
  updateAdminTableStatusButton();

  showLoading();
  try {
    const res = await API.getAdminDashboardData();
    hideLoading();
    if (res && res.success && res.data) {
      STATE.adminData = res.data;
      if (res.data.menu && res.data.menu.length > 0) {
        STATE.menu = res.data.menu;
        localStorage.setItem('kk_menu_cache', JSON.stringify(res.data.menu));
      }
      renderAdminOrders();
      renderAdminReservations();
      renderAdminProducts();
      renderAdminReports();
      updateAdminTableStatusButton();
    }
  } catch (err) {
    hideLoading();
    showToast('Gagal memuat data admin: ' + err.message, 'error');
  }
}

// --- RENDER ADMIN ORDERS ---
function renderAdminOrders() {
  const tbody = document.getElementById('table-body-orders');
  if (!tbody) return;

  const filterStatus = document.getElementById('filter-order-status')?.value || 'ALL';
  let orders = STATE.adminData.orders || [];

  if (filterStatus !== 'ALL') {
    orders = orders.filter(o => o.status === filterStatus);
  }

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--text-muted);">Belum ada data pesanan.</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(o => {
    const itemsHtml = (o.items || []).map(it => `<div>• ${it.name} <strong>(${it.qty}x)</strong></div>`).join('');
    const statusColors = {
      PENDING: '#ED6C02',
      DIPROSES: '#0288D1',
      SELESAI: '#2E7D32',
      BATAL: '#D32F2F'
    };

    const proofHtml = o.paymentProofUrl 
      ? `<button class="btn btn-secondary" style="padding:0.25rem 0.5rem; font-size:0.75rem;" onclick="openPreviewModal('${o.paymentProofUrl}', 'Bukti Bayar - ${o.orderId}')"><i class="fa-solid fa-image"></i> Lihat Bukti</button>`
      : '<span style="color:var(--text-muted); font-size:0.75rem;">-</span>';

    const waPhone = (o.customerPhone || '').replace(/^0/, '62');

    return `
      <tr>
        <td>
          <strong>${o.orderId}</strong><br>
          <small style="color:var(--text-muted);">${o.timestamp}</small>
        </td>
        <td>
          <strong>${o.customerName}</strong><br>
          <small>${o.customerPhone}</small>
        </td>
        <td>
          <span style="font-weight:700; font-size:0.75rem; background:var(--crema-subtle); padding:0.2rem 0.5rem; border-radius:4px;">${o.orderType}</span><br>
          <small style="color:var(--text-secondary);">${o.deliveryAddress || '-'}</small>
        </td>
        <td style="font-size:0.8rem;">${itemsHtml}</td>
        <td>
          <strong style="color:var(--espresso-rich);">Rp ${Number(o.totalAmount).toLocaleString('id-ID')}</strong><br>
          <small>${o.paymentMethod}</small>
        </td>
        <td>${proofHtml}</td>
        <td>
          <select class="form-control" style="font-weight:700; color:${statusColors[o.status] || '#333'}; padding:0.3rem 0.5rem; font-size:0.8rem;" onchange="handleOrderStatusChange('${o.orderId}', this.value)">
            <option value="PENDING" ${o.status === 'PENDING' ? 'selected' : ''}>PENDING</option>
            <option value="DIPROSES" ${o.status === 'DIPROSES' ? 'selected' : ''}>DIPROSES</option>
            <option value="SELESAI" ${o.status === 'SELESAI' ? 'selected' : ''}>SELESAI</option>
            <option value="BATAL" ${o.status === 'BATAL' ? 'selected' : ''}>BATAL</option>
          </select>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-secondary" style="padding:0.35rem 0.6rem; font-size:0.75rem;" onclick="printOrderReceipt('${o.orderId}')" title="Cetak Struk POS">
              <i class="fa-solid fa-print"></i>
            </button>
            <a href="https://wa.me/${waPhone}?text=Halo%20Kak%20${encodeURIComponent(o.customerName)},%20pesanan%20Kopi%20Krema%20NBX%20(${o.orderId})%20sedang%20kami%20proses." target="_blank" class="btn btn-secondary" style="padding:0.35rem 0.6rem; font-size:0.75rem; background:#E8F5E9; color:#2E7D32; border-color:#C8E6C9;" title="Chat WhatsApp">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

async function handleOrderStatusChange(orderId, newStatus) {
  const order = STATE.adminData.orders.find(o => o.orderId === orderId);
  if (order) order.status = newStatus;
  showToast(`Status pesanan diubah ke ${newStatus}`, 'success');

  try {
    await API.updateOrderStatus(orderId, newStatus);
  } catch (e) {}
}

async function printOrderReceipt(orderId) {
  showLoading();
  try {
    const res = await API.getReceiptHtml(orderId);
    hideLoading();
    if (res && res.data && res.data.html) {
      const win = window.open('', '_blank', 'width=400,height=600');
      win.document.write(res.data.html);
      win.document.close();
    } else {
      showToast('Struk siap dicetak!', 'info');
    }
  } catch (e) {
    hideLoading();
  }
}

// --- RENDER ADMIN RESERVATIONS ---
function renderAdminReservations() {
  const tbody = document.getElementById('table-body-reservations');
  if (!tbody) return;

  const resList = STATE.adminData.reservations || [];
  if (resList.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">Belum ada data reservasi meja.</td></tr>';
    return;
  }

  tbody.innerHTML = resList.map(r => {
    const waPhone = (r.guestPhone || '').replace(/^0/, '62');
    return `
      <tr>
        <td><strong>${r.resId}</strong><br><small>${r.timestamp}</small></td>
        <td><strong>${r.guestName}</strong><br><small>${r.guestPhone}</small></td>
        <td><strong>${r.resDate}</strong><br><small>${r.resTime} WIT</small></td>
        <td><strong>${r.pax} Orang</strong></td>
        <td>${r.tableNo}<br><small style="color:var(--text-muted);">${r.notes}</small></td>
        <td>
          <select class="form-control" style="font-weight:700; padding:0.3rem 0.5rem; font-size:0.8rem;" onchange="handleReservationStatusChange('${r.resId}', this.value)">
            <option value="PENDING" ${r.status === 'PENDING' ? 'selected' : ''}>PENDING</option>
            <option value="CONFIRMED" ${r.status === 'CONFIRMED' ? 'selected' : ''}>CONFIRMED</option>
            <option value="FULL" ${r.status === 'FULL' ? 'selected' : ''}>FULL / PENUH</option>
            <option value="SELESAI" ${r.status === 'SELESAI' ? 'selected' : ''}>SELESAI</option>
            <option value="BATAL" ${r.status === 'BATAL' ? 'selected' : ''}>BATAL</option>
          </select>
        </td>
        <td>
          <a href="https://wa.me/${waPhone}?text=Halo%20Kak%20${encodeURIComponent(r.guestName)},%20reservasi%20meja%20Kopi%20Krema%20NBX%20untuk%20tanggal%20${r.resDate}%20jam%20${r.resTime}%20WIT%20telah%20kami%20konfirmasi." target="_blank" class="btn btn-secondary" style="padding:0.35rem 0.6rem; font-size:0.75rem; background:#E8F5E9; color:#2E7D32; border-color:#C8E6C9;" title="Konfirmasi via WA">
            <i class="fa-brands fa-whatsapp"></i> Chat WA
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

async function handleReservationStatusChange(resId, newStatus) {
  const res = STATE.adminData.reservations.find(r => r.resId === resId);
  if (res) res.status = newStatus;
  showToast(`Status reservasi diubah ke ${newStatus}`, 'success');

  try {
    await API.updateReservationStatus(resId, newStatus);
  } catch (e) {}
}

async function toggleTableAvailability() {
  const nextStatus = (STATE.config.tableStatus === 'READY') ? 'FULL' : 'READY';
  STATE.config.tableStatus = nextStatus;
  updateAdminTableStatusButton();
  applyStoreStatusUI();
  showToast(`Status meja kafe diubah menjadi ${nextStatus}`, 'success');

  try {
    await API.toggleTableStatus(nextStatus);
  } catch (e) {}
}

function updateAdminTableStatusButton() {
  const btnText = document.getElementById('table-global-status-text');
  if (btnText) {
    btnText.innerText = `Meja: ${STATE.config.tableStatus || 'READY'}`;
  }
}

// ============================================================================
// 9. MODUL MANAJEMEN PRODUK & MENU (CRUD LENGKAP)
// ============================================================================

function renderAdminProducts() {
  const tbody = document.getElementById('table-body-products');
  if (!tbody) return;

  const searchQuery = document.getElementById('admin-search-menu')?.value.trim().toLowerCase() || '';
  const filterCat = document.getElementById('admin-filter-category')?.value || 'ALL';

  let list = STATE.adminData.menu || STATE.menu || DEFAULT_MENU;
  list = list.filter(m => m.isActive !== false);

  if (filterCat !== 'ALL') {
    list = list.filter(m => m.category === filterCat);
  }

  if (searchQuery) {
    list = list.filter(m => 
      (m.name && m.name.toLowerCase().includes(searchQuery)) ||
      (m.id && m.id.toLowerCase().includes(searchQuery))
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">Tidak ada menu yang sesuai filter.</td></tr>';
    return;
  }

  const isOwner = (STATE.currentUser && STATE.currentUser.role === 'OWNER');

  tbody.innerHTML = list.map(item => {
    const isSoldOut = (item.stock === 'SOLD_OUT');

    return `
      <tr>
        <td>
          <img src="${item.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=120&q=80'}" style="width:48px; height:48px; object-fit:cover; border-radius:var(--radius-md); border:1px solid var(--border-light); cursor:pointer;" onclick="openPreviewModal('${item.image}', '${item.name}')">
        </td>
        <td>
          <strong>${item.name}</strong><br>
          <small style="color:var(--text-muted);">${item.id}</small>
        </td>
        <td>
          <span style="background:var(--crema-subtle); padding:0.2rem 0.5rem; border-radius:4px; font-weight:700; font-size:0.75rem;">${item.category}</span>
        </td>
        <td><strong>Rp ${Number(item.price).toLocaleString('id-ID')}</strong></td>
        <td>${item.isBestSeller ? '<span style="color:var(--crema-gold); font-weight:800;">★ Best Seller</span>' : '-'}</td>
        <td>
          <label class="toggle-switch" title="Ubah Stok Ready / Sold Out">
            <input type="checkbox" ${!isSoldOut ? 'checked' : ''} onchange="handleProductStockToggle('${item.id}', this.checked)">
            <span class="toggle-slider"></span>
          </label>
          <span style="font-size:0.75rem; font-weight:700; margin-left:0.4rem; color:${isSoldOut ? 'var(--tag-soldout)' : 'var(--status-open)'};">
            ${isSoldOut ? 'SOLD OUT' : 'READY'}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            ${isOwner ? `
              <button class="btn btn-secondary" style="padding:0.35rem 0.6rem; font-size:0.75rem;" onclick="openEditProductModal('${item.id}')" title="Edit Menu">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn btn-secondary" style="padding:0.35rem 0.6rem; font-size:0.75rem; background:#FFEBEE; color:#C62828; border-color:#FFCDD2;" onclick="handleDeleteProduct('${item.id}')" title="Hapus Menu">
                <i class="fa-solid fa-trash"></i>
              </button>
            ` : '<span style="font-size:0.75rem; color:var(--text-muted);">Kasir (Stok Saja)</span>'}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

async function handleProductStockToggle(menuId, isReadyChecked) {
  const newStock = isReadyChecked ? 'READY' : 'SOLD_OUT';
  
  const item = STATE.menu.find(m => m.id === menuId);
  if (item) item.stock = newStock;
  const adminItem = (STATE.adminData.menu || []).find(m => m.id === menuId);
  if (adminItem) adminItem.stock = newStock;

  localStorage.setItem('kk_menu_cache', JSON.stringify(STATE.menu));
  renderPublicMenu();
  renderAdminProducts();
  showToast(`Stok ${item ? item.name : menuId} diubah ke ${newStock}`, 'success');

  try {
    await API.toggleMenuStock(menuId, newStock);
  } catch (e) {}
}

function openProductModal() {
  document.getElementById('form-product').reset();
  document.getElementById('prod-id').value = '';
  document.getElementById('modal-product-title').innerHTML = '<i class="fa-solid fa-mug-hot" style="color:var(--crema-gold);"></i> Tambah Menu Baru';
  document.getElementById('prod-preview-box').style.display = 'none';
  STATE.tempProductImageBase64 = null;
  STATE.tempProductImageFilename = '';
  document.getElementById('modal-product').classList.add('open');
}

function openEditProductModal(menuId) {
  const item = (STATE.adminData.menu || STATE.menu || DEFAULT_MENU).find(m => m.id === menuId);
  if (!item) return;

  document.getElementById('modal-product-title').innerHTML = '<i class="fa-solid fa-pen-to-square" style="color:var(--crema-gold);"></i> Edit Menu';
  document.getElementById('prod-id').value = item.id;
  document.getElementById('prod-name').value = item.name;
  document.getElementById('prod-category').value = item.category;
  document.getElementById('prod-price').value = item.price;
  document.getElementById('prod-desc').value = item.desc || '';
  document.getElementById('prod-stock').value = item.stock || 'READY';
  document.getElementById('prod-is-bestseller').checked = !!item.isBestSeller;
  document.getElementById('prod-image-existing-url').value = item.image || '';

  const preview = document.getElementById('prod-preview-box');
  const img = document.getElementById('prod-preview-img');
  if (item.image) {
    img.src = item.image;
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }

  STATE.tempProductImageBase64 = null;
  STATE.tempProductImageFilename = '';
  document.getElementById('modal-product').classList.add('open');
}

function closeProductModal() {
  document.getElementById('modal-product').classList.remove('open');
}

function handleProductImageSelected(e) {
  const file = e.target.files[0];
  if (!file) return;

  compressImageClientSide(file, 800, 0.75, function(base64) {
    STATE.tempProductImageBase64 = base64;
    STATE.tempProductImageFilename = 'menu_' + Date.now() + '_' + file.name;
    const preview = document.getElementById('prod-preview-box');
    const img = document.getElementById('prod-preview-img');
    img.src = base64;
    preview.style.display = 'block';
  });
}

async function handleProductSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-save-product');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
  showLoading();

  const menuId = document.getElementById('prod-id').value;
  const payload = {
    id: menuId,
    name: document.getElementById('prod-name').value.trim(),
    category: document.getElementById('prod-category').value,
    price: Number(document.getElementById('prod-price').value),
    desc: document.getElementById('prod-desc').value.trim(),
    stock: document.getElementById('prod-stock').value,
    isBestSeller: document.getElementById('prod-is-bestseller').checked,
    image: document.getElementById('prod-image-existing-url').value,
    imageBase64: STATE.tempProductImageBase64,
    imageFilename: STATE.tempProductImageFilename
  };

  try {
    const res = await API.saveMenuItem(payload);
    hideLoading();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Menu';
    closeProductModal();
    showToast(res.message || 'Menu berhasil disimpan!', 'success');
    refreshDashboardData();
  } catch (err) {
    hideLoading();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Menu';
    showToast('Gagal simpan: ' + err.message, 'error');
  }
}

async function handleDeleteProduct(menuId) {
  if (!confirm('Apakah Anda yakin ingin menghapus / menonaktifkan menu ini dari katalog?')) return;

  STATE.menu = STATE.menu.filter(m => m.id !== menuId);
  if (STATE.adminData.menu) {
    STATE.adminData.menu = STATE.adminData.menu.filter(m => m.id !== menuId);
  }
  renderAdminProducts();
  renderPublicMenu();
  showToast('Menu berhasil dinonaktifkan.', 'info');

  try {
    await API.deleteMenuItem(menuId);
  } catch (e) {}
}

// ============================================================================
// 10. LAPORAN KEUANGAN & AI INSIGHT & CHART.JS (OWNER ONLY)
// ============================================================================

function renderAdminReports() {
  const metrics = STATE.adminData.metrics || {};
  document.getElementById('metric-total-omset').innerText = `Rp ${Number(metrics.totalOmset || 0).toLocaleString('id-ID')}`;
  document.getElementById('metric-pesanan-selesai').innerText = metrics.totalPesananSelesai || 0;
  document.getElementById('metric-pesanan-pending').innerText = metrics.totalPesananPending || 0;
  document.getElementById('metric-reservasi-pending').innerText = metrics.totalReservasiPending || 0;

  const insightBox = document.getElementById('ai-insights-content');
  if (insightBox) {
    const insights = metrics.aiInsights || [
      '💡 Menu "Kopi Susu Krema Gula Aren" adalah kontributor pendapatan nomor 1 minggu ini.',
      '📈 Rata-rata transaksi online meningkat pada rentang jam 13.00 – 16.00 WIT.',
      '☕ Rekomendasi: Pertahankan persediaan biji kopi Arabika Papua dan susu fresh milk.'
    ];
    insightBox.innerHTML = insights.map(i => `<p style="margin-bottom:0.35rem;">${i}</p>`).join('');
  }

  const tbody = document.getElementById('table-body-bestsellers');
  if (tbody) {
    const topItems = metrics.topSellingItems || [];
    if (topItems.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:1.5rem; color:var(--text-muted);">Belum ada transaksi pesanan yang selesai.</td></tr>';
    } else {
      tbody.innerHTML = topItems.map((item, idx) => `
        <tr>
          <td><strong>#${idx + 1}</strong></td>
          <td><strong>${item.name}</strong></td>
          <td><span style="font-weight:800; color:var(--crema-gold);">${item.qty} Terjual</span></td>
        </tr>
      `).join('');
    }
  }

  renderCategoryChart();
}

function renderCategoryChart() {
  const ctx = document.getElementById('chart-category-sales');
  if (!ctx || typeof Chart === 'undefined') return;

  const metrics = STATE.adminData.metrics || {};
  const catData = metrics.categoryChartData || { Kopi: 650000, 'Non-Kopi': 340000, Makanan: 480000, Snack: 220000 };

  if (STATE.categoryChartInstance) {
    STATE.categoryChartInstance.destroy();
  }

  STATE.categoryChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(catData),
      datasets: [{
        label: 'Total Penjualan (Rp)',
        data: Object.values(catData),
        backgroundColor: ['#2B1B17', '#D4A373', '#7D562D', '#CCD5AE'],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(val) {
              return 'Rp ' + Number(val).toLocaleString('id-ID');
            }
          }
        }
      }
    }
  });
}

async function toggleStoreOnlineOffline(newStatus) {
  STATE.config.storeStatus = newStatus;
  applyStoreStatusUI();
  renderPublicMenu();
  showToast(`Status operasional toko diubah ke: ${newStatus}`, 'success');

  try {
    await API.toggleStoreStatus(newStatus);
  } catch (e) {}
}

// ============================================================================
// 11. MODAL PREVIEW & LOADING INDICATOR
// ============================================================================

function openPreviewModal(url, title) {
  const modal = document.getElementById('modal-preview');
  const img = document.getElementById('modal-preview-image');
  const iframe = document.getElementById('modal-preview-iframe');
  const dlBtn = document.getElementById('btn-preview-download');
  const titleEl = document.getElementById('modal-preview-title');

  if (!url) return;
  if (titleEl) titleEl.innerText = title || 'Pratinjau Berkas';
  if (dlBtn) dlBtn.href = url;

  if (url.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i) || url.startsWith('data:image')) {
    img.src = url;
    img.style.display = 'inline-block';
    iframe.style.display = 'none';
  } else {
    iframe.src = url;
    iframe.style.display = 'block';
    img.style.display = 'none';
  }

  modal.classList.add('open');
}

function closePreviewModal() {
  document.getElementById('modal-preview').classList.remove('open');
}

function showLoading() {
  const bar = document.getElementById('global-loading-bar');
  if (bar) {
    bar.classList.remove('done');
    bar.classList.add('active');
  }
}

function hideLoading() {
  const bar = document.getElementById('global-loading-bar');
  if (bar) {
    bar.classList.remove('active');
    bar.classList.add('done');
    setTimeout(() => bar.classList.remove('done'), 400);
  }
}

// ============================================================================
// 12. CLIENT-SIDE UTILITIES
// ============================================================================

function compressImageClientSide(file, maxWidth, quality, callback) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      callback(dataUrl);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function initDarkMode() {
  const saved = localStorage.getItem('kk_dark_mode');
  const isDark = (saved === 'true');
  document.body.classList.toggle('dark-mode', isDark);
  updateDarkModeIcon(isDark);
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('kk_dark_mode', isDark);
  updateDarkModeIcon(isDark);
}

function updateDarkModeIcon(isDark) {
  const icon = document.getElementById('dark-mode-icon');
  if (icon) {
    icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    icon.style.color = isDark ? '#D4A373' : 'inherit';
  }
}

function openInfoModal() {
  document.getElementById('modal-info').classList.add('open');
}

function closeInfoModal() {
  document.getElementById('modal-info').classList.remove('open');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-circle-exclamation';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}
