# CoinScope 2.1 업데이트 안내

**기존 GitHub 저장소를 보존하면서 업데이트합니다.** `CoinScope-v3-update.zip`은 변경한 파일만 담았습니다. 이미 연결한 `docs/config.js`, `docs/symbols-cache.js` 및 Git 이력은 덮어쓰지 않습니다.

## 적용

```bash
cd ~/Documents/git_local/coinscope
git status -sb
git switch main
git pull --ff-only
# 업데이트 전 백업 브랜치를 선택적으로 생성
git branch backup/pre-coinscope-v3
unzip -o ~/Downloads/CoinScope-v3-update.zip -d .
node --check docs/app.js
python3 -m py_compile backend/server.py
git add -A
git commit -m "feat: upgrade CoinScope search and responsive workspace"
git push origin main
```

## 확인

1. GitHub Pages 주소에서 3개 기본 차트가 표시되는지 확인합니다.
2. **차트 관리 → 종목 검색**에서 `BTC` 검색 시 Binance가 앞쪽에 나오는지 확인합니다.
3. 선호 거래소를 Bybit로 바꾸고 같은 검색에서 Bybit가 먼저 표시되는지 확인합니다.
4. 종목 옆 ☆를 눌러 즐겨찾기가 유지되는지 확인합니다.
5. 상단 **새 작업 공간**을 만들고 차트를 추가한 뒤 다른 작업 공간으로 전환해 봅니다.
6. 모바일에서 한 차트만 크게 보이며 이전/다음 전환이 가능한지 확인합니다.
7. `<https://coinscope-api-zhel.onrender.com/health>`에서 API 응답을 확인합니다.
8. Render 자동 배포가 꺼져 있다면 새 커밋으로 수동 재배포합니다.

**참고:** 서버의 변경은 실시간 종목 검색 결과 정렬을 안정화합니다. API가 작동하지 않는 경우에도 저장 목록 검색은 사용할 수 있습니다. 브라우저/OS/네트워크에 따라 TradingView 위젯 화면은 달라질 수 있습니다.
