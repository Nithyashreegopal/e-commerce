const SESSION_KEY = 'pressmart_admin_session';
const API_BASE_URL = window.API_BASE || 'http://127.0.0.1:5000/api';
const WISHLIST_STORAGE_KEY = 'pressmart_wishlist';
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const hamburger = document.getElementById('hamburger');
const logoutBtn = document.getElementById('logoutBtn');
const logoutMobile = document.getElementById('logoutMobile');
const pageTitle = document.getElementById('pageTitle');
const pageBreadcrumb = document.getElementById('pageBreadcrumb');
const primaryActionBtn = document.getElementById('primaryActionBtn');
const openAddBannerBtn = document.getElementById('openAddBanner');
const openAddProductBtn = document.getElementById('openAddProduct');
const modalOverlay = document.getElementById('modalOverlay');
const modalBox = document.getElementById('modalBox');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalFoot = document.getElementById('modalFoot');
const modalClose = document.getElementById('modalClose');
const bannerList = document.getElementById('bannerList');
const productTableBody = document.getElementById('productTableBody');
const navItems = Array.from(document.querySelectorAll('.sb-item[data-page]'));
const pages = Array.from(document.querySelectorAll('.page'));

const BANNER_TYPE_HINTS = {
  homepage: 'Create a full-width hero banner for the homepage with a bold headline and strong call to action.',
  sale: 'Use this for seasonal or discount promotions. Add a clear offer message and link to the sale collection.',
  product: 'Feature a specific product with image, title, and a button that takes customers directly to the product page.',
  blog: 'Design a content banner for a blog post or editorial feature with title, summary, and read-more link.'
};

let productCatalogCache = [];
let activeProductTagFilter = '';
let activeProductSearch = '';

function getProductTagList(product) {
  return String(product.tags || '')
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(Boolean);
}

function renderProductRows(products) {
  productTableBody.innerHTML = '';
  products.forEach(p => {
    const row = document.createElement('tr');
    row.dataset.productId = p.id;
    row.innerHTML = `
      <td><input type="checkbox"></td>
      <td><div style="display:flex;align-items:center;gap:10px"><img src="${p.image_url}" style="width:40px;height:40px;border-radius:8px;object-fit:cover"><strong>${p.name}</strong></div></td>
      <td>${p.category}</td>
      <td>$${parseFloat(p.price).toFixed(2)}</td>
      <td>${p.stock} units</td>
      <td>${p.tags || '—'}</td>
      <td style="display:flex;gap:8px">
        <button class="panel-link edit" onclick="editProduct(this)"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
        <button class="panel-link delete" onclick="deleteProduct(this)"><i class="fa-solid fa-trash"></i> Delete</button>
      </td>
    `;
    productTableBody.appendChild(row);
  });
}

function filterProducts() {
  const search = activeProductSearch.trim().toLowerCase();
  const tag = activeProductTagFilter;
  const filtered = productCatalogCache.filter(p => {
    if (tag) {
      const tags = getProductTagList(p);
      if (!tags.includes(tag)) return false;
    }
    if (!search) return true;
    const haystack = [p.name, p.category, p.tags, p.description].join(' ').toLowerCase();
    return haystack.includes(search);
  });
  renderProductRows(filtered);
}

function initProductFilters() {
  const searchInput = document.getElementById('productSearch');
  const tagButtons = Array.from(document.querySelectorAll('.tag-tab'));

  tagButtons.forEach(button => {
    button.addEventListener('click', () => {
      tagButtons.forEach(btn => btn.classList.toggle('active', btn === button));
      activeProductTagFilter = button.dataset.tag || '';
      filterProducts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', event => {
      activeProductSearch = event.target.value || '';
      filterProducts();
    });
  }
}

function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function redirectToLogin() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'adminlogin.html';
}

function updateUserInfo() {
  const session = getSession();
  const name = session?.username ? session.username : 'Super Admin';
  const avatar = name.slice(0, 2).toUpperCase();
  document.getElementById('sbUsername').textContent = name;
  document.getElementById('sbAvatar').textContent = avatar;
}

async function loadAdminCredentials() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Unable to fetch admin info');
    const usernameInput = document.getElementById('set-username');
    if (usernameInput) usernameInput.value = data.username || '';

    const session = getSession();
    if (session && data.username) {
      session.username = data.username;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      updateUserInfo();
    }
  } catch (err) {
    console.error('Error loading admin credentials:', err);
  }
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('visible');
}

function toggleSidebar() {
  const isOpen = sidebar.classList.toggle('open');
  sidebarOverlay.classList.toggle('visible', isOpen);
}

