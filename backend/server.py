#!/usr/bin/env python3
import json
import math
import os
import re
import ssl
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "4174"))
QUOTES = ("USDT", "USDC", "USD", "BTC", "ETH")
SEARCH_TYPES = ("", "stock", "fund", "futures", "forex", "crypto", "index", "indices", "cfd", "economic")
SEARCH_CACHE_TTL = 20
SEARCH_CACHE = {}
SEARCH_EXCHANGE_LABELS = {
    "GATEIO": "Gate.io",
    "BYBIT": "Bybit",
    "BINANCE": "Binance",
    "OKX": "OKX",
    "BITGET": "Bitget",
    "MEXC": "MEXC",
    "KUCOIN": "KuCoin",
}
PUBLIC_MARKET_CONTEXT = ssl.create_default_context()


def parse_symbol(tv_symbol):
    if ":" in tv_symbol:
        exchange, pair = tv_symbol.split(":", 1)
    else:
        exchange, pair = "BINANCE", tv_symbol

    clean_pair = (
        pair.upper()
        .replace(".P", "")
        .replace("PERP", "")
        .replace("/", "")
        .replace("_", "")
        .replace("-", "")
    )
    quote = next((candidate for candidate in QUOTES if clean_pair.endswith(candidate)), "USDT")
    base = clean_pair[: -len(quote)] if clean_pair.endswith(quote) else clean_pair

    return {
        "tv_symbol": tv_symbol.upper(),
        "exchange": exchange.upper(),
        "pair": f"{base}{quote}",
        "base": base,
        "quote": quote,
        "gate_contract": f"{base}_{quote}",
    }


def get_json(url):
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            ),
            "Accept": "application/json,text/plain,*/*",
            "Referer": "https://www.tradingview.com/",
            "Origin": "https://www.tradingview.com",
        },
    )
    with urllib.request.urlopen(request, timeout=6, context=PUBLIC_MARKET_CONTEXT) as response:
        return json.loads(response.read().decode("utf-8"))


def clean_tradingview_text(value):
    return re.sub(r"<[^>]*>", "", str(value or "")).replace("&amp;", "&").strip()


def normalize_exchange_id(value):
    cleaned = "".join(str(value or "").replace(".", "").split()).upper()
    if cleaned in ("GATE", "GATEIO"):
        return "GATEIO"
    return cleaned


def format_tradingview_symbol(value, exchange_id):
    cleaned = "".join(clean_tradingview_text(value).split()).upper()
    if not cleaned:
        return ""
    if ":" in cleaned:
        return cleaned
    if not exchange_id:
        return ""
    return f"{exchange_id}:{cleaned}"


def exchange_label_for(exchange_id):
    normalized = normalize_exchange_id(exchange_id)
    return SEARCH_EXCHANGE_LABELS.get(normalized, normalized or "TradingView")


def normalize_search_text(value):
    return re.sub(r"[^A-Z0-9]", "", str(value or "").upper())


def search_query_variants(text):
    normalized = normalize_search_text(text)
    variants = {normalized}
    if normalized.endswith("P"):
        variants.add(normalized[:-1])
    if normalized.endswith("PERP"):
        variants.add(normalized[:-4])
    return {variant for variant in variants if variant}


def tradingview_result_matches(text, result):
    needles = search_query_variants(text)
    if not needles:
        return True

    haystacks = [
        result.get("symbol"),
        result.get("title"),
        result.get("subtitle"),
        result.get("exchangeLabel"),
        result.get("typeLabel"),
    ]
    normalized_haystacks = [normalize_search_text(value) for value in haystacks]

    for needle in needles:
        for haystack in normalized_haystacks:
            if not haystack:
                continue
            if needle in haystack:
                return True
            if len(needle) >= 6 and len(haystack) >= 4 and haystack in needle:
                return True
    return False


def tradingview_search_items(payload):
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict):
        for key in ("symbols", "data", "items"):
            value = payload.get(key)
            if isinstance(value, list):
                return value
    return []


