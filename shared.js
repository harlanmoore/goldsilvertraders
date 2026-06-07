// Shared navigation and footer for all pages
// Each page calls renderNav(activePage) and renderFooter()

function renderNav(activePage) {
  const pages = {
    home: 'index.html',
    buy: 'what-we-buy.html',
    process: 'how-it-works.html',
    faq: 'faq.html',
    contact: 'contact.html'
  };

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
        </div>
      </li>
      <li><a href="${pages.faq}" ${activePage==='faq'?'class="active"':''}>FAQ</a></li>
      <li><a href="${pages.contact}" ${activePage==='contact'?'class="active"':''} class="nav-cta ${activePage==='contact'?'active':''}">Get an Offer</a></li>
    </ul>
  `;

  document.getElementById('navToggle')?.addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });
}

function renderFooter() {
  document.getElementById('site-footer').innerHTML = `
    <p>&copy; ${new Date().getFullYear()} Gold &amp; Silver Traders. All rights reserved.</p>
    <p>All transactions subject to applicable federal, state, and international regulations.</p>
    <p><a href="mailto:harlan@goldsilvertraders.com">harlan@goldsilvertraders.com</a></p>
  `;
}

// FAQ accordion (shared)
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
