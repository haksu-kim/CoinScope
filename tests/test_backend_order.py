"""Deterministic trading exchange sort without network access."""
import importlib.util
import time
import urllib.parse
from pathlib import Path

root = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("coinscope_server", root / "backend/server.py")
server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server)
server.SEARCH_CACHE.clear()
server.SEARCH_TYPES = ("gate", "bybit", "binance")


def fake_get_json(url):
    kind = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)["type"][0]
    time.sleep(.003 if kind == "gate" else .04)
    exchange = {"gate": "GATEIO", "binance": "BINANCE", "bybit": "BYBIT"}[kind]
    return [{"symbol": "BTCUSDT.P", "exchange": exchange, "type": "crypto"}]


server.get_json = fake_get_json
results = server.tradingview_symbol_search("BTC", limit=2)
assert [item["symbol"] for item in results] == ["BINANCE:BTCUSDT.P", "BYBIT:BTCUSDT.P"], results
print("Backend order test OK")
