# CoinScope — GitHub Pages + Render 배포

기존 CoinScope 차트 앱을 **GitHub Pages(정적 프론트엔드)**, 필요하면 **Render(TradingView 심볼 검색 API)**로 운영합니다. 기존 닷홈 주소는 새 사이트를 확인할 때까지 유지하세요.

## 폴더 구성

```text
coinscope/
├── docs/                 # GitHub Pages가 배포하는 파일
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── config.js         # Render URL 설정
│   ├── symbols-cache.js
│   └── .nojekyll
├── backend/              # Render Python API
│   ├── server.py
│   ├── requirements.txt
│   └── build_symbol_cache.py
├── render.yaml           # Render Blueprint
├── .gitignore
└── README.md
```

## 1. GitHub 저장소 만들고 업로드하기

1. GitHub에서 **New repository** → 이름 `coinscope` → **Public** → Create repository.
2. 압축을 푼 `coinscope` 폴더에서 터미널을 열고 아래 명령을 실행합니다. GitHub 계정 이름이 다르면 URL을 수정하세요.

```bash
git init -b main
git add .
git commit -m "chore: prepare CoinScope deployment"
git remote add origin https://github.com/haksu-kim/coinscope.git
git push -u origin main
```

기존 Git 저장소가 이미 있다면 `git init`/`remote add` 단계는 생략하고 현재 remote를 확인한 뒤 업로드합니다.

3. GitHub 저장소 → **Settings → Pages**.
4. Source: **Deploy from a branch** / Branch: `main` / Folder: `/docs` → **Save**.
5. 공개 주소(저장소 이름과 계정이 이 예시대로라면): `https://haksu-kim.github.io/coinscope/`.

GitHub Pages만 사용해도 실시간 TradingView 차트, 차트 배치, 봉과 지표 설정, 저장된 캐시를 이용한 종목 검색 기능이 동작하도록 기존 코드가 구성되어 있습니다. 서버가 없으면 TradingView *실시간 검색*은 브라우저의 직접 요청/CORS 제약으로 일부 제한될 수 있습니다.

## 2. Render 연결 (선택, 실시간 전체 심볼 검색 향상)

1. [Render Dashboard](https://dashboard.render.com/)에 로그인합니다.
2. **New → Blueprint**에서 위 GitHub 저장소를 연결하고 `render.yaml`을 선택해 배포합니다. Blueprint가 어렵다면 **New → Web Service**로 같은 저장소를 연결하고 Root Directory를 `backend`, Build Command를 `pip install -r requirements.txt`, Start Command를 `python server.py`, Health Check Path를 `/health`로 설정할 수 있습니다.
3. 배포 후 Render 대시보드에 표시되는 **실제** `https://...onrender.com` 서비스 URL을 복사합니다. 주소가 예시와 같다고 가정하면 안 됩니다.
4. `docs/config.js`를 아래처럼 수정합니다. 마지막 `/`는 빼세요.

```js
window.PIVOT_API_BASE_URL = "https://실제로-할당된-주소.onrender.com";
```

5. 변경 사항을 GitHub에 커밋/푸시하면 GitHub Pages에 자동 반영됩니다.
6. `https://실제로-할당된-주소.onrender.com/health`에 접속하여 `{"status":"ok", ...}` 응답을 확인합니다.
7. 새 GitHub Pages 주소에서 **차트 추가 → 종목 검색**을 확인합니다. Render가 정상 연결되면 `TradingView 실시간 검색 연결됨` 문구가 나올 수 있습니다.

Render 서버는 GitHub Pages와 출처가 달라도 검색할 수 있도록 공개 읽기 전용 API에 `Access-Control-Allow-Origin: *`를 사용합니다. 별도의 API 키를 사용하지 않습니다. 비밀키는 `config.js`에 넣으면 안 됩니다.

Render 무료 서비스는 사용하지 않으면 잠시 중지될 수 있으며, 처음 검색할 때 응답이 늦어질 수 있습니다. 차트 자체는 TradingView 위젯이므로 Render 없이도 계속 이용할 수 있습니다. 서버의 외부 TradingView 검색은 상대측 정책이나 장애의 영향을 받을 수 있습니다.

## 3. 심볼 캐시 갱신 (필요한 경우)

```bash
python3 backend/build_symbol_cache.py --output docs/symbols-cache.js
```

작업 디렉터리는 `coinscope/` 루트로 잡습니다. 캐시 파일은 현재 ZIP에 포함되어 있으므로 처음 배포할 때 갱신할 필요가 없습니다.

## 4. 확인 사항

- GitHub Pages URL에서 화면 및 차트가 표시되는지
- 3개 기본 차트 / 추가 차트 / 지표 / 봉 / 가로 배치가 동작하는지
- BTC, ETH와 다른 심볼이 검색되는지
- Render 연결 시 `/health`가 200을 반환하는지, 종목 검색 API가 정상 동작하는지
- 기존 닷홈 주소는 검증이 끝날 때까지 유지할 것

## 참고

정적 사이트의 차트 설정은 기존 코드의 브라우저 `localStorage`에 저장되므로 **닷홈과 GitHub Pages는 도메인이 달라 기존 설정이 자동으로 이전되지는 않습니다.** 새 사이트에서는 기본 설정부터 시작합니다.

프론트엔드에서 호출하는 외부 스크립트는 TradingView 및 Lucide CDN입니다. CDN 또는 외부 서비스가 제한되면 일부 기능에 영향이 있을 수 있습니다.
