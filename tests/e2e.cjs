const { chromium, devices } = require('playwright');
const OUT = process.env.E2E_OUT || require('path').join(__dirname, '..', 'e2e-screenshots');
require('fs').mkdirSync(OUT, { recursive: true });
const BASE = (process.env.E2E_URL || 'http://localhost:4173') + '/#';
const results = [];
const check = (name, cond, extra = '') => { results.push(`${cond ? 'PASS' : 'FAIL'} ${name} ${extra}`); };
const euro = (s) => Math.round(parseFloat(s.replace(/[^\d,]/g, '').replace(',', '.')) * 100);

(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined;
  const browser = await chromium.launch({ proxy });
  const ctx = await browser.newContext({ ...devices['iPhone 13'], ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));

  // Home
  await page.goto(BASE + '/');
  await page.waitForSelector('.hero-title');
  await page.waitForTimeout(2500);
  const loadedImgs = await page.$$eval('img.loaded', (x) => x.length);
  check('home renders, images load', loadedImgs > 0, `(${loadedImgs} loaded)`);
  await page.screenshot({ path: `${OUT}/m_home.png`, fullPage: true });

  // Mobile menu -> collection
  await page.click('button[aria-label="Open menu"]');
  await page.waitForTimeout(400);
  await page.click('.menu-drawer >> text=2026 Collection');
  await page.waitForSelector('.grid .card');
  const count = await page.$$eval('.grid .card', (x) => x.length);
  check('collection shows all 33 products', count === 33, `(${count})`);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/m_collection.png` });

  // Filter + sort
  await page.click('.toolbar-btn');
  await page.waitForTimeout(400);
  await page.check('text=In stock only');
  const afterStock = await page.$$eval('.grid .card', (x) => x.length);
  check('in-stock filter removes sold-out product', afterStock === 32, `(${afterStock})`);
  await page.check('.filter-drawer label:has-text("Green") input');
  const green = await page.$$eval('.grid .card', (x) => x.length);
  check('colour filter narrows list', green > 0 && green < afterStock, `(${green})`);
  await page.screenshot({ path: `${OUT}/m_filter.png` });
  await page.click('.filter-drawer >> text=Clear');
  await page.click('.filter-drawer button:has-text("Show")');
  await page.selectOption('.sort select', 'price-asc');
  const prices = await page.$$eval('.grid .card .price-now', (x) => x.map((e) => e.textContent));
  const pc = prices.map(euro);
  check('sort price ascending', pc.every((v, i) => i === 0 || pc[i - 1] <= v), `(${prices.slice(0, 3).join(', ')})`);
  check('sort persisted in URL', page.url().includes('sort=price-asc'));

  // Search overlay
  await page.click('button[aria-label="Search"]');
  await page.fill('.search-form input', 'oak');
  await page.waitForTimeout(300);
  const live = await page.$$eval('.search-results li', (x) => x.length);
  check('live search returns results', live > 0, `(${live})`);
  await page.press('.search-form input', 'Enter');
  await page.waitForSelector('.grid .card');
  check('search page shows results', page.url().includes('/search?q=oak'));
  await page.click('button[aria-label="Search"]');
  await page.fill('.search-form input', 'qwertz');
  await page.waitForTimeout(200);
  check('search empty state', (await page.textContent('.search-results')).includes('No results'));
  await page.click('button[aria-label="Close search"]');

  // Product page: buy 1 get 1 with two different colours
  await page.goto(BASE + '/products/poedagar-8051');
  await page.waitForSelector('.product-title');
  await page.waitForTimeout(1500);
  const unit = euro(await page.textContent('.product-price .price-now'));
  const offerPrice = euro(await page.textContent('.offer.active .offer-price strong'));
  check('B1G1 offer price equals one unit', offerPrice === unit, `(${unit})`);
  const rows = await page.$$('.offer.active .variant-row');
  const sw = await rows[1].$$('.swatch:not([disabled])');
  await sw[1].click();
  await page.screenshot({ path: `${OUT}/m_product.png`, fullPage: true });
  await page.click('.product-info > .btn');
  await page.waitForSelector('.cart-drawer.open .cart-line');
  const lines = await page.$$eval('.cart-drawer .cart-line', (x) => x.length);
  const cnt = await page.textContent('.cart-count');
  check('add bundle -> 2 lines, 2 items', lines === 2 && cnt === '2', `(lines ${lines}, count ${cnt})`);
  const disc = await page.textContent('.cart-drawer .discount dd');
  check('BOGO discount applied in cart', euro(disc) === unit, `(${disc})`);
  await page.screenshot({ path: `${OUT}/m_cartdrawer.png` });

  // Quantity + remove
  await page.click('.cart-drawer .cart-line >> nth=0 >> button[aria-label="Increase quantity"]');
  check('quantity increase updates badge', (await page.textContent('.cart-count')) === '3');
  const total3 = euro(await page.textContent('.cart-drawer .total dd'));
  check('total for 3 units = 2 paid units', total3 === unit * 2, `(${total3})`);
  await page.click('.cart-drawer .cart-line >> nth=1 >> button[aria-label^="Remove"]');
  check('remove line', (await page.$$eval('.cart-drawer .cart-line', (x) => x.length)) === 1);
  await page.click('.cart-drawer >> text=Check out');

  // Checkout validation
  await page.waitForSelector('.checkout-form');
  await page.click('.checkout-form button.btn-lg');
  const errCount = await page.$$eval('.field-error', (x) => x.length);
  check('empty checkout shows validation errors', errCount >= 6, `(${errCount})`);
  await page.screenshot({ path: `${OUT}/m_checkout_errors.png`, fullPage: true });
  await page.fill('[name=email]', 'max@example.com');
  await page.fill('[name=firstName]', 'Max');
  await page.fill('[name=lastName]', 'Mustermann');
  await page.fill('[name=address1]', 'Hauptstraße 1');
  await page.fill('[name=zip]', '1011');
  await page.fill('[name=city]', 'Berlin');
  await page.check('[name=terms]');
  await page.click('.checkout-form button.btn-lg');
  check('invalid postal code rejected', (await page.textContent('.checkout-form')).includes('valid postal code'));
  await page.fill('[name=zip]', '10115');
  await page.click('.checkout-form button.btn-lg');
  await page.waitForSelector('.confirm-head', { timeout: 5000 });
  const orderNo = await page.textContent('.confirm-head strong');
  check('order confirmation shown', /^DEMO-\d+$/.test(orderNo), `(${orderNo})`);
  check('cart cleared after order', (await page.$('.cart-count')) === null);
  await page.screenshot({ path: `${OUT}/m_confirmation.png`, fullPage: true });

  // Track order
  await page.goto(BASE + '/pages/track-order');
  await page.fill('input[placeholder^=DEMO]', orderNo);
  await page.fill('.track-form input[type=email]', 'MAX@example.com');
  await page.click('.track-form button');
  check('track order finds the order', !!(await page.$('.timeline')));

  // Persistence across reload
  await page.goto(BASE + '/products/poedagar-kings-oak');
  await page.click('.offer >> text=Mix & Match');
  await page.click('.offer.active button[aria-label="Increase quantity"]');
  await page.click('.product-info > .btn');
  await page.waitForSelector('.cart-drawer.open .cart-line');
  await page.reload();
  await page.waitForSelector('.cart-count');
  check('cart persists after reload', (await page.textContent('.cart-count')) === '2');

  // Sold out + 404 + collection best sellers + policy pages
  await page.goto(BASE + '/products/armor-dive-s2-watch');
  check('sold out product cannot be added', await page.isDisabled('.product-info > .btn'));
  await page.goto(BASE + '/products/nope');
  check('unknown product -> not found', (await page.textContent('h1')).includes('not found'));
  await page.goto(BASE + '/collections/best-sellers');
  const bs = await page.$$eval('.grid .card', (x) => x.length);
  check('best sellers collection', bs === 14, `(${bs})`);
  await page.goto(BASE + '/pages/faq');
  check('faq page', (await page.textContent('h1')) === 'FAQ');
  await page.goto(BASE + '/pages/contact');
  await page.click('.contact-form button');
  check('contact form validates', (await page.$$('.contact-form .field-error')).length === 3);

  // Horizontal overflow on mobile
  for (const path of ['/', '/collections/all', '/products/poedagar-8051', '/cart', '/checkout']) {
    await page.goto(BASE + path);
    await page.waitForTimeout(500);
    const ow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(`no horizontal scroll ${path}`, ow <= 0, `(${ow}px)`);
  }

  // Desktop pass
  const d = await browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
  const dp = await d.newPage();
  dp.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
  await dp.goto(BASE + '/');
  await dp.waitForTimeout(2500);
  await dp.screenshot({ path: `${OUT}/d_home.png` });
  await dp.click('.nav-desktop >> text=Best Sellers');
  await dp.waitForSelector('.grid .card');
  await dp.waitForTimeout(1500);
  await dp.screenshot({ path: `${OUT}/d_collection.png` });
  await dp.goto(BASE + '/products/poedagar-8051');
  await dp.waitForTimeout(2000);
  await dp.screenshot({ path: `${OUT}/d_product.png` });
  await dp.click('button[aria-label="Next image"]');
  await dp.waitForTimeout(700);
  check('desktop gallery arrow advances', (await dp.$$eval('.gallery-dots span', (x) => x.findIndex((e) => e.classList.contains('on')))) === 1);

  results.forEach((r) => console.log(r));
  console.log('console errors:', errors.length ? errors : 'none');
  await browser.close();
})().catch((e) => { results.forEach((r) => console.log(r)); console.error('E2E CRASH', e); process.exit(1); });
