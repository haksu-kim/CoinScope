#!/usr/bin/env python3
import json
import math
import os
import ssl
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "4174"))
QUOTES = ("USDT", "USDC", "USD", "BTC", "ETH")
PUBLIC_MARKET_CONTEXT = ssl._create_unverified_context()


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
    request = urllib.request.Request(url, headers={"User-Agent": "PivotMultiCharts/1.0"})
    with urllib.request.urlopen(request, timeout=6, context=PUBLIC_MARKET_CONTEXT) as response:
        return json.loads(response.read().decode("utf-8"))


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


class PivotHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        if self.path.startswith("/api/tickers"):
            self.write_json({"items": self.tickers_response()})
            return
        if self.path.startswith("/api/pivots"):
            self.write_json({"items": self.pivots_response()})
            return
        super().do_GET()

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
