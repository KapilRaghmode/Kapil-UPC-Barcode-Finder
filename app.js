/**
 * ============================================================================
 * 1. BUILT-IN GROCERY & EVERYDAY PRODUCT DATABASE
 * ============================================================================
 */
const DEFAULT_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Maggi 2-Minute Masala Instant Noodles',
    brand: 'Nestlé Maggi',
    category: 'Instant Noodles & Pasta',
    size: '70g',
    barcode: '8901058851298',
    imageUrl: '',
    source: 'Built-in DB'
  },
  {
    id: 'prod-2',
    name: 'Maggi Double Masala Instant Noodles',
    brand: 'Nestlé Maggi',
    category: 'Instant Noodles & Pasta',
    size: '140g (2-Pack)',
    barcode: '8901058851304',
    imageUrl: '',
    source: 'Built-in DB'
  },
  {
    id: 'prod-3',
    name: 'Maggi Special Masala Instant Noodles',
    brand: 'Nestlé Maggi',
    category: 'Instant Noodles & Pasta',
    size: '70g',
    barcode: '8901058865226',
    imageUrl: '',
    source: 'Built-in DB'
  },
  {
    id: 'prod-4',
    name: 'Amul Pasteurised Table Butter',
    brand: 'Amul',
    category: 'Dairy & Bakery',
    size: '100g',
    barcode: '8901262010016',
    imageUrl: '',
    source: 'Built-in DB'
  },
  {
    id: 'prod-5',
    name: 'Amul Taaza Homogenised Toned Milk',
    brand: 'Amul',
    category: 'Dairy & Bakery',
    size: '1L Tetra Pack',
    barcode: '8901262150125',
    imageUrl: '',
    source: 'Built-in DB'
  },
  {
    id: 'prod-6',
    name: 'Parle-G Original Gluco Biscuits',
    brand: 'Parle',
    category: 'Biscuits & Snacks',
    size: '250g',
    barcode: '8901719110016',
    imageUrl: '',
    source: 'Built-in DB'
  },
  {
    id: 'prod-7',
    name: 'Britannia Good Day Cashew Cookies',
    brand: 'Britannia',
    category: 'Biscuits & Snacks',
    size: '200g',
    barcode: '8901063010123',
    imageUrl: '',
    source: 'Built-in DB'
  },
  {
    id: 'prod-8',
    name: 'Tata Salt Vacuum Evaporated Iodized Salt',
    brand: 'Tata Consumer',
    category: 'Staples & Spices',
    size: '1kg',
    barcode: '8904043901015',
    imageUrl: '',
    source: 'Built-in DB'
  },
  {
    id: 'prod-9',
    name: 'Aashirvaad Shudh Chakki Whole Wheat Atta',
    brand: 'ITC Aashirvaad',
    category: 'Staples & Spices',
    size: '5kg',
    barcode: '8901725121112',
    imageUrl: '',
    source: 'Built-in DB'
  },
  {
    id: 'prod-10',
    name: 'Lay’s India’s Magic Masala Potato Chips',
    brand: 'PepsiCo Lay’s',
    category: 'Biscuits & Snacks',
    size: '50g',
    barcode: '8901491101837',
    imageUrl: '',
    source: 'Built-in DB'
  },
  {
    id: 'prod-11',
    name: 'Lay’s Classic Salted Potato Chips',
    brand: 'PepsiCo Lay’s',
    category: 'Biscuits & Snacks',
    size: '50g',
    barcode: '8901491101813',
    imageUrl: '',
    source: 'Built-in DB'
  },
  {
    id: 'prod-12',
    name: 'Coca-Cola Original Taste Soft Drink',
    brand: 'Coca-Cola',
    category: 'Beverages',
    size: '750ml',
    barcode: '8901764012273',
    imageUrl: '',
    source: 'Built-in DB'
  },
  {
    id: 'prod-13',
    name: 'Red Label Natural Care Tea',
    brand: 'Brooke Bond',
    category: 'Beverages',
    size: '500g',
    barcode: '8901030705212',
    imageUrl: '',
    source: 'Built-in DB'
  },
  {
    id: 'prod-14',
    name: 'Kissan Fresh Tomato Ketchup',
    brand: 'HUL Kissan',
    category: 'Staples & Spices',
    size: '950g Pouch',
    barcode: '8901030654121',
    imageUrl: '',
    source: 'Built-in DB'
  },
  {
    id: 'prod-15',
    name: 'Dettol Original Germ Protection Bathing Soap',
    brand: 'Reckitt Dettol',
    category: 'Personal Care',
    size: '125g',
    barcode: '8901396311201',
    imageUrl: '',
    source: 'Built-in DB'
  }
];