function formatPageLabel(slug) {
  return slug
    .split('-')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function setActivePage(page) {
  const pageSection = document.getElementById(`page-${page}`);
  if (!pageSection) return;

  pages.forEach(section => section.classList.toggle('active', section === pageSection));
  navItems.forEach(item => item.classList.toggle('active', item.dataset.page === page));
  pageTitle.textContent = formatPageLabel(page);
  const navItem = document.querySelector(`.sb-item[data-page="${page}"] span`);
  pageBreadcrumb.textContent = page === 'dashboard' ? '/ Overview' : `/ ${navItem?.textContent || formatPageLabel(page)}`;

  if (page === 'settings' || page === 'orders' || page === 'banners') {
    primaryActionBtn.style.display = 'none';
  } else {
    primaryActionBtn.style.display = 'inline-flex';
    const label = page === 'products' ? 'Add Product' : page === 'promos' ? 'Create Promo' : page === 'blog' ? 'New Article' : 'Add Item';
    primaryActionBtn.innerHTML = `<i class="fa-solid fa-plus"></i> ${label}`;
  }

  if (openAddProductBtn) {
    openAddProductBtn.style.display = page === 'products' ? 'none' : 'inline-flex';
  }

  // Load data from database for specific pages
  if (page === 'products') {
    loadProducts();
  } else if (page === 'banners') {
    loadBanners();
  } else if (page === 'dashboard') {
    loadDashboardStats();
  } else if (page === 'analytics') {
    loadAnalyticsStats();
  } else if (page === 'wishlist') {
    loadAdminWishlist();
  } else if (page === 'orders') {
    loadOrders();
  }

  closeSidebar();
}

function goPage(page) {
  if (!page) page = 'dashboard';
  setActivePage(page);
}

function buildBannerForm() {
  return `
    <div class="form-grid">
      <div class="form-row">
        <label for="bannerType">Banner type</label>
        <select id="bannerType">
          <option value="homepage">Homepage hero</option>
          <option value="sale">Sale & promo</option>
          <option value="product">Product spotlight</option>
          <option value="blog">Blog feature</option>
        </select>
      </div>
      <div class="form-row">
        <label for="bannerTitle">Banner headline</label>
        <input type="text" id="bannerTitle" placeholder="Season Sale" />
      </div>
      <div class="form-row">
        <label for="bannerSubtext">Subheading / offer</label>
        <input type="text" id="bannerSubtext" placeholder="Min. 35-70% Off" />
      </div>
      <div class="form-row">
        <label for="bannerDescription">Description</label>
        <textarea id="bannerDescription" rows="4" placeholder="Write a short description for this banner."></textarea>
      </div>
      <div class="form-row">
        <label for="bannerImage">Image URL</label>
        <input type="url" id="bannerImage" placeholder="https://example.com/banner.jpg" />
      </div>
      <div class="form-row">
        <label for="bannerImageFile">Upload Local Image</label>
        <input type="file" id="bannerImageFile" accept="image/*" />
        <small>Choose a file to store in the database as a local image. URL is used when no file is selected.</small>
      </div>
      <div class="form-row">
        <label for="bannerCta">Button label</label>
        <input type="text" id="bannerCta" placeholder="Shop Now" />
      </div>
      <div class="form-row">
        <label for="bannerLink">Button link</label>
        <input type="url" id="bannerLink" placeholder="/shop.html" />
      </div>
      <div class="form-row">
        <label for="bannerStatus">Status</label>
        <select id="bannerStatus">
          <option value="Active">Active</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Draft">Draft</option>
        </select>
      </div>
      <div class="form-row banner-hint" id="bannerHint">${BANNER_TYPE_HINTS.homepage}</div>
    </div>
  `;
}

function openModal(title, bodyHtml, footerHtml = '') {
  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHtml;
  modalFoot.innerHTML = footerHtml;
  modalOverlay.classList.add('active');
  modalBox.scrollTop = 0;
}

function closeModal() {
  modalOverlay.classList.remove('active');
}

function updateBannerHint() {
  const type = document.getElementById('bannerType')?.value;
  const hint = document.getElementById('bannerHint');
  if (hint && type) {
    hint.textContent = BANNER_TYPE_HINTS[type] || '';
  }
}

function createBannerCard(data) {
  const card = document.createElement('article');
  card.className = 'banner-card';
  card.innerHTML = `
    <div class="banner-card-image"><img src="${data.image}" alt="${data.title}"></div>
    <div class="banner-card-content">
      <span class="banner-tag">${data.status}</span>
      <h3>${data.title}</h3>
      <p>${data.description}</p>
      <div class="banner-meta"><span>${data.subtext}</span><span>${data.type}</span></div>
      <div class="banner-actions"><a href="${data.link}" class="btn-primary">${data.cta}</a></div>
    </div>
  `;
  return card;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function getImageValue(urlInputId, fileInputId) {
  const fileInput = document.getElementById(fileInputId);
  if (fileInput?.files?.length) {
    try {
      return await fileToDataUrl(fileInput.files[0]);
    } catch (err) {
      console.error('Error reading image file:', err);
      return document.getElementById(urlInputId)?.value.trim();
    }
  }
  return document.getElementById(urlInputId)?.value.trim();
}

async function saveBanner() {
  const title = document.getElementById('bannerTitle')?.value.trim();
  const subtext = document.getElementById('bannerSubtext')?.value.trim();
  const description = document.getElementById('bannerDescription')?.value.trim();
  const image = await getImageValue('bannerImage', 'bannerImageFile');
  const cta = document.getElementById('bannerCta')?.value.trim();
  const link = document.getElementById('bannerLink')?.value.trim();
  const type = document.getElementById('bannerType')?.value;
  const status = document.getElementById('bannerStatus')?.value;

  if (!title || !image || !cta || !link) {
    alert('Please fill in the headline, image URL, button label, and button link.');
    return;
  }

  const bannerData = { title, subtext, description, image, cta, link, type, status };

  fetch(`${API_BASE_URL}/banners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bannerData)
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) throw new Error(data.error);
    loadBanners();
    closeModal();
    showToast('Banner added successfully');
  })
  .catch(err => {
    alert('Error: ' + err.message);
    console.error(err);
  });
}

async function loadBanners() {
  try {
    const res = await fetch(`${API_BASE_URL}/banners`);
    const banners = await res.json();
    
    bannerList.innerHTML = '';
    banners.forEach(b => {
      const card = document.createElement('article');
      card.className = 'banner-card';
      card.dataset.bannerId = b.id;
      card.innerHTML = `
        <div class="banner-card-image"><img src="${b.image_url}" alt="${b.title}"></div>
        <div class="banner-card-content">
          <span class="banner-tag">${b.status}</span>
          <h3>${b.title}</h3>
          <p>${b.description || ''}</p>
          <div class="banner-meta"><span>${b.subtext || ''}</span><span>${b.type}</span></div>
          <div class="banner-actions" style="display:flex;gap:8px">
            <a href="${b.cta_link}" class="btn-primary">${b.cta_label}</a>
            <button class="panel-link edit-banner-btn" style="padding:10px 16px"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
            <button class="panel-link delete-banner-btn" style="color:#dc2626;padding:10px 16px"><i class="fa-solid fa-trash"></i> Delete</button>
          </div>
        </div>
      `;

      card.querySelector('.edit-banner-btn').addEventListener('click', () => {
        editBanner(b);
      });

      card.querySelector('.delete-banner-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this banner?')) {
          fetch(`${API_BASE_URL}/banners/${b.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
          })
          .then(res => {
            if (!res.ok) throw new Error('Failed to delete banner');
            return res.json();
          })
          .then(data => {
            card.remove();
            showToast('Banner deleted successfully');
          })
          .catch(err => {
            alert('Error: ' + err.message);
            console.error(err);
          });
        }
      });

      bannerList.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading banners:', err);
  }
}

