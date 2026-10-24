const DEFAULT_SYMBOLS = ["BINANCE:BTCUSDT.P", "BINANCE:ETHUSDT.P", "OANDA:NAS100USD"];
const ADD_CHART_SYMBOLS = [
  ...DEFAULT_SYMBOLS,
  "BINANCE:SOLUSDT.P",
  "BINANCE:XRPUSDT.P",
  "BINANCE:BNBUSDT.P",
  "BINANCE:DOGEUSDT.P",
  "BINANCE:ADAUSDT.P",
  "BINANCE:LINKUSDT.P",
];
const LEGACY_DEFAULT_SYMBOLS = ["GATEIO:ETHUSDT.P", "BYBIT:ETHUSDT.P"];
const DEFAULT_INDICATORS = ["pivot"];
const DEFAULT_INTERVAL = "60";
const STORE_KEY = "coinScope.profile.v2";
const LEGACY_STORE_KEYS = ["pivotMultiCharts.profile.v1"];
const MAX_SYMBOLS = 9;
const SYMBOL_SEARCH_LIMIT = 80;
const CHART_QUICK_SEARCH_LIMIT = 8;
const SYMBOL_SEARCH_DEBOUNCE_MS = 220;
const SYMBOL_ACTION_PREFIX = "symbol-action:";
const SYMBOL_CACHE_GLOBAL = "COIN_SCOPE_SYMBOL_CACHE";
const TRADINGVIEW_SEARCH_TYPES = ["", "stock", "fund", "futures", "forex", "crypto", "index", "indices", "cfd", "economic"];
const QUOTES = ["USDT", "USDC", "USD", "BTC", "ETH"];
const INDICATORS = [
  { id: "pivot", label: "Pivot HL", study: "PivotPointsHighLow@tv-basicstudies" },
  { id: "volume", label: "Volume", study: "Volume@tv-basicstudies" },
  { id: "ma", label: "MA", study: "MASimple@tv-basicstudies" },
  { id: "ema", label: "EMA", study: "MAExp@tv-basicstudies" },
  { id: "bb", label: "Bollinger", study: "BB@tv-basicstudies" },
  { id: "rsi", label: "RSI", study: "RSI@tv-basicstudies" },
  { id: "macd", label: "MACD", study: "MACD@tv-basicstudies" },
];
const INTERVALS = [
  { value: "1", label: "1m" },
  { value: "5", label: "5m" },
  { value: "15", label: "15m" },
  { value: "60", label: "1h" },
  { value: "240", label: "4h" },
  { value: "D", label: "1D" },
];
const SEARCH_EXCHANGES = [
  { id: "GATEIO", label: "Gate.io" },
  { id: "BYBIT", label: "Bybit" },
  { id: "BINANCE", label: "Binance" },
  { id: "OKX", label: "OKX" },
  { id: "BITGET", label: "Bitget" },
  { id: "MEXC", label: "MEXC" },
  { id: "KUCOIN", label: "KuCoin" },
];
const LOCAL_MARKETS = [
  ["BTC", "Bitcoin"],
  ["ETH", "Ethereum"],
  ["SOL", "Solana"],
  ["XRP", "XRP"],
  ["BNB", "BNB"],
  ["DOGE", "Dogecoin"],
  ["ADA", "Cardano"],
  ["AVAX", "Avalanche"],
  ["LINK", "Chainlink"],
  ["SUI", "Sui"],
  ["TRX", "TRON"],
  ["DOT", "Polkadot"],
  ["LTC", "Litecoin"],
  ["BCH", "Bitcoin Cash"],
  ["TON", "Toncoin"],
  ["UNI", "Uniswap"],
  ["APT", "Aptos"],
  ["NEAR", "NEAR Protocol"],
  ["ARB", "Arbitrum"],
  ["OP", "Optimism"],
  ["AAVE", "Aave"],
  ["ENA", "Ethena"],
  ["WIF", "dogwifhat"],
  ["PEPE", "Pepe"],
  ["SHIB", "Shiba Inu"],
  ["FET", "Fetch.ai"],
  ["INJ", "Injective"],
  ["SEI", "Sei"],
  ["TIA", "Celestia"],
  ["FIL", "Filecoin"],
  ["ETC", "Ethereum Classic"],
  ["ATOM", "Cosmos"],
  ["ICP", "Internet Computer"],
  ["JUP", "Jupiter"],
  ["RUNE", "THORChain"],
  ["MKR", "Maker"],
  ["WLD", "Worldcoin"],
  ["ORDI", "Ordinals"],
  ["GALA", "Gala"],
  ["SAND", "The Sandbox"],
  ["MANA", "Decentraland"],
  ["AXS", "Axie Infinity"],
  ["CRV", "Curve"],
  ["LDO", "Lido DAO"],
  ["PENDLE", "Pendle"],
  ["ONDO", "Ondo"],
  ["STRK", "Starknet"],
  ["PYTH", "Pyth Network"],
  ["JTO", "Jito"],
  ["JASMY", "JasmyCoin"],
  ["NOT", "Notcoin"],
  ["BONK", "Bonk"],
  ["FLOKI", "FLOKI"],
  ["RENDER", "Render"],
  ["TAO", "Bittensor"],
  ["XLM", "Stellar"],
  ["HBAR", "Hedera"],
  ["KAS", "Kaspa"],
  ["ALGO", "Algorand"],
  ["VET", "VeChain"],
  ["IMX", "Immutable"],
  ["STX", "Stacks"],
  ["FTM", "Fantom"],
  ["DYDX", "dYdX"],
  ["BLUR", "Blur"],
  ["GMT", "STEPN"],
  ["APE", "ApeCoin"],
  ["CFX", "Conflux"],
  ["AR", "Arweave"],
  ["EGLD", "MultiversX"],
];
const LOCAL_SYMBOLS = [
  {
    symbol: "OANDA:NAS100USD",
    title: "NAS100USD",
    subtitle: "US Nasdaq 100 CFD",
    exchangeLabel: "OANDA",
    typeLabel: "지수",
    aliases: ["NAS100", "NAS100USD", "US100", "NDX", "NASDAQ100"],
  },
  {
    symbol: "OANDA:SPX500USD",
    title: "SPX500USD",
    subtitle: "US S&P 500 CFD",
    exchangeLabel: "OANDA",
    typeLabel: "지수",
    aliases: ["SPX500", "SPX500USD", "SP500", "US500", "S&P500"],
  },
  {
    symbol: "OANDA:US30USD",
    title: "US30USD",
    subtitle: "US Wall Street 30 CFD",
    exchangeLabel: "OANDA",
    typeLabel: "지수",
    aliases: ["US30", "US30USD", "DJI", "DOW", "DOWJONES"],
  },
  {
    symbol: "OANDA:XAUUSD",
    title: "XAUUSD",
    subtitle: "Gold Spot / US Dollar",
    exchangeLabel: "OANDA",
    typeLabel: "금속",
    aliases: ["XAU", "XAUUSD", "GOLD"],
  },
  {
    symbol: "OANDA:XAGUSD",
    title: "XAGUSD",
    subtitle: "Silver Spot / US Dollar",
    exchangeLabel: "OANDA",
    typeLabel: "금속",
    aliases: ["XAG", "XAGUSD", "SILVER"],
  },
];

const state = {
  symbols: DEFAULT_SYMBOLS,
  interval: DEFAULT_INTERVAL,
  intervals: {},
  layout: "auto",
  horizontal: false,
  activeChartSymbol: DEFAULT_SYMBOLS[0],
  indicators: DEFAULT_INDICATORS,
  searchExchange: "ALL",
};
let localApiAvailable = null;
let symbolSearchRunId = 0;
let symbolSearchStatus = "idle";
let symbolSearchTimer = null;
let symbolSearchController = null;
let chartQuickSearchTimer = null;
let cachedSymbolResults = [];
let symbolCacheAvailable = false;