const STORAGE_KEY_PRODUCTS = 'barcode_finder_products_v3';
const STORAGE_KEY_HISTORY = 'barcode_finder_history_v3';
const STORAGE_KEY_API_CACHE = 'barcode_finder_api_cache_v3';

// Free/open product endpoints across categories + UPCitemdb free trial barcode lookup
const OPEN_FACTS_SOURCES = [
  { name: 'Open Food Facts', baseUrl: 'https://world.openfoodfacts.org' },
  { name: 'Open Beauty Facts', baseUrl: 'https://world.openbeautyfacts.org' },
  { name: 'Open Pet Food Facts', baseUrl: 'https://world.openpetfoodfacts.org' },
  { name: 'Open Products Facts', baseUrl: 'https://world.openproductsfacts.org' }
];

const UPCITEMDB_TRIAL_URL = 'https://api.upcitemdb.com/prod/trial/lookup';

let productsDB = [];
let searchHistory = [];
let currentInspectedProduct = null;

/**
 * ============================================================================
 * 2. INITIALIZATION & STORAGE HELPERS
 * ============================================================================
 */
function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Storage read error for ${key}:`, err);
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`Storage write error for ${key} (quota/privacy mode):`, err);
    return false;
  }
}

function saveProductsToStorage() {
  writeStorage(STORAGE_KEY_PRODUCTS, productsDB);
  updateBadges();
}

function saveHistoryToStorage() {
  writeStorage(STORAGE_KEY_HISTORY, searchHistory);
  updateBadges();
}

function updateBadges() {
  const dbBadge = document.getElementById('db-count-badge');
  const histBadge = document.getElementById('history-count-badge');
  if (dbBadge) dbBadge.textContent = productsDB.length;
  if (histBadge) histBadge.textContent = searchHistory.length;
}

function initApp() {
  const savedProducts = readStorage(STORAGE_KEY_PRODUCTS, null);
  if (Array.isArray(savedProducts) && savedProducts.length > 0) {
    productsDB = savedProducts;
  } else {
    productsDB = [...DEFAULT_PRODUCTS];
    saveProductsToStorage();
  }

  const savedHistory = readStorage(STORAGE_KEY_HISTORY, []);
  searchHistory = Array.isArray(savedHistory) ? savedHistory : [];

  // Show/hide clear button on search box
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search-btn');
  if (searchInput && clearBtn) {
    searchInput.addEventListener('input', () => {
      clearBtn.classList.toggle('hidden', searchInput.value.trim().length === 0);
    });
  }

  updateBadges();
  renderSearchResults(productsDB.slice(0, 8), 'Featured & Popular Products', 'Showing built-in items');

  // Inspect the first product by default
  if (productsDB.length > 0) {
    inspectProduct(productsDB[0], false);
  }

  renderDatabaseTable();
  renderHistoryList();
}

/**
 * ============================================================================
 * 3. NAVIGATION TABS & TOAST NOTIFICATIONS
 * ============================================================================
 */
function switchTab(tabName) {
  const views = ['search', 'database', 'history', 'importexport'];
  views.forEach((name) => {
    const viewEl = document.getElementById(`view-${name}`);
    const btnEl = document.getElementById(`tab-btn-${name}`);

    if (viewEl) viewEl.classList.toggle('hidden', name !== tabName);
    if (btnEl) {
      if (name === tabName) {
        btnEl.className = 'tab-btn px-3.5 py-2 rounded-lg text-sm font-semibold bg-white text-indigo-600 shadow-sm transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer';
      } else {
        btnEl.className = 'tab-btn px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer';
      }
    }
  });

  if (tabName === 'database') renderDatabaseTable();
  if (tabName === 'history') renderHistoryList();
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const styles = {
    success: 'bg-emerald-900 text-emerald-50 border-emerald-700',
    error: 'bg-rose-900 text-rose-50 border-rose-700',
    info: 'bg-slate-900 text-white border-slate-700'
  };

  const toast = document.createElement('div');
  toast.className = `toast-item border rounded-xl px-4 py-3 shadow-lg text-xs sm:text-sm font-medium ${styles[type] || styles.info}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

/**
 * ============================================================================
 * 4. IMAGE RENDERING HELPERS (WITH SAFE FALLBACK)
 * ============================================================================
 */
