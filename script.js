/* ============================================
   PRESSMART - script.js
   ============================================ */

// ── HERO SLIDER (Moved to app.js to integrate with Database and Backend) ──
// Slider logic has been migrated to app.js to fetch dynamic data and avoid event conflicts.


// ── PRODUCT TABS ─────────────────────────────
document.querySelectorAll('.product-tabs span').forEach((tab, index) => {
  tab.addEventListener('click', () => {
    // Remove active from all tabs
    document.querySelectorAll('.product-tabs span').forEach(t => t.classList.remove('active'));
    // Add active to clicked tab
    tab.classList.add('active');
    
    // Get category based on tab text
    let category = '';
    const tabText = tab.textContent.trim();
    if (tabText === 'New Arrival') category = 'new-arrival';
    else if (tabText === 'Best Selling') category = 'best-selling';
    else if (tabText === 'Top Rated') category = 'top-rated';
    
    // Filter products
    document.querySelectorAll('.product-card').forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (cardCategory === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});


// ── NAVBAR NAV LINKS ─────────────────────────
function getNavUrl(link) {
  const text = link.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
  if (text.includes('home')) return 'index.html';
  if (text.includes('shop')) return 'shop.html';
  if (text.includes('blog')) return 'blog.html';
  if (text.includes('buy')) return 'buy.html';
  return 'index.html';
}

document.querySelectorAll('.nav-links li').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    closeMobileNav();
    const url = getNavUrl(link);
    if (url) {
      window.location.href = url;
    }
  });
});

document.querySelectorAll('.icons .fa-magnifying-glass').forEach(icon => {
  icon.addEventListener('click', event => {
    event.stopPropagation();
    if (typeof openSearchModal === 'function') openSearchModal();
  });
});

document.querySelectorAll('.icons .fa-regular.fa-user').forEach(icon => {
  icon.addEventListener('click', event => {
    event.stopPropagation();
    // if user is signed in, the icon will have 'logged-in' and app.js handles dropdown
    if (icon.classList.contains('logged-in')) return;
    if (typeof openAuthModal === 'function') openAuthModal();
  });
});

document.querySelectorAll('.navbar .icons').forEach(container => {
  container.addEventListener('click', event => {
    const userEl = event.target.closest('.fa-user');
    if (userEl) {
      event.stopPropagation();
      // avoid opening auth modal when already logged in (dropdown handles it)
      if (userEl.classList.contains('logged-in')) return;
      if (typeof openAuthModal === 'function') openAuthModal();
    }
  });
});

document.querySelectorAll('.icons .fa-heart').forEach(icon => {
  icon.addEventListener('click', event => {
    event.stopPropagation();
    window.location.href = 'wishlist.html';
  });
});

document.querySelectorAll('.cart-wrap').forEach(el => {
  el.addEventListener('click', event => {
    event.stopPropagation();
    window.location.href = 'cart.html';
  });
});

const navToggle = document.querySelector('.nav-toggle');
const navLinksElement = document.querySelector('.nav-links');

function closeMobileNav() {
  if (!navToggle || !navLinksElement) return;
  navLinksElement.classList.remove('show');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

if (navToggle && navLinksElement) {
  navToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = navLinksElement.classList.toggle('show');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinksElement.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  document.addEventListener('click', (event) => {
    if (!navLinksElement.contains(event.target) && !navToggle.contains(event.target)) {
      closeMobileNav();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 968) {
      closeMobileNav();
    }
  });
}


// ── WISHLIST TOGGLE ──────────────────────────
document.querySelectorAll('.wishlist').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const icon = btn.querySelector('i');
    if (icon.style.color === 'rgb(255, 68, 68)') {
      icon.style.color = '';
    } else {
      icon.style.color = '#ff4444';
    }
  });
});