const els = {
  form: document.querySelector("#chartForm"),
  symbolInput: document.querySelector("#symbolInput"),
  symbolSelect: document.querySelector("#symbolSelect"),
  openSearch: document.querySelector("#openSearchButton"),
  chartSummary: document.querySelector("#chartSummary"),
  searchPanel: document.querySelector("#symbolSearchPanel"),
  closeSearch: document.querySelector("#closeSearchButton"),
  addChart: document.querySelector("#addChartButton"),
  searchInput: document.querySelector("#symbolSearchInput"),
  searchResults: document.querySelector("#symbolResults"),
  chartManagerList: document.querySelector("#chartManagerList"),
  chartCountText: document.querySelector("#chartCountText"),
  exchangeFilter: document.querySelector(".exchange-filter"),
  interval: document.querySelector("#intervalSelect"),
  horizontalToggle: document.querySelector("#horizontalToggle"),
  openIndicator: document.querySelector("#openIndicatorButton"),
  indicatorSummary: document.querySelector("#indicatorSummary"),
  indicatorPanel: document.querySelector("#indicatorPanel"),
  closeIndicator: document.querySelector("#closeIndicatorButton"),
  indicatorOptions: document.querySelector("#indicatorOptions"),
  grid: document.querySelector("#chartGrid"),
  sidebarList: document.querySelector("#sidebarChartList"),
  sidebarAdd: document.querySelector("#sidebarAddChart"),
  workspaceCount: document.querySelector("#workspaceChartCount"),
  mobileChartTabs: document.querySelector("#mobileChartTabs"),
  mobileChartCounter: document.querySelector("#mobileChartCounter"),
  previousChart: document.querySelector("#previousChartButton"),
  nextChart: document.querySelector("#nextChartButton"),
  layoutButtons: document.querySelectorAll("[data-layout]"),
};
const mobileMedia = window.matchMedia("(max-width: 767px), (pointer: coarse) and (max-width: 1024px)");

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORE_KEY) || legacyProfileRaw();
    if (!raw) return;
    const profile = JSON.parse(raw);
    const symbols = normalizeSymbols(profile.symbols || DEFAULT_SYMBOLS);
    state.symbols = isLegacyDefaultSymbols(symbols) ? DEFAULT_SYMBOLS : symbols;
    state.interval = normalizeInterval(profile.interval || state.interval);
    state.intervals = normalizeChartIntervals(profile.intervals || {}, state.symbols, state.interval);
    state.layout = ["auto", "1", "2", "6"].includes(profile.layout) ? profile.layout : "auto";
    state.horizontal = profile.horizontal === true;
    state.indicators = normalizeIndicators(profile.indicators || DEFAULT_INDICATORS);
  } catch {
    state.symbols = DEFAULT_SYMBOLS;
    state.intervals = normalizeChartIntervals({}, state.symbols, state.interval);
  }
}

function legacyProfileRaw() {
  for (const key of LEGACY_STORE_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw) return raw;
  }
  return "";
}

function isLegacyDefaultSymbols(symbols) {
  return (
    symbols.length === LEGACY_DEFAULT_SYMBOLS.length &&
    symbols.every((symbol, index) => symbol === LEGACY_DEFAULT_SYMBOLS[index])
  );
}

function profileSnapshot() {
  return {
    symbols: state.symbols,
    interval: state.interval,
    intervals: cleanChartIntervals(),
    horizontal: state.horizontal,
    indicators: state.indicators,
    layout: state.layout,
  };
}

function persistProfile() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(profileSnapshot()));
  } catch {
    // Some private browsing or locked-down browser contexts can block local storage.
  }
}

function syncControls() {
  els.symbolInput.value = state.symbols.join(", ");
  els.interval.value = state.interval;
  els.horizontalToggle.checked = state.horizontal;
  renderSymbolSelect();
  renderChartManager();
  renderIndicatorOptions();
  syncIndicatorSummary();
  syncLayoutButtons();
}

function normalizeSymbols(value) {
  const list = Array.isArray(value) ? value : String(value).split(",");
  return list
    .map((symbol) => String(symbol).trim().toUpperCase())
    .filter(Boolean)
    .slice(0, MAX_SYMBOLS);
}

function normalizeIndicators(value) {
  const validIds = new Set(INDICATORS.map((indicator) => indicator.id));
  const list = Array.isArray(value) ? value : String(value).split(",");
  const unique = [];

  list.forEach((item) => {
    const id = String(item).trim();
    if (!validIds.has(id) || unique.includes(id)) return;
    unique.push(id);
  });

  return unique;
}

function normalizeInterval(value) {
  const normalized = String(value || "").trim();
  return INTERVALS.some((interval) => interval.value === normalized) ? normalized : DEFAULT_INTERVAL;
}

function normalizeChartIntervals(value, symbols = state.symbols, fallback = state.interval) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const intervals = {};
  symbols.forEach((symbol) => {
    intervals[symbol] = normalizeInterval(source[symbol] || fallback);
  });
  return intervals;
}

function cleanChartIntervals() {
  return normalizeChartIntervals(state.intervals, state.symbols, state.interval);
}

function intervalForSymbol(symbol) {
  return normalizeInterval(state.intervals[symbol] || state.interval);
}

function normalizeSearchText(value) {
  return String(value)
    .trim()
    .replace(/[\/_\-\s]/g, "")
    .toUpperCase();
}

function loadCachedSymbolResults() {
  const payload = window[SYMBOL_CACHE_GLOBAL];
  cachedSymbolResults = normalizeCachedSymbolResults(payload);
  symbolCacheAvailable = cachedSymbolResults.length > 0;
}

function normalizeCachedSymbolResults(payload) {
  const items = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : [];
  return mergeSymbolResults(items.map(normalizeCachedSymbolResult).filter(Boolean));
}

function normalizeCachedSymbolResult(item) {
  if (typeof item === "string") {
    const symbol = formatTradingViewSymbol(item, "");
    if (!symbol) return null;
    return {
      symbol,
      title: symbolDisplayName(symbol),
      subtitle: symbol,
      exchangeLabel: exchangeLabelFor(symbol.split(":")[0]),
      typeLabel: "저장 목록",
      aliases: [],
    };
  }

  if (!item || typeof item !== "object") return null;

  const symbol = formatTradingViewSymbol(item.symbol || item.full_name || item.pro_name || "", normalizeExchangeId(item.exchange || ""));
  if (!symbol) return null;

  const aliases = Array.isArray(item.aliases)
    ? item.aliases.map(cleanTradingViewText).filter(Boolean)
    : [];

  return {
    symbol,
    title: cleanTradingViewText(item.title || symbolDisplayName(symbol)),
    subtitle: cleanTradingViewText(item.subtitle || item.description || symbol),
    exchangeLabel: cleanTradingViewText(item.exchangeLabel || exchangeLabelFor(symbol.split(":")[0])),
    typeLabel: cleanTradingViewText(item.typeLabel || item.type || "저장 목록"),
    aliases,
  };
}