function renderThumbnailInto(container, imageUrl, altText) {
  if (!container) return;
  container.innerHTML = '';

  const fallbackEl = document.createElement('span');
  fallbackEl.className = 'product-thumb-placeholder';
  fallbackEl.textContent = 'No Photo';

  if (!imageUrl) {
    container.appendChild(fallbackEl);
    return;
  }

  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = altText || 'Product image';
  img.className = 'product-thumb-img';
  img.loading = 'lazy';

  img.addEventListener('error', () => {
    container.innerHTML = '';
    container.appendChild(fallbackEl);
  });

  container.appendChild(img);
}

/**
 * ============================================================================
 * 5. SEARCH ENGINE: LOCAL CATALOG + MULTI-API GLOBAL FALLBACK
 * ============================================================================
 */
function isDigitsOnlyBarcode(query) {
  return /^\d{8,14}$/.test(query.trim());
}

function clearSearchInput() {
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search-btn');
  if (input) input.value = '';
  if (clearBtn) clearBtn.classList.add('hidden');
  renderSearchResults(productsDB.slice(0, 8), 'Featured & Popular Products', 'Showing built-in items');
}

function quickSearch(term) {
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search-btn');
  if (input) {
    input.value = term;
    if (clearBtn) clearBtn.classList.remove('hidden');
  }
  searchBarcode();
}

function searchLocalCatalog(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return productsDB.filter((item) => {
    const nameMatch = (item.name || '').toLowerCase().includes(q);
    const brandMatch = (item.brand || '').toLowerCase().includes(q);
    const codeMatch = (item.barcode || '').toLowerCase().includes(q);
    const catMatch = (item.category || '').toLowerCase().includes(q);
    return nameMatch || brandMatch || codeMatch || catMatch;
  });
}

function normalizeOpenFactsProduct(raw, sourceName) {
  if (!raw || typeof raw !== 'object') return null;

  const barcode = String(raw.code || raw._id || '').replace(/\D/g, '').trim();
  const name = (
    raw.product_name_en ||
    raw.product_name ||
    raw.generic_name ||
    ''
  ).trim();

  if (!name && !barcode) return null;

  // Extract best available image URL from Open*Facts fields
  const imageUrl = (
    raw.image_front_small_url ||
    raw.image_front_url ||
    raw.image_small_url ||
    raw.image_url ||
    ''
  ).trim();

  const brand = (raw.brands || '').split(',')[0].trim() || 'Global Brand';
  const category = (raw.categories || '').split(',')[0].trim() || 'General Grocery';
  const size = (raw.quantity || '').trim() || 'Standard Pack';

  return {
    id: `api-${sourceName.toLowerCase().replace(/\s+/g, '-')}-${barcode || Math.random().toString(36).slice(2, 8)}`,
    name: name || `Product (${barcode})`,
    brand,
    category,
    size,
    barcode: barcode || '0000000000000',
    imageUrl,
    source: sourceName
  };
}

