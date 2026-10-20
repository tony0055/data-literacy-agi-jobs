<!-- 생성 파일 — scripts/build.mjs. 손으로 고치지 않는다. 값은 토큰 원본에서 만든다(TK-01). -->
# 디자인 시스템 — 직접 고름(기본 바탕)

이 파일과 같은 폴더의 CSS·아이콘으로 이 조합의 화면(앱·덱·시안)을 만든다. 값의 정본은 `product-design-system/design-system/tokens`의 원본이고, 이 파일은 `node product-design-system/design-system/scripts/build.mjs`가 만들었다(2026-10-20). 원본이 바뀌면 다시 빌드한다.

프리셋 설명: default 프리셋에서 variant=C, accent=blue, context=light로 바꿈

> **맥락 고정 조합 — 덱·인쇄·이미지·시안용. 배포하는 앱은 자동(CO-25).** 이 묶음은 맥락을 라이트(`light`)로 고정했다. 실제로 배포하는 앱은 `--context auto`로 다시 빌드한다.

## 1. 이 조합

| 축 | 값 | 뜻 |
| --- | --- | --- |
| 변형안 | C 청량 | 채도를 sRGB가 허용하는 만큼 살리고 색상각을 차가운 쪽으로 옮겼어요(파랑은 남색 쪽, 초록은 청록 쪽). 회색에 푸른 기운이 있어요. 어울리는 곳: 짧게 눈길을 끌어야 하는 화면: 발표 덱, 첫 화면·소개 화면, 큰 화면·프로젝터. 차갑고 또렷한 인상. |
| 강조 색상 | blue 파랑 | 주 버튼·선택·초점 고리·켜진 컨트롤에 쓰인다. 링크는 강조와 따로 파랑이다(CO-09). |
| 맥락 | light 라이트 | 라이트로 고정한다. `prefers-contrast: more`면 라이트 대비 높임으로 바뀐다. 덱·인쇄·이미지·시안처럼 화면 모드를 바꿀 일이 없는 결과물용이다. |

고정 축(프리셋으로 바꾸지 않는다, `product-design-system/design-system/guideline/presets.md`):

| 축 | 값 | 원본 |
| --- | --- | --- |
| 글꼴 | Pretendard (`pretendard`) | `tokens/type.fonts.json` decision.chosen |
| 글자 단계 | 표준 (`standard`) | `tokens/type.scale.json` decision.chosen |
| 형태 | 그림자 중간 (`mid`) | `tokens/shape.json` decision.chosen |
| 아이콘 | Lucide (`lucide`) | `tokens/icon.json` decision.chosen |
| 모션 | 여유 있게 (`relaxed`) | `tokens/motion.json` decision.chosen |
| 컴포넌트 | 채움 (`solid`) | `components/variants.json` decision.chosen |
| 밀도 | 표준 (`standard`) | `tokens/space.json` decision.chosen |

이 조합을 다시 만들거나 바꿀 때:

```json
{
  "name": "직접 고름(기본 바탕)",
  "about": "default 프리셋에서 variant=C, accent=blue, context=light로 바꿈",
  "variant": "C",
  "accent": "blue",
  "context": "light"
}
```

```sh
node product-design-system/design-system/scripts/build.mjs [<프리셋 id>] [--variant A|B|C] [--accent <색상>] [--context auto|light|dark|light-contrast|dark-contrast] [--accept-near-status] [--out <폴더>]
```

고를 수 있는 강조 색상(변형안 C): `yellow` 노랑(찾기 표시와 같은 색상), `mint` 민트(상태 색 green에 가까움, ΔE2000 12.7), `teal` 틸(상태 색 cyan에 가까움, ΔE2000 8.1), `blue` 파랑, `indigo` 인디고, `purple` 보라, `pink` 분홍(상태 색 red에 가까움, ΔE2000 8.5), `brown` 갈색(상태 색 orange에 가까움, ΔE2000 11.8). 상태 색 `red`(오류·위험), `green`(성공), `orange`(경고), `cyan`(정보)은 고를 수 없다(CO-14).

## 2. 불러오는 법

이 순서로 불러온다. 앞의 것이 뒤의 것이 쓰는 변수를 정한다.

```html
<link rel="stylesheet" href="fonts.css">       <!-- Pretendard (CDN @import) -->
<link rel="stylesheet" href="tokens.css">      <!-- 토큰: 이 조합의 변수 전부 -->
<link rel="stylesheet" href="layout.css">      <!-- 배치 부품: .stack .inline .grid -->
<link rel="stylesheet" href="components.css">  <!-- 컴포넌트 모양 -->
```

문서 기본 글과 바탕은 화면 쪽 CSS에서 토큰으로 정한다(토큰 CSS는 `word-break: keep-all`만 정한다).

```css
html { background: var(--color-background-1); color: var(--color-text-1); }
body { margin: 0; font: var(--type-body); letter-spacing: var(--type-body-letter-spacing); }
button, input, select, textarea { font: inherit; color: inherit; }
```

아이콘(Lucide 1.50.0, ISC, 라이선스 `icons-LICENSE.txt`)은 스프라이트 `icons.svg` 하나다. 색은 글자 색(currentColor)을 따르고 크기는 `.icon`(16) · `.icon--size-2`(20) · `.icon--size-3`(24)이다.

```html
<svg class="icon" aria-hidden="true"><use href="icons.svg#icon-checkmark"/></svg>
```