function renderSymbolSelect(preferredSymbol = els.symbolSelect.value) {
  if (!state.symbols.length) {
    els.symbolSelect.innerHTML = `<option value="">검색으로 심볼 추가</option>`;
    els.symbolSelect.value = "";
    delete els.symbolSelect.dataset.activeSymbol;
    return;
  }

  const activeSymbol = els.symbolSelect.dataset.activeSymbol;
  const selectedSymbol = state.symbols.includes(preferredSymbol)
    ? preferredSymbol
    : state.symbols.includes(activeSymbol)
      ? activeSymbol
      : state.symbols[0];
  const selectedIndex = state.symbols.indexOf(selectedSymbol);
  const actionOptions = [
    { id: "first", label: "맨 앞으로 보내기", disabled: selectedIndex === 0 },
    { id: "up", label: "한 칸 위로", disabled: selectedIndex === 0 },
    { id: "down", label: "한 칸 아래로", disabled: selectedIndex === state.symbols.length - 1 },
    { id: "last", label: "맨 뒤로 보내기", disabled: selectedIndex === state.symbols.length - 1 },
    { id: "remove", label: "차트 삭제", disabled: false },
  ];
  const symbolOptions = state.symbols
    .map((symbol, index) => `<option value="${escapeHtml(symbol)}">${index + 1}. ${escapeHtml(symbol)}</option>`)
    .join("");
  const controlOptions = actionOptions
    .map((action) => {
      const disabled = action.disabled ? "disabled" : "";
      return `<option value="${SYMBOL_ACTION_PREFIX}${action.id}" ${disabled}>${escapeHtml(action.label)}</option>`;
    })
    .join("");

  els.symbolSelect.innerHTML = `
    ${symbolOptions}
    <optgroup label="선택한 차트">
      ${controlOptions}
    </optgroup>
  `;
  els.symbolSelect.value = selectedSymbol;
  els.symbolSelect.dataset.activeSymbol = selectedSymbol;
}

function setSymbols(symbols, preferredSymbol = els.symbolSelect.dataset.activeSymbol || els.symbolSelect.value) {
  state.symbols = normalizeSymbols(symbols);
  state.intervals = normalizeChartIntervals(state.intervals, state.symbols, state.interval);
  if (!state.symbols.includes(state.activeChartSymbol)) {
    state.activeChartSymbol = state.symbols.includes(preferredSymbol) ? preferredSymbol : state.symbols[0] || "";
  }
  els.symbolInput.value = state.symbols.join(", ");
  renderSymbolSelect(preferredSymbol);
  renderChartManager();
}

function openSearchPanel() {
  els.searchPanel.hidden = false;
  renderChartManager();
  initIcons();
}

function closeSearchPanel() {
  els.searchPanel.hidden = true;
}

function renderExchangeFilter() {
  if (!els.exchangeFilter) return;
  const items = [{ id: "ALL", label: "전체" }, ...SEARCH_EXCHANGES];
  els.exchangeFilter.innerHTML = items
    .map((exchange) => {
      const active = state.searchExchange === exchange.id ? "active" : "";
      return `<button type="button" class="${active}" data-exchange="${escapeHtml(exchange.id)}">${escapeHtml(exchange.label)}</button>`;
    })
    .join("");
}

function renderChartManager() {
  const countText = `${state.symbols.length} / ${MAX_SYMBOLS}`;
  els.chartSummary.textContent = `차트 ${countText}`;
  els.chartCountText.textContent = countText;
  els.workspaceCount.textContent = `${state.symbols.length}개 차트`;
  renderChartNavigation();
  if (els.addChart) {
    const atLimit = state.symbols.length >= MAX_SYMBOLS;
    els.addChart.disabled = atLimit;
    els.addChart.title = atLimit ? "차트는 최대 9개까지 추가할 수 있습니다" : "차트 추가";
  }

  els.chartManagerList.innerHTML = state.symbols.length
    ? state.symbols.map(renderManagedChart).join("")
    : `<div class="empty compact-empty">차트 없음</div>`;
  initIcons();
}

function renderManagedChart(symbol, index) {
  const parsed = parseSymbol(symbol);
  const displayName = symbolDisplayName(symbol);
  const intervalOptions = INTERVALS.map((interval) => {
    const selected = interval.value === intervalForSymbol(symbol) ? "selected" : "";
    return `<option value="${escapeHtml(interval.value)}" ${selected}>${escapeHtml(interval.label)}</option>`;
  }).join("");
  return `
    <article class="chart-manager-item" draggable="true" data-chart-symbol="${escapeHtml(symbol)}">
      <span class="drag-handle" aria-hidden="true">
        <i data-lucide="grip-vertical"></i>
      </span>
      <span class="chart-order">${index + 1}</span>
      <div class="managed-chart-main">
        <strong>${escapeHtml(displayName)}</strong>
        <span>${escapeHtml(parsed.exchange)} · ${escapeHtml(symbol)}</span>
        <label class="chart-interval-control">
          <span>봉</span>
          <select data-chart-interval-symbol="${escapeHtml(symbol)}">
            ${intervalOptions}
          </select>
        </label>
      </div>
      <div class="manager-move-buttons" role="group" aria-label="${escapeHtml(displayName)} 차트 순서">
        <button type="button" data-shift-managed="${escapeHtml(symbol)}" data-shift-direction="-1" aria-label="위로 이동" ${index === 0 ? "disabled" : ""}><i data-lucide="chevron-up"></i></button>
        <button type="button" data-shift-managed="${escapeHtml(symbol)}" data-shift-direction="1" aria-label="아래로 이동" ${index === state.symbols.length - 1 ? "disabled" : ""}><i data-lucide="chevron-down"></i></button>
      </div>
      <button class="icon-only" type="button" title="차트 삭제" aria-label="${escapeHtml(displayName)} 차트 삭제" data-remove-managed-symbol="${escapeHtml(symbol)}">
        <i data-lucide="trash-2"></i>
      </button>
    </article>
  `;
}

function openIndicatorPanel() {
  els.indicatorPanel.hidden = false;
  renderIndicatorOptions();
  initIcons();
}

function closeIndicatorPanel() {
  els.indicatorPanel.hidden = true;
}

function renderIndicatorOptions() {
  els.indicatorOptions.innerHTML = INDICATORS.map((indicator) => {
    const checked = state.indicators.includes(indicator.id) ? "checked" : "";
    return `
      <label class="indicator-option">
        <input type="checkbox" value="${escapeHtml(indicator.id)}" ${checked} />
        <span>${escapeHtml(indicator.label)}</span>
      </label>
    `;
  }).join("");
}

function syncIndicatorSummary() {
  const selected = INDICATORS.filter((indicator) => state.indicators.includes(indicator.id));
  els.indicatorSummary.textContent = selected.length ? `지표 ${selected.length}` : "지표 없음";
}

function selectedStudies() {
  return INDICATORS.filter((indicator) => state.indicators.includes(indicator.id)).map(
    (indicator) => indicator.study,
  );
}

function scheduleSymbolResults() {
  window.clearTimeout(symbolSearchTimer);
  symbolSearchTimer = window.setTimeout(renderSymbolResults, SYMBOL_SEARCH_DEBOUNCE_MS);
}

async function renderSymbolResults() {
  if (!els.searchInput || !els.searchResults) return;
  const query = els.searchInput.value.trim();
  const runId = ++symbolSearchRunId;

  if (!query) {
    symbolSearchStatus = "idle";
    if (symbolSearchController) symbolSearchController.abort();
    els.searchResults.innerHTML = `<div class="empty">TradingView 심볼 검색</div>`;
    return;
  }

  if (symbolSearchController) symbolSearchController.abort();
  symbolSearchController = new AbortController();
  els.searchResults.innerHTML = `<div class="empty">${symbolCacheAvailable ? "저장된 목록 검색 중" : "심볼 검색 중"}</div>`;

  let results = [];
  try {
    results = await fetchTradingViewSymbols(query, symbolSearchController.signal);
  } catch (error) {
    if (error.name === "AbortError") return;
  }
  if (runId !== symbolSearchRunId) return;

  els.searchResults.innerHTML = results.length
    ? `${renderSymbolSearchNotice()}${results.slice(0, SYMBOL_SEARCH_LIMIT).map(renderSymbolResult).join("")}`
    : renderEmptySymbolResults(query);
  initIcons();
}

