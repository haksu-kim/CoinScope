# CoinScope 2.0 업데이트 방법

## GitHub 저장소에 적용

1. 기존 `haksu-kim/CoinScope` 저장소를 clone한 폴더로 이동합니다. `.git` 폴더가 보존된 상태여야 합니다.
2. 백업 브랜치를 생성합니다: `git branch backup/before-ui-v2` (중복 이름이라면 생략).
3. `CoinScope-v2-update.zip`을 **저장소 루트**에서 압축 해제합니다. 예: `unzip -o ~/Downloads/CoinScope-v2-update.zip -d .`
4. `docs/index.html`, `docs/styles.css`, `docs/app.js`가 교체됩니다. `docs/config.js`, `docs/symbols-cache.js`, `backend`는 그대로 둡니다.
5. 검사: `node --check docs/app.js`, `git diff --stat`
6. `git add docs/index.html docs/styles.css docs/app.js`, `git commit -m "feat: redesign CoinScope responsive trading workspace"`, `git push origin main`
7. GitHub Pages 설정이 `main` / `/docs`라면 자동 배포됩니다.

## 새 UI

- PC: 사이드바에서 차트를 선택하고 자동/1열/2열/3열 배치로 변경할 수 있습니다.
- 모바일: 종목 탭과 양옆 화살표로 차트를 변경합니다. 기본적으로 현재 차트만 불러옵니다.
- 각 차트 우측의 돋보기로 종목을 변경하고 확대 버튼으로 차트를 크게 볼 수 있습니다.
- 차트 관리에서 차트별 봉 주기를 조정하고, 모바일에서도 위/아래 버튼으로 순서를 변경할 수 있습니다.

Render 배포는 필수가 아닙니다. 차트는 TradingView 스크립트에 의존하며, 종목 검색은 기존 브라우저 캐시나 외부 API 접근 가능 여부에 따라 일부 차이가 있습니다.

## 검증

Chromium 기반 오프라인 UI 검사(TradingView 위젯은 테스트용 모의 객체)를 다음에서 통과했습니다: 데스크톱 1440×900, 태블릿 800×1000, 모바일 390×844, 작은 모바일 320×640, 모바일 가로 844×390. 실제 TradingView CDN 연동과 외부 거래소 API 응답은 GitHub Pages 배포 후 브라우저에서 별도 확인해야 합니다.
