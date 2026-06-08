// ── CONFIGURATION ──
// No API key needed — uses freegoldapi.com (completely free, no signup)

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
    <p>
      <a href="mailto:harlan@goldsilvertraders.com">harlan@goldsilvertraders.com</a>
      &nbsp;&nbsp;·&nbsp;&nbsp;
      <a href="https://wa.me/14252691221" target="_blank" rel="noopener">WhatsApp: +1 (425) 269-1221</a>
    </p>
  `;
}

// ── LIVE METALS TICKER ──
async function renderTicker() {
  const el = document.getElementById('metals-ticker');
  if (!el) return;

  try {
    const res  = await fetch('https://freegoldapi.com/data/latest.json');
    const data = await res.json();

    // Get today and yesterday prices for % change
    const sorted  = data.filter(d => d.price > 0).sort((a,b) => a.date.localeCompare(b.date));
    const latest  = sorted[sorted.length - 1];
    const prev    = sorted[sorted.length - 2];

    const price   = latest.price;
    const change  = prev ? ((price - prev.price) / prev.price * 100) : 0;
    const dir     = change >= 0 ? 'up' : 'down';
    const arrow   = change >= 0 ? '▲' : '▼';

    const fmt = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

    // Gold/Silver ratio dataset for silver estimate
    let silverHTML = '';
    try {
      const ratioRes  = await fetch('https://freegoldapi.com/data/gold_silver_ratio_enriched.csv');
      const ratioText = await ratioRes.text();
      const lines     = ratioText.trim().split('
').filter(l => l.trim());
      const lastLine  = lines[lines.length - 1];
      const parts     = lastLine.split(',');
      const ratio     = parseFloat(parts[1]);
      if (ratio > 0) {
        const silverPrice = price / ratio;
        silverHTML = `
          <div class="ticker-item">
            <span class="ticker-metal">Silver / oz</span>
            <span class="ticker-price">${fmt(silverPrice)}</span>
          </div>`;
      }
    } catch(e) {}

    el.innerHTML = `
      <div class="ticker-item">
        <span class="ticker-metal">Gold / oz</span>
        <span class="ticker-price">${fmt(price)}</span>
        <span class="ticker-change ${dir}">${arrow} ${Math.abs(change).toFixed(2)}%</span>
      </div>
      ${silverHTML}
      <div class="ticker-item" style="margin-left:0.5rem;">
        <span class="ticker-metal" style="font-size:0.58rem; color:var(--muted)">LBMA ref · updated daily</span>
      </div>`;

  } catch(e) {
    el.innerHTML = `<div class="ticker-item"><span class="ticker-metal" style="color:var(--muted)">Price data temporarily unavailable</span></div>`;
  }
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