- 파일을 그냥 열면(file://) 브라우저가 다른 파일의 `<use href>`를 막는다. 서버로 열거나, 한 파일짜리 결과물(덱 HTML 등)은 `icons.svg`의 `<symbol>`들을 문서 맨 앞 `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">` 안에 넣고 `href="#icon-이름"`으로 쓴다(`index.html`이 그렇게 한다). `<svg hidden>`은 쓰지 않는다 — `hidden`은 HTML 요소의 속성이라 `<svg>`에는 듣지 않고, 크기를 주지 않은 `<svg>`는 기본 300×150 자리를 차지해 쪽 맨 위에 빈칸이 생긴다.
- 아이콘만 있는 버튼에는 `aria-label`을 단다. 글자 옆 아이콘은 `aria-hidden="true"`.
- 있는 아이콘(60개): `magnifying-glass` `document-magnifying-glass` `lines-decreasing` `checkmark` `xmark` `plus` `trash` `pencil` `square-pencil` `scissors` `documents` `clipboard` `squares-plus` `arrow-uturn-left` `arrow-uturn-right` `folder` `paperclip` `ellipsis` `checkmark-circle` `text-bold` `text-italic` `text-underline` `text-align-left` `text-align-center` `text-align-justify` `text-align-right` `square-arrow-up` `printer` `person-circle` `thumb-up` `thumb-down` `layers` `alarm-clock` `archive-box` `calendar` `info-circle` `exclamation-circle` `exclamation-triangle` `chevron-down` `document` `clock` `person` `people` `bell` `lock` `gear` `chain-link` `credit-card` `arrow-clockwise` `arrow-down-line` `circle-notch` `chevron-right` `chevron-left` `sidebar-left` `house` `list-bullet` `squares-grid` `arrows-up-down` `minus` `chevron-up`. 없는 그림이 필요하면 `tokens/icon.json`에 이름을 더하고 `node product-design-system/design-system/scripts/icons.mjs`로 받은 뒤 다시 빌드한다.

## 3. 의미 색 토큰

화면은 의미 토큰만 쓴다: `var(--color-…)`. 값은 이 조합(변형안 C, 강조 blue)에서 푼 값이다. 

| 토큰 | 쓰임 | 라이트 | 라이트 대비 높임 |
| --- | --- | --- | --- |
| `--color-text-1` | 제목·본문·라벨 글자 | `#0F1318` | `#0F1318` |
| `--color-text-2` | 보조 글자(설명 문단) | `#3B4046` | `#282C32` |
| `--color-text-3` | 덜 중요한 글자(메타·날짜), 아이콘 버튼의 아이콘 | `#4F545B` | `#3B4046` |
| `--color-text-4` | 가장 옅은 글자 | `#666B71` | `#4F545B` |
| `--color-text-placeholder` | 입력 칸 자리표시 글 | `#666B71` | `#4F545B` |
| `--color-text-on-accent` | 강조·선택·위험 채움 위 글자(다크에서는 어두운 글자) | `#FFFFFF` | `#FFFFFF` |
| `--color-background-1` | 창·쪽 바탕 | `#FFFFFF` | `#FFFFFF` |
| `--color-background-2` | 둘째 바탕(사이드바, 탭 칸, 묶음 상자) | `#F1F7FE` | `#F1F7FE` |
| `--color-background-3` | 셋째 바탕 | `#E8EEF5` | `#E8EEF5` |
| `--color-background-elevated-1` | 한 단계 뜬 면 바탕. 지금 컴포넌트에는 쓰는 곳이 없다. 카드 바탕으로 쓰지 않는다(카드 없음). 다크에서 받침보다 한 단계 밝다 | `#FFFFFF` | `#FFFFFF` |
| `--color-background-elevated-2` | 떠 있는 층 바탕(메뉴·팝오버·툴팁·대화상자·모달·달력·목록 상자, 그림자는 elevation-2) | `#FFFFFF` | `#FFFFFF` |
| `--color-fill-1` | 진한 채움(스위치 꺼짐 홈, 아바타) | `#D5DAE2` | `#B9BFC6` |
| `--color-fill-2` | 보통 채움(세그먼트 홈) | `#E8EEF5` | `#D5DAE2` |
| `--color-fill-3` | 옅은 채움(비활성 버튼, 표 행 호버) | `#F1F7FE` | `#E8EEF5` |
| `--color-control` | 컨트롤 면(보조 버튼·입력 칸·선택 상자 바탕) | `#FFFFFF` | `#FFFFFF` |
| `--color-control-selected` | 켜진 컨트롤(체크박스·스위치·라디오) | `#365FE0` | `#274ABA` |
| `--color-control-text` | 컨트롤 안 글자 | `#0F1318` | `#0F1318` |
| `--color-control-text-disabled` | 비활성 컨트롤 글자 | `#9CA1A8` | `#82878E` |
| `--color-separator` | 장식 구분선(대비 요구 없음) | `#D5DAE2` | `#82878E` |
| `--color-separator-opaque` | 보조 버튼 테두리, 불투명 구분선 | `#B9BFC6` | `#666B71` |
| `--color-link` | 링크 글자(파랑 고정, CO-09) | `#365FE0` | `#274ABA` |
| `--color-accent` | 주 버튼·강조 채움 | `#365FE0` | `#274ABA` |
| `--color-focus-ring` | 초점 고리(AC-25) | `#527FFE` | `#274ABA` |
| `--color-selection-content-background` | 초점 있는 목록·표의 선택 행 | `#365FE0` | `#274ABA` |
| `--color-selection-content-background-unfocused` | 초점 없는 목록·표의 선택 행 | `#D5DAE2` | `#B9BFC6` |
| `--color-selection-text-background` | 글자 선택 바탕 | `#CADAFF` | `#A2BEFF` |
| `--color-header-text` | 표 머리 글자 | `#4F545B` | `#3B4046` |
| `--color-find-highlight` | 찾기 결과 표시 | `#ECDA99` | `#D9BD55` |
| `--color-status-error` | 오류 글자·테두리·아이콘 | `#D50331` | `#AB0225` |
| `--color-status-danger` | 위험 버튼 채움 | `#D50331` | `#AB0225` |
| `--color-status-success` | 성공 아이콘·글자 | `#027A4E` | `#01613D` |
| `--color-status-warning` | 경고 아이콘·글자 | `#AA5102` | `#884001` |
| `--color-status-info` | 정보 아이콘·글자 | `#027393` | `#015B75` |
| `--color-status-error-background` | 오류 배너·꼬리표 바탕 | `#FFF4F3` | `#FFE8E7` |
| `--color-status-success-background` | 성공 배너·꼬리표 바탕 | `#E6FBEF` | `#D2F6E0` |
| `--color-status-warning-background` | 경고 배너·꼬리표 바탕 | `#FFF4EE` | `#FFE9DD` |
| `--color-status-info-background` | 정보 배너·꼬리표 바탕 | `#EAF9FF` | `#D6F2FD` |
| `--color-control-border` | 입력 칸·체크박스 테두리(3:1, AC-09) | `#82878E` | `#4F545B` |
| `--color-control-hover` | 보조 버튼·아이콘 버튼 호버 | `#F1F7FE` | `#F1F7FE` |
| `--color-accent-hover` | 주 버튼 호버 | `#274ABA` | `#1D388D` |
| `--color-status-danger-hover` | 위험 버튼 호버 | `#AB0225` | `#84011B` |
| `--color-scrim` | 모달 뒤 덮개(CN-07) | `#0F131866` | `#0F131899` |
| `--color-shadow` | 그림자 색과 세기(elevation-*가 쓴다) | `#0F131824` | `#0F13183D` |
| `--color-highlight` | 다크에서 뜬 층 위 가장자리 빛(elevation-*가 쓴다) | `#FFFFFF00` | `#FFFFFF00` |

차트 계열·색상 꼬리표는 뜻 없는 색상 토큰 `--color-hue-<색상>`을 쓴다(CO-15). 상태를 말할 때는 상태 토큰을 쓴다.

| 토큰 | 라이트 | 라이트 대비 높임 |
| --- | --- | --- |
| `--color-hue-red` 빨강 | `#D50331` | `#AB0225` |
| `--color-hue-orange` 주황 | `#AA5102` | `#884001` |
| `--color-hue-yellow` 노랑 | `#7E6802` | `#645201` |
| `--color-hue-green` 초록 | `#027A4E` | `#01613D` |
| `--color-hue-mint` 민트 | `#027770` | `#015E59` |
| `--color-hue-teal` 틸 | `#027581` | `#015D67` |
| `--color-hue-cyan` 시안 | `#027393` | `#015B75` |
| `--color-hue-blue` 파랑 | `#365FE0` | `#274ABA` |
| `--color-hue-indigo` 인디고 | `#714AEC` | `#5B36C4` |
| `--color-hue-purple` 보라 | `#BE03B7` | `#980292` |
| `--color-hue-pink` 분홍 | `#D3034F` | `#A9023E` |
| `--color-hue-brown` 갈색 | `#8E5F45` | `#734A34` |

색상으로 구별하는 옅은 바탕(단계 색 칸, 핵심어 형광펜)은 `--color-hue-<색상>-background`(칸)와 `--color-hue-<색상>-mark`(형광펜, 칸보다 한 단계 진하다)를 쓴다. `color-mix()`로 섞지 않는다(`check.mjs` 3번). 위 글자는 `--color-text-1`(칸 위 라벨은 `--color-text-3`도 된다) — 네 맥락 모두 7:1 이상이다.
- 무채 단계는 새 토큰 없이 `--color-fill-1`을 칸·형광펜에 쓴다.
- 노랑 형광펜(`--color-hue-yellow-mark`)은 찾기 표시(`--color-find-highlight`)와 같은 값이다. 찾기가 있는 화면에서는 노랑 형광펜을 쓰지 않는다(CO-35).

| 색상 | 칸 라이트 | 형광펜 라이트 | 칸 라이트 대비 높임 | 형광펜 라이트 대비 높임 |
| --- | --- | --- | --- | --- |
| 빨강 (red) | `#FFE8E7` | `#FFCFCC` | `#FFCFCC` | `#FFA8A5` |
| 주황 (orange) | `#FFE9DD` | `#FFD1B6` | `#FFD1B6` | `#FFAB78` |
| 노랑 (yellow) | `#F6EDCE` | `#ECDA99` | `#ECDA99` | `#D9BD55` |
| 초록 (green) | `#D2F6E0` | `#A0EAC1` | `#A0EAC1` | `#5AD499` |
| 민트 (mint) | `#D5F3F0` | `#A7E6DF` | `#A7E6DF` | `#69CFC6` |
| 틸 (teal) | `#D6F2F7` | `#A9E4ED` | `#A9E4ED` | `#6ECCDA` |
| 시안 (cyan) | `#D6F2FD` | `#ABE2FA` | `#ABE2FA` | `#72CAED` |
| 파랑 (blue) | `#E5EDFF` | `#CADAFF` | `#CADAFF` | `#A2BEFF` |
| 인디고 (indigo) | `#ECEBFF` | `#D8D6FF` | `#D8D6FF` | `#BCB7FF` |
| 보라 (purple) | `#FFE6FB` | `#FFC9F8` | `#FFC9F8` | `#FF9DF5` |
| 분홍 (pink) | `#FFE8EA` | `#FFCED3` | `#FFCED3` | `#FFA6B1` |
| 갈색 (brown) | `#F8EBE4` | `#EFD5C7` | `#EFD5C7` | `#DDB7A3` |

## 4. 글자·간격·형태·모션

### 글자 — Pretendard, 단계 표준

`font`와 짝 자간을 함께 쓴다. `font-size`·`line-height`·`font-weight`를 따로 주지 않는다(TK-14, TY-45).

```css
.title { font: var(--type-title-2); letter-spacing: var(--type-title-2-letter-spacing); }
```

| 역할 | 크기/행간(px) | 굵기 | 자간 | 쓰임 |
| --- | --- | --- | --- | --- |
| `--type-title-1` | 26/32 | 700 | -0.02em | 쪽 제목(한 쪽에 하나) |
| `--type-title-2` | 22/28 | 700 | -0.018em | 절 제목 |
| `--type-heading` | 18/24 | 600 | -0.014em | 빈 상태·대화상자·모달·도구 막대 제목(components.css가 쓰는 곳) |
| `--type-body` | 15/24 | 400 | -0.009em | 본문 문단, 입력 칸 글 |
| `--type-body-strong` | 15/24 | 600 | -0.009em | 본문 속 강조, 배너 제목 |
| `--type-label` | 13/20 | 400 | -0.003em | 라벨·표·도움말 등 인터페이스 글 |
| `--type-label-strong` | 13/20 | 600 | -0.003em | 버튼·칸 라벨·표 머리 |
| `--type-caption` | 12/16 | 400 | 0em | 가장 작은 보조 글(12px이 바닥, TY-08) |
| `--type-code` | 13/20 | 400 | -0.003em | 코드·값(고정폭) |

- 글꼴: `"Pretendard Variable", "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif`. 고정폭은 `ui-monospace, "SF Mono", Menlo, Consolas, monospace`.
- 줄바꿈: 한글은 단어(어절) 단위로 줄을 바꾼다(word-break: keep-all). 칸보다 긴 낱말(URL, 파일 이름)은 넘치지 않게 그 안에서 끊는다(overflow-wrap: break-word).
- 숫자: 금액과 표의 숫자 칸은 같은 폭 숫자를 쓴다(font-variant-numeric: tabular-nums, TY-47). 문장 속 숫자는 기본(비례 폭)으로 둔다.
- 덱처럼 큰 화면의 큰 글자는 이 단계 밖이다. 글자 단계·밀도는 데스크톱 앱 화면 기준값이라, 덱의 제목·본문 크기는 덱 쪽 지침을 따르고 색·글꼴·아이콘·모양만 이 파일에서 가져간다.

### 간격 — 기준 8px(반 단위 4px), 밀도 표준

간격은 부모의 `gap`·`padding`으로 주고 자식에 바깥 여백을 주지 않는다(SP-61). 값은 이 단계에서만 고른다(SP-02).

| 토큰 | 값 |
| --- | --- |
| `--space-half` | 4px |
| `--space-1` | 8px |
| `--space-2` | 16px |
| `--space-3` | 24px |
| `--space-4` | 32px |
| `--space-5` | 40px |
| `--space-6` | 48px |
| `--space-8` | 64px |

관계마다 한 단계, 바깥으로 갈수록 넓게(`guideline/spacing.md` 「간격 배정」):

| 관계 | 토큰 | 값 |
| --- | --- | --- |
| 아이콘 둘레, 작은 글 덩어리 안(꼬리표·상태 표시, 이름 + 메타, 라벨 + 설명, 배너 제목 + 설명) | `space-half` | 4px |
| 컨트롤 안 아이콘과 글자 사이 | `space-1` | 8px |
| 상자·절·패널 머리의 제목 + 설명 문단, 대화상자 제목 + 설명 | `space-1` | 8px |
| 라벨과 칸 사이, 칸과 도움말·오류 문구 사이 | `space-1` | 8px |
| 세로로 놓은 항목 사이(체크박스·라디오 목록, 키-값 목록 행, 검사 목록, 안내 줄) | `space-1` | 8px |
| 도구 막대 안 항목 사이, 증감 버튼과 값 칸 사이, 이동 경로 항목과 구분 기호 사이 | `space-1` | 8px |
| 떠 있는 작은 층 안쪽(메뉴·목록 상자) | `space-1` | 8px |
| 나란한 버튼·컨트롤 사이(버튼 줄, 대화상자 버튼) | `space-2` | 16px |
| 입력 칸·선택 상자·버튼 안쪽 좌우(작은 크기도 같다) | `space-2` | 16px |
| 가로로 놓은 항목 사이(체크박스·라디오·스위치), 칸(필드) 사이 | `space-3` | 24px |
| 팝오버·달력 안쪽, 표 칸 사이, 도구 막대 구역 사이 | `space-3` | 24px |
| 묶음 사이, 대화상자·모달·탭 칸 안쪽 | `space-4` | 32px |
| 대화상자처럼 쓰는 팝오버(견본 프리셋 저장·지우기·빌드)의 내용 ↔ 버튼 줄 | `space-4` | 32px |
| 절과 절 사이 | `space-8` | 64px |

| 크기·배치 토큰 | 값 |
| --- | --- |
| `--size-control-1` | 28px |
| `--size-control-2` | 36px |
| `--size-control-3` | 44px |
| `--layout-margin` | 32px |
| `--layout-gutter` | 24px |
| `--layout-max-width` | 1280px |
| `--layout-line-length` | 40em |

- 버튼·입력 칸·선택 상자 높이는 `--size-control-2`, 작은 것은 `--size-control-1`. 누름 영역은 24×24px 이상(AC-44).
- 배치 부품(`layout.css` 머리 주석):

  배치 부품 — 피그마 자동 배치(auto layout)를 CSS로 옮긴 것(SP-61·SP-62, guideline/layout.md).
  - 흐름: .stack(세로), .inline(가로, 줄바꿈은 data-wrap), .grid(격자)
  - 간격·안쪽 여백은 부모가 갖는다(자식에 margin을 주지 않는다). 값은 간격 단계에서만: data-gap, data-pad = half · 1 · 2 · 3 · 4 · 5 · 6 · 8, 쪽 격자의 열 사이는 data-gap="gutter"(관계별 배정은 guideline/spacing.md)
  - 정렬: data-align(교차 축) = start · center · end · stretch · baseline, data-justify(주 축) = start · center · end · between
  - 크기 방식: 자식의 .hug(내용에 맞춤) · .fill(남는 자리 채움), 고정은 크기 토큰, 최대는 data-max = line · page
  - 흐름 밖: .float(부모 기준 위치, 모서리 배지 등)
  - 나란한 상자의 행 공유: .grid[data-share-rows] — 자식마다 머리·본문 두 행(값 3이면 바닥까지 세 행)을 서브그리드로 함께 쓴다

### 형태 — 그림자 중간

| 토큰 | 값 | 쓰는 곳 |
| --- | --- | --- |
| `--radius-0` | 0 |  |
| `--radius-1` | 4px | 체크박스, 꼬리표, 작은 버튼, 세그먼트 컨트롤 안 칸 |
| `--radius-2` | 8px | 버튼, 입력 칸, 선택 상자, 세그먼트 컨트롤 바깥, 배너, 표의 선택 행 |
| `--radius-3` | 12px | 묶음 상자, 팝오버·메뉴, 대화상자, 창 |
| `--border-1` | 1px |  |
| `--border-2` | 2px |  |
| `--elevation-0` | none |  |
| `--elevation-1` | y 1 흐림 3 퍼짐 0 세기 80% + y 0 흐림 0 퍼짐 1 세기 15% (color-shadow 기준) | 스크롤된 도구 막대, 창. 묶음 상자는 높이 0(그림자 없이 선으로 나눈다) |
| `--elevation-2` | y 4 흐림 12 퍼짐 0 세기 95% + y 0 흐림 0 퍼짐 1 세기 42% (color-shadow 기준) | 팝오버, 메뉴, 대화상자 |

- 안에 둥근 요소가 들어가면 바깥 반지름에서 안쪽 여백을 뺀 값으로 동심을 맞춘다(SP-10).

### 모션 — 여유 있게

140·220·320·440ms. 감속이 완만하고, 들어올 때 끝에서 아주 살짝 넘쳤다가 자리 잡아요(넘침 약 1%).

| 토큰 | 값 | 쓰는 곳 |
| --- | --- | --- |
| `--duration-1` | 140ms | 누름 피드백, 색 바뀜, 메뉴 닫힘 |
| `--duration-2` | 220ms | 메뉴·팝오버 열림, 스위치 손잡이·선택 칸 이동, 대화상자·배너 닫힘 |
| `--duration-3` | 320ms | 대화상자·배너 열림 |
| `--duration-4` | 440ms | 큰 패널·쪽 전환(드묾, 지금 쓰는 곳 없음) |
| `--easing-productive` | cubic-bezier(0.33, 1, 0.68, 1) | 나감, 화면 안 이동, 누름 피드백 |
| `--easing-expressive` | cubic-bezier(0.34, 1.2, 0.64, 1) | 들어옴(열림·나타남) |

패턴(전환에 그대로 쓴다: `transition: opacity var(--motion-menu-scale-in)`):

| 패턴 | 대상 | 지속·곡선 | 시작 값 |
| --- | --- | --- | --- |
| `--motion-menu-scale-in` | 메뉴·팝오버 | duration-2 · easing-expressive | opacity 0, scale 0.96 |
| `--motion-menu-fade-out` | 메뉴·팝오버 | duration-1 · easing-productive | opacity 0 |
| `--motion-dialog-scale-in` | 대화상자(뒤 막 포함) | duration-3 · easing-expressive | opacity 0, scale 0.96 |
| `--motion-dialog-fade-out` | 대화상자(뒤 막 포함) | duration-2 · easing-productive | opacity 0 |
| `--motion-banner-slide-in` | 피드백 메시지(배너) | duration-3 · easing-expressive | opacity 0, y -8px |
| `--motion-banner-fade-out` | 피드백 메시지(배너) | duration-2 · easing-productive | opacity 0 |
| `--motion-thumb-slide-move` | 스위치 손잡이·세그먼트 선택 칸 | duration-2 · easing-productive |  |
| `--motion-tooltip-fade-in` | 툴팁 | duration-1 · easing-expressive | opacity 0, scale 0.97 |
| `--motion-tooltip-fade-out` | 툴팁 | duration-1 · easing-productive | opacity 0 |
| `--motion-disclosure-fade-in` | 펼침의 펼친 내용 | duration-2 · easing-expressive | opacity 0 |

- transform·opacity만 움직인다. 동작 줄이기(`prefers-reduced-motion: reduce`)에서는 토큰이 위치·크기 변화를 빼고 투명도만 남긴다(MO-05).
- 키보드로 한 동작에는 모션을 두지 않는다. 마지막 입력이 키보드면 `<html data-input="keyboard">`를 달고, 포인터면 뗀다. components.css가 이 속성을 보고 전환을 끈다.
- 여닫는 메뉴·팝오버·배너·대화상자는 `data-animated`를 달고, 열림을 `data-open`으로 바꾼다(닫힘 모션이 끝난 뒤 숨긴다).

## 5. 컴포넌트 — 모양 채움

모양의 정본은 `components.css`(원본 `product-design-system/design-system/components/components.css`)다. 클래스만 붙이고 색·크기를 다시 정하지 않는다. 초점 고리는 `:focus-visible`로 components.css가 그린다(한 스타일, AC-25). 호버는 포인터가 있는 기기에서만 그린다.

| 컴포넌트 | 모양 | 토큰 |
| --- | --- | --- |
| 주 버튼(CC-12) | 강조색 채움 + 흰 글자 | `color-accent`, `color-text-on-accent`, 호버 `color-accent-hover` |
| 보조·취소 버튼 | 흰 바탕 + 옅은 테두리 | `color-control`, `color-separator-opaque`, 호버 `color-control-hover` |
| 위험 버튼(CC-150) | 빨강 채움 + 흰 글자 | `color-status-danger`, 호버 `color-status-danger-hover` |
| 아이콘 버튼 | 바탕 없음, 호버 때 회색 칸 | `color-text-3`, 호버 `color-control-hover` |
| 비활성 버튼 | 옅은 회색 면 + 흐린 글자 | `color-fill-3`, `color-control-text-disabled` |
| 입력 칸·선택 상자 | 흰 바탕 + 테두리(3:1) | `color-control`, `color-control-border` |
| 오류 입력 칸 | 빨강 테두리 2px(테두리 + 안쪽 1px) | `color-status-error` |
| 선택 — 초점 있음(CO-10) | 강조색 채움 + 흰 글자 | `color-selection-content-background`, `color-text-on-accent` |
| 선택 — 초점 없음 | 회색 면 + 기본 글자 | `color-selection-content-background-unfocused` |
| 표 행(CN-82) | 선 없이 둥근 행(`radius-2`), 기본은 번갈아 칠하지 않는다 | 호버 `color-fill-3` |
| 세그먼트 | 회색 홈 + 흰 선택 칸 + 3:1 테두리 | `color-fill-2`, `color-control`, `color-control-border` |
| 피드백 메시지(CN-146~149) | 옅은 상태색 면 + 종류별 아이콘 | `color-status-*-background` + `color-status-*` |

클래스 목록(구역마다 블록, 요소 `__`, 변형 `--`, 상태 속성 `data-*`. 열림·선택 같은 상태는 ARIA 속성으로도 그린다: `aria-selected`·`aria-checked`·`aria-expanded`·`aria-invalid`):

| 구역 | 블록 | 요소 | 변형 | 상태 속성 |
| --- | --- | --- | --- | --- |
| 공통 | `.icon` |  | `--size-2` `--size-3` `--spin` |  |
|  | `.link` |  |  |  |
| 버튼 (CC-12 주·보조·취소·위험, CC-23 눌림) | `.button` |  | `--primary` `--secondary` `--danger` `--small` `--icon` |  |
| 입력 칸 (CC-68~CC-77, WR-73) | `.field` | `__label` `__hint` `__message` |  |  |
|  | `.input` |  |  |  |
|  | `.search` | `__icon` `__clear` |  |  |
| 선택 상자 (CC-57~CC-60) | `.select` | `__control` `__chevron` | `--small` |  |
| 스위치 (CC-27, CC-32, CC-34) | `.switch` | `__thumb` |  |  |
| 체크박스 (CC-30, CC-34) | `.checkbox` | `__box` `__input` `__mark` |  |  |
| 세그먼트 컨트롤 (CC-37~CC-42) | `.segmented` | `__item` | `--small` |  |
| 피드백 메시지(배너) (CN-146~CN-150) | `.banner` | `__icon` `__title` `__text` `__close` |  | `data-animated` `data-open` `data-kind`=info·success·warning·error |
| 꼬리표 (CO-15 색상 토큰, CO-14 상태 색) | `.tag` |  |  | `data-hue`=red·orange·yellow·green·mint·teal·cyan·blue·indigo·purple·pink·brown `data-status`=info·success·warning·error |
| 사이드바 (CN-63~CN-70, CN-22, CO-10) | `.sidebar` | `__group` `__list` `__item` `__count` `__dot` |  | `data-hue`=red·orange·yellow·green·mint·teal·cyan·blue·indigo·purple·pink·brown |
| 표·목록 행과 선택 (CN-77~CN-85, CO-10, AC-26) | `.table` | `__head` `__row` `__cell` | `__cell--name` `__cell--muted` `__cell--numeric` |  |
| 빈 상태 (WR-67) | `.empty` | `__content` `__icon` `__title` `__text` |  |  |
| 메뉴 (CC-61~CC-63, 10.25) | `.menu-anchor` |  |  |  |
|  | `.menu` | `__item` `__check` `__shortcut` `__separator` | `--static` `--start` | `data-animated` `data-open` `data-highlighted` |
| 대화상자 (CN-01~CN-18, WR-58) | `.dialog` | `__content` `__title` `__text` `__actions` |  |  |
|  | `.dialog-layer` |  | `--contained` | `data-animated` `data-open` |
| 라디오 버튼 (CC-26, CC-33, CC-36) | `.radio-group` | `__legend` `__items` | `--row` |  |
|  | `.radio` | `__input` |  |  |
| 여러 줄 입력 (10.15, CC-68) | `.textarea` |  |  |  |
| 툴팁 (CC-10, AC-52, AC-53) | `.tooltip` |  |  | `data-side`=top `data-open` `data-instant` |
| 펼침 (CC-93~CC-97) | `.disclosure` | `__summary` `__content` |  |  |
|  | `.disclosure-button` |  |  |  |
| 탭 (CN-71~CN-76): 탭 컨트롤을 내용 칸의 위쪽 가장자리에 걸친다 | `.tabs` | `__list` `__panel` |  |  |
| 팝오버 (CN-46~CN-54) | `.popover-anchor` |  |  |  |
|  | `.popover` | `__title` |  | `data-animated` `data-open` |
| 모달 대화상자 (CN-07~CN-09, CN-41~CN-45): `<dialog>`.showModal() | `.modal` | `__form` `__content` `__title` `__body` `__actions` |  | `data-closing` |
| 도구 막대 (CC-135~CC-148): 앞쪽·가운데·뒤쪽 세 구역, 기호 항목은 테두리 없이 | `.toolbar` | `__group` `__title` `__center` `__divider` |  |  |
| 진행 막대 (CC-107, MO-27~MO-35) | `.progress` | `__label` `__value` `__track` `__fill` |  | `data-indeterminate` |
| 이동 경로 (CC-98) | `.breadcrumb` | `__item` `__link` `__sep` |  |  |
| 슬라이더 (CC-43~CC-49): 최솟값은 앞쪽, 채운 부분은 강조색, 손잡이는 흰 원 + 3:1 테두리 | `.slider` | `__row` `__input` `__ticks` |  |  |
| 증감 버튼 (CC-50, CC-51): 값 칸 바로 옆, 누름 영역이 24px 바닥을 넘게 가로로 둔다 | `.stepper` | `__input` `__unit` |  |  |
| 날짜 선택 (CC-52~CC-56): 글자 칸 + 달력 팝오버(칸 바로 아래) | `.datefield` | `__button` |  |  |
|  | `.calendar` | `__head` `__title` `__grid` `__weekday` `__day` |  | `data-outside` |
| 자동 완성 입력 (CC-64~CC-67): 목록은 칸 폭을 넘지 않는다 | `.combobox` | `__toggle` |  |  |
|  | `.listbox` | `__option` `__meta` `__empty` |  | `data-active` `data-animated` `data-open` |
| 칩 입력 (CC-85~CC-88): 쉼표·Enter로 칩을 만든다. 칸 전체가 입력 칸처럼 보이고 초점 고리도 칸에 | `.chips` | `__input` |  |  |
|  | `.chip` |  |  |  |
| 묶음 상자 (CN-99~CN-101): 제목은 상자 위, 안의 하위 묶음은 여백·선으로(상자 안에 상자를 넣지 않는다) | `.groupbox` | `__title` `__box` `__row` `__label` `__desc` |  |  |
| 아바타 (CN-102, CN-103): 사진, 없으면 머리글자 | `.avatar` |  | `--small` |  |
|  | `.avatar-group` |  |  |  |
|  | `.person` | `__text` `__name` `__meta` |  |  |
| 문맥 안 상태 표시·배지 (CN-143, CN-151~CN-154) | `.badge` |  | `--alert` |  |
|  | `.status` |  |  | `data-kind`=success·warning·error |

### 대표 마크업

`index.html`이 이 마크업을 이 조합으로 그린다.

#### 버튼

```html
<div class="inline" data-gap="2" data-wrap>
  <button type="button" class="button button--secondary">취소</button>
  <button type="button" class="button button--primary">저장</button>
  <button type="button" class="button button--danger">지우기</button>
  <button type="button" class="button button--secondary button--small">작게</button>
  <button type="button" class="button button--primary" disabled>보내는 중</button>
  <button type="button" class="button button--icon" aria-label="설정"><svg class="icon" aria-hidden="true"><use href="icons.svg#icon-gear"/></svg></button>
</div>
```

#### 입력 칸·선택 상자

```html
<div class="grid" data-columns="3" data-gap="3">
  <div class="field">
    <label class="field__label" for="f-name">프로젝트 이름</label>
    <input class="input" id="f-name" placeholder="예: 3분기 보고서" aria-describedby="f-name-hint">
    <p class="field__hint" id="f-name-hint">나중에 바꿀 수 있어요.</p>
  </div>
  <div class="field">
    <label class="field__label" for="f-mail">받는 사람 메일</label>
    <input class="input" id="f-mail" value="kim@" aria-invalid="true" aria-describedby="f-mail-msg">
    <p class="field__message" id="f-mail-msg"><svg class="icon" aria-hidden="true"><use href="icons.svg#icon-exclamation-circle"/></svg>@ 뒤에 도메인(예: example.com)을 넣어 주세요.</p>
  </div>
  <div class="field">
    <label class="field__label" for="f-sort">정렬</label>
    <span class="select">
      <select class="select__control" id="f-sort"><option>최근 수정한 순</option><option>이름순</option></select>
      <svg class="icon select__chevron" aria-hidden="true"><use href="icons.svg#icon-chevron-down"/></svg>
    </span>
  </div>
</div>
```

#### 체크박스·스위치·세그먼트

```html
<div class="inline" data-gap="3" data-wrap>
  <label class="checkbox"><span class="checkbox__box"><input type="checkbox" class="checkbox__input" checked><svg class="icon checkbox__mark" aria-hidden="true"><use href="icons.svg#icon-checkmark"/></svg></span>문서</label>
  <label class="checkbox"><span class="checkbox__box"><input type="checkbox" class="checkbox__input"><svg class="icon checkbox__mark" aria-hidden="true"><use href="icons.svg#icon-checkmark"/></svg></span>이미지</label>
  <div class="inline" data-gap="1"><span id="sw-mail">메일로 받기</span><button type="button" class="switch" role="switch" aria-checked="true" aria-labelledby="sw-mail"><span class="switch__thumb"></span></button></div>
  <div class="segmented" role="radiogroup" aria-label="보기 방식">
    <button type="button" class="segmented__item" role="radio" aria-checked="true">목록</button>
    <button type="button" class="segmented__item" role="radio" aria-checked="false">격자</button>
  </div>
</div>
```

#### 피드백 메시지(배너)

```html
<div class="stack" data-gap="2">
  <div class="banner" data-kind="info" role="status">
    <svg class="icon banner__icon" aria-hidden="true"><use href="icons.svg#icon-info-circle"/></svg>
    <div><p class="banner__title">11월 3일부터 요약 메일을 월요일에 보내요</p><p class="banner__text">받는 사람과 담기는 내용은 그대로예요.</p></div>
    <button type="button" class="button button--icon banner__close" aria-label="닫기"><svg class="icon" aria-hidden="true"><use href="icons.svg#icon-xmark"/></svg></button>
  </div>
  <div class="banner" data-kind="success" role="status">
    <svg class="icon banner__icon" aria-hidden="true"><use href="icons.svg#icon-checkmark-circle"/></svg>
    <div><p class="banner__title">파일 3개를 올렸어요</p></div>
  </div>
  <div class="banner" data-kind="warning" role="status">
    <svg class="icon banner__icon" aria-hidden="true"><use href="icons.svg#icon-exclamation-triangle"/></svg>
    <div><p class="banner__title">저장 공간이 10% 남았어요</p><p class="banner__text">오래된 파일을 보관함으로 옮기면 자리가 생겨요.</p></div>
  </div>
  <div class="banner" data-kind="error" role="alert">
    <svg class="icon banner__icon" aria-hidden="true"><use href="icons.svg#icon-exclamation-circle"/></svg>
    <div><p class="banner__title">파일 2개를 올리지 못했어요</p><p class="banner__text">연결을 확인하고 다시 올려 주세요.</p></div>
  </div>
</div>
```

#### 표

```html
<div class="table files-table" role="grid" aria-label="파일">
  <div class="table__head" role="row"><span role="columnheader">이름</span><span role="columnheader">묶음</span><span role="columnheader">상태</span><span role="columnheader" class="table__cell--numeric">크기</span></div>
  <div class="table__row" role="row" tabindex="0" aria-selected="false"><span class="table__cell table__cell--name" role="gridcell"><svg class="icon" aria-hidden="true"><use href="icons.svg#icon-document"/></svg>3분기 매출 보고서.xlsx</span><span class="table__cell" role="gridcell"><span class="tag" data-hue="purple">연간 보고</span></span><span class="table__cell" role="gridcell"><span class="tag" data-status="success">검토 끝</span></span><span class="table__cell table__cell--muted table__cell--numeric" role="gridcell">1.2MB</span></div>
  <div class="table__row" role="row" tabindex="-1" aria-selected="true"><span class="table__cell table__cell--name" role="gridcell"><svg class="icon" aria-hidden="true"><use href="icons.svg#icon-document"/></svg>브랜드 색 시안 3차.fig</span><span class="table__cell" role="gridcell"><span class="tag" data-hue="indigo">브랜드 개편</span></span><span class="table__cell" role="gridcell"><span class="tag" data-status="warning">검토 기다림</span></span><span class="table__cell table__cell--muted table__cell--numeric" role="gridcell">24MB</span></div>
  <div class="table__row" role="row" tabindex="-1" aria-selected="false"><span class="table__cell table__cell--name" role="gridcell"><svg class="icon" aria-hidden="true"><use href="icons.svg#icon-document"/></svg>회의록 1017.docx</span><span class="table__cell" role="gridcell"><span class="tag" data-hue="teal">주간 회의</span></span><span class="table__cell" role="gridcell"><span class="tag" data-status="info">공유함</span></span><span class="table__cell table__cell--muted table__cell--numeric" role="gridcell">36KB</span></div>
</div>
```

열 너비는 화면이 정한다:

```css
.files-table .table__head,
.files-table .table__row {
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr) minmax(0, 2fr) minmax(0, 1fr);
}
```

## 6. 하지 말 것

- 원시 색(`--raw-color-*`)이나 16진수 색을 화면 코드에 쓰지 않는다. 의미 토큰만 쓴다(TK-04). 표에 적힌 16진수 값은 확인용이다.
- px·ms 값을 직접 쓰지 않는다. 간격·크기·반지름·지속 시간은 토큰으로(TK-01).
- 상태 색(red·green·orange·cyan)을 강조로 쓰지 않는다. 빨강은 오류·위험, 초록은 성공, 주황은 경고, 시안은 정보다(CO-14).
- 한 결과물 안에서 조합을 섞지 않는다. 앱 하나·덱 하나는 프리셋 하나다(CO-51). 다른 조합이 필요하면 다른 결과물로 따로 빌드한다.
- 앱에 라이트·다크 전환 버튼을 두지 않는다. 배포하는 앱은 `auto`로 OS 설정을 따른다(CO-25). 고정 맥락은 덱·인쇄·시안용이다.
- 강조색을 둘 이상 쓰지 않는다(CO-11). 다른 색이 필요하면 뜻 없는 색상 토큰(`--color-hue-*`)이나 상태 토큰을 쓴다.
- 색만으로 상태를 말하지 않는다. 글자·아이콘을 함께 둔다(AC-11).
- 고정 축(글꼴·글자 단계·형태·아이콘·모션·컴포넌트·밀도)을 결과물마다 바꾸지 않는다. 다른 글꼴·아이콘 세트를 섞지 않는다.
- 카드를 만들지 않는다. 카드는 채택하지 않았다(rules.md 11.1). 올림 바탕(`--color-background-elevated-*`)과 높이 그림자(`--elevation-*`)를 한 상자에 같이 쓰는 것은 떠 있는 층(메뉴·팝오버·대화상자 류)뿐이다. 내용을 묶을 때는 묶음 상자(`.groupbox` · `.groupbox__box`, 바탕 2 + 선 + `radius-3`, 그림자 없음)를 쓴다. `check.mjs` 12번이 잡는다.
- 이 파일과 `components.css`에 없는 컴포넌트 모양을 토큰을 엮어 새로 만들지 않는다. 토큰의 「쓰는 곳」은 컴포넌트가 실제로 쓰는 자리를 적은 것이지 새 모양을 허락하는 목록이 아니다. 필요한 모양이 없으면 만들기 전에 사용자에게 묻는다.

## 7. 규칙 정본과 문서

| 문서 | 경로 |
| --- | --- |
| 규칙 전부(정본) | `product-design-system/design-system/guideline/rules.md` |
| 프리셋과 고르는 축 | `product-design-system/design-system/guideline/presets.md` |
| 색 | `product-design-system/design-system/guideline/color.md` |
| 글자 | `product-design-system/design-system/guideline/typography.md` |
| 간격·크기·배치 | `product-design-system/design-system/guideline/spacing.md, product-design-system/design-system/guideline/layout.md` |
| 형태 | `product-design-system/design-system/guideline/shape.md` |
| 아이콘 | `product-design-system/design-system/guideline/icons.md` |
| 모션 | `product-design-system/design-system/guideline/motion.md` |
| 컴포넌트 | `product-design-system/design-system/guideline/components.md` |
| 토큰 원본과 CSS 변수 이름 | `product-design-system/design-system/tokens/README.md` |
| 검사(대비·하드코딩·금지 표현) | `node product-design-system/design-system/scripts/check.mjs --scan=<결과물 폴더>` |

화면 글(해요체, 금지 표현)은 rules.md의 WR 장을 따른다.