async function fetchFromOpenFactsSources(query) {
  const isCode = isDigitsOnlyBarcode(query);
  const collected = [];

  for (const src of OPEN_FACTS_SOURCES) {
    try {
      const endpoint = isCode
        ? `${src.baseUrl}/api/v2/product/${encodeURIComponent(query.trim())}.json`
        : `${src.baseUrl}/cgi/search.pl?search_terms=${encodeURIComponent(query.trim())}&search_simple=1&action=process&json=1&page_size=8`;

      const response = await fetch(endpoint, {
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) continue;
      const data = await response.json();

      if (isCode) {
        if (data.status === 1 && data.product) {
          const item = normalizeOpenFactsProduct(data.product, src.name);
          if (item) collected.push(item);
        }
      } else if (Array.isArray(data.products)) {
        for (const rawItem of data.products) {
          const item = normalizeOpenFactsProduct(rawItem, src.name);
          if (item) collected.push(item);
        }
      }

      if (collected.length >= 8) break;
    } catch (err) {
      console.warn(`Lookup warning (${src.name}):`, err);
    }
  }

  return collected;
}

async function fetchFromUpcItemDb(query) {
  if (!isDigitsOnlyBarcode(query)) return [];

  try {
    const url = `${UPCITEMDB_TRIAL_URL}?upc=${encodeURIComponent(query.trim())}`;
    const response = await fetch(url, {
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data.items)) return [];

    return data.items.map((item, idx) => ({
      id: `upcitemdb-${query.trim()}-${idx}`,
      name: (item.title || `Product (${query.trim()})`).trim(),
      brand: (item.brand || 'Global Brand').trim(),
      category: (item.category || 'General Retail').trim(),
      size: (item.size || item.weight || 'Standard Pack').trim(),
      barcode: String(item.upc || item.ean || query.trim()).replace(/\D/g, '') || query.trim(),
      imageUrl: Array.isArray(item.images) && item.images.length > 0 ? String(item.images[0]).trim() : '',
      source: 'UPCitemdb'
    }));
  } catch (err) {
    console.warn('UPCitemdb lookup warning:', err);
    return [];
  }
}

function mergeUniqueProducts(lists) {
  const seen = new Set();
  const merged = [];

  for (const list of lists) {
    for (const item of list) {
      const key = `${(item.barcode || '').trim()}|${(item.name || '').trim().toLowerCase().slice(0, 32)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
  }

  return merged;
}

async function searchBarcode() {
  const input = document.getElementById('search-input');
  const liveToggle = document.getElementById('live-api-toggle');
  const loadingEl = document.getElementById('search-loading');

  const query = input ? input.value.trim() : '';
  if (!query) {
    showToast('Please enter a product name or barcode first.', 'error');
    if (input) input.focus();
    return;
  }

  const localMatches = searchLocalCatalog(query);
  let apiMatches = [];

  const useLiveApi = liveToggle ? liveToggle.checked : true;
  const cache = readStorage(STORAGE_KEY_API_CACHE, {});
  const cacheKey = query.toLowerCase();

  if (useLiveApi) {
    if (Array.isArray(cache[cacheKey]) && cache[cacheKey].length > 0) {
      apiMatches = cache[cacheKey];
    } else {
      if (loadingEl) loadingEl.classList.remove('hidden');
      const openFactsHits = await fetchFromOpenFactsSources(query);
      const upcHits = openFactsHits.length === 0 ? await fetchFromUpcItemDb(query) : [];
      apiMatches = [...openFactsHits, ...upcHits];

      if (apiMatches.length > 0) {
        cache[cacheKey] = apiMatches;
        writeStorage(STORAGE_KEY_API_CACHE, cache);
      }
      if (loadingEl) loadingEl.classList.add('hidden');
    }
  }

  const combined = mergeUniqueProducts([localMatches, apiMatches]);

  // If user typed a barcode number not found in any API, still let them preview/generate it
  if (combined.length === 0 && isDigitsOnlyBarcode(query)) {
    const customCodeItem = {
      id: `custom-code-${query}`,
      name: `Barcode ${query}`,
      brand: 'Custom / Unlisted',
      category: 'General Grocery',
      size: 'Standard Pack',
      barcode: query,
      imageUrl: '',
      source: 'Custom Code'
    };
    combined.push(customCodeItem);
  }

  renderSearchResults(
    combined,
    `Results for "${query}"`,
    `${localMatches.length} local • ${apiMatches.length} global API`
  );

  if (combined.length > 0) {
    inspectProduct(combined[0], true);
  } else {
    showToast(`No products found for "${query}". You can add it in Product Database.`, 'info');
  }
}

function renderSearchResults(items, headingText, metaText) {
  const headingEl = document.getElementById('results-heading');
  const metaEl = document.getElementById('results-meta');
  const listEl = document.getElementById('search-results-list');

  if (headingEl) headingEl.textContent = headingText;
  if (metaEl) metaEl.textContent = metaText;
  if (!listEl) return;

  listEl.innerHTML = '';

  if (!items || items.length === 0) {
    listEl.innerHTML = `
      <div class="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
        <p class="text-sm font-semibold text-slate-700">No matching products found.</p>
        <p class="text-xs text-slate-500 mt-1">Try another keyword, enable Live Global API Fallback, or add the product under Product Database.</p>
      </div>
    `;
    return;
  }

  items.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 p-4 shadow-sm transition flex items-center gap-4 cursor-pointer';
    card.addEventListener('click', () => inspectProduct(product, true));

    // 1. Product image right alongside barcode & details
    const thumbBox = document.createElement('div');
    thumbBox.className = 'product-thumb-box';
    renderThumbnailInto(thumbBox, product.imageUrl, product.name);

    // 2. Details & barcode badge
    const body = document.createElement('div');
    body.className = 'min-w-0 flex-1';

    const topMeta = document.createElement('div');
    topMeta.className = 'flex items-center justify-between gap-2 mb-0.5';
    topMeta.innerHTML = `
      <span class="text-xs font-semibold text-indigo-600 truncate">${escapeHtml(product.brand || 'Brand')}</span>
      <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 shrink-0">${escapeHtml(product.source || 'Catalog')}</span>
    `;

    const title = document.createElement('h4');
    title.className = 'text-sm sm:text-base font-bold text-slate-900 truncate';
    title.textContent = product.name;

    const bottomRow = document.createElement('div');
    bottomRow.className = 'mt-2 flex flex-wrap items-center justify-between gap-2';

    const codeBadge = document.createElement('span');
    codeBadge.className = 'font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200';
    codeBadge.textContent = `UPC/EAN: ${product.barcode}`;

    const sizeText = document.createElement('span');
    sizeText.className = 'text-xs text-slate-500';
    sizeText.textContent = product.size || '';

    bottomRow.appendChild(codeBadge);
    bottomRow.appendChild(sizeText);

    body.appendChild(topMeta);
    body.appendChild(title);
    body.appendChild(bottomRow);

    card.appendChild(thumbBox);
    card.appendChild(body);
    listEl.appendChild(card);
  });
}

/**
 * ============================================================================
 * 6. BARCODE INSPECTOR, RENDERING (JsBarcode) & PNG DOWNLOAD
 * ============================================================================
 */
function inspectProduct(product, recordHistory = true) {
  if (!product) return;
  currentInspectedProduct = product;

  document.getElementById('inspector-brand').textContent = product.brand || 'Unknown Brand';
  document.getElementById('inspector-category').textContent = product.category || 'Grocery';
  document.getElementById('inspector-name').textContent = product.name || 'Unnamed Product';
  document.getElementById('inspector-size').textContent = `Pack Size: ${product.size || 'N/A'} | Source: ${product.source || 'Catalog'}`;
  document.getElementById('inspector-code').textContent = product.barcode || '0000000000000';
  document.getElementById('inspector-source-badge').textContent = product.source || 'Catalog';

  const thumbWrap = document.getElementById('inspector-thumb-wrap');
  renderThumbnailInto(thumbWrap, product.imageUrl, product.name);

  renderBarcodeSvg(product.barcode);

  if (recordHistory) {
    addToHistory(product);
  }
}

function renderBarcodeSvg(rawCode) {
  const svgEl = document.getElementById('barcode-svg');
  const errEl = document.getElementById('barcode-error-msg');
  if (!svgEl || typeof JsBarcode === 'undefined') return;

  const digitsOnly = String(rawCode || '').replace(/\D/g, '');
  if (errEl) {
    errEl.classList.add('hidden');
    errEl.textContent = '';
  }

  try {
    // Choose standard barcode format based on digit length, falling back to CODE128
    let format = 'CODE128';
    let valueToEncode = String(rawCode || '').trim() || '8901058851298';

    if (digitsOnly.length === 13 && validateEAN13(digitsOnly)) {
      format = 'EAN13';
      valueToEncode = digitsOnly;
    } else if (digitsOnly.length === 12 && validateUPCA(digitsOnly)) {
      format = 'UPC';
      valueToEncode = digitsOnly;
    } else if (digitsOnly.length >= 4) {
      format = 'CODE128';
      valueToEncode = digitsOnly;
    }

    JsBarcode(svgEl, valueToEncode, {
      format,
      lineColor: '#0f172a',
      width: 2,
      height: 72,
      displayValue: true,
      font: 'JetBrains Mono',
      fontSize: 14,
      margin: 8
    });
  } catch (err) {
    try {
      JsBarcode(svgEl, String(rawCode || '00000000').trim() || '00000000', {
        format: 'CODE128',
        lineColor: '#0f172a',
        width: 2,
        height: 68,
        displayValue: true,
        margin: 8
      });
    } catch (innerErr) {
      if (errEl) {
        errEl.textContent = 'Could not render barcode for this value.';
        errEl.classList.remove('hidden');
      }
    }
  }
}

function validateEAN13(code) {
  if (!/^\d{13}$/.test(code)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = Number(code[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === Number(code[12]);
}

function validateUPCA(code) {
  if (!/^\d{12}$/.test(code)) return false;
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    const digit = Number(code[i]);
    sum += i % 2 === 0 ? digit * 3 : digit;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === Number(code[11]);
}

function generateValidEAN13(prefix = '890') {
  const cleanPrefix = prefix.replace(/\D/g, '').slice(0, 3).padEnd(3, '0');
  let body = cleanPrefix;
  for (let i = 0; i < 9; i++) {
    body += Math.floor(Math.random() * 10);
  }
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = Number(body[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return body + String(checkDigit);
}

function fillGeneratedEAN13() {
  const input = document.getElementById('prod-barcode');
  if (input) {
    input.value = generateValidEAN13('890');
    showToast('Generated a valid Indian GS1 (890) EAN-13 barcode.', 'info');
  }
}

function copyCurrentBarcode() {
  const code = currentInspectedProduct?.barcode || document.getElementById('inspector-code')?.textContent?.trim();
  if (!code) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code)
      .then(() => showToast(`Copied barcode ${code} to clipboard!`, 'success'))
      .catch(() => fallbackCopyText(code));
  } else {
    fallbackCopyText(code);
  }
}

function fallbackCopyText(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showToast(`Copied barcode ${text} to clipboard!`, 'success');
}

function downloadBarcodePNG() {
  const svgEl = document.getElementById('barcode-svg');
  const canvas = document.getElementById('export-canvas');
  if (!svgEl || !canvas) return;

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgEl);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    canvas.width = img.width || 360;
    canvas.height = img.height || 150;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const pngUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const codeName = currentInspectedProduct?.barcode || 'barcode';
    link.download = `barcode-${codeName}.png`;
    link.href = pngUrl;
    link.click();

    URL.revokeObjectURL(url);
    showToast(`Downloaded barcode-${codeName}.png`, 'success');
  };
  img.src = url;
}

function saveInspectedToDatabase() {
  if (!currentInspectedProduct) return;

  const exists = productsDB.some((p) => p.barcode === currentInspectedProduct.barcode);
  if (exists) {
    showToast(`Barcode ${currentInspectedProduct.barcode} is already in your Product Database.`, 'info');
    return;
  }

  const newEntry = {
    ...currentInspectedProduct,
    id: `custom-${Date.now()}`,
    source: 'Saved by User'
  };

  productsDB.unshift(newEntry);
  saveProductsToStorage();
  renderDatabaseTable();
  showToast(`Saved "${newEntry.name}" to your Product Database!`, 'success');
}

/**
 * ============================================================================
 * 7. PRODUCT DATABASE CRUD (ADD / EDIT / DELETE / RESET)
 * ============================================================================
 */
function handleSaveProduct() {
  const editId = document.getElementById('edit-product-id').value.trim();
  const name = document.getElementById('prod-name').value.trim();
  const brand = document.getElementById('prod-brand').value.trim();
  const size = document.getElementById('prod-size').value.trim() || 'Standard Pack';
  const category = document.getElementById('prod-category').value;
  const barcode = document.getElementById('prod-barcode').value.trim();
  const imageUrl = document.getElementById('prod-image').value.trim();

  if (!name || !brand || !barcode) {
    showToast('Please fill out Product Name, Brand, and Barcode.', 'error');
    return;
  }

  if (editId) {
    const idx = productsDB.findIndex((p) => p.id === editId);
    if (idx !== -1) {
      productsDB[idx] = {
        ...productsDB[idx],
        name,
        brand,
        size,
        category,
        barcode,
        imageUrl
      };
      showToast(`Updated "${name}".`, 'success');
    }
  } else {
    const newProduct = {
      id: `prod-${Date.now()}`,
      name,
      brand,
      size,
      category,
      barcode,
      imageUrl,
      source: 'Custom DB'
    };
    productsDB.unshift(newProduct);
    showToast(`Added "${name}" to database.`, 'success');
  }

  saveProductsToStorage();
  resetProductForm();
  renderDatabaseTable();
}

function startEditProduct(productId) {
  const item = productsDB.find((p) => p.id === productId);
  if (!item) return;

  document.getElementById('edit-product-id').value = item.id;
  document.getElementById('prod-name').value = item.name || '';
  document.getElementById('prod-brand').value = item.brand || '';
  document.getElementById('prod-size').value = item.size || '';
  document.getElementById('prod-category').value = item.category || 'General Grocery';
  document.getElementById('prod-barcode').value = item.barcode || '';
  document.getElementById('prod-image').value = item.imageUrl || '';

  document.getElementById('form-title').textContent = 'Edit Product';
  document.getElementById('submit-product-btn').textContent = 'Update Product';
  document.getElementById('cancel-edit-btn').classList.remove('hidden');
}

function resetProductForm() {
  document.getElementById('product-form').reset();
  document.getElementById('edit-product-id').value = '';
  document.getElementById('form-title').textContent = 'Add New Product';
  document.getElementById('submit-product-btn').textContent = 'Save Product to Database';
  document.getElementById('cancel-edit-btn').classList.add('hidden');
}

function deleteProduct(productId) {
  productsDB = productsDB.filter((p) => p.id !== productId);
  saveProductsToStorage();
  renderDatabaseTable();
  showToast('Product removed from database.', 'info');
}

function resetToDefaultDatabase() {
  productsDB = [...DEFAULT_PRODUCTS];
  saveProductsToStorage();
  resetProductForm();
  renderDatabaseTable();
  showToast('Restored built-in default product catalog.', 'success');
}

function renderDatabaseTable() {
  const tbody = document.getElementById('database-table-body');
  const filterVal = (document.getElementById('db-filter-input')?.value || '').trim().toLowerCase();
  if (!tbody) return;

  const filtered = productsDB.filter((p) => {
    if (!filterVal) return true;
    return (
      (p.name || '').toLowerCase().includes(filterVal) ||
      (p.brand || '').toLowerCase().includes(filterVal) ||
      (p.barcode || '').toLowerCase().includes(filterVal) ||
      (p.category || '').toLowerCase().includes(filterVal)
    );
  });

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="py-8 px-4 text-center text-slate-500 text-xs">No matching items in your catalog.</td>
      </tr>
    `;
    return;
  }

  filtered.forEach((item) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';

    // Product cell with image + name + brand
    const prodTd = document.createElement('td');
    prodTd.className = 'py-3 px-4';

    const flexWrap = document.createElement('div');
    flexWrap.className = 'flex items-center gap-3';

    const thumbBox = document.createElement('div');
    thumbBox.className = 'product-thumb-box';
    thumbBox.style.width = '44px';
    thumbBox.style.height = '44px';
    renderThumbnailInto(thumbBox, item.imageUrl, item.name);

    const textCol = document.createElement('div');
    textCol.innerHTML = `
      <div class="font-semibold text-slate-900">${escapeHtml(item.name)}</div>
      <div class="text-xs text-slate-500">${escapeHtml(item.brand)} • ${escapeHtml(item.size || '')}</div>
    `;

    flexWrap.appendChild(thumbBox);
    flexWrap.appendChild(textCol);
    prodTd.appendChild(flexWrap);

    // Category cell
    const catTd = document.createElement('td');
    catTd.className = 'py-3 px-4 text-xs text-slate-600';
    catTd.textContent = item.category || 'General Grocery';

    // Barcode cell
    const codeTd = document.createElement('td');
    codeTd.className = 'py-3 px-4 font-mono text-xs font-bold text-indigo-700';
    codeTd.textContent = item.barcode;

    // Actions cell
    const actTd = document.createElement('td');
    actTd.className = 'py-3 px-4 text-right whitespace-nowrap space-x-1.5';

    const inspectBtn = document.createElement('button');
    inspectBtn.type = 'button';
    inspectBtn.className = 'px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold cursor-pointer';
    inspectBtn.textContent = 'Inspect';
    inspectBtn.addEventListener('click', () => {
      switchTab('search');
      inspectProduct(item, true);
    });

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => startEditProduct(item.id));

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold cursor-pointer';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deleteProduct(item.id));

    actTd.appendChild(inspectBtn);
    actTd.appendChild(editBtn);
    actTd.appendChild(delBtn);

    tr.appendChild(prodTd);
    tr.appendChild(catTd);
    tr.appendChild(codeTd);
    tr.appendChild(actTd);
    tbody.appendChild(tr);
  });
}

