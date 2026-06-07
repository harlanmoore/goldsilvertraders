// ── CONFIGURATION ──
// Sign up free at https://gold-api.com to get your API key (takes 60 seconds)
const GOLD_API_KEY = 'YOUR_GOLD_API_KEY';

// ── PAGES ──
const pages = {
  home:    'index.html',
  buy:     'what-we-buy.html',
  process: 'how-it-works.html',
  faq:     'faq.html',
  about:   'about.html',
  contact: 'contact.html'
};

// ── RENDER NAV ──
function renderNav(activePage) {
  document.getElementById('site-nav').innerHTML = `
    <a href="${pages.home}" class="nav-logo">Gold <span>&</span> Silver Traders</a>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links" id="navLinks">
      <li><a href="${pages.home}" ${activePage==='home'?'class="active"':''}>Home</a></li>
      <li>
        <a href="#" ${activePage==='buy'||activePage==='process'?'class="active"':''}>
          Services <span class="chevron">▾</span>
        </a>
        <div class="dropdown">
          <a href="${pages.buy}">What We Buy</a>
          <a href="${pages.process}">How It Works</a>
          <a href="${pages.about}">About</a>
        </div>
      </li>
      <li><a href="${pages.faq}" ${activePage==='faq'?'class="active"':''}>FAQ</a></li>
      <li><a href="${pages.contact}" ${activePage==='contact'?'class="active"':''} class="nav-cta">Get an Offer</a></li>
    </ul>
  `;
  document.getElementById('navToggle')?.addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });
}

// ── RENDER FOOTER ──
function renderFooter() {
  document.getElementById('site-footer').innerHTML = `
    <p>&copy; ${new Date().getFullYear()} Gold &amp; Silver Traders. All rights reserved.</p>
    <p>All transactions subject to applicable federal, state, and international regulations.</p>
    <p><a href="mailto:harlan@goldsilvertraders.com">harlan@goldsilvertraders.com</a></p>
  `;
}

// ── LIVE METALS TICKER ──
async function renderTicker() {
  const el = document.getElementById('metals-ticker');
  if (!el) return;

  // Metals to display: symbol, label
  const metals = [
    { symbol: 'XAU', label: 'Gold / oz' },
    { symbol: 'XAG', label: 'Silver / oz' },
    { symbol: 'XPT', label: 'Platinum / oz' },
    { symbol: 'XPD', label: 'Palladium / oz' },
  ];

  // Show loading state
  el.innerHTML = metals.map(m => `
    <div class="ticker-item">
      <span class="ticker-metal">${m.label}</span>
      <span class="ticker-price" style="color:var(--muted)">—</span>
    </div>
  `).join('');

  // If no API key, show placeholder message
  if (GOLD_API_KEY === 'YOUR_GOLD_API_KEY') {
    el.innerHTML = `
      <div class="ticker-item">
        <span class="ticker-metal" style="color:var(--muted)">Add your GoldAPI.io key to shared.js to show live prices</span>
      </div>`;
    return;
  }

  // Fetch each metal
  const results = await Promise.allSettled(
    metals.map(m =>
      fetch(`https://www.goldapi.io/api/${m.symbol}/USD`, {
        headers: { 'x-access-token': GOLD_API_KEY, 'Content-Type': 'application/json' }
      }).then(r => r.json()).then(d => ({ ...d, label: m.label }))
    )
  );

  el.innerHTML = results.map(r => {
    if (r.status !== 'fulfilled' || !r.value?.price) {
      return `<div class="ticker-item"><span class="ticker-metal" style="color:var(--muted)">Unavailable</span></div>`;
    }
    const d = r.value;
    const price = d.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
    const chp   = d.chp ?? 0;
    const dir   = chp >= 0 ? 'up' : 'down';
    const arrow = chp >= 0 ? '▲' : '▼';
    return `
      <div class="ticker-item">
        <span class="ticker-metal">${d.label}</span>
        <span class="ticker-price">${price}</span>
        <span class="ticker-change ${dir}">${arrow} ${Math.abs(chp).toFixed(2)}%</span>
      </div>`;
  }).join('');
}

// ── FAQ ACCORDION ──
function initFaq() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}