function editBanner(banner) {
  openModal(
    'Edit Banner',
    buildBannerForm(),
    `<button class="btn-primary" id="updateBannerBtn"><i class="fa-solid fa-save"></i> Update Banner</button>`
  );

  document.getElementById('bannerType').value = banner.type || 'homepage';
  document.getElementById('bannerTitle').value = banner.title || '';
  document.getElementById('bannerSubtext').value = banner.subtext || '';
  document.getElementById('bannerDescription').value = banner.description || '';
  document.getElementById('bannerImage').value = banner.image_url || '';
  document.getElementById('bannerImageFile').value = '';
  document.getElementById('bannerCta').value = banner.cta_label || '';
  document.getElementById('bannerLink').value = banner.cta_link || '';
  document.getElementById('bannerStatus').value = banner.status || 'Active';

  document.getElementById('bannerType')?.addEventListener('change', updateBannerHint);
  updateBannerHint();

  const updateBtn = document.getElementById('updateBannerBtn');
  if (!updateBtn) return;

  const handleUpdate = async () => {
    const title = document.getElementById('bannerTitle')?.value.trim();
    const subtext = document.getElementById('bannerSubtext')?.value.trim();
    const description = document.getElementById('bannerDescription')?.value.trim();
    const image = await getImageValue('bannerImage', 'bannerImageFile');
    const cta = document.getElementById('bannerCta')?.value.trim();
    const link = document.getElementById('bannerLink')?.value.trim();
    const type = document.getElementById('bannerType')?.value;
    const status = document.getElementById('bannerStatus')?.value;

    if (!title || !image || !cta || !link) {
      alert('Please fill in the headline, image URL, button label, and button link.');
      return;
    }

    const payload = { title, subtext, description, image, cta, link, type, status };

    try {
      const res = await fetch(`${API_BASE_URL}/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update banner');

      loadBanners();
      closeModal();
      showToast('Banner updated successfully');
    } catch (err) {
      alert('Error updating banner: ' + err.message);
      console.error(err);
    }
  };

  updateBtn.addEventListener('click', handleUpdate);
}


async function loadOrders() {
  const tableBody = document.getElementById('ordersTableBody');
  if (!tableBody) return;
  
  if (!productCatalogCache.length) {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      const products = await res.json();
      productCatalogCache = Array.isArray(products) ? products : [];
    } catch (err) {
      console.error('Error loading product catalog for orders:', err);
    }
  }
  
  try {
    const res = await fetch(`${API_BASE_URL}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const orders = await res.json();
    
    const searchInput = document.getElementById('orderSearch')?.value.trim().toLowerCase() || '';
    const statusFilter = document.getElementById('orderStatusFilter')?.value || '';
    
    let filtered = Array.isArray(orders) ? orders : [];
    
    if (searchInput) {
      filtered = filtered.filter(o => 
        String(o.id).toLowerCase().includes(searchInput) ||
        String(o.customer_name).toLowerCase().includes(searchInput) ||
        String(o.customer_email).toLowerCase().includes(searchInput)
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(o => o.status === statusFilter);
    }
    
    tableBody.innerHTML = '';
    if (!filtered.length) {
      tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:20px;color:#6b7280">No orders found.</td></tr>';
      return;
    }
    
    const STATIC_PRODUCT_NAMES = {
      'p1': 'Tan Solid Laptop Backpack',
      'p2': 'Brown Solid Biker Jacket',
      'p3': 'Exclusive Leather Handbag',
      'p4': 'Premium Running Shoes',
      'p5': 'Classic Travel Backpack',
      'p6': 'Minimalist Leather Belt',
      'p7': 'Vintage Polarized Sunglasses',
      'p8': 'Signature Cotton Hoodie',
      'p9': 'Waterproof Sports Watch',
      'p10': 'Wool Blend Scarf',
      'p11': 'Denim Trucker Jacket',
      'p12': 'Genuine Leather Wallet',
      'p13': 'Sleek Metal Key Holder',
      'p14': 'Wireless Noise-Canceling Earbuds',
      'p15': 'Cozy Knitted Beanie',
      'p16': 'Canvas Weekender Duffle Bag',
      'p17': 'Complete Grooming Kit'
    };
    
    filtered.forEach(order => {
      const itemsList = Array.isArray(order.items)
        ? order.items.map(item => {
            const prod = productCatalogCache.find(p => String(p.id) === String(item.id));
            const name = prod ? (prod.name || prod.title) : (STATIC_PRODUCT_NAMES[item.id] || 'Product ' + item.id);
            return `${name} (x${item.qty})`;
          }).join(', ')
        : '—';
        
      const dateStr = order.created_at ? new Date(order.created_at).toLocaleDateString() : '—';
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>#${order.id}</strong></td>
        <td>
          <div><strong>${order.customer_name || 'Guest'}</strong></div>
          <div style="font-size: 11.5px; color: #6b7280">${order.customer_email || ''}</div>
        </td>
        <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${itemsList}">${itemsList}</td>
        <td>${formatCurrency(order.total)}</td>
        <td><span class="badge" style="background:#e1f5fe;color:#0288d1;padding:4px 8px;border-radius:4px;font-size:12px">${order.payment_status || 'Paid'}</span></td>
        <td>
          <span class="badge status-${String(order.status).toLowerCase()}" style="padding:4px 8px;border-radius:4px;font-size:12px;font-weight:600">
            ${order.status}
          </span>
        </td>
        <td>${dateStr}</td>
        <td>
          <select class="order-status-select" data-order-id="${order.id}" style="padding:4px 8px;border-radius:4px;border:1px solid #ccc;font-size:12px;cursor:pointer">
            <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
      `;
      
      const badge = row.querySelector(`.badge.status-${String(order.status).toLowerCase()}`);
      if (badge) {
        if (order.status === 'Confirmed') {
          badge.style.background = '#eef2ff'; badge.style.color = '#4f46e5';
        } else if (order.status === 'Shipped') {
          badge.style.background = '#fef3c7'; badge.style.color = '#d97706';
        } else if (order.status === 'Delivered') {
          badge.style.background = '#d1fae5'; badge.style.color = '#059669';
        } else if (order.status === 'Cancelled') {
          badge.style.background = '#fee2e2'; badge.style.color = '#dc2626';
        }
      }
      
      row.querySelector('.order-status-select').addEventListener('change', async (e) => {
        const newStatus = e.target.value;
        try {
          const updateRes = await fetch(`${API_BASE_URL}/orders/${order.id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
          });
          if (!updateRes.ok) throw new Error('Failed to update status');
          showToast(`Order #${order.id} status updated to ${newStatus}`);
          loadOrders();
          loadDashboardStats();
        } catch (err) {
          alert('Error updating status: ' + err.message);
          console.error(err);
        }
      });
      
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error('Error loading orders:', err);
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
}

function renderDashboardCards(stats) {
  const dashStats = document.getElementById('dashStats');
  if (!dashStats) return;
  dashStats.innerHTML = `
    <div class="stat-card">
      <span>Total Products</span>
      <strong>${stats.totalProducts}</strong>
    </div>
    <div class="stat-card">
      <span>Total Orders</span>
      <strong>${stats.totalOrders}</strong>
    </div>
    <div class="stat-card">
      <span>Revenue</span>
      <strong>${formatCurrency(stats.revenue)}</strong>
    </div>
    <div class="stat-card">
      <span>Avg. Order Value</span>
      <strong>${formatCurrency(stats.averageOrderValue)}</strong>
    </div>
  `;
}

function renderDashboardWidgets(orders, products) {
  const orderFeed = document.getElementById('dashOrders');
  const topProducts = document.getElementById('dashTopProducts');
  const activityFeed = document.getElementById('dashActivity');

  if (orderFeed) {
    orderFeed.innerHTML = orders.slice(0, 3).map(order => `
      <div class="order-summary">
        <div><strong>Order #${order.id}</strong></div>
        <div>${order.customer_name || order.customer || 'Guest'}</div>
        <div>${order.status || 'Pending'}</div>
      </div>
    `).join('') || '<p class="empty-state">No recent orders available.</p>';
  }

  if (topProducts) {
    topProducts.innerHTML = products.slice(0, 3).map(product => `
      <div class="top-product-item">
        <strong>${product.name || product.title}</strong>
        <span>${product.category || 'Uncategorized'}</span>
      </div>
    `).join('') || '<p class="empty-state">No products available.</p>';
  }

  if (activityFeed) {
    activityFeed.innerHTML = orders.slice(0, 4).map(order => `
      <div class="activity-item">
        <span>${order.status || 'Updated'}</span>
        <p>Order #${order.id} - ${formatCurrency(Number(order.total_amount || order.total || 0))}</p>
      </div>
    `).join('') || '<p class="empty-state">No recent activity yet.</p>';
  }
}

async function loadDashboardStats() {
  try {
    const [ordersRes, productsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/orders`),
      fetch(`${API_BASE_URL}/products`)
    ]);

    if (!ordersRes.ok || !productsRes.ok) return;

    const [orders, products] = await Promise.all([ordersRes.json(), productsRes.json()]);
    const totalOrders = Array.isArray(orders) ? orders.length : 0;
    const totalProducts = Array.isArray(products) ? products.length : 0;
    const revenue = Array.isArray(orders)
      ? orders.reduce((sum, order) => sum + Number(order.total_amount || order.total || 0), 0)
      : 0;
    const averageOrderValue = totalOrders ? revenue / totalOrders : 0;

    renderDashboardCards({ totalProducts, totalOrders, revenue, averageOrderValue });
    renderDashboardWidgets(orders, products);
    document.getElementById('orderBadge').textContent = String(totalOrders);
  } catch (err) {
    console.error('Error loading dashboard stats:', err);
  }
}

async function loadAnalyticsStats() {
  try {
    const [ordersRes, productsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/orders`),
      fetch(`${API_BASE_URL}/products`)
    ]);

    if (!ordersRes.ok || !productsRes.ok) return;

    const [orders, products] = await Promise.all([ordersRes.json(), productsRes.json()]);
    const statusCounts = {};
    const revenueByCategory = {};

    (Array.isArray(orders) ? orders : []).forEach(order => {
      const status = order.status || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    (Array.isArray(products) ? products : []).forEach(product => {
      const category = product.category || 'Uncategorized';
      revenueByCategory[category] = (revenueByCategory[category] || 0) + Number(product.price || 0);
    });

    const statsContainer = document.getElementById('analyticsStats');
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="stat-card">
          <span>Orders</span>
          <strong>${Array.isArray(orders) ? orders.length : 0}</strong>
        </div>
        <div class="stat-card">
          <span>Products</span>
          <strong>${Array.isArray(products) ? products.length : 0}</strong>
        </div>
        <div class="stat-card">
          <span>Revenue by Category</span>
          <strong>${Object.keys(revenueByCategory).length}</strong>
        </div>
        <div class="stat-card">
          <span>Order Status Types</span>
          <strong>${Object.keys(statusCounts).length}</strong>
        </div>
      `;
    }

    const revenueChart = document.getElementById('revenueChart');
    if (revenueChart) {
      revenueChart.innerHTML = Object.entries(revenueByCategory).map(([category, amount]) => `
        <div class="chart-row">
          <span>${category}</span>
          <strong>${formatCurrency(amount)}</strong>
        </div>
      `).join('') || '<p class="empty-state">No revenue data available.</p>';
    }

    const statusChart = document.getElementById('statusChart');
    if (statusChart) {
      statusChart.innerHTML = Object.entries(statusCounts).map(([status, count]) => `
        <div class="chart-row">
          <span>${status}</span>
          <strong>${count}</strong>
        </div>
      `).join('') || '<p class="empty-state">No status data available.</p>';
    }
  } catch (err) {
    console.error('Error loading analytics stats:', err);
  }
}

function deleteBanner(btn) {
  const card = btn.closest('.banner-card');
  const bannerId = card.dataset.bannerId;
  
  if (confirm('Are you sure you want to delete this banner?')) {
    fetch(`${API_BASE_URL}/banners/${bannerId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
      card.remove();
      showToast('Banner deleted successfully');
    })
    .catch(err => alert('Error: ' + err));
  }
}

function buildProductForm() {
  return `
    <div class="form-grid">
      <div class="form-row">
        <label for="productName">Product name</label>
        <input type="text" id="productName" placeholder="Premium Wireless Headphones" />
      </div>
      <div class="form-row">
        <label for="productCategory">Category</label>
        <select id="productCategory">
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home & Living</option>
          <option value="Books">Books</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="form-row">
        <label for="productPrice">Price</label>
        <input type="number" id="productPrice" placeholder="99.99" step="0.01" min="0" />
      </div>
      <div class="form-row">
        <label for="productStock">Stock quantity</label>
        <input type="number" id="productStock" placeholder="50" min="0" />
      </div>
      <div class="form-row">
        <label for="productTags">Tags</label>
        <select id="productTags" multiple>
          <option value="new-arrival">New Arrival</option>
          <option value="best-selling">Best Selling</option>
          <option value="top-rated">Top Rated</option>
        </select>
      </div>
      <div class="form-row">
        <label for="productImage">Image URL</label>
        <input type="url" id="productImage" placeholder="https://example.com/product.jpg" />
      </div>
      <div class="form-row">
        <label for="productImageFile">Upload Local Image</label>
        <input type="file" id="productImageFile" accept="image/*" />
        <small>Choose a file to store locally in the database as a data URL. URL is used if no file is selected.</small>
      </div>
      <div class="form-row">
        <label for="productDescription">Description</label>
        <textarea id="productDescription" rows="4" placeholder="Write product details and features..."></textarea>
      </div>
      <div class="form-row">
        <label for="productStatus">Status</label>
        <select id="productStatus">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Draft">Draft</option>
        </select>
      </div>
    </div>
  `;
}

function deleteProduct(btn) {
  const row = btn.closest('tr');
  const productId = row.dataset.productId;
  
  if (confirm('Are you sure you want to delete this product?')) {
    fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
      row.remove();
      showToast('Product deleted successfully');
    })
    .catch(err => {
      alert('Error deleting product: ' + err);
      console.error(err);
    });
  }
}