/**
 * ============================================================================
 * 8. HISTORY MANAGEMENT
 * ============================================================================
 */
function addToHistory(product) {
  const entry = {
    ...product,
    viewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  searchHistory = [
    entry,
    ...searchHistory.filter((h) => h.barcode !== product.barcode || h.name !== product.name)
  ].slice(0, 24);

  saveHistoryToStorage();
  renderHistoryList();
}

function clearHistory() {
  searchHistory = [];
  saveHistoryToStorage();
  renderHistoryList();
  showToast('Cleared lookup history.', 'info');
}

function renderHistoryList() {
  const listEl = document.getElementById('history-list');
  if (!listEl) return;

  listEl.innerHTML = '';

  if (searchHistory.length === 0) {
    listEl.innerHTML = `
      <div class="col-span-full text-center py-8 text-xs text-slate-500">
        No history items yet. Search or click any product to record it here.
      </div>
    `;
    return;
  }

  searchHistory.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'rounded-xl border border-slate-200 hover:border-indigo-400 p-3.5 bg-slate-50/60 flex items-center gap-3 cursor-pointer transition';
    card.addEventListener('click', () => {
      switchTab('search');
      inspectProduct(item, false);
    });

    const thumb = document.createElement('div');
    thumb.className = 'product-thumb-box';
    thumb.style.width = '48px';
    thumb.style.height = '48px';
    renderThumbnailInto(thumb, item.imageUrl, item.name);

    const info = document.createElement('div');
    info.className = 'min-w-0 flex-1';
    info.innerHTML = `
      <div class="text-sm font-bold text-slate-900 truncate">${escapeHtml(item.name)}</div>
      <div class="font-mono text-xs text-indigo-700 font-semibold">${escapeHtml(item.barcode)}</div>
      <div class="text-[11px] text-slate-400">${escapeHtml(item.source || 'Catalog')} • ${escapeHtml(item.viewedAt || '')}</div>
    `;

    card.appendChild(thumb);
    card.appendChild(info);
    listEl.appendChild(card);
  });
}

