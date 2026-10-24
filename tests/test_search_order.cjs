/** Run with: node tests/test_search_order.cjs — no external packages needed. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root=path.resolve(__dirname,'..');
let code=fs.readFileSync(path.join(root,'docs/app.js'),'utf8');
code=code.replace(/\ninit\(\);\s*$/,'');
const ctx=vm.createContext({
  window:{matchMedia:()=>({matches:false}),location:{protocol:'https:'},PIVOT_API_BASE_URL:'',setTimeout,clearTimeout},
  document:{querySelector:()=>({}),querySelectorAll:()=>[]},
  localStorage:{getItem:()=>null,setItem:()=>{}},
  URLSearchParams,AbortController,console,setTimeout,clearTimeout,navigator:{onLine:true}
});
vm.runInContext(code,ctx);
vm.runInContext(fs.readFileSync(path.join(root,'docs/symbols-cache.js'),'utf8'),ctx);
vm.runInContext('loadCachedSymbolResults()',ctx);
const binance=vm.runInContext('findCachedTickerSymbols("BTC")[0].symbol',ctx);
assert.ok(binance.startsWith('BINANCE:'),binance);
vm.runInContext('state.preferredExchange="BYBIT"',ctx);
const bybit=vm.runInContext('findCachedTickerSymbols("BTC")[0].symbol',ctx);
assert.ok(bybit.startsWith('BYBIT:'),bybit);
assert.equal(vm.runInContext('normalizeSymbols(["BINANCE:BTCUSDT.P","BINANCE:BTCUSDT.P"]).length',ctx),1);
console.log('Frontend sorting, preference, and dedup tests OK');
