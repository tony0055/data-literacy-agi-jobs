# qa — 덱 시각 QA 기록과 검사기

발표 덱(`presentation/index.html`, 34장)을 고치기 전에 "이상 상태"를 조건으로 적고, 기준선(커밋 46a5bfc)에서 어긋난 곳을 위반으로 모은 감사 기록이다. 이후 PR은 모두 이 폴더의 조건과 검사기로 검증한다.

## 들어 있는 것

| 파일 | 내용 |
| --- | --- |
| [ideal-state.md](ideal-state.md) | 이상 상태 147조건(레이아웃·면·카드·색·대비·타이포·문장·이미지·차트·근거·내비게이션·컨트롤·안내·반응형·모션·접근성·성능·메타·인쇄·표준) |
| [hig-principles.md](hig-principles.md) · [rules.md](rules.md) | 조건의 근거: HIG 읽기 정리, 규칙 159개(출처·충돌 해소 포함) |
| [violations.md](violations.md) | 1회차 감사 위반 278건(critical 4 · major 144 · minor 130). 근거 링크는 `evidence/`와 `before/` |
| [violations.json](violations.json) | 같은 위반의 기계용 사본 + `criteria`(147조건: id · verify_method · verify_procedure · threshold). 검사기가 읽는 원본 |
| [PLAN.md](PLAN.md) | PR1~PR7 실행 계획(맡는 파일·배정 위반·통과해야 할 조건) |
| [LOG.md](LOG.md) | 회차별 기록 |
| `evidence/` | 위반 근거 크롭·측정 결과 |
| `before/slide-NN.jpg` | 기준선 34장 1920×1080 렌더(품질 85) |
| `reports/<label>.md·json` | 검사기 보고서. `baseline`이 기준선 |
| `exceptions.json`(선택) | 조건별로 의도한 예외 장. `{"LAY-01": {"slides": [1, 2], "reason": "표지·계단 문장"}}` — 보고서에 '예외로 넘김'으로 따로 남는다 |
| `pr/<번호>/before·after/` | PR마다 바뀐 장의 이전·이후 이미지(커밋한다) |
| `shots/<label>/` | 검사기 스크린샷(jpg). 다시 만들 수 있어 커밋하지 않는다(.gitignore) |

## 검사기 돌리기

```sh
cd presentation
bun scripts/visual-qa.ts --label pr2 --compare=baseline   # 기준보다 나빠진 조건을 '회귀'로 따로 표시
bun scripts/visual-qa.ts --only=TYP-03,LAY-06 --slides=5-5  # 조건·장을 좁혀서
bash scripts/qa-all.sh --label pr2 --compare=baseline      # build → render → check-numbers → 헌법 감사·token-check → visual-qa
```

- 필요한 것: bun(Bun.WebView chrome 백엔드), PIL·numpy가 있는 파이썬(`QA_PY=<경로>`로 지정, 없으면 `python3`), poppler(`pdfinfo`·`pdftotext`·`pdftoppm`), 공통 덱 스킬 스크립트(`QA_DECK_SKILL`, 기본 `~/.agents/skills/designing-decks-and-motion/scripts`). 있으면 taste-skill `lint.mjs`(`QA_TASTE_SCRIPTS`)도 돌린다.
- 선택: `--net`(원문 링크 HTTP 상태), `--public=<URL>`(공개 URL의 장 수·글꼴·빈 차트).
- 한 번에 4~5분 걸린다(표지 30초 대기·탭 숨김 10초·느린 회선 측정 포함). 실패가 하나라도 있으면 종료 코드 1.

### 무엇을 어떻게 재나

- `?check=1`·`?slide=n`(1920×1080) 렌더에서 장마다 DOM·계산 스타일·상자를 잰다(`scripts/vqa/page.js`). svg 글자는 화면 배율을 곱한 실효 크기로 잰다.
- 발표 무대(`index.html#n`)를 CDP Emulation으로 1920×1080 · 1512×982 · 1440×900 · 1366×768 · 1280×720 · 1024×768 · 2560×1080 · 960×1080 · 844×390 · 812×375 · 768×1024 · 390×844 · 375×812(휴대폰은 터치)에서 열어 배율·고정 컨트롤·겹침·실효 글자를 잰다.
- 터치 스와이프·키보드·hashchange·개요·뒤로 가기·연타·모션 감소·탭 숨김·전체 화면 미지원·JS 끔·anime 차단·이미지 차단·느린 회선·인쇄는 CDP Input·Emulation·Network로 실제로 조작해 판정한다.
- 대비·면·채도·레터박스·다크 모드 차이·썸네일 SSIM처럼 픽셀이 필요한 것은 스크린샷을 `scripts/qa_pixels.py`로 잰다.
- 헌법 감사(`constitution_audit.py`)·`token-check.ts --strict`·`check-numbers.ts`·`render.ts`(fit 보고)·`probe-nav.ts` 결과를 해당 조건에 넣는다.
- 판정 규칙은 `scripts/vqa/judge.ts`에 조건 id마다 한 함수로 있다. visual 조건 5개와 OCR이 필요한 IMG-02는 수동으로 두고, 보고서에 볼 스크린샷 묶음과 확인 절차를 낸다. both 조건은 자동 부분을 판정하고 남은 눈 확인 절차를 함께 낸다.
- 이 환경에 없는 도구(axe-core·Lighthouse·tesseract)가 필요한 조건은 직접 잰 근사로 판정하고 보고서에 '부분'으로 표시한다. 에뮬레이션 결과는 실기기 확인이 아니다.

## fit.js 예외

`src/fit.js`의 `?check` 모드는 3차 정보 예외 목록(TERTIARY)이나 결론 띠 안이라 넘긴 글자를 숨기지 않고 `#report-excepted`에 '예외로 넘김'으로 남긴다(`render.ts` 출력의 `excepted`). 14px 미만은 예외 목록에 있어도 실패다. 차트·도식 svg는 첫 글자 하나가 아니라 모든 글자를 축소 배율을 곱해 잰다. 발표 화면 표시는 바뀌지 않는다.