async function fetchTradingViewSymbols(query, signal) {
  symbolSearchStatus = "searching";
  const cachedResults = findCachedTickerSymbols(query);
  const localResults = findLocalTickerSymbols(query);

  if (symbolCacheAvailable) {
    const results = mergeSymbolResults(localResults, cachedResults);
    symbolSearchStatus = cachedResults.length ? "cache" : localResults.length ? "cache-local" : "cache-empty";
    return results;
  }

  const serverResults = await fetchTradingViewSymbolsFromServer(query, signal);
  if (serverResults) {
    symbolSearchStatus = "server";
    return mergeSymbolResults(serverResults, localResults);
  }

  const directResults = await fetchTradingViewSymbolsDirect(query, signal);
  const results = mergeSymbolResults(directResults, localResults);
  symbolSearchStatus = directResults.length ? "direct" : localResults.length ? "local" : localApiAvailable === false ? "no-server" : "empty";
  return results;
}

async function fetchTradingViewSymbolsFromServer(query, signal) {
  const params = new URLSearchParams({
    query,
    limit: String(SYMBOL_SEARCH_LIMIT),
  });

  if (state.searchExchange !== "ALL") params.set("exchange", state.searchExchange);

  const path = `/api/symbol-search?${params.toString()}`;
  const urls = apiUrls(path);

  for (const url of urls) {
    if (url === path && localApiAvailable === false) continue;

    try {
      const response = await fetch(url, { cache: "no-store", signal });
      if (response.status === 404) localApiAvailable = false;
      if (!response.ok) continue;

      localApiAvailable = true;
      const payload = await response.json();
      const items = payload?.items || payload;
      if (Array.isArray(items) && items.some((item) => item?.error)) continue;
      return normalizeServerSymbolResults(items);
    } catch (error) {
      if (error.name === "AbortError") throw error;
      localApiAvailable = false;
      // Local/API-backed search is optional when the app is opened as a static file.
    }
  }

  return null;
}

function apiUrls(path) {
  const configuredBase = String(window.PIVOT_API_BASE_URL || "").replace(/\/+$/, "");
  if (configuredBase) return [`${configuredBase}${path}`];

  if (window.location.protocol === "file:") {
    return [`http://127.0.0.1:4174${path}`];
  }

  if (["http:", "https:"].includes(window.location.protocol)) {
    return [path];
  }

  return [];
}

function normalizeServerSymbolResults(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (!item || item.error) return null;
      if (!item.symbol) return normalizeTradingViewResult(item);

      const symbol = formatTradingViewSymbol(item.symbol, normalizeExchangeId(item.exchange || ""));
      if (!symbol) return null;

      return {
        symbol,
        title: cleanTradingViewText(item.title || symbolDisplayName(symbol)),
        subtitle: cleanTradingViewText(item.subtitle || item.description || symbol),
        exchangeLabel: cleanTradingViewText(
          item.exchangeLabel || exchangeLabelFor(symbol.split(":")[0] || item.exchange || ""),
        ),
        typeLabel: cleanTradingViewText(item.typeLabel || item.type || ""),
      };
    })
    .filter(Boolean);
}

function renderSymbolSearchNotice() {
  if (symbolSearchStatus === "cache") {
    return `<div class="search-notice success">저장된 티커 목록에서 검색 중</div>`;
  }

  if (symbolSearchStatus === "cache-local") {
    return `<div class="search-notice">저장된 티커 목록과 기본 후보에서 검색 중</div>`;
  }

  if (symbolSearchStatus === "server") {
    return `<div class="search-notice success">TradingView 실시간 검색 연결됨</div>`;
  }

  if (symbolSearchStatus === "local") {
    return `<div class="search-notice">검색 서버 연결 전입니다. 내장 후보만 표시 중이라 원하는 티커가 빠질 수 있습니다.</div>`;
  }

  if (symbolSearchStatus === "direct") {
    return `<div class="search-notice">브라우저 직접 검색 결과입니다. 전체 검색은 서버 연결 시 더 안정적입니다.</div>`;
  }

  return "";
}

function mergeSymbolResults(...groups) {
  const seen = new Set();
  const results = [];

  groups.flat().forEach((result) => {
    if (!result?.symbol || seen.has(result.symbol)) return;
    seen.add(result.symbol);
    results.push(result);
  });

  return results;
}

function findCachedTickerSymbols(query, exchangeFilter = state.searchExchange) {
  const clean = normalizeSearchText(query);
  if (!clean || !cachedSymbolResults.length) return [];

  return cachedSymbolResults
    .filter((item) => cachedTickerMatches(clean, item, exchangeFilter))
    .sort((a, b) => cachedTickerScore(clean, a) - cachedTickerScore(clean, b))
    .slice(0, SYMBOL_SEARCH_LIMIT);
}

function cachedTickerMatches(query, item, exchangeFilter = state.searchExchange) {
  if (!searchExchangeMatches(item, exchangeFilter)) return false;
  return cachedTickerValues(item).some((value) => normalizeSearchText(value).includes(query));
}

function cachedTickerScore(query, item) {
  const values = cachedTickerValues(item).map(normalizeSearchText);
  const exactIndex = values.findIndex((value) => value === query);
  if (exactIndex >= 0) return exactIndex;

  const prefixIndex = values.findIndex((value) => value.startsWith(query));
  if (prefixIndex >= 0) return 20 + prefixIndex;

  return 100;
}

function cachedTickerValues(item) {
  return [
    item.symbol,
    symbolDisplayName(item.symbol),
    item.title,
    item.subtitle,
    item.exchangeLabel,
    item.typeLabel,
    ...(item.aliases || []),
  ].filter(Boolean);
}

function searchExchangeMatches(item, exchangeFilter = state.searchExchange) {
  if (exchangeFilter === "ALL") return true;
  const symbolExchange = item.symbol?.split(":")[0] || "";
  return normalizeExchangeId(symbolExchange) === exchangeFilter || normalizeExchangeId(item.exchangeLabel) === exchangeFilter;
}

function findLocalTickerSymbols(query, exchangeFilter = state.searchExchange) {
  const clean = normalizeSearchText(query);
  if (!clean) return [];

  const exactResult = exactSymbolResult(query);
  const exchanges = exchangeFilter === "ALL"
    ? SEARCH_EXCHANGES
    : SEARCH_EXCHANGES.filter((exchange) => exchange.id === exchangeFilter);
  const results = [
    ...(exactResult ? [exactResult] : []),
    ...findLocalStandaloneSymbols(clean, exchangeFilter),
  ];

  LOCAL_MARKETS.filter(([base, name]) => localMarketMatches(clean, base, name))
    .slice(0, 12)
    .forEach(([base, name]) => {
      exchanges.forEach((exchange) => {
        results.push(localTickerResult(exchange, base, name));
      });
    });

  return mergeSymbolResults(results).slice(0, 40);
}

function findLocalStandaloneSymbols(query, exchangeFilter = state.searchExchange) {
  if (exchangeFilter !== "ALL") return [];

  return LOCAL_SYMBOLS.filter((item) => localStandaloneMatches(query, item)).map((item) => ({
    symbol: item.symbol,
    title: item.title,
    subtitle: item.subtitle,
    exchangeLabel: item.exchangeLabel,
    typeLabel: item.typeLabel,
  }));
}

function localStandaloneMatches(query, item) {
  const values = [item.symbol, item.title, item.subtitle, item.exchangeLabel, ...(item.aliases || [])];
  return values.some((value) => normalizeSearchText(value).includes(query));
}

function localMarketMatches(query, base, name) {
  const pair = `${base}USDT`;
  const futuresPair = `${pair}P`;
  const normalizedName = normalizeSearchText(name);
  return [base, pair, futuresPair, normalizedName].some((value) => normalizeSearchText(value).includes(query));
}

function localTickerResult(exchange, base, name) {
  const symbol = `${exchange.id}:${base}USDT.P`;
  return {
    symbol,
    title: `${base}USDT.P`,
    subtitle: `${name} / USDT Perpetual`,
    exchangeLabel: exchange.label,
    typeLabel: "티커 후보",
  };
}