function editProduct(btn) {
  const row = btn.closest('tr');
  const productId = row.dataset.productId;
  const product = productCatalogCache.find(p => String(p.id) === String(productId));
  if (!product) return alert('Product data not available for editing.');

  // Open modal with product form and prefill values
  openModal(
    'Edit Product',
    buildProductForm(),
    `<button class="btn-primary" id="updateProductBtn"><i class="fa-solid fa-save"></i> Update Product</button>`
  );

  // Prefill form fields
  document.getElementById('productName').value = product.name || '';
  document.getElementById('productCategory').value = product.category || '';
  document.getElementById('productPrice').value = product.price ?? '';
  document.getElementById('productStock').value = product.stock ?? '';
  document.getElementById('productImage').value = product.image_url || product.image || '';
  document.getElementById('productImageFile').value = '';
  document.getElementById('productDescription').value = product.description || '';
  document.getElementById('productStatus').value = product.status || 'Active';

  // Tags (multi-select)
  const tagsSelect = document.getElementById('productTags');
  if (tagsSelect) {
    const tags = String(product.tags || '').split(',').map(t => t.trim()).filter(Boolean);
    Array.from(tagsSelect.options).forEach(opt => {
      opt.selected = tags.includes(opt.value);
    });
  }

  // Attach update handler
  const updateBtn = document.getElementById('updateProductBtn');
  if (!updateBtn) return;

  const handleUpdate = async () => {
    const name = document.getElementById('productName')?.value.trim();
    const category = document.getElementById('productCategory')?.value;
    const price = document.getElementById('productPrice')?.value.trim();
    const stock = document.getElementById('productStock')?.value.trim();
    const tags = Array.from(document.getElementById('productTags')?.selectedOptions || []).map(o => o.value).join(', ');
    const image = await getImageValue('productImage', 'productImageFile');
    const status = document.getElementById('productStatus')?.value;
    const description = document.getElementById('productDescription')?.value.trim();

    if (!name || !price || !stock || !image) {
      alert('Please fill in the product name, price, stock, and image URL.');
      return;
    }

    const payload = { name, category, price: parseFloat(price), stock: parseInt(stock), tags, image, status, description };

    try {
      const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update product');

      // Update local cache and UI
      const idx = productCatalogCache.findIndex(p => String(p.id) === String(productId));
      if (idx >= 0) {
        productCatalogCache[idx] = Object.assign({}, productCatalogCache[idx], {
          name, category, price: parseFloat(price), stock: parseInt(stock), tags, image_url: image, description, status
        });
      }
      filterProducts();
      closeModal();
      showToast('Product updated successfully');
    } catch (err) {
      alert('Error updating product: ' + err.message);
      console.error(err);
    }
  };

  updateBtn.addEventListener('click', handleUpdate);
}

