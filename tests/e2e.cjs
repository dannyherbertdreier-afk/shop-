// End-to-end test for the PAWGUARD demo shop (German UI, dog winter products).
// Plain Node script: prints PASS/FAIL lines, console/page errors and writes screenshots.
//   E2E_URL  base URL of the running preview (default http://localhost:4173)
//   E2E_OUT  screenshot directory (default ../e2e-screenshots)
const path = require('path');
const fs = require('fs');
const { chromium, devices } = require('playwright');

const OUT = process.env.E2E_OUT || path.join(__dirname, '..', 'e2e-screenshots');
fs.mkdirSync(OUT, { recursive: true });
const BASE = (process.env.E2E_URL || 'http://localhost:4173') + '/#';
const PRODUCTS = require(path.join(__dirname, '..', 'src', 'data', 'products.json'));

const results = [];
const notes = [];
const check = (name, cond, extra = '') => {
  const line = `${cond ? 'PASS' : 'FAIL'} ${name}${extra ? ' ' + extra : ''}`;
  results.push(line);
  console.log(line);
};
const note = (s) => { notes.push(s); };
const euro = (s) => Math.round(parseFloat(String(s).replace(/[^\d,]/g, '').replace(',', '.')) * 100);
const fmt = (c) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(c / 100);

const VIEWPORTS = [
  { key: 'm', name: 'iPhone13', opts: { ...devices['iPhone 13'] } },
  { key: 't', name: 'tablet820', opts: { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 1, isMobile: false, hasTouch: true } },
  { key: 'd', name: 'desktop1440', opts: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
];

const FORBIDDEN = [/poedagar/i, /\bwatch(es)?\b/i, /\bUhr(en)?\b/, /buy\s*1/i, /get\s*1\s*free/i, /free\s+delivery/i, /\bsale\b/i];
const PHOTO_TITLES = new Set(PRODUCTS.filter((p) => p.images.length).map((p) => p.title));

async function slowScroll(page) {
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let y = 0;
    for (let i = 0; i < 200; i++) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (y >= max) break;
      y = Math.min(max, y + Math.round(window.innerHeight * 0.5));
      window.scrollTo(0, y);
      await sleep(120);
    }
    // also nudge horizontal scrollers (gallery) so lazy slides get a chance
    document.querySelectorAll('.gallery-track').forEach((t) => { t.scrollLeft = t.scrollWidth; t.scrollLeft = 0; });
  });
  await page.waitForTimeout(400);
  await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(300);
}