function renderEmptySymbolResults(query) {
  const exactResult = exactSymbolResult(query);
  const notice =
    symbolSearchStatus === "cache-empty"
      ? "저장된 목록에 없는 심볼입니다. 목록을 갱신하면 검색 범위가 늘어납니다."
      : symbolSearchStatus === "no-server"
      ? "TradingView 전체 검색 서버 연결이 필요합니다. config.js에 Python 서버 주소를 넣으면 실시간 검색됩니다."
      : "검색 결과 없음";
  const exactHtml = exactResult ? renderSymbolResult(exactResult) : "";

  return `
    <div class="search-notice">${escapeHtml(notice)}</div>
    ${exactHtml}
  `;
}

function exactSymbolResult(query) {
  const clean = cleanTradingViewText(query).replace(/\s+/g, "").toUpperCase();
  if (!clean) return null;

  let symbol = "";
  if (clean.includes(":")) {
    symbol = formatTradingViewSymbol(clean, "");
  } else if (state.searchExchange !== "ALL" && looksLikeTradingPair(clean)) {
    symbol = formatTradingViewSymbol(clean, state.searchExchange);
  }

  if (!symbol) return null;

  return {
    symbol,
    title: symbolDisplayName(symbol),
    subtitle: "직접 입력한 TradingView 심볼",
    exchangeLabel: exchangeLabelFor(symbol.split(":")[0] || state.searchExchange),
    typeLabel: "직접 추가",
  };
}

function looksLikeTradingPair(value) {
  return QUOTES.some((quote) => {
    const normalized = value.replace(".P", "").replace("PERP", "");
    return normalized.length > quote.length && normalized.endsWith(quote);
  });
}

async function fetchTradingViewSymbolsDirect(query, signal) {
  const params = new URLSearchParams({
    text: query,
    hl: "1",
    lang: "ko",
    domain: "production",
    limit: String(SYMBOL_SEARCH_LIMIT),
  });

  if (state.searchExchange !== "ALL") params.set("exchange", state.searchExchange);

  const urls = TRADINGVIEW_SEARCH_TYPES.map((type) => {
    const nextParams = new URLSearchParams(params);
    if (type) nextParams.set("type", type);
    return `https://symbol-search.tradingview.com/symbol_search/?${nextParams.toString()}`;
  });

  const seen = new Set();
  const results = [];

  for (const url of urls) {
    try {
      const response = await fetch(url, { cache: "no-store", signal });
      if (!response.ok) continue;
      const payload = await response.json();
      normalizeTradingViewResults(payload).forEach((result) => {
        if (!result?.symbol || seen.has(result.symbol)) return;
        seen.add(result.symbol);
        results.push(result);
      });
      if (results.length >= SYMBOL_SEARCH_LIMIT) break;
    } catch (error) {
      if (error.name === "AbortError") throw error;
      // Keep the search panel quiet if TradingView search is temporarily unavailable.
    }
  }

  return results;
}

function normalizeTradingViewResults(payload) {
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.symbols)
      ? payload.symbols
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

  return items.map(normalizeTradingViewResult).filter(Boolean);
}

function normalizeTradingViewResult(item) {
  const rawFullName = cleanTradingViewText(item.full_name || item.pro_name || item.fullName || "");
  const rawSymbol = cleanTradingViewText(item.symbol || item.ticker || item.name || "");
  const rawExchange = cleanTradingViewText(
    item.exchange || item.prefix || item.source_id || item.source || item.source2?.id || "",
  );
  const exchangeId = normalizeExchangeId(rawExchange || rawFullName.split(":")[0]);
  const tvSymbol = formatTradingViewSymbol(rawFullName || rawSymbol, exchangeId);
  if (!tvSymbol) return null;

  const symbolName = tvSymbol.includes(":") ? tvSymbol.split(":").slice(1).join(":") : tvSymbol;
  const exchangeName = exchangeLabelFor(tvSymbol.split(":")[0] || exchangeId);
  const description = cleanTradingViewText(item.description || item.desc || item.type || "");
  const typespecs = Array.isArray(item.typespecs) ? item.typespecs.join(" ") : item.typespecs;
  const typeLabel = cleanTradingViewText(item.type || typespecs || "");

  return {
    symbol: tvSymbol,
    title: symbolName,
    subtitle: description || tvSymbol,
    exchangeLabel: exchangeName,
    typeLabel,
  };
}

function cleanTradingViewText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .trim();
}

function normalizeExchangeId(value) {
  const clean = String(value || "")
    .replace(/[\s.]+/g, "")
    .toUpperCase();
  if (clean === "GATE" || clean === "GATEIO") return "GATEIO";
  return clean;
}

function formatTradingViewSymbol(value, exchangeId) {
  const clean = cleanTradingViewText(value).replace(/\s+/g, "").toUpperCase();
  if (!clean) return "";
  if (clean.includes(":")) return clean;
  if (!exchangeId) return "";
  return `${exchangeId}:${clean}`;
}

function symbolDisplayName(tvSymbol) {
  const clean = cleanTradingViewText(tvSymbol).replace(/\s+/g, "").toUpperCase();
  return clean.includes(":") ? clean.split(":").slice(1).join(":") : clean;
}

function exchangeLabelFor(exchangeId) {
  const normalized = normalizeExchangeId(exchangeId);
  const exchange = SEARCH_EXCHANGES.find((item) => item.id === normalized);
  return exchange?.label || normalized || "TradingView";
}

function renderSymbolResult({ symbol, title, subtitle, exchangeLabel, typeLabel }) {
  const selected = state.symbols.includes(symbol);
  const atLimit = state.symbols.length >= MAX_SYMBOLS;
  const disabled = selected || atLimit;
  const buttonText = selected ? "선택됨" : atLimit ? "최대" : "추가";
  const meta = [subtitle, typeLabel].filter(Boolean).join(" · ");
  return `
    <article class="symbol-result">
      <div class="result-main">
        <div class="result-title">
          <strong>${escapeHtml(title || symbol)}</strong>
          <span class="exchange-badge">${escapeHtml(exchangeLabel)}</span>
        </div>
        <div class="result-sub">${escapeHtml(meta || symbol)} · ${escapeHtml(symbol)}</div>
      </div>
      <button class="icon-button ${disabled ? "" : "primary"}" type="button" data-add-symbol="${escapeHtml(symbol)}" ${disabled ? "disabled" : ""}>
        <i data-lucide="${selected ? "check" : atLimit ? "lock" : "plus"}"></i>
        <span>${buttonText}</span>
      </button>
    </article>
  `;
}

function renderChartQuickResults(input) {
  window.clearTimeout(chartQuickSearchTimer);
  chartQuickSearchTimer = window.setTimeout(() => {
    const index = Number(input.dataset.chartQuickInput);
    const query = input.value.trim();
    const panel = els.grid.querySelector(`[data-chart-quick-results="${index}"]`);
    const wrapper = input.closest(".chart-quick-search");
    if (!panel || !wrapper) return;

    wrapper.classList.toggle("open", Boolean(query));

    if (query.length < 2) {
      panel.hidden = true;
      panel.innerHTML = "";
      return;
    }

    const results = quickSymbolResults(query);
    panel.hidden = false;
    panel.innerHTML = results.length
      ? results.map((result) => renderChartQuickResult(result, index)).join("")
      : `<div class="chart-quick-empty">결과 없음</div>`;
  }, SYMBOL_SEARCH_DEBOUNCE_MS);
}

function quickSymbolResults(query) {
  return mergeSymbolResults(
    findLocalTickerSymbols(query, "ALL"),
    findCachedTickerSymbols(query, "ALL"),
  ).slice(0, CHART_QUICK_SEARCH_LIMIT);
}

function renderChartQuickResult({ symbol, title, subtitle, exchangeLabel, typeLabel }, index) {
  const meta = [exchangeLabel, subtitle, typeLabel].filter(Boolean).join(" · ");
  return `
    <button class="chart-quick-result" type="button" data-chart-quick-symbol="${escapeHtml(symbol)}" data-chart-quick-target="${index}">
      <strong>${escapeHtml(title || symbolDisplayName(symbol))}</strong>
      <span>${escapeHtml(meta || symbol)}</span>
    </button>
  `;
}

