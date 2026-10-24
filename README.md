# CoinScope 2.1 — Responsive Trading Workspace

CoinScope는 **TradingView 임베드 차트**를 최대 9개까지 확인하고, 모바일에서는 한 번에 한 차트를 크게 표시하는 멀티 차트 웹입니다. 프론트엔드는 GitHub Pages에, 선택적인 종목 검색 API는 Render에 배포합니다.

## 이번 업데이트

- **통합 종목 검색:** 차트 관리 창에서 종목 검색·추가, 거래소 필터, 결과 정렬(관련도/거래소/종목명), 선호 거래소 설정, 즐겨찾기만 보기를 제공합니다. 관련도가 같으면 기본적으로 Binance → Bybit → OKX → Gate.io 순으로 정렬합니다. 선호 거래소는 변경할 수 있습니다.
- **Render 검색 연동:** 종목 캐시가 존재해도 Render API를 호출합니다. 저장된 검색 결과를 먼저 보여주고, Render 결과가 도착하면 목록을 갱신합니다. 무료 서버가 잠든 경우 검색 응답을 최대 6.5초 기다리고 캐시로 계속 검색합니다.
- **차트 성능:** 차트 순서 변경이나 종목 추가 시 바뀌지 않은 TradingView 위젯을 최대한 유지합니다. 데스크톱에서는 화면에 가까운 차트부터 로드합니다. 봉·보조지표 변경 시에는 필요한 차트만 다시 만듭니다.
- **모바일 UI:** 선택한 차트 하나를 크게 표시하고 탭·이전·다음으로 이동합니다. 좁은 화면에 맞춰 검색/설정 창과 터치 버튼 크기를 조정했습니다.
- **즐겨찾기:** 통합 검색 또는 차트 상단의 별을 눌러 즐겨찾기를 저장합니다. PC 사이드바에서 빠르게 접근할 수 있습니다.
- **작업 공간:** 여러 차트 배치/봉/지표 설정을 별도 작업 공간으로 만들고, 이름 변경·전환·삭제할 수 있습니다. 기존 로컬 저장 설정이 있으면 첫 작업 공간으로 이전합니다.
- **신뢰성:** 외부 아이콘 CDN 버전을 고정하고 차트 연결 실패 시 재시도 버튼을 표시합니다. 심볼 캐시 갱신 GitHub Actions를 추가했습니다.

## 배포 구성

```text
CoinScope/
├── docs/                        # GitHub Pages: main /docs
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── config.js
│   ├── symbols-cache.js
│   └── .nojekyll
├── backend/                     # Render Python 서버
│   ├── server.py
│   ├── requirements.txt
│   └── build_symbol_cache.py
├── .github/workflows/
│   └── refresh-symbol-cache.yml
├── render.yaml
└── .gitignore
```

배포된 사이트: <https://haksu-kim.github.io/CoinScope/>  
Render API: <https://coinscope-api-zhel.onrender.com>  
API 상태 점검: <https://coinscope-api-zhel.onrender.com/health>

`docs/config.js`에 현재 Render API 주소가 지정되어 있습니다. API를 연결하지 않더라도 기존 저장 목록과 TradingView 위젯을 사용할 수 있습니다.

## 업데이트 적용

**기존 GitHub 저장소 `haksu-kim/CoinScope`의 루트에서** 업데이트 ZIP을 압축 해제하세요. `.git`은 건드리지 마세요.

```bash
cd ~/Documents/git_local/coinscope
git switch main
git pull --ff-only
# ZIP을 ~/Downloads에 내려받은 경우
unzip -o ~/Downloads/CoinScope-v3-update.zip -d .
node --check docs/app.js
python3 -m py_compile backend/server.py
git add docs/index.html docs/styles.css docs/app.js backend/server.py .github/workflows/refresh-symbol-cache.yml README.md UPGRADE.md
git commit -m "feat: improve CoinScope search, workspaces, mobile and chart performance"
git push origin main
```

GitHub Pages 설정은 **Settings → Pages → Deploy from a branch → main /docs**로 유지합니다. `render.yaml`은 그대로이므로 Render에서 GitHub 자동 배포를 켜 두었다면 서버 코드도 재배포됩니다. 수동 배포인 경우 Render에서 Deploy latest commit을 실행하세요.

## 캐시 갱신

`.github/workflows/refresh-symbol-cache.yml`은 매주 일요일 UTC 03:00(한국 시간 일요일 12:00)에 자동 갱신을 시도합니다. GitHub **Actions → Refresh CoinScope symbol cache → Run workflow**에서 수동 실행도 가능합니다. 새 캐시 데이터가 너무 적으면 파일을 교체하지 않습니다. GitHub Actions가 허용되어야 작동합니다.

## 제한 사항

- 저장된 작업 공간과 즐겨찾기는 `localStorage`에 저장되므로 **같은 브라우저·기기에서만 유지**됩니다. 로그인/기기 간 동기화는 제공하지 않습니다.
- 외부 TradingView 위젯 내부의 차트·종목 변경 상태를 CoinScope가 완전히 제어할 수는 없습니다. 차트 추가/관리 설정은 CoinScope가 저장합니다.
- Render 무료 서버가 잠들었거나 외부 TradingView 검색 API가 제한되면 실시간 검색이 실패할 수 있습니다. 캐시 결과를 계속 이용할 수 있습니다.
- 배포 전에 실기기에서 TradingView 차트 및 모바일 가로 화면을 확인하세요. 정적 코드 및 모의 데이터 테스트만으로 외부 차트 동작을 보장할 수 없습니다.
