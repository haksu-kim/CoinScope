const DEFAULT_SYMBOLS = ["GATEIO:ETHUSDT.P", "BYBIT:ETHUSDT.P"];
const DEFAULT_INDICATORS = ["pivot"];
const STORE_KEY = "pivotMultiCharts.profile.v1";
const MAX_SYMBOLS = 9;
const SYMBOL_ACTION_PREFIX = "symbol-action:";
const STATIC_HOST_SUFFIXES = [".github.io"];
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
const SEARCH_EXCHANGES = [
  { id: "GATEIO", label: "Gate.io", suffix: ".P" },
  { id: "BYBIT", label: "Bybit", suffix: ".P" },
  { id: "BINANCE", label: "Binance", suffix: ".P" },
];
const SEARCH_MARKETS = [
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
];

const state = {
  symbols: DEFAULT_SYMBOLS,
  interval: "60",
  layout: "auto",
  live: true,
  indicators: DEFAULT_INDICATORS,
  searchExchange: "ALL",
  tickers: new Map(),
  pivots: new Map(),
  sockets: [],
  pollTimer: null,
};
let localApiAvailable = null;

const els = {
  form: document.querySelector("#chartForm"),
  symbolInput: document.querySelector("#symbolInput"),
  symbolSelect: document.querySelector("#symbolSelect"),
  openSearch: document.querySelector("#openSearchButton"),
  searchPanel: document.querySelector("#symbolSearchPanel"),
  closeSearch: document.querySelector("#closeSearchButton"),
  searchInput: document.querySelector("#symbolSearchInput"),
  searchResults: document.querySelector("#symbolResults"),
  exchangeFilter: document.querySelector(".exchange-filter"),
  interval: document.querySelector("#intervalSelect"),
  layout: document.querySelector("#layoutSelect"),
  openIndicator: document.querySelector("#openIndicatorButton"),
  indicatorSummary: document.querySelector("#indicatorSummary"),
  indicatorPanel: document.querySelector("#indicatorPanel"),
  closeIndicator: document.querySelector("#closeIndicatorButton"),
  indicatorOptions: document.querySelector("#indicatorOptions"),
  grid: document.querySelector("#chartGrid"),
  liveToggle: document.querySelector("#liveToggle"),
  feedStatus: document.querySelector("#feedStatus"),
  tickerList: document.querySelector("#tickerList"),
  saveProfile: document.querySelector("#saveProfileButton"),
  reset: document.querySelector("#resetButton"),
};

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const profile = JSON.parse(raw);
    state.symbols = normalizeSymbols(profile.symbols || DEFAULT_SYMBOLS);
    state.interval = profile.interval || state.interval;
    state.layout = profile.layout || state.layout;
    state.live = profile.live !== false;
    state.indicators = normalizeIndicators(profile.indicators || DEFAULT_INDICATORS);
  } catch {
    state.symbols = DEFAULT_SYMBOLS;
  }
}

function saveProfile() {
  const profile = {
    symbols: state.symbols,
    interval: state.interval,
    layout: state.layout,
    live: state.live,
    indicators: state.indicators,
  };
  localStorage.setItem(STORE_KEY, JSON.stringify(profile));
  setFeedStatus("프로필 저장됨");
}

