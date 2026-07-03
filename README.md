# PIVOT COMMAND

TradingView 위젯 기반 멀티 코인 선물 차트입니다.

## GitHub Pages로 배포

1. 이 폴더를 GitHub 저장소에 올립니다.
2. GitHub 저장소에서 `Settings` > `Pages`로 이동합니다.
3. `Build and deployment`에서 `Deploy from a branch`를 선택합니다.
4. Branch는 `main`, folder는 `/root`를 선택합니다.
5. 저장하면 `https://계정명.github.io/저장소명/` 주소로 열립니다.

## GitHub Pages 모드에서의 차이

- TradingView 차트, 지표, 심볼 추가, 차트 배치는 동작합니다.
- 실시간 차트는 TradingView 위젯과 거래소 WebSocket을 브라우저에서 직접 사용합니다.
- Python 서버의 `/api/tickers`, `/api/pivots`는 GitHub Pages에서 실행되지 않습니다.
- 피봇/가격 보조 데이터는 브라우저에서 직접 가져올 수 있을 때만 표시됩니다.

## 서버 포함 배포

피봇/가격 API 중계까지 더 안정적으로 쓰려면 Render 같은 Python Web Service 배포를 사용합니다.