async function saveProduct() {
  const name = document.getElementById('productName')?.value.trim();
  const category = document.getElementById('productCategory')?.value;
  const price = document.getElementById('productPrice')?.value.trim();
  const stock = document.getElementById('productStock')?.value.trim();
  const tags = Array.from(document.getElementById('productTags')?.selectedOptions || []).map(o => o.value).join(', ');
  const image = await getImageValue('productImage', 'productImageFile');
  const status = document.getElementById('productStatus')?.value;

  if (!name || !price || !stock || !image) {
    alert('Please fill in the product name, price, stock, and image URL.');
    return;
  }

  const productData = {
    name, category, price: parseFloat(price), stock: parseInt(stock), tags, image, status,
    description: document.getElementById('productDescription')?.value.trim()
  };

  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save product');

    const row = document.createElement('tr');
    row.dataset.productId = data.id;
    row.innerHTML = `
      <td><input type="checkbox"></td>
      <td><div style="display:flex;align-items:center;gap:10px"><img src="${image}" style="width:40px;height:40px;border-radius:8px;object-fit:cover"><strong>${name}</strong></div></td>
      <td>${category}</td>
      <td>$${parseFloat(price).toFixed(2)}</td>
      <td>${stock} units</td>
      <td>${tags || '—'}</td>
      <td style="display:flex;gap:8px">
        <button class="panel-link edit" onclick="editProduct(this)"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
        <button class="panel-link delete" onclick="deleteProduct(this)"><i class="fa-solid fa-trash"></i> Delete</button>
      </td>
    `;
    productTableBody.prepend(row);
    closeModal();
    showToast('Product added successfully');
  } catch (err) {
    alert('Error: ' + err.message);
    console.error(err);
  }
}