function syncControls() {
  els.symbolInput.value = state.symbols.join(", ");
  els.interval.value = state.interval;
  els.layout.value = state.layout;
  els.liveToggle.checked = state.live;
  renderSymbolSelect();
  renderIndicatorOptions();
  syncIndicatorSummary();
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

function normalizeSearchText(value) {
  return String(value)
    .trim()
    .replace(/[\/_\-\s]/g, "")
    .toUpperCase();
}

function buildTvSymbol(exchangeId, base) {
  const exchange = SEARCH_EXCHANGES.find((item) => item.id === exchangeId) || SEARCH_EXCHANGES[0];
  return `${exchange.id}:${base}USDT${exchange.suffix}`;
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
  els.symbolInput.value = state.symbols.join(", ");
  renderSymbolSelect(preferredSymbol);
}

function openSearchPanel() {
  els.searchPanel.hidden = false;
  els.searchInput.value = "";
  renderSymbolResults();
  initIcons();
  window.setTimeout(() => els.searchInput.focus(), 0);
}

function closeSearchPanel() {
  els.searchPanel.hidden = true;
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

function renderSymbolResults() {
  const query = normalizeSearchText(els.searchInput.value);
  const exchanges = SEARCH_EXCHANGES.filter(
    (exchange) => state.searchExchange === "ALL" || exchange.id === state.searchExchange,
  );
  const marketMatches = SEARCH_MARKETS.filter(([base, name]) => {
    if (!query) return true;
    const normalizedName = normalizeSearchText(name);
    return base.includes(query) || normalizedName.includes(query);
  }).slice(0, query ? 16 : 10);

  const rows = [];

  if (query && /^[A-Z0-9]+$/.test(query) && !SEARCH_MARKETS.some(([base]) => base === query)) {
    marketMatches.unshift([query, `${query} Perpetual`]);
  }

  marketMatches.forEach(([base, name]) => {
    exchanges.forEach((exchange) => {
      const symbol = buildTvSymbol(exchange.id, base);
      rows.push(renderSymbolResult({ base, name, exchange, symbol }));
    });
  });

  els.searchResults.innerHTML = rows.length
    ? rows.join("")
    : `<div class="empty">검색 결과 없음</div>`;
  initIcons();
}

function renderSymbolResult({ base, name, exchange, symbol }) {
  const selected = state.symbols.includes(symbol);
  const atLimit = state.symbols.length >= MAX_SYMBOLS;
  const disabled = selected || atLimit;
  const buttonText = selected ? "선택됨" : atLimit ? "최대" : "추가";
  return `
    <article class="symbol-result">
      <div class="result-main">
        <div class="result-title">
          <strong>${escapeHtml(base)}USDT.P</strong>
          <span class="exchange-badge">${escapeHtml(exchange.label)}</span>
        </div>
        <div class="result-sub">${escapeHtml(name)} · ${escapeHtml(symbol)}</div>
      </div>
      <button class="icon-button ${disabled ? "" : "primary"}" type="button" data-add-symbol="${escapeHtml(symbol)}" ${disabled ? "disabled" : ""}>
        <i data-lucide="${selected ? "check" : atLimit ? "lock" : "plus"}"></i>
        <span>${buttonText}</span>
      </button>
    </article>
  `;
}

function addSymbol(symbol) {
  if (state.symbols.includes(symbol) || state.symbols.length >= MAX_SYMBOLS) {
    renderSymbolResults();
    return;
  }

  setSymbols([...state.symbols, symbol]);
  renderSymbolSelect(symbol);
  applySettings();
  renderSymbolResults();
}

function removeSymbol(symbol) {
  const currentIndex = state.symbols.indexOf(symbol);
  const nextSymbols = state.symbols.filter((item) => item !== symbol);
  const nextSelection = nextSymbols[Math.min(currentIndex, nextSymbols.length - 1)] || "";
  setSymbols(nextSymbols);
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

function formatNumber(value, digits = 2) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "--";
  const decimals = Math.abs(number) >= 100 ? digits : Math.abs(number) >= 1 ? Math.max(digits, 3) : 6;
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: Math.min(decimals, 2),
  }).format(number);
}

function formatPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "--";
  return `${number > 0 ? "+" : ""}${number.toFixed(2)}%`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setFeedStatus(message) {
  els.feedStatus.textContent = message;
}

async function fetchLocalJson(path) {
  if (!["http:", "https:"].includes(window.location.protocol)) return null;
  if (isStaticHost()) return null;
  if (localApiAvailable === false) return null;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 4500);
  try {
    const response = await fetch(path, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (response.status === 404) localApiAvailable = false;
    if (!response.ok) return null;
    localApiAvailable = true;
    return await response.json();
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

function isStaticHost() {
  const host = window.location.hostname.toLowerCase();
  return STATIC_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix));
}