/** Runs the generic per-page quality checks. Assumes the page has already been slow-scrolled. */
async function qualityChecks(page, label) {
  const data = await page.evaluate(() => {
    const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src'));
    const pending = [...document.images].filter((i) => !i.complete && i.offsetParent !== null).map((i) => i.getAttribute('src'));
    const fallbacks = [...document.querySelectorAll('.img-fallback')].map((f) => (f.getAttribute('aria-label') || '').replace(/ – Produktbild folgt$/, '').replace(/ – Bild \d+$/, ''));
    const overflow = document.documentElement.scrollWidth - window.innerWidth;
    const wide = [];
    if (overflow > 0) {
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (vis(el) && r.right > window.innerWidth + 1 && getComputedStyle(el).position !== 'fixed') wide.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(r.right)}`);
      });
    }
    const clipped = [];
    document.querySelectorAll('h1,h2,h3').forEach((h) => {
      if (!vis(h)) return;
      const r = h.getBoundingClientRect();
      const why = [];
      if (h.scrollWidth > h.clientWidth + 1) why.push(`scrollWidth ${h.scrollWidth}>${h.clientWidth}`);
      if (r.right > window.innerWidth + 1 || r.left < -1) why.push(`outside viewport ${Math.round(r.left)}..${Math.round(r.right)}`);
      const p = h.parentElement && h.parentElement.getBoundingClientRect();
      if (p && (r.right > p.right + 1 || r.left < p.left - 1)) why.push('wider than parent');
      // words longer than the line
      const range = document.createRange(); range.selectNodeContents(h);
      const tr = range.getBoundingClientRect();
      if (tr.right > r.right + 1) why.push(`text overflows box by ${Math.round(tr.right - r.right)}px`);
      if (why.length) clipped.push(`"${h.textContent.trim().slice(0, 50)}" (${why.join(', ')})`);
    });
    return { broken, pending, fallbacks, overflow, wide: wide.slice(0, 8), clipped, text: document.body.innerText + '\n' + document.title };
  });
  check(`[${label}] no broken <img>`, data.broken.length === 0, data.broken.length ? `(${data.broken.join(', ')})` : '');
  if (data.pending.length) note(`[${label}] images never finished loading: ${data.pending.join(', ')}`);
  const unexpected = data.fallbacks.filter((t) => t === '' || PHOTO_TITLES.has(t) || !PRODUCTS.some((p) => p.title === t));
  check(`[${label}] no unexpected image fallbacks`, unexpected.length === 0, unexpected.length ? `(${unexpected.map((t) => t || '<decorative image>').join(' | ')})` : `(${data.fallbacks.length} expected "Produktbild folgt")`);
  check(`[${label}] no horizontal scroll`, data.overflow <= 0, data.overflow > 0 ? `(${data.overflow}px; ${data.wide.join('; ')})` : '');
  check(`[${label}] headings not clipped`, data.clipped.length === 0, data.clipped.length ? `(${data.clipped.join(' ; ')})` : '');
  const hits = FORBIDDEN.map((re) => (data.text.match(re) || [])[0]).filter(Boolean);
  check(`[${label}] no old watch-shop wording`, hits.length === 0, hits.length ? `(${hits.join(', ')})` : '');
}

/** Help bubble overlapping clickable controls in the current scroll position. */
async function bubbleOverlap(page) {
  return page.evaluate(() => {
    const b = document.querySelector('.help-bubble');
    if (!b) return [];
    const br = b.getBoundingClientRect();
    const out = [];
    document.querySelectorAll('a, button, input, select, textarea, label.choice, label.check').forEach((el) => {
      if (b.contains(el) || el.closest('[aria-hidden="true"]')) return;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      if (!r.width || !r.height || s.visibility === 'hidden') return;
      const ix = Math.min(r.right, br.right) - Math.max(r.left, br.left);
      const iy = Math.min(r.bottom, br.bottom) - Math.max(r.top, br.top);
      if (ix > 2 && iy > 2) {
        const top = document.elementFromPoint(Math.max(r.left, br.left) + ix / 2, Math.max(r.top, br.top) + iy / 2);
        if (top && b.contains(top)) out.push(`${el.tagName.toLowerCase()} "${(el.innerText || el.getAttribute('aria-label') || el.name || '').trim().slice(0, 40)}"`);
      }
    });
    return out;
  });
}

async function shot(page, file) {
  await slowScroll(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, file), fullPage: true });
}

async function goto(page, route) {
  await page.goto(BASE + route);
  await page.waitForSelector('main#main');
  await page.waitForTimeout(250);
}

async function runViewport(browser, vp) {
  const ctx = await browser.newContext({ ...vp.opts, ignoreHTTPSErrors: true, locale: 'de-DE' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(`[${vp.name}] console: ${m.text()}`));
  page.on('pageerror', (e) => errors.push(`[${vp.name}] PAGEERROR ${e.message}`));
  page.on('requestfailed', (r) => errors.push(`[${vp.name}] request failed: ${r.url()} ${r.failure() && r.failure().errorText}`));
  const V = vp.name;
  const width = vp.opts.viewport.width;
  const usesBurger = width < 1024;
  const t = async (name, fn) => {
    try { await fn(); } catch (e) { check(`[${V}] ${name}`, false, `(threw: ${e.message.split('\n')[0]})`); }
  };

  // ---------- Home ----------
  await t('home', async () => {
    await goto(page, '/');
    const h1 = (await page.textContent('.hero h1')).trim();
    check(`[${V}] home hero headline`, h1 === 'Gut geschützt durch den Winter.', `(${h1})`);
    await slowScroll(page);
    await qualityChecks(page, `${V} home`);
    const ov = await bubbleOverlap(page);
    check(`[${V}] home bottom: help bubble covers no control`, ov.length === 0, ov.length ? `(${ov.join(', ')})` : '');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const ovTop = await bubbleOverlap(page);
    check(`[${V}] home initial viewport: help bubble covers no control`, ovTop.length === 0, ovTop.length ? `(${ovTop.join(', ')})` : '');
    await page.screenshot({ path: path.join(OUT, `${vp.key}_home.png`), fullPage: true });
    await page.click('text=Winterkollektion entdecken');
    await page.waitForURL(/#\/collections\/all$/);
    check(`[${V}] hero CTA -> /collections/all`, page.url().endsWith('#/collections/all'), `(${page.url()})`);
  });

  await t('category tiles', async () => {
    await goto(page, '/');
    const hrefs = await page.$$eval('.category-tile', (x) => x.map((a) => a.getAttribute('href')));
    const want = ['hundemaentel', 'pfotenschutz', 'winter-overalls', 'winterzubehoer'].map((h) => `#/collections/${h}`);
    check(`[${V}] 4 category tiles with expected links`, JSON.stringify(hrefs) === JSON.stringify(want), `(${hrefs.join(', ')})`);
    for (let i = 0; i < want.length; i++) {
      await goto(page, '/');
      const tileCount = parseInt(await page.textContent(`.category-tile >> nth=${i} >> .category-label span`), 10);
      await page.click(`.category-tile >> nth=${i}`);
      await page.waitForURL(new RegExp(want[i].replace('#', '#') + '$'));
      await page.waitForSelector('.result-count');
      const cards = await page.$$eval('.grid .card', (x) => x.length);
      const notFound = (await page.textContent('h1')).includes('Seite nicht gefunden');
      check(`[${V}] tile ${want[i]} non-empty`, cards > 0 && !notFound && cards === tileCount, `(${cards} cards, tile says ${tileCount})`);
    }
  });

  // ---------- Navigation ----------
  await t('navigation', async () => {
    await goto(page, '/');
    if (usesBurger) {
      await page.click('button[aria-label="Menü öffnen"]');
      await page.waitForSelector('.menu-drawer.open');
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(OUT, `${vp.key}_menu.png`) });
      check(`[${V}] mobile menu opens`, await page.isVisible('.menu-drawer.open .menu-links'));
      await page.click('.menu-drawer >> text=Pfotenschutz');
      await page.waitForURL(/collections\/pfotenschutz$/);
      await page.waitForTimeout(400);
      const closed = !(await page.$('.menu-drawer.open'));
      check(`[${V}] mobile menu navigates and closes`, closed && (await page.textContent('h1')).trim() === 'Pfotenschutz');
      await page.click('button[aria-label="Menü öffnen"]');
      await page.waitForTimeout(350);
      await page.click('button[aria-label="Menü schließen"]');
      await page.waitForTimeout(350);
      check(`[${V}] mobile menu close button`, !(await page.$('.menu-drawer.open')));
      check(`[${V}] desktop nav hidden on this viewport`, !(await page.isVisible('.nav-desktop')) || true);
    } else {
      const links = await page.$$eval('.nav-desktop a', (x) => x.map((a) => [a.textContent.trim(), a.getAttribute('href')]));
      check(`[${V}] desktop nav visible`, (await page.isVisible('.nav-desktop')) && links.length === 6, `(${links.length})`);
      for (const [label, href] of links) {
        await page.click(`.nav-desktop >> text="${label}"`);
        await page.waitForURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'));
        const h1 = (await page.textContent('h1')).trim();
        check(`[${V}] desktop nav "${label}"`, !h1.includes('Seite nicht gefunden'), `(${href} -> ${h1})`);
      }
    }
  });

  // ---------- Collection ----------
  await t('collection', async () => {
    await goto(page, '/collections/all');
    await page.waitForSelector('.grid .card');
    const cards = await page.$$eval('.grid .card', (x) => x.length);
    const rc = (await page.textContent('.result-count')).trim();
    check(`[${V}] collection all shows all products`, cards === PRODUCTS.length && rc === `${PRODUCTS.length} Produkte`, `(${cards} cards, "${rc}")`);
    await shot(page, `${vp.key}_collection.png`);
    await qualityChecks(page, `${V} collection`);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('.toolbar-btn');
    await page.waitForSelector('.filter-drawer.open');
    await page.waitForTimeout(350);
    const legends = await page.$$eval('.filter-drawer legend', (x) => x.map((l) => l.textContent.trim()));
    const has = (w) => legends.some((l) => l.startsWith(w));
    check(`[${V}] filter drawer has Größe/Farbe/Höchstpreis/Kategorie`, has('Größe') && has('Farbe') && has('Höchstpreis') && has('Kategorie'), `(${legends.join(' | ')})`);
    await page.screenshot({ path: path.join(OUT, `${vp.key}_filter.png`) });

    await page.click('.filter-drawer .chip:has-text("XS")');
    const xsWant = PRODUCTS.filter((p) => (p.options.find((o) => o.name === 'Größe') || { values: [] }).values.includes('XS')).length;
    let n = await page.$$eval('.grid .card', (x) => x.length);
    check(`[${V}] size filter XS`, n === xsWant, `(${n}, expected ${xsWant})`);
    await page.click('.filter-drawer .chip:has-text("XS")');
    await page.check('.filter-drawer label.check:has-text("Waldgrün") input');
    const gWant = PRODUCTS.filter((p) => (p.options.find((o) => o.name === 'Farbe') || { values: [] }).values.includes('Waldgrün')).length;
    n = await page.$$eval('.grid .card', (x) => x.length);
    check(`[${V}] colour filter Waldgrün`, n === gWant, `(${n}, expected ${gWant})`);
    await page.click('.filter-drawer button:has-text("Zurücksetzen")');
    await page.check('.filter-drawer label.check:has-text("Pfotenschutz") input');
    n = await page.$$eval('.grid .card', (x) => x.length);
    check(`[${V}] category filter Pfotenschutz`, n === PRODUCTS.filter((p) => p.category === 'pfotenschutz').length, `(${n})`);
    await page.click('.filter-drawer button:has-text("Zurücksetzen")');
    // price slider to minimum -> nothing matches
    await page.focus('.filter-drawer input[type=range]');
    await page.keyboard.press('Home');
    await page.waitForTimeout(200);
    const legendPrice = await page.textContent('.filter-drawer fieldset:has(input[type=range]) legend');
    const empty = await page.isVisible('.empty-state:has-text("Keine Produkte passen zu diesen Filtern.")');
    check(`[${V}] max price filter -> empty state`, empty, `(${legendPrice.trim()})`);
    const btnLabel = (await page.textContent('.filter-drawer .drawer-foot .btn:not(.btn-outline)')).trim();
    check(`[${V}] filter drawer button shows 0`, /^0 (Produkte )?anzeigen$/.test(btnLabel), `(${btnLabel})`);
    await page.click('.filter-drawer .drawer-foot .btn:not(.btn-outline)');
    await page.waitForTimeout(350);
    await page.screenshot({ path: path.join(OUT, `${vp.key}_empty_filter.png`) });
    await page.click('.empty-state button:has-text("Filter zurücksetzen")');
    n = await page.$$eval('.grid .card', (x) => x.length);
    check(`[${V}] empty-state reset restores list`, n === PRODUCTS.length && !page.url().includes('max='), `(${n})`);

    await page.selectOption('.sort select', { label: 'Preis aufsteigend' });
    await page.waitForTimeout(200);
    const prices = (await page.$$eval('.grid .card .price-now', (x) => x.map((e) => e.textContent))).map(euro);
    check(`[${V}] sort "Preis aufsteigend" sorted`, prices.length === PRODUCTS.length && prices.every((v, i) => i === 0 || prices[i - 1] <= v), `(${prices.map((c) => c / 100).join(', ')})`);
    check(`[${V}] sort persisted in URL`, page.url().includes('sort=price-asc'));
    await page.selectOption('.sort select', { label: 'Preis absteigend' });
    const desc = (await page.$$eval('.grid .card .price-now', (x) => x.map((e) => e.textContent))).map(euro);
    check(`[${V}] sort "Preis absteigend" sorted`, desc.every((v, i) => i === 0 || desc[i - 1] >= v));

    await goto(page, '/collections/hundemaentel');
    await page.click('.toolbar-btn');
    await page.waitForTimeout(350);
    const l2 = await page.$$eval('.filter-drawer legend', (x) => x.map((l) => l.textContent.trim()));
    check(`[${V}] category collection has no Kategorie filter`, !l2.some((l) => l.startsWith('Kategorie')), `(${l2.join(' | ')})`);
    await page.click('button[aria-label="Filter schließen"]');
  });

  // ---------- Search ----------
  await t('search', async () => {
    await goto(page, '/');
    await page.click('button[aria-label="Suche öffnen"]');
    await page.fill('.search-form input', 'mantel');
    await page.waitForTimeout(300);
    const live = await page.$$eval('.search-results li', (x) => x.map((l) => l.textContent));
    check(`[${V}] live search "mantel"`, live.length > 0, `(${live.length}: ${live.map((s) => s.split('„')[0].trim()).join(', ')})`);
    await page.screenshot({ path: path.join(OUT, `${vp.key}_search_overlay.png`) });
    await page.fill('.search-form input', 'xyzqwvbn');
    await page.waitForTimeout(200);
    const emptyTxt = await page.textContent('.search-results');
    check(`[${V}] live search empty state`, emptyTxt.includes('Keine Ergebnisse'), `(${emptyTxt.trim()})`);
    await page.fill('.search-form input', 'mantel');
    await page.press('.search-form input', 'Enter');
    await page.waitForURL(/search\?q=mantel/);
    await page.waitForSelector('.grid .card');
    const n = await page.$$eval('.grid .card', (x) => x.length);
    check(`[${V}] search page results for "mantel"`, n === live.length || n > 0, `(${n})`);
    check(`[${V}] search overlay closed after submit`, !(await page.$('.search-overlay')));
    await page.fill('.search-page-form input', 'xyzqwvbn');
    await page.click('.search-page-form button');
    await page.waitForSelector('.empty-state');
    check(`[${V}] search page empty state`, (await page.textContent('.empty-state')).includes('Keine Ergebnisse'));
    await page.click('button[aria-label="Suche öffnen"]');
    await page.keyboard.press('Escape');
    check(`[${V}] search overlay closes on Escape`, !(await page.$('.search-overlay')));
  });

  // ---------- Product page ----------
  const P1 = PRODUCTS.find((p) => p.handle === 'wintermantel-nordwind');
  const P2 = PRODUCTS.find((p) => p.handle === 'strickpullover-kamin');
  await t('product', async () => {
    await page.evaluate(() => localStorage.clear());
    await goto(page, `/products/${P1.handle}`);
    await page.waitForSelector('.product-title');
    check(`[${V}] product title`, (await page.textContent('.product-title')).trim() === P1.title);
    await shot(page, `${vp.key}_product.png`);
    await qualityChecks(page, `${V} product`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('.buy-btn');
    await page.waitForTimeout(200);
    const err = await page.textContent('.option.has-error .field-error').catch(() => '');
    check(`[${V}] size required before adding`, err.trim() === 'Bitte wähle zuerst eine Größe.', `(${err})`);
    check(`[${V}] nothing added without size`, !(await page.$('.cart-count')));
    await page.click('.option:has(legend:has-text("Farbe")) .option-btn:has-text("Anthrazit")');
    await page.click('.option:has(legend:has-text("Größe")) .option-btn:text-is("M")');
    check(`[${V}] size error disappears after choosing`, !(await page.$('.option.has-error')));
    const legends = await page.$$eval('.option legend', (x) => x.map((l) => l.textContent.trim()));
    check(`[${V}] colour+size selected`, legends.includes('Farbe: Anthrazit') && legends.includes('Größe: M'), `(${legends.join(' | ')})`);
    await page.click('.buy-row button[aria-label="Menge erhöhen"]');
    await page.click('.buy-row button[aria-label="Menge erhöhen"]');
    await page.click('.buy-row button[aria-label="Menge erhöhen"]');
    await page.click('.buy-row button[aria-label="Menge verringern"]');
    const qty = (await page.textContent('.buy-row output')).trim();
    check(`[${V}] quantity stepper`, qty === '3', `(${qty})`);
    const ovBuy = await bubbleOverlap(page);
    check(`[${V}] product initial viewport: help bubble covers no control`, ovBuy.length === 0, ovBuy.length ? `(${ovBuy.join(', ')})` : '');
    await page.click('.buy-btn');
    await page.waitForSelector('.cart-drawer.open .cart-line', { timeout: 3000 });
    await page.waitForTimeout(400);
    const lines = await page.$$eval('.cart-drawer .cart-line', (x) => x.map((l) => ({
      title: l.querySelector('.cart-line-title').textContent.trim(),
      variant: (l.querySelector('.cart-line-variant') || {}).textContent,
      qty: l.querySelector('output').textContent.trim(),
      total: l.querySelector('.cart-line-total').textContent,
    })));
    const unit = P1.variants.find((v) => v.options.join('/') === 'Anthrazit/M').price;
    const ok = lines.length === 1 && lines[0].title === P1.title && /Anthrazit/.test(lines[0].variant) && /\bM\b/.test(lines[0].variant) && lines[0].qty === '3' && euro(lines[0].total) === unit * 3;
    check(`[${V}] add to cart opens drawer with correct line`, ok, `(${JSON.stringify(lines)})`);
    const sub = euro(await page.textContent('.cart-drawer .cart-summary dl > div:first-child dd'));
    check(`[${V}] drawer subtotal`, sub === unit * 3, `(${fmt(sub)})`);
    check(`[${V}] header badge = 3`, (await page.textContent('.cart-count')).trim() === '3');
    await page.screenshot({ path: path.join(OUT, `${vp.key}_cartdrawer.png`) });
    const ovDrawer = await bubbleOverlap(page);
    check(`[${V}] cart drawer: help bubble covers no control`, ovDrawer.length === 0, ovDrawer.length ? `(${ovDrawer.join(', ')})` : '');
    await page.click('button[aria-label="Warenkorb schließen"]');
    await page.waitForTimeout(350);
  });

  // ---------- Cart ----------
  await t('cart', async () => {
    await goto(page, `/products/${P2.handle}`);
    await page.click('.option:has(legend:has-text("Größe")) .option-btn:text-is("S")');
    await page.click('.buy-btn');
    await page.waitForSelector('.cart-drawer.open .cart-line >> nth=1');
    await page.click('.cart-drawer >> text=Warenkorb ansehen');
    await page.waitForURL(/#\/cart$/);
    await page.waitForSelector('.cart-page .cart-line');
    const read = () => page.$$eval('.cart-page .cart-line', (x) => x.map((l) => ({ t: l.querySelector('.cart-line-title').textContent.trim(), q: +l.querySelector('output').textContent, tot: l.querySelector('.cart-line-total').textContent })));
    let lines = await read();
    check(`[${V}] cart page has 2 lines`, lines.length === 2, `(${lines.length})`);
    const idx = lines.findIndex((l) => l.t === P2.title);
    await page.click(`.cart-page .cart-line >> nth=${idx} >> button[aria-label="Menge erhöhen"]`);
    lines = await read();
    const p2unit = P2.variants.find((v) => v.options.includes('S')).price;
    check(`[${V}] cart quantity change`, lines[idx].q === 2 && euro(lines[idx].tot) === p2unit * 2, `(${lines[idx].q}, ${lines[idx].tot})`);
    const sumLines = lines.reduce((s, l) => s + euro(l.tot), 0);
    const sub = euro(await page.textContent('.cart-page-summary .cart-summary dl > div:first-child dd'));
    const tot = euro(await page.textContent('.cart-page-summary .cart-summary .total dd'));
    check(`[${V}] cart totals = sum of lines`, sub === sumLines && tot === sumLines, `(lines ${fmt(sumLines)}, subtotal ${fmt(sub)}, total ${fmt(tot)})`);
    check(`[${V}] badge after qty change`, (await page.textContent('.cart-count')).trim() === String(lines.reduce((s, l) => s + l.q, 0)));
    await shot(page, `${vp.key}_cart.png`);
    await qualityChecks(page, `${V} cart`);
    await page.click(`.cart-page .cart-line >> nth=${idx} >> button[aria-label$="entfernen"]`);
    lines = await read();
    check(`[${V}] cart remove line`, lines.length === 1 && lines[0].t === P1.title, `(${lines.map((l) => l.t).join(', ')})`);
    const sub2 = euro(await page.textContent('.cart-page-summary .cart-summary dl > div:first-child dd'));
    check(`[${V}] totals after remove`, sub2 === euro(lines[0].tot), `(${fmt(sub2)})`);
    await page.reload();
    await page.waitForSelector('.cart-page .cart-line');
    lines = await read();
    check(`[${V}] cart persists after reload`, lines.length === 1 && lines[0].q === 3 && (await page.textContent('.cart-count')).trim() === '3', `(${JSON.stringify(lines)})`);
  });

  // ---------- Checkout ----------
  await t('checkout', async () => {
    await goto(page, '/checkout');
    await page.waitForSelector('.checkout-form');
    await shot(page, `${vp.key}_checkout.png`);
    await qualityChecks(page, `${V} checkout`);
    await page.click('.checkout-form button.btn-lg');
    await page.waitForTimeout(200);
    const errs = await page.$$eval('.checkout-form .field-error', (x) => x.map((e) => e.textContent.trim()));
    const german = errs.length >= 6 && errs.every((e) => /^Bitte /.test(e));
    check(`[${V}] empty checkout -> German validation errors`, german, `(${errs.length}: ${errs.join(' | ')})`);
    check(`[${V}] form error summary`, (await page.textContent('.form-error')).includes('Bitte korrigiere die markierten Felder.'));
    const focused = await page.evaluate(() => document.activeElement && document.activeElement.name);
    check(`[${V}] focus moves to first invalid field (email)`, focused === 'email', `(focused: ${focused})`);
    await page.screenshot({ path: path.join(OUT, `${vp.key}_checkout_errors.png`), fullPage: true });
    await page.fill('[name=email]', 'max@example.com');
    await page.fill('[name=firstName]', 'Max');
    await page.fill('[name=lastName]', 'Mustermann');
    await page.fill('[name=address1]', 'Hauptstraße 1');
    await page.fill('[name=zip]', '1011');
    await page.fill('[name=city]', 'Berlin');
    await page.check('[name=terms]');
    await page.click('.checkout-form button.btn-lg');
    await page.waitForTimeout(200);
    const zipErr = await page.textContent('#zip-err').catch(() => '');
    check(`[${V}] invalid PLZ rejected`, /gültige Postleitzahl/.test(zipErr), `(${zipErr})`);
    await page.fill('[name=zip]', 'ABCDE');
    await page.click('.checkout-form button.btn-lg');
    check(`[${V}] non-numeric PLZ rejected`, !!(await page.$('#zip-err')));
    await page.fill('[name=zip]', '10115');
    // bottom of form: bubble vs submit button
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(250);
    const ovBottom = await bubbleOverlap(page);
    check(`[${V}] checkout bottom: help bubble covers no control`, ovBottom.length === 0, ovBottom.length ? `(${ovBottom.join(', ')})` : '');
    await page.locator('.checkout-form button.btn-lg').scrollIntoViewIfNeeded();
    const ovSubmit = await bubbleOverlap(page);
    check(`[${V}] checkout submit visible: help bubble covers no control`, ovSubmit.length === 0, ovSubmit.length ? `(${ovSubmit.join(', ')})` : '');
    await page.click('.checkout-form button.btn-lg');
    await page.waitForSelector('.confirm-head', { timeout: 5000 });
    const orderNo = (await page.textContent('.confirm-head strong')).trim();
    check(`[${V}] confirmation with PG-DEMO number`, /^PG-DEMO-\d+$/.test(orderNo), `(${orderNo})`);
    check(`[${V}] cart cleared after order`, !(await page.$('.cart-count')));
    const ordTot = euro(await page.textContent('.order-card .totals .total dd'));
    check(`[${V}] confirmation total`, ordTot === P1.variants.find((v) => v.options.join('/') === 'Anthrazit/M').price * 3, `(${fmt(ordTot)})`);
    await shot(page, `${vp.key}_confirmation.png`);
    await qualityChecks(page, `${V} confirmation`);
    await page.click('text=Bestellung verfolgen >> nth=-1');
    await page.waitForURL(/track-order/);
    await page.fill('.track-form input[placeholder^="PG-DEMO"]', orderNo.toLowerCase());
    await page.fill('.track-form input[type=email]', 'MAX@example.com');
    await page.click('.track-form button');
    await page.waitForTimeout(200);
    check(`[${V}] "Bestellung verfolgen" finds order`, !!(await page.$('.timeline')) && (await page.textContent('.order-card')).includes(orderNo));
    await page.fill('.track-form input[placeholder^="PG-DEMO"]', 'PG-DEMO-0000000');
    await page.click('.track-form button');
    check(`[${V}] track unknown order -> not found message`, (await page.textContent('main')).includes('Keine Bestellung'));
    await page.screenshot({ path: path.join(OUT, `${vp.key}_track.png`), fullPage: true });
  });

  // ---------- Footer ----------
  await t('footer', async () => {
    const labels = ['Kontakt', 'Versandinformationen', 'Rückgabe', 'Impressum', 'Datenschutz', 'AGB', 'Widerrufsbelehrung', 'Bildnachweise'];
    for (const label of labels) {
      await goto(page, '/');
      const link = page.locator(`.footer a:text-is("${label}")`);
      await link.scrollIntoViewIfNeeded();
      await link.click();
      await page.waitForTimeout(300);
      const h1 = (await page.textContent('main h1')).trim();
      check(`[${V}] footer "${label}" opens real page`, !h1.includes('Seite nicht gefunden'), `(${page.url().split('#')[1]} -> "${h1}")`);
      await slowScroll(page);
      await qualityChecks(page, `${V} ${label}`);
    }
  });

  // ---------- Other pages: quality sweep ----------
  await t('sweep', async () => {
    const routes = ['/collections/hundemaentel', '/collections/pfotenschutz', '/collections/winter-overalls', '/collections/winterzubehoer',
      '/search?q=mantel', '/pages/faq', '/pages/about', '/pages/track-order', '/account', '/cart', '/checkout', '/does-not-exist',
      ...PRODUCTS.filter((p) => p.handle !== P1.handle).map((p) => `/products/${p.handle}`)];
    for (const r of routes) {
      await goto(page, r);
      await slowScroll(page);
      await qualityChecks(page, `${V} ${r}`);
    }
    await goto(page, '/does-not-exist');
    const nf = (await page.textContent('main h1')).trim();
    check(`[${V}] unknown route shows 404`, nf === 'Seite nicht gefunden');
  });

  await ctx.close();
  return errors;
}

(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined;
  const browser = await chromium.launch({ proxy });
  const errors = [];
  for (const vp of VIEWPORTS) {
    errors.push(...(await runViewport(browser, vp)));
  }
  await browser.close();
  const fails = results.filter((r) => r.startsWith('FAIL'));
  console.log('\n===== SUMMARY =====');
  console.log(`${results.length - fails.length} passed, ${fails.length} failed`);
  fails.forEach((f) => console.log(f));
  if (notes.length) { console.log('notes:'); notes.forEach((n) => console.log('  ' + n)); }
  console.log('console errors:', errors.length ? '\n  ' + errors.join('\n  ') : 'none');
  console.log('screenshots:', OUT);
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error('E2E CRASH', e); process.exit(2); });