/**
 * ============================================================================
 * 9. IMPORT & EXPORT (JSON & CSV)
 * ============================================================================
 */
function exportDatabaseJSON() {
  const payload = {
    owner: 'Kapil Madhav Raghmode',
    exportedAt: new Date().toISOString(),
    count: productsDB.length,
    products: productsDB
  };
  triggerFileDownload('barcode-products-backup.json', JSON.stringify(payload, null, 2), 'application/json');
  showToast('Exported JSON backup.', 'success');
}

function exportDatabaseCSV() {
  const headers = ['name', 'brand', 'category', 'size', 'barcode', 'imageUrl', 'source'];
  const rows = [headers.join(',')];

  for (const p of productsDB) {
    const row = headers.map((col) => `"${String(p[col] || '').replace(/"/g, '""')}"`);
    rows.push(row.join(','));
  }

  triggerFileDownload('barcode-products.csv', rows.join('\n'), 'text/csv;charset=utf-8;');
  showToast('Exported CSV file.', 'success');
}

function triggerFileDownload(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function handleFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const textarea = document.getElementById('bulk-import-textarea');
    if (textarea) textarea.value = String(e.target.result || '');
    showToast(`Loaded "${file.name}" into import box.`, 'info');
  };
  reader.readAsText(file);
}