function renderCharts() {
  els.grid.className = `chart-grid layout-${state.layout}`;
  els.grid.innerHTML = "";

  state.symbols.forEach((symbol, index) => {
    const parsed = parseSymbol(symbol);
    const card = document.createElement("article");
    card.className = "chart-card";
    card.dataset.symbol = symbol;

    const container = document.createElement("div");
    container.id = `tv-chart-${index}-${Date.now()}`;
    container.className = "tv-container";
    container.innerHTML = `<div class="chart-placeholder">차트 로딩</div>`;

    card.append(container);
    els.grid.append(card);

    mountTradingView(container.id, parsed.tvSymbol);
  });
}

function mountTradingView(containerId, symbol) {
  const mount = () => {
    if (!window.TradingView?.widget) {
      document.querySelector(`#${containerId}`).innerHTML = `<div class="chart-placeholder">TradingView 연결 대기</div>`;
      return;
    }

    new window.TradingView.widget({
      autosize: true,
      symbol,
      interval: state.interval,
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

function renderMonitor() {
  if (!state.symbols.length) {
    els.tickerList.innerHTML = `<div class="empty">심볼 없음</div>`;
    return;
  }

  els.tickerList.innerHTML = state.symbols
    .map((symbol) => {
      const parsed = parseSymbol(symbol);
      const ticker = state.tickers.get(symbol) || {};
      const pivot = state.pivots.get(symbol);
      const price = Number(ticker.price);
      const changeClass = Number(ticker.changePct) >= 0 ? "positive" : "negative";

      return `
        <article class="ticker-card" data-symbol="${escapeHtml(symbol)}">
          <div class="ticker-top">
            <div class="ticker-name">
              <strong>${escapeHtml(parsed.pair)}</strong>
              <span>${escapeHtml(parsed.exchange)}</span>
            </div>
            <div class="price">${formatNumber(price)}</div>
          </div>
          <div class="ticker-body">
            <div class="ticker-stats">
              <div class="ticker-stat"><span>24h</span><b class="${changeClass}">${formatPercent(ticker.changePct)}</b></div>
              <div class="ticker-stat"><span>Mark</span><b>${formatNumber(ticker.markPrice || price)}</b></div>
            </div>
            ${renderPivotTable(pivot, price)}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderPivotTable(pivot, price) {
  if (!pivot) {
    return `
      <div class="pivot-table">
        <div class="pivot-row"><span>Pivot</span><b>--</b></div>
        <div class="pivot-row"><span>R1 / S1</span><b>--</b></div>
        <div class="pivot-row"><span>R2 / S2</span><b>--</b></div>
      </div>
    `;
  }

  const rows = [
    ["R3", pivot.r3],
    ["R2", pivot.r2],
    ["R1", pivot.r1],
    ["P", pivot.p],
    ["S1", pivot.s1],
    ["S2", pivot.s2],
    ["S3", pivot.s3],
  ];

  const rendered = rows
    .map(([label, value]) => {
      const near = isNear(price, value) ? "near" : "";
      return `<div class="pivot-row ${near}"><span>${label}</span><b>${formatNumber(value)}</b></div>`;
    })
    .join("");

  return `
    <div class="pivot-table">${rendered}</div>
    <div class="pivot-source">전일 HLC 기준</div>
  `;
}

function isNear(price, level) {
  if (!Number.isFinite(price) || !Number.isFinite(level) || level === 0) return false;
  return Math.abs(price - level) / level <= 0.0015;
}

function closeSockets() {
  state.sockets.forEach((socket) => {
    try {
      socket.close();
    } catch {
      // Ignore already-closed sockets.
    }
  });
  state.sockets = [];
}

function stopPolling() {
  if (!state.pollTimer) return;
  window.clearInterval(state.pollTimer);
  state.pollTimer = null;
}

function startFeeds() {
  closeSockets();
  stopPolling();
  state.tickers.clear();
  renderMonitor();

  if (!state.live) {
    setFeedStatus("실시간 꺼짐");
    return;
  }

  const groups = groupByExchange(state.symbols);
  let connectionCount = 0;

  groups.bybit.forEach((item) => {
    connectionCount += 1;
    connectBybit(item);
  });

  groups.gateio.forEach((item) => {
    connectionCount += 1;
    connectGateio(item);
  });

  if (groups.binance.length) {
    connectionCount += 1;
    connectBinance(groups.binance);
  }

  if (connectionCount === 0) {
    setFeedStatus("지원 피드 없음");
  } else {
    setFeedStatus("실시간 연결 중");
    pollTickers();
    state.pollTimer = window.setInterval(pollTickers, 7000);
  }
}

function groupByExchange(symbols) {
  return symbols.reduce(
    (groups, symbol) => {
      const parsed = parseSymbol(symbol);
      const item = { symbol, parsed };
      if (parsed.exchange.includes("BYBIT")) groups.bybit.push(item);
      else if (parsed.exchange.includes("GATEIO") || parsed.exchange.includes("GATE")) groups.gateio.push(item);
      else if (parsed.exchange.includes("BINANCE")) groups.binance.push(item);
      return groups;
    },
    { bybit: [], gateio: [], binance: [] },
  );
}

function connectBybit(item) {
  const socket = new WebSocket("wss://stream.bybit.com/v5/public/linear");
  state.sockets.push(socket);

  socket.addEventListener("open", () => {
    socket.send(JSON.stringify({ op: "subscribe", args: [`tickers.${item.parsed.pair}`] }));
    setFeedStatus("실시간 연결됨");
  });

  socket.addEventListener("message", (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (!payload?.data) return;
      updateTicker(item.symbol, {
        price: payload.data.lastPrice,
        markPrice: payload.data.markPrice,
        changePct: Number(payload.data.price24hPcnt) * 100,
      });
    } catch {
      setFeedStatus("BYBIT 수신 오류");
    }
  });

  socket.addEventListener("error", () => setFeedStatus("BYBIT 연결 오류"));
}

function connectGateio(item) {
  const socket = new WebSocket("wss://fx-ws.gateio.ws/v4/ws/usdt");
  state.sockets.push(socket);

  socket.addEventListener("open", () => {
    socket.send(
      JSON.stringify({
        time: Math.floor(Date.now() / 1000),
        channel: "futures.tickers",
        event: "subscribe",
        payload: [item.parsed.gateContract],
      }),
    );
    setFeedStatus("실시간 연결됨");
  });

  socket.addEventListener("message", (event) => {
    try {
      const payload = JSON.parse(event.data);
      const data = Array.isArray(payload.result) ? payload.result[0] : payload.result;
      if (!data) return;
      updateTicker(item.symbol, {
        price: data.last,
        markPrice: data.mark_price,
        changePct: data.change_percentage,
      });
    } catch {
      setFeedStatus("GATEIO 수신 오류");
    }
  });

  socket.addEventListener("error", () => setFeedStatus("GATEIO 연결 오류"));
}

function connectBinance(items) {
  const streams = items.map((item) => `${item.parsed.pair.toLowerCase()}@ticker`).join("/");
  const socket = new WebSocket(`wss://fstream.binance.com/stream?streams=${streams}`);
  state.sockets.push(socket);

  socket.addEventListener("open", () => setFeedStatus("실시간 연결됨"));
  socket.addEventListener("message", (event) => {
    try {
      const payload = JSON.parse(event.data);
      const data = payload.data;
      const item = items.find((candidate) => candidate.parsed.pair === data.s);
      if (!item) return;
      updateTicker(item.symbol, {
        price: data.c,
        markPrice: data.c,
        changePct: data.P,
      });
    } catch {
      setFeedStatus("BINANCE 수신 오류");
    }
  });

  socket.addEventListener("error", () => setFeedStatus("BINANCE 연결 오류"));
}

function updateTicker(symbol, update) {
  const cleaned = Object.fromEntries(
    Object.entries(update).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
  state.tickers.set(symbol, { ...(state.tickers.get(symbol) || {}), ...cleaned, updatedAt: Date.now() });
  renderMonitor();
}

async function pollTickers() {
  if (!state.live) return;

  const handled = new Set();
  const localData = await fetchLocalJson(`/api/tickers?symbols=${encodeURIComponent(state.symbols.join(","))}`);
  if (Array.isArray(localData?.items)) {
    localData.items.forEach((item) => {
      if (!item?.symbol || item.error || item.price == null) return;
      handled.add(item.symbol);
      updateTicker(item.symbol, item);
    });
    if (handled.size) setFeedStatus("로컬 피드 연결됨");
  }

  await Promise.all(
    state.symbols.filter((symbol) => !handled.has(symbol)).map(async (symbol) => {
      const parsed = parseSymbol(symbol);
      try {
        const ticker = await fetchTicker(parsed);
        if (ticker) updateTicker(symbol, ticker);
      } catch {
        // WebSocket remains the primary source when exchange REST polling is unavailable.
      }
    }),
  );
}

async function fetchTicker(parsed) {
  if (parsed.exchange.includes("BYBIT")) return fetchBybitTicker(parsed);
  if (parsed.exchange.includes("GATEIO") || parsed.exchange.includes("GATE")) return fetchGateTicker(parsed);
  if (parsed.exchange.includes("BINANCE")) return fetchBinanceTicker(parsed);
  return null;
}

async function fetchBybitTicker(parsed) {
  const url = `https://api.bybit.com/v5/market/tickers?category=linear&symbol=${parsed.pair}`;
  const response = await fetch(url);
  const json = await response.json();
  const data = json?.result?.list?.[0];
  if (!data) return null;
  return {
    price: data.lastPrice,
    markPrice: data.markPrice,
    changePct: Number(data.price24hPcnt) * 100,
  };
}

async function fetchGateTicker(parsed) {
  const url = `https://api.gateio.ws/api/v4/futures/usdt/tickers?contract=${parsed.gateContract}`;
  const response = await fetch(url);
  const json = await response.json();
  const data = Array.isArray(json) ? json[0] : json;
  if (!data) return null;
  return {
    price: data.last,
    markPrice: data.mark_price,
    changePct: data.change_percentage,
  };
}

async function fetchBinanceTicker(parsed) {
  const url = `https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${parsed.pair}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data?.symbol) return null;
  return {
    price: data.lastPrice,
    markPrice: data.lastPrice,
    changePct: data.priceChangePercent,
  };
}

async function loadPivots() {
  state.pivots.clear();
  renderMonitor();

  const handled = new Set();
  const localData = await fetchLocalJson(`/api/pivots?symbols=${encodeURIComponent(state.symbols.join(","))}`);
  if (Array.isArray(localData?.items)) {
    localData.items.forEach((item) => {
      if (!item?.symbol || !item.pivot) return;
      handled.add(item.symbol);
      state.pivots.set(item.symbol, item.pivot);
    });
  }

  await Promise.all(
    state.symbols.filter((symbol) => !handled.has(symbol)).map(async (symbol) => {
      const parsed = parseSymbol(symbol);
      try {
        const candle = await fetchPreviousDailyCandle(parsed);
        if (!candle) return;
        state.pivots.set(symbol, calculatePivot(candle));
      } catch {
        // External chart data can be blocked by the browser or exchange CORS.
      }
    }),
  );

  renderMonitor();
}

async function fetchPreviousDailyCandle(parsed) {
  if (parsed.exchange.includes("BYBIT")) return fetchBybitDaily(parsed);
  if (parsed.exchange.includes("GATEIO") || parsed.exchange.includes("GATE")) return fetchGateDaily(parsed);
  if (parsed.exchange.includes("BINANCE")) return fetchBinanceDaily(parsed);
  return null;
}

async function fetchBybitDaily(parsed) {
  const url = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${parsed.pair}&interval=D&limit=3`;
  const response = await fetch(url);
  const json = await response.json();
  const rows = json?.result?.list || [];
  const sorted = rows.map((row) => ({
    time: Number(row[0]),
    high: Number(row[2]),
    low: Number(row[3]),
    close: Number(row[4]),
  })).sort((a, b) => a.time - b.time);
  return newestClosedDaily(sorted);
}

async function fetchGateDaily(parsed) {
  const url = `https://api.gateio.ws/api/v4/futures/usdt/candlesticks?contract=${parsed.gateContract}&interval=1d&limit=3`;
  const response = await fetch(url);
  const rows = await response.json();
  const sorted = rows.map((row) => ({
    time: Number(row.t) * 1000,
    high: Number(row.h),
    low: Number(row.l),
    close: Number(row.c),
  })).sort((a, b) => a.time - b.time);
  return newestClosedDaily(sorted);
}

async function fetchBinanceDaily(parsed) {
  const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${parsed.pair}&interval=1d&limit=3`;
  const response = await fetch(url);
  const rows = await response.json();
  const sorted = rows.map((row) => ({
    time: Number(row[0]),
    high: Number(row[2]),
    low: Number(row[3]),
    close: Number(row[4]),
  })).sort((a, b) => a.time - b.time);
  return newestClosedDaily(sorted);
}

function newestClosedDaily(rows) {
  const todayUtc = new Date();
  todayUtc.setUTCHours(0, 0, 0, 0);
  const closed = rows.filter((row) => row.time < todayUtc.getTime());
  return closed.at(-1) || rows.at(-2) || rows.at(-1) || null;
}

function calculatePivot({ high, low, close }) {
  const p = (high + low + close) / 3;
  return {
    p,
    r1: 2 * p - low,
    s1: 2 * p - high,
    r2: p + (high - low),
    s2: p - (high - low),
    r3: high + 2 * (p - low),
    s3: low - 2 * (high - p),
  };
}

function applySettings() {
  state.symbols = normalizeSymbols(els.symbolInput.value);
  state.interval = els.interval.value;
  state.layout = els.layout.value;
  state.live = els.liveToggle.checked;
  syncIndicatorSummary();

  renderCharts();
  renderMonitor();
  loadPivots();
  startFeeds();
}

function bindEvents() {
  els.form.addEventListener("submit", (event) => {
    event.preventDefault();
    applySettings();
  });

  els.openSearch.addEventListener("click", openSearchPanel);
  els.closeSearch.addEventListener("click", closeSearchPanel);
  els.openIndicator.addEventListener("click", openIndicatorPanel);
  els.closeIndicator.addEventListener("click", closeIndicatorPanel);

  els.searchPanel.addEventListener("click", (event) => {
    if (event.target === els.searchPanel) closeSearchPanel();
  });

  els.indicatorPanel.addEventListener("click", (event) => {
    if (event.target === els.indicatorPanel) closeIndicatorPanel();
  });

  els.searchInput.addEventListener("input", renderSymbolResults);

  els.searchResults.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-add-symbol]");
    if (!button) return;
    addSymbol(button.dataset.addSymbol);
  });

  els.exchangeFilter.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-exchange]");
    if (!button) return;
    state.searchExchange = button.dataset.exchange;
    els.exchangeFilter.querySelectorAll("button").forEach((item) => {
      item.classList.toggle("active", item === button);
    });
    renderSymbolResults();
  });

  els.indicatorOptions.addEventListener("change", (event) => {
    if (event.target.type !== "checkbox") return;
    const selected = Array.from(els.indicatorOptions.querySelectorAll("input:checked")).map((input) => input.value);
    state.indicators = normalizeIndicators(selected);
    syncIndicatorSummary();
    applySettings();
  });

  els.symbolSelect.addEventListener("change", handleSymbolSelectChange);

  els.interval.addEventListener("change", applySettings);
  els.layout.addEventListener("change", applySettings);

  els.form.addEventListener("change", (event) => {
    if (event.target === els.symbolSelect) return;
    if (event.target === els.interval || event.target === els.layout) return;
    applySettings();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.searchPanel.hidden) closeSearchPanel();
    if (event.key === "Escape" && !els.indicatorPanel.hidden) closeIndicatorPanel();
  });

  els.liveToggle.addEventListener("change", () => {
    state.live = els.liveToggle.checked;
    startFeeds();
  });

  els.saveProfile.addEventListener("click", saveProfile);

  els.reset.addEventListener("click", () => {
    state.symbols = DEFAULT_SYMBOLS;
    state.interval = "60";
    state.layout = "auto";
    state.live = true;
    state.indicators = DEFAULT_INDICATORS;
    syncControls();
    applySettings();
    setFeedStatus("기본값 적용");
  });
}

function initIcons() {
  if (window.lucide?.createIcons) window.lucide.createIcons();
}

function init() {
  loadProfile();
  syncControls();
  bindEvents();
  renderCharts();
  renderMonitor();
  loadPivots();
  startFeeds();
  window.addEventListener("load", initIcons);
}

init();