function nextAddChartSymbol() {
  return ADD_CHART_SYMBOLS.find((symbol) => !state.symbols.includes(symbol)) || ADD_CHART_SYMBOLS[0];
}

function addChart() {
  if (state.symbols.length >= MAX_SYMBOLS) {
    renderChartManager();
    return;
  }

  const symbol = nextAddChartSymbol();
  const index = state.symbols.length;
  state.intervals[symbol] = normalizeInterval(els.interval.value || state.interval);
  setSymbols([...state.symbols, symbol], symbol);
  state.activeChartSymbol = symbol;
  persistProfile();
  appendChart(symbol, index);
}

function replaceSymbolAtIndex(index, symbol) {
  const normalized = normalizeSymbols([symbol])[0];
  if (!normalized || !state.symbols[index]) return;

  const currentSymbol = state.symbols[index];
  const nextSymbols = [...state.symbols];
  nextSymbols[index] = normalized;

  state.intervals[normalized] = state.intervals[currentSymbol] || state.interval;
  if (!nextSymbols.includes(currentSymbol)) delete state.intervals[currentSymbol];

  setSymbols(nextSymbols, normalized);
  if (state.activeChartSymbol === currentSymbol) state.activeChartSymbol = normalized;
  persistProfile();
  replaceChartAtIndex(index, normalized);
}

function closeChartQuickSearch(wrapper) {
  if (!wrapper) return;
  const input = wrapper.querySelector("[data-chart-quick-input]");
  const panel = wrapper.querySelector("[data-chart-quick-results]");
  if (input) input.value = "";
  if (panel) {
    panel.hidden = true;
    panel.innerHTML = "";
  }
  wrapper.classList.remove("open");
}

function addSymbol(symbol) {
  if (state.symbols.includes(symbol) || state.symbols.length >= MAX_SYMBOLS) {
    renderSymbolResults();
    return;
  }

  state.intervals[symbol] = normalizeInterval(els.interval.value || state.interval);
  setSymbols([...state.symbols, symbol], symbol);
  state.activeChartSymbol = symbol;
  renderSymbolSelect(symbol);
  applySettings();
  renderSymbolResults();
}

function removeSymbol(symbol) {
  const currentIndex = state.symbols.indexOf(symbol);
  const nextSymbols = state.symbols.filter((item) => item !== symbol);
  const nextSelection = nextSymbols[Math.min(currentIndex, nextSymbols.length - 1)] || "";
  delete state.intervals[symbol];
  setSymbols(nextSymbols, nextSelection);
  if (!state.symbols.includes(state.activeChartSymbol)) state.activeChartSymbol = nextSelection;
  renderSymbolSelect(nextSelection);
  applySettings();
  renderSymbolResults();
}

function moveSymbol(symbol, direction) {
  const currentIndex = state.symbols.indexOf(symbol);
  if (currentIndex < 0) return;

  const nextIndex = currentIndex + Number(direction);
  moveSymbolToIndex(symbol, nextIndex);
}

function moveSymbolToIndex(symbol, nextIndex) {
  const currentIndex = state.symbols.indexOf(symbol);
  if (currentIndex < 0) {
    renderSymbolSelect();
    return;
  }
  if (nextIndex < 0 || nextIndex >= state.symbols.length || nextIndex === currentIndex) {
    renderSymbolSelect(symbol);
    return;
  }

  const symbols = [...state.symbols];
  symbols.splice(currentIndex, 1);
  symbols.splice(nextIndex, 0, symbol);
  setSymbols(symbols);
  renderSymbolSelect(symbol);
  applySettings();
  renderSymbolResults();
}

function moveSymbolByDrop(sourceSymbol, targetSymbol, placeAfter) {
  if (sourceSymbol === targetSymbol) return;

  const symbols = [...state.symbols];
  const sourceIndex = symbols.indexOf(sourceSymbol);
  if (sourceIndex < 0) return;
  symbols.splice(sourceIndex, 1);

  const targetIndex = symbols.indexOf(targetSymbol);
  if (targetIndex < 0) return;
  symbols.splice(targetIndex + (placeAfter ? 1 : 0), 0, sourceSymbol);

  setSymbols(symbols, sourceSymbol);
  applySettings();
  renderSymbolResults();
}

function setChartInterval(symbol, interval) {
  if (!state.symbols.includes(symbol)) return;
  state.intervals[symbol] = normalizeInterval(interval);
  persistProfile();
  renderChartManager();
  renderCharts();
}

function handleSymbolSelectChange() {
  const value = els.symbolSelect.value;

  if (!value.startsWith(SYMBOL_ACTION_PREFIX)) {
    renderSymbolSelect(value);
    return;
  }

  const action = value.replace(SYMBOL_ACTION_PREFIX, "");
  const symbol = els.symbolSelect.dataset.activeSymbol;
  const currentIndex = state.symbols.indexOf(symbol);

  if (currentIndex < 0) {
    renderSymbolSelect();
    return;
  }

  if (action === "first") {
    moveSymbolToIndex(symbol, 0);
    return;
  }

  if (action === "up") {
    moveSymbol(symbol, -1);
    return;
  }

  if (action === "down") {
    moveSymbol(symbol, 1);
    return;
  }

  if (action === "last") {
    moveSymbolToIndex(symbol, state.symbols.length - 1);
    return;
  }

  if (action === "remove") {
    removeSymbol(symbol);
    return;
  }

  renderSymbolSelect(symbol);
}