function processBulkImport() {
  const textarea = document.getElementById('bulk-import-textarea');
  const raw = (textarea?.value || '').trim();
  if (!raw) {
    showToast('Paste JSON or CSV data before importing.', 'error');
    return;
  }

  let importedItems = [];

  try {
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed.products) ? parsed.products : [];
    importedItems = list.map((obj, idx) => ({
      id: `imp-json-${Date.now()}-${idx}`,
      name: String(obj.name || '').trim(),
      brand: String(obj.brand || 'Imported Brand').trim(),
      category: String(obj.category || 'General Grocery').trim(),
      size: String(obj.size || 'Standard Pack').trim(),
      barcode: String(obj.barcode || '').trim(),
      imageUrl: String(obj.imageUrl || obj.image || '').trim(),
      source: 'Imported JSON'
    }));
  } catch {
    // Parse as CSV lines: name,brand,category,size,barcode,imageUrl
    const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
    lines.forEach((line, idx) => {
      const parts = line.split(',').map((s) => s.replace(/^"|"$/g, '').trim());
      if (parts.length >= 2 && parts[0].toLowerCase() !== 'name') {
        importedItems.push({
          id: `imp-csv-${Date.now()}-${idx}`,
          name: parts[0],
          brand: parts[1] || 'Imported Brand',
          category: parts[2] || 'General Grocery',
          size: parts[3] || 'Standard Pack',
          barcode: parts[4] || generateValidEAN13('890'),
          imageUrl: parts[5] || '',
          source: 'Imported CSV'
        });
      }
    });
  }

  const validItems = importedItems.filter((item) => item.name && item.barcode);
  if (validItems.length === 0) {
    showToast('No valid products found. Ensure each item has a name and barcode.', 'error');
    return;
  }

  productsDB = mergeUniqueProducts([validItems, productsDB]);
  saveProductsToStorage();
  renderDatabaseTable();
  if (textarea) textarea.value = '';
  showToast(`Imported ${validItems.length} product(s) successfully!`, 'success');
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"');
}

// Boot application when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