async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    const products = await res.json();
    productCatalogCache = Array.isArray(products) ? products : [];
    filterProducts();
  } catch (err) {
    console.error('Error loading products:', err);
    productCatalogCache = [];
    renderProductRows([]);
  }
}

function getWebsiteWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function renderAdminWishlist() {
  const container = document.getElementById('wishlistAdmin');
  if (!container) return;

  const wishlistIds = getWebsiteWishlist().map(id => String(id));
  const wishlistProducts = productCatalogCache.filter(product => wishlistIds.includes(String(product.id)));

  if (!wishlistIds.length || !wishlistProducts.length) {
    container.innerHTML = `<div class="empty-state"><p>No wishlist items found from website users.</p><p>Make sure users have saved items in the shop wishlist first.</p></div>`;
    return;
  }

  container.innerHTML = wishlistProducts.map(product => {
    const title = product.name || product.title || 'Unnamed product';
    const image = product.image_url || product.images?.[0] || product.image || '';
    const price = product.price != null ? `$${parseFloat(product.price).toFixed(2)}` : '—';
    const category = product.category || 'Uncategorized';

    return `
      <article class="panel-card wishlist-card">
        <div class="card-content">
          <img src="${image}" alt="${title}" />
          <div>
            <h4>${title}</h4>
            <p>${category}</p>
            <strong>${price}</strong>
          </div>
        </div>
        <button class="btn-outline remove-wishlist-item" data-id="${product.id}">Remove</button>
      </article>
    `;
  }).join('');

  container.querySelectorAll('.remove-wishlist-item').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      const wishlist = getWebsiteWishlist().map(id => String(id));
      const updated = wishlist.filter(id => id !== String(productId));
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
      renderAdminWishlist();
      showToast('Wishlist item removed from user wishlist');
    });
  });
}