def normalize_tradingview_result(item):
    if not isinstance(item, dict):
        return None

    raw_full_name = clean_tradingview_text(
        item.get("full_name") or item.get("pro_name") or item.get("fullName") or ""
    )
    raw_symbol = clean_tradingview_text(item.get("symbol") or item.get("ticker") or item.get("name") or "")
    raw_source2 = item.get("source2") if isinstance(item.get("source2"), dict) else {}
    raw_exchange = clean_tradingview_text(
        item.get("exchange")
        or item.get("prefix")
        or item.get("source_id")
        or item.get("source")
        or raw_source2.get("id")
        or ""
    )

    exchange_id = normalize_exchange_id(raw_exchange or raw_full_name.split(":", 1)[0])
    tv_symbol = format_tradingview_symbol(raw_full_name or raw_symbol, exchange_id)
    if not tv_symbol:
        return None

    symbol_name = tv_symbol.split(":", 1)[1] if ":" in tv_symbol else tv_symbol
    description = clean_tradingview_text(item.get("description") or item.get("desc") or item.get("type") or "")
    typespecs = item.get("typespecs")
    if isinstance(typespecs, list):
        typespecs = " ".join(str(value) for value in typespecs)
    type_label = clean_tradingview_text(item.get("type") or typespecs or "")

    return {
        "symbol": tv_symbol,
        "title": symbol_name,
        "subtitle": description or tv_symbol,
        "exchangeLabel": exchange_label_for(tv_symbol.split(":", 1)[0] if ":" in tv_symbol else exchange_id),
        "typeLabel": type_label,
    }


def symbol_search_params(path):
    query = urllib.parse.urlparse(path).query
    params = urllib.parse.parse_qs(query)
    text = (params.get("query") or params.get("text") or [""])[0].strip()
    exchange = normalize_exchange_id((params.get("exchange") or [""])[0])
    if exchange == "ALL":
        exchange = ""

    try:
        limit = int((params.get("limit") or ["40"])[0])
    except ValueError:
        limit = 80

    return {
        "text": text,
        "exchange": exchange,
        "limit": max(1, min(limit, 100)),
    }


def tradingview_symbol_search(text, exchange="", limit=40):
    if not text:
        return []

    cache_key = (text.strip().lower(), exchange, limit)
    cached = SEARCH_CACHE.get(cache_key)
    now = time.time()
    if cached and now - cached["time"] <= SEARCH_CACHE_TTL:
        return cached["items"]

    seen = set()
    results = []
    urls = [tradingview_symbol_search_url(text, exchange, limit, search_type) for search_type in SEARCH_TYPES]

    with ThreadPoolExecutor(max_workers=min(6, len(urls))) as executor:
        future_map = {executor.submit(get_json, url): url for url in urls}
        for future in as_completed(future_map):
            try:
                items = tradingview_search_items(future.result())
            except Exception:
                continue

            for item in items:
                result = normalize_tradingview_result(item)
                if not result or result["symbol"] in seen or not tradingview_result_matches(text, result):
                    continue
                seen.add(result["symbol"])
                results.append(result)
                if len(results) >= limit:
                    SEARCH_CACHE[cache_key] = {"time": now, "items": results}
                    return results

    SEARCH_CACHE[cache_key] = {"time": now, "items": results}
    return results


def tradingview_symbol_search_url(text, exchange="", limit=40, search_type=""):
    params = {
        "text": text,
        "hl": "1",
        "lang": "ko",
        "domain": "production",
        "limit": str(limit),
    }
    if exchange:
        params["exchange"] = exchange
    if search_type:
        params["type"] = search_type

    return f"https://symbol-search.tradingview.com/symbol_search/?{urllib.parse.urlencode(params)}"


def ticker_for(parsed):
    exchange = parsed["exchange"]
    if "BYBIT" in exchange:
        url = f"https://api.bybit.com/v5/market/tickers?category=linear&symbol={parsed['pair']}"
        data = get_json(url)["result"]["list"][0]
        return {
            "price": data.get("lastPrice"),
            "markPrice": data.get("markPrice"),
            "changePct": safe_float(data.get("price24hPcnt")) * 100,
        }

    if "GATEIO" in exchange or "GATE" in exchange:
        contract = urllib.parse.quote(parsed["gate_contract"])
        url = f"https://api.gateio.ws/api/v4/futures/usdt/tickers?contract={contract}"
        data = get_json(url)[0]
        return {
            "price": data.get("last"),
            "markPrice": data.get("mark_price"),
            "changePct": data.get("change_percentage"),
        }

    if "BINANCE" in exchange:
        url = f"https://fapi.binance.com/fapi/v1/ticker/24hr?symbol={parsed['pair']}"
        data = get_json(url)
        return {
            "price": data.get("lastPrice"),
            "markPrice": data.get("lastPrice"),
            "changePct": data.get("priceChangePercent"),
        }

    return None


