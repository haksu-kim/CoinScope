#!/usr/bin/env python3
import argparse
import json
import time
from datetime import datetime, timezone
from pathlib import Path

from server import tradingview_symbol_search


DEFAULT_SEEDS = (
    "BTCUSDT.P",
    "ETHUSDT.P",
    "SOLUSDT.P",
    "XRPUSDT.P",
    "BNBUSDT.P",
    "DOGEUSDT.P",
    "ADAUSDT.P",
    "AVAXUSDT.P",
    "LINKUSDT.P",
    "SUIUSDT.P",
    "TRXUSDT.P",
    "DOTUSDT.P",
    "LTCUSDT.P",
    "BCHUSDT.P",
    "TONUSDT.P",
    "UNIUSDT.P",
    "APTUSDT.P",
    "NEARUSDT.P",
    "ARBUSDT.P",
    "OPUSDT.P",
    "AAVEUSDT.P",
    "ENAUSDT.P",
    "PEPEUSDT.P",
    "SHIBUSDT.P",
    "INJUSDT.P",
    "SEIUSDT.P",
    "TIAUSDT.P",
    "FILUSDT.P",
    "ETCUSDT.P",
    "ATOMUSDT.P",
    "ICPUSDT.P",
    "JUPUSDT.P",
    "RUNEUSDT.P",
    "MKRUSDT.P",
    "WLDUSDT.P",
    "ORDIUSDT.P",
    "GALAUSDT.P",
    "PENDLEUSDT.P",
    "ONDOUSDT.P",
    "NAS100USD",
    "NAS100",
    "US100",
    "NDX",
    "SPX500USD",
    "SPX500",
    "US500",
    "SPX",
    "US30USD",
    "US30",
    "DJI",
    "DXY",
    "VIX",
    "NQ1!",
    "ES1!",
    "YM1!",
    "XAUUSD",
    "XAGUSD",
    "EURUSD",
    "GBPUSD",
    "USDJPY",
    "AUDUSD",
    "USDCAD",
    "USDCHF",
    "NZDUSD",
    "AAPL",
    "MSFT",
    "NVDA",
    "TSLA",
    "AMZN",
    "META",
    "GOOGL",
    "AMD",
    "QQQ",
    "SPY",
)


def item_aliases(item):
    aliases = set()
    symbol = str(item.get("symbol") or "").upper()
    title = str(item.get("title") or "").upper()
    subtitle = str(item.get("subtitle") or "")

    for value in (symbol, title, subtitle):
        if value:
            aliases.add(value)

    symbol_name = symbol.split(":", 1)[1] if ":" in symbol else symbol
    if symbol_name:
        aliases.add(symbol_name)
        aliases.add(symbol_name.replace(".P", ""))
        aliases.add(symbol_name.replace("PERP", ""))

    return sorted(value for value in aliases if value)


def compact_item(item):
    return {
        "symbol": item.get("symbol", ""),
        "title": item.get("title", ""),
        "subtitle": item.get("subtitle", ""),
        "exchangeLabel": item.get("exchangeLabel", ""),
        "typeLabel": item.get("typeLabel", ""),
        "aliases": item_aliases(item),
    }


def collect_symbols(seeds, limit_per_query, pause):
    seen = set()
    items = []
    total = len(seeds)

    for index, seed in enumerate(seeds, start=1):
        print(f"[{index}/{total}] {seed}")
        try:
            results = tradingview_symbol_search(seed, limit=limit_per_query)
        except Exception as error:
            print(f"  skipped: {error}")
            continue

        for item in results:
            symbol = item.get("symbol")
            if not symbol or symbol in seen:
                continue
            seen.add(symbol)
            items.append(compact_item(item))

        if pause:
            time.sleep(pause)

    return items


def write_cache(output_path, items, seeds):
    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": "tradingview-symbol-search",
        "seedCount": len(seeds),
        "itemCount": len(items),
        "items": items,
    }
    body = "window.COIN_SCOPE_SYMBOL_CACHE = "
    body += json.dumps(payload, ensure_ascii=False, indent=2)
    body += ";\n"
    output_path.write_text(body, encoding="utf-8")


def parse_args():
    parser = argparse.ArgumentParser(description="Build Coin Scope static symbol search cache.")
    parser.add_argument("--output", default="symbols-cache.js", help="Output JavaScript cache path.")
    parser.add_argument("--limit-per-query", type=int, default=40, help="TradingView result limit per seed.")
    parser.add_argument("--pause", type=float, default=0.12, help="Pause between seed searches.")
    parser.add_argument("--seed", action="append", default=[], help="Extra search seed. Can be repeated.")
    parser.add_argument("--allow-empty", action="store_true", help="Write an empty cache if no symbols are collected.")
    return parser.parse_args()


def main():
    args = parse_args()
    seeds = list(dict.fromkeys([*DEFAULT_SEEDS, *args.seed]))
    items = collect_symbols(seeds, max(1, min(args.limit_per_query, 100)), max(0, args.pause))
    if not items and not args.allow_empty:
        raise SystemExit("No symbols were collected. Existing cache was left untouched.")
    write_cache(Path(args.output), items, seeds)
    print(f"Wrote {len(items)} symbols to {args.output}")


if __name__ == "__main__":
    main()