async function loadAdminWishlist() {
  if (!productCatalogCache.length) {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      const products = await res.json();
      productCatalogCache = Array.isArray(products) ? products : [];
    } catch (err) {
      console.error('Error loading product catalog for wishlist:', err);
    }
  }
  renderAdminWishlist();
}

function initNavigation() {
  navItems.forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();
      const page = item.dataset.page;
      goPage(page);
    });
  });

  hamburger.addEventListener('click', toggleSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);
  logoutBtn.addEventListener('click', redirectToLogin);
  logoutMobile.addEventListener('click', redirectToLogin);
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', event => {
    if (event.target === modalOverlay) closeModal();
  });

  initProductFilters();

  document.getElementById('orderSearch')?.addEventListener('input', loadOrders);
  document.getElementById('orderStatusFilter')?.addEventListener('change', loadOrders);

  primaryActionBtn?.addEventListener('click', () => {
    const pageTitle = document.getElementById('pageTitle')?.textContent;
    if (pageTitle === 'Products') {
      openModal(
        'Add Product',
        buildProductForm(),
        `<button class="btn-primary" id="saveProductBtn"><i class="fa-solid fa-save"></i> Save Product</button>`
      );
      document.getElementById('saveProductBtn')?.addEventListener('click', saveProduct);
    }
  });

  openAddProductBtn?.addEventListener('click', () => {
    openModal(
      'Add Product',
      buildProductForm(),
      `<button class="btn-primary" id="saveProductBtn"><i class="fa-solid fa-save"></i> Save Product</button>`
    );
    document.getElementById('saveProductBtn')?.addEventListener('click', saveProduct);
  });

  openAddBannerBtn?.addEventListener('click', () => {
    openModal(
      'Add Banner',
      buildBannerForm(),
      `<button class="btn-primary" id="saveBannerBtn"><i class="fa-solid fa-save"></i> Save Banner</button>`
    );
    document.getElementById('bannerType')?.addEventListener('change', updateBannerHint);
    document.getElementById('saveBannerBtn')?.addEventListener('click', saveBanner);
  });
}