function parseSymbol(tvSymbol) {
  const [exchangeRaw = "BINANCE", pairRaw = tvSymbol] = tvSymbol.split(":");
  const exchange = exchangeRaw.toUpperCase();
  const cleanPair = (pairRaw || "")
    .replace(".P", "")
    .replace("PERP", "")
    .replace(/[\/_\-]/g, "")
    .toUpperCase();
  const quote = QUOTES.find((candidate) => cleanPair.endsWith(candidate)) || "USDT";
  const base = cleanPair.endsWith(quote) ? cleanPair.slice(0, -quote.length) : cleanPair;

  return {
    tvSymbol,
    exchange,
    pair: `${base}${quote}`,
    base,
    quote,
    gateContract: `${base}_${quote}`,
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderChartQuickSearch(symbol, index) {
  return `
    <div class="chart-quick-search" data-chart-quick-index="${index}">
      <label class="chart-quick-input-wrap">
        <i data-lucide="search"></i>
        <input
          type="search"
          aria-label="${escapeHtml(symbol)} 종목 변경"
          placeholder="${escapeHtml(symbolDisplayName(symbol))}"
          data-chart-quick-input="${index}"
          autocomplete="off"
          spellcheck="false"
        />
      </label>
      <div class="chart-quick-results" data-chart-quick-results="${index}" hidden></div>
    </div>
  `;
}

function isMobileWorkspace() {
  return mobileMedia.matches;
}

function syncLayoutButtons() {
  els.layoutButtons.forEach((button) => {
    const active = button.dataset.layout === state.layout;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function setLayout(layout) {
  if (!["auto", "1", "2", "6"].includes(layout)) return;
  state.layout = layout;
  els.grid.className = `chart-grid layout-${state.layout}${state.horizontal ? " horizontal" : ""}`;
  syncLayoutButtons();
  persistProfile();
}

function renderChartNavigation() {
  if (!state.symbols.includes(state.activeChartSymbol)) state.activeChartSymbol = state.symbols[0] || "";
  const activeIndex = state.symbols.indexOf(state.activeChartSymbol);
  els.mobileChartCounter.textContent = state.symbols.length ? `${activeIndex + 1} / ${state.symbols.length}` : "0 / 0";
  els.previousChart.disabled = activeIndex <= 0;
  els.nextChart.disabled = activeIndex < 0 || activeIndex === state.symbols.length - 1;
  els.mobileChartTabs.innerHTML = state.symbols.map((symbol, index) => {
    const active = symbol === state.activeChartSymbol;
    return `<button class="mobile-chart-tab" type="button" role="tab" aria-selected="${active}" aria-label="${index + 1}번 차트 ${escapeHtml(symbolDisplayName(symbol))}" data-focus-chart="${index}">${escapeHtml(symbolDisplayName(symbol))}</button>`;
  }).join("");
  els.sidebarList.innerHTML = state.symbols.map((symbol, index) => {
    const parsed = parseSymbol(symbol);
    const active = symbol === state.activeChartSymbol;
    return `<button class="sidebar-chart-item ${active ? "active" : ""}" type="button" aria-current="${active ? "true" : "false"}" data-focus-chart="${index}">
      <span class="sidebar-symbol-icon">${String(index + 1).padStart(2, "0")}</span>
      <span class="sidebar-chart-text"><strong>${escapeHtml(symbolDisplayName(symbol))}</strong><small>${escapeHtml(parsed.exchange)} · ${escapeHtml(intervalLabel(intervalForSymbol(symbol)))}</small></span>
    </button>`;
  }).join("");
  initIcons();
}

function activateChart(index) {
  if (!Number.isInteger(index) || index < 0 || index >= state.symbols.length) return;
  state.activeChartSymbol = state.symbols[index];
  renderChartNavigation();
  syncChartVisibility();
  if (!isMobileWorkspace()) {
    els.grid.querySelectorAll(".chart-card")[index]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  } else {
    els.mobileChartTabs.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest", inline: "center" });
  }
}

function syncChartVisibility() {
  const mobile = isMobileWorkspace();
  if (!state.symbols.includes(state.activeChartSymbol)) state.activeChartSymbol = state.symbols[0] || "";
  const cards = els.grid.querySelectorAll(".chart-card");
  cards.forEach((card) => {
    const active = card.dataset.symbol === state.activeChartSymbol;
    const visible = !mobile || active;
    card.hidden = !visible;
    card.classList.toggle("is-selected", active && !mobile);
    if (visible && card.dataset.mounted !== "true") {
      card.dataset.mounted = "true";
      const mount = card.querySelector(".tv-container");
      mountTradingView(mount.id, parseSymbol(card.dataset.symbol).tvSymbol, intervalForSymbol(card.dataset.symbol));
    }
  });
  if (!cards.length) els.grid.innerHTML = '<div class="empty">차트 관리에서 차트를 추가해 주세요.</div>';
}

function renderCharts() {
  document.body.classList.remove("chart-expanded");
  els.grid.className = `chart-grid layout-${state.layout}${state.horizontal ? " horizontal" : ""}`;
  els.grid.innerHTML = "";
  state.symbols.forEach((symbol, index) => els.grid.append(createChartCard(symbol, index).card));
  renderChartNavigation();
  syncChartVisibility();
  initIcons();
}

function createChartCard(symbol, index) {
  const parsed = parseSymbol(symbol);
  const card = document.createElement("article");
  card.className = "chart-card";
  card.dataset.symbol = symbol;
  card.insertAdjacentHTML("afterbegin", `
    <div class="chart-card-toolbar">
      <div class="chart-card-identity">
        <span class="chart-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="chart-card-name"><strong>${escapeHtml(symbolDisplayName(symbol))}</strong><small>${escapeHtml(parsed.exchange)} · ${escapeHtml(symbol)}</small></span>
      </div>
      <div class="chart-card-actions">
        <span class="chart-interval-tag">${escapeHtml(intervalLabel(intervalForSymbol(symbol)))}</span>
        <button type="button" class="chart-card-action" data-toggle-quick-search="${index}" aria-label="${escapeHtml(symbolDisplayName(symbol))} 종목 변경" title="종목 변경"><i data-lucide="search"></i></button>
        <button type="button" class="chart-card-action" data-toggle-expand="${index}" aria-pressed="false" aria-label="차트 확대" title="차트 확대"><i data-lucide="maximize-2"></i></button>
      </div>
    </div>
    ${renderChartQuickSearch(symbol, index)}
  `);

  const container = document.createElement("div");
  container.id = `tv-chart-${index}-${Date.now()}`;
  container.className = "tv-container";
  container.innerHTML = `<div class="chart-placeholder">TradingView 차트를 불러오는 중입니다</div>`;
  card.append(container);
  return { card, containerId: container.id, parsed };
}

function replaceChartAtIndex(index, symbol) {
  const currentCard = els.grid.querySelectorAll(".chart-card")[index];
  if (!currentCard) { renderCharts(); return; }
  currentCard.replaceWith(createChartCard(symbol, index).card);
  renderChartNavigation();
  syncChartVisibility();
  initIcons();
}

function appendChart(symbol, index) {
  els.grid.append(createChartCard(symbol, index).card);
  renderChartNavigation();
  syncChartVisibility();
  initIcons();
}

function toggleChartExpand(index) {
  const card = els.grid.querySelectorAll(".chart-card")[index];
  if (!card) return;
  const shouldExpand = !card.classList.contains("is-maximized");
  els.grid.querySelectorAll(".is-maximized").forEach((item) => item.classList.remove("is-maximized"));
  els.grid.querySelectorAll("[data-toggle-expand]").forEach((button) => {
    button.setAttribute("aria-pressed", "false");
    button.title = "차트 확대";
  });
  card.classList.toggle("is-maximized", shouldExpand);
  document.body.classList.toggle("chart-expanded", shouldExpand);
  const button = card.querySelector("[data-toggle-expand]");
  button.setAttribute("aria-pressed", String(shouldExpand));
  button.title = shouldExpand ? "확대 종료" : "차트 확대";
  button.setAttribute("aria-label", button.title);
  button.innerHTML = `<i data-lucide="${shouldExpand ? "minimize-2" : "maximize-2"}"></i>`;
  initIcons();
}

function closeExpandedChart() {
  const card = els.grid.querySelector(".chart-card.is-maximized");
  if (!card) return;
  const index = [...els.grid.querySelectorAll(".chart-card")].indexOf(card);
  toggleChartExpand(index);
}

function mountTradingView(containerId, symbol, interval) {
  const mount = () => {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!window.TradingView?.widget) {
      container.innerHTML = `<div class="chart-placeholder">TradingView 연결 대기 · 인터넷 연결을 확인해 주세요.</div>`;
      return;
    }

    new window.TradingView.widget({
      autosize: true,
      symbol,
      interval,
      timezone: "Asia/Seoul",
      theme: "dark",
      style: "1",
      locale: "kr",
      toolbar_bg: "#101521",
      enable_publishing: false,
      hide_top_toolbar: true,
      hide_side_toolbar: true,
      allow_symbol_change: true,
      save_image: false,
      studies: selectedStudies(),
      container_id: containerId,
    });
  };

  if (window.TradingView?.widget) {
    mount();
  } else {
    window.addEventListener("load", mount, { once: true });
  }
}

function intervalLabel(value) {
  const labels = { 1: "1m", 5: "5m", 15: "15m", 60: "1h", 240: "4h", D: "1D" };
  return labels[value] || value;
}

function applySettings() {
  state.symbols = normalizeSymbols(els.symbolInput.value);
  const nextInterval = normalizeInterval(els.interval.value);
  const intervalChanged = state.interval !== nextInterval;
  state.interval = nextInterval;
  if (intervalChanged) {
    state.intervals = Object.fromEntries(state.symbols.map((symbol) => [symbol, state.interval]));
  } else {
    state.intervals = normalizeChartIntervals(state.intervals, state.symbols, state.interval);
  }
  state.horizontal = els.horizontalToggle.checked;
  syncIndicatorSummary();
  persistProfile();

  renderCharts();
}

function bindEvents() {
  els.form.addEventListener("submit", (event) => {
    event.preventDefault();
    applySettings();
  });

  els.openSearch.addEventListener("click", openSearchPanel);
  els.closeSearch.addEventListener("click", closeSearchPanel);
  els.sidebarAdd.addEventListener("click", addChart);
  for (const button of els.layoutButtons) {
    button.addEventListener("click", () => setLayout(button.dataset.layout));
  }
  const focusFromNavigation = (event) => {
    const button = event.target.closest("button[data-focus-chart]");
    if (button) activateChart(Number(button.dataset.focusChart));
  };
  els.sidebarList.addEventListener("click", focusFromNavigation);
  els.mobileChartTabs.addEventListener("click", focusFromNavigation);
  els.previousChart.addEventListener("click", () => activateChart(state.symbols.indexOf(state.activeChartSymbol) - 1));
  els.nextChart.addEventListener("click", () => activateChart(state.symbols.indexOf(state.activeChartSymbol) + 1));
  const handleMediaChange = () => {
    closeExpandedChart();
    syncChartVisibility();
    renderChartNavigation();
  };
  if (mobileMedia.addEventListener) mobileMedia.addEventListener("change", handleMediaChange);
  else mobileMedia.addListener(handleMediaChange);
  if (els.addChart) {
    els.addChart.addEventListener("click", addChart);
  }
  els.openIndicator.addEventListener("click", openIndicatorPanel);
  els.closeIndicator.addEventListener("click", closeIndicatorPanel);

  els.searchPanel.addEventListener("click", (event) => {
    if (event.target === els.searchPanel) closeSearchPanel();
  });

  els.indicatorPanel.addEventListener("click", (event) => {
    if (event.target === els.indicatorPanel) closeIndicatorPanel();
  });

  if (els.searchInput) {
    els.searchInput.addEventListener("input", scheduleSymbolResults);
  }

  if (els.searchResults) {
    els.searchResults.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-add-symbol]");
      if (!button) return;
      addSymbol(button.dataset.addSymbol);
    });
  }

  els.grid.addEventListener("input", (event) => {
    const input = event.target.closest("[data-chart-quick-input]");
    if (!input) return;
    renderChartQuickResults(input);
  });

  els.grid.addEventListener("keydown", (event) => {
    const input = event.target.closest("[data-chart-quick-input]");
    if (!input) return;

    if (event.key === "Escape") {
      closeChartQuickSearch(input.closest(".chart-quick-search"));
      input.blur();
      return;
    }

    if (event.key !== "Enter") return;
    event.preventDefault();
    const index = Number(input.dataset.chartQuickInput);
    const firstResult = quickSymbolResults(input.value.trim())[0];
    if (firstResult) replaceSymbolAtIndex(index, firstResult.symbol);
  });

  els.grid.addEventListener("click", (event) => {
    const expandButton = event.target.closest("[data-toggle-expand]");
    if (expandButton) {
      toggleChartExpand(Number(expandButton.dataset.toggleExpand));
      return;
    }
    const searchButton = event.target.closest("[data-toggle-quick-search]");
    if (searchButton) {
      const wrapper = searchButton.closest(".chart-card").querySelector(".chart-quick-search");
      if (wrapper.classList.contains("open")) {
        closeChartQuickSearch(wrapper);
      } else {
        wrapper.classList.add("open");
        wrapper.querySelector("[data-chart-quick-input]").focus();
      }
      return;
    }
    const button = event.target.closest("[data-chart-quick-symbol]");
    if (!button) return;
    replaceSymbolAtIndex(Number(button.dataset.chartQuickTarget), button.dataset.chartQuickSymbol);
  });

  els.grid.addEventListener("focusout", (event) => {
    const wrapper = event.target.closest(".chart-quick-search");
    if (!wrapper) return;
    window.setTimeout(() => {
      if (!wrapper.contains(document.activeElement)) closeChartQuickSearch(wrapper);
    }, 160);
  });

  els.chartManagerList.addEventListener("click", (event) => {
    const shiftButton = event.target.closest("[data-shift-managed]");
    if (shiftButton) {
      moveSymbol(shiftButton.dataset.shiftManaged, Number(shiftButton.dataset.shiftDirection));
      return;
    }
    const button = event.target.closest("button[data-remove-managed-symbol]");
    if (!button) return;
    removeSymbol(button.dataset.removeManagedSymbol);
  });

  els.chartManagerList.addEventListener("change", (event) => {
    const select = event.target.closest("select[data-chart-interval-symbol]");
    if (!select) return;
    setChartInterval(select.dataset.chartIntervalSymbol, select.value);
  });

  els.chartManagerList.addEventListener("dragstart", (event) => {
    if (event.target.closest("select, button, input, label")) {
      event.preventDefault();
      return;
    }
    const item = event.target.closest("[data-chart-symbol]");
    if (!item) return;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", item.dataset.chartSymbol);
    item.classList.add("dragging");
  });

  els.chartManagerList.addEventListener("dragend", () => {
    els.chartManagerList.querySelectorAll(".dragging, .drop-before, .drop-after").forEach((item) => {
      item.classList.remove("dragging", "drop-before", "drop-after");
    });
  });

  els.chartManagerList.addEventListener("dragover", (event) => {
    const item = event.target.closest("[data-chart-symbol]");
    if (!item) return;
    event.preventDefault();
    const rect = item.getBoundingClientRect();
    const placeAfter = event.clientY > rect.top + rect.height / 2;
    els.chartManagerList.querySelectorAll(".drop-before, .drop-after").forEach((target) => {
      target.classList.remove("drop-before", "drop-after");
    });
    item.classList.toggle("drop-before", !placeAfter);
    item.classList.toggle("drop-after", placeAfter);
  });

  els.chartManagerList.addEventListener("dragleave", (event) => {
    const item = event.target.closest("[data-chart-symbol]");
    if (!item || item.contains(event.relatedTarget)) return;
    item.classList.remove("drop-before", "drop-after");
  });

  els.chartManagerList.addEventListener("drop", (event) => {
    const item = event.target.closest("[data-chart-symbol]");
    if (!item) return;
    event.preventDefault();
    const rect = item.getBoundingClientRect();
    const placeAfter = event.clientY > rect.top + rect.height / 2;
    const sourceSymbol = event.dataTransfer.getData("text/plain");
    moveSymbolByDrop(sourceSymbol, item.dataset.chartSymbol, placeAfter);
  });

  if (els.exchangeFilter) {
    els.exchangeFilter.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-exchange]");
      if (!button) return;
      state.searchExchange = button.dataset.exchange;
      els.exchangeFilter.querySelectorAll("button").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      renderSymbolResults();
    });
  }

  els.indicatorOptions.addEventListener("change", (event) => {
    if (event.target.type !== "checkbox") return;
    const selected = Array.from(els.indicatorOptions.querySelectorAll("input:checked")).map((input) => input.value);
    state.indicators = normalizeIndicators(selected);
    syncIndicatorSummary();
    applySettings();
  });

  els.symbolSelect.addEventListener("change", handleSymbolSelectChange);

  els.interval.addEventListener("change", applySettings);
  els.horizontalToggle.addEventListener("change", applySettings);

  els.form.addEventListener("change", (event) => {
    if (event.target === els.symbolSelect) return;
    if (event.target === els.interval) return;
    applySettings();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.searchPanel.hidden) closeSearchPanel();
    if (event.key === "Escape" && !els.indicatorPanel.hidden) closeIndicatorPanel();
    if (event.key === "Escape") closeExpandedChart();
  });

}

function initIcons() {
  if (window.lucide?.createIcons) window.lucide.createIcons();
}

function init() {
  loadCachedSymbolResults();
  loadProfile();
  syncControls();
  bindEvents();
  renderCharts();
  syncLayoutButtons();
  window.addEventListener("load", initIcons);
}

init();