def previous_daily_for(parsed):
    exchange = parsed["exchange"]
    if "BYBIT" in exchange:
        url = f"https://api.bybit.com/v5/market/kline?category=linear&symbol={parsed['pair']}&interval=D&limit=4"
        rows = get_json(url)["result"]["list"]
        candles = [
            {
                "time": int(row[0]),
                "high": safe_float(row[2]),
                "low": safe_float(row[3]),
                "close": safe_float(row[4]),
            }
            for row in rows
        ]
        return newest_closed_daily(candles)

    if "GATEIO" in exchange or "GATE" in exchange:
        contract = urllib.parse.quote(parsed["gate_contract"])
        url = f"https://api.gateio.ws/api/v4/futures/usdt/candlesticks?contract={contract}&interval=1d&limit=4"
        rows = get_json(url)
        candles = [
            {
                "time": int(row["t"]) * 1000,
                "high": safe_float(row["h"]),
                "low": safe_float(row["l"]),
                "close": safe_float(row["c"]),
            }
            for row in rows
        ]
        return newest_closed_daily(candles)

    if "BINANCE" in exchange:
        url = f"https://fapi.binance.com/fapi/v1/klines?symbol={parsed['pair']}&interval=1d&limit=4"
        rows = get_json(url)
        candles = [
            {
                "time": int(row[0]),
                "high": safe_float(row[2]),
                "low": safe_float(row[3]),
                "close": safe_float(row[4]),
            }
            for row in rows
        ]
        return newest_closed_daily(candles)

    return None


def safe_float(value):
    try:
        number = float(value)
        return number if math.isfinite(number) else None
    except (TypeError, ValueError):
        return None


def newest_closed_daily(candles):
    today_utc = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today_ms = int(today_utc.timestamp() * 1000)
    sorted_candles = sorted(candles, key=lambda candle: candle["time"])
    closed = [candle for candle in sorted_candles if candle["time"] < today_ms]
    return (closed or sorted_candles)[-1] if sorted_candles else None


def calculate_pivot(candle):
    high = candle["high"]
    low = candle["low"]
    close = candle["close"]
    if high is None or low is None or close is None:
        return None

    pivot = (high + low + close) / 3
    return {
        "p": pivot,
        "r1": 2 * pivot - low,
        "s1": 2 * pivot - high,
        "r2": pivot + (high - low),
        "s2": pivot - (high - low),
        "r3": high + 2 * (pivot - low),
        "s3": low - 2 * (high - pivot),
    }


def symbols_from_query(path):
    query = urllib.parse.urlparse(path).query
    symbols = urllib.parse.parse_qs(query).get("symbols", [""])[0]
    return [symbol.strip().upper() for symbol in symbols.split(",") if symbol.strip()][:12]


class PivotHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        path = urllib.parse.urlsplit(self.path).path
        if path in ("/", "/health"):
            self.write_json({"status": "ok", "service": "CoinScope API"})
            return
        if path == "/api/tickers":
            self.write_json({"items": self.tickers_response()})
            return
        if path == "/api/pivots":
            self.write_json({"items": self.pivots_response()})
            return
        if path == "/api/symbol-search":
            self.write_json({"items": self.symbol_search_response()})
            return
        self.send_error(404, "Not found")

    def tickers_response(self):
        items = []
        for symbol in symbols_from_query(self.path):
            parsed = parse_symbol(symbol)
            try:
                ticker = ticker_for(parsed)
                items.append({"symbol": symbol, **(ticker or {})})
            except Exception as error:
                items.append({"symbol": symbol, "error": str(error)})
        return items

    def pivots_response(self):
        items = []
        for symbol in symbols_from_query(self.path):
            parsed = parse_symbol(symbol)
            try:
                candle = previous_daily_for(parsed)
                pivot = calculate_pivot(candle) if candle else None
                items.append({"symbol": symbol, "pivot": pivot})
            except Exception as error:
                items.append({"symbol": symbol, "error": str(error)})
        return items

    def symbol_search_response(self):
        params = symbol_search_params(self.path)
        try:
            return tradingview_symbol_search(
                params["text"],
                exchange=params["exchange"],
                limit=params["limit"],
            )
        except Exception as error:
            return [{"error": str(error)}]

    def write_json(self, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = ThreadingHTTPServer((HOST, PORT), PivotHandler)
    display_host = "127.0.0.1" if HOST in ("0.0.0.0", "") else HOST
    print(f"Pivot Multi Charts: http://{display_host}:{PORT}/")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