function initSession() {
  const session = getSession();
  if (!session) {
    window.location.href = 'adminlogin.html';
    return;
  }
  updateUserInfo();
  loadAdminCredentials();
  initNavigation();
  goPage('dashboard');
}

initSession();

// ----------------- SETTINGS: Change Admin Password -----------------
document.getElementById('changePassBtn')?.addEventListener('click', async () => {
  const username = document.getElementById('set-username')?.value.trim() || '';
  const oldPass = document.getElementById('set-oldPass')?.value || '';
  const newPass = document.getElementById('set-newPass')?.value || '';
  const confirmPass = document.getElementById('set-confirmPass')?.value || '';
  const msgEl = document.getElementById('pwChangeMsg');
  msgEl.textContent = '';
  msgEl.style.color = '#1f2937';

  if (!oldPass || !newPass) {
    msgEl.textContent = 'Please provide current and new password.';
    return;
  }
  if (newPass !== confirmPass) {
    msgEl.textContent = 'New password and confirmation do not match.';
    return;
  }

  try {
    const payload = { current_password: oldPass, new_password: newPass };
    if (username) payload.username = username;

    const res = await fetch(`${API_BASE_URL}/admin`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update credentials');

    const session = getSession();
    if (session && username) {
      session.username = username;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      updateUserInfo();
    }

    msgEl.style.color = 'green';
    msgEl.textContent = 'Admin credentials updated successfully.';
    document.getElementById('set-oldPass').value = '';
    document.getElementById('set-newPass').value = '';
    document.getElementById('set-confirmPass').value = '';
    showToast('Admin credentials updated');
  } catch (err) {
    msgEl.style.color = '#b91c1c';
    msgEl.textContent = err.message || 'Error updating credentials';
    console.error(err);
  }
});
