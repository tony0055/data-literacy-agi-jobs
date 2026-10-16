# 인물 사진 출처 (Wikimedia Commons, 2026-10-16 내려받음, 960px 썸네일)

| 파일 | 원본 | 촬영자·권리자 | 라이선스 |
| --- | --- | --- | --- |
| altman.jpg | https://commons.wikimedia.org/wiki/File:%E2%80%9CSam_Altman%E2%80%9D_by_Village_Global_(Cropped).jpg | Village Global (2022-11-17) | CC BY 2.0 |
| amodei.jpg | https://commons.wikimedia.org/wiki/File:Dario_Amodei_in_2023.jpg | UK Prime Minister Flickr 계정 (2023-05-24) | CC BY 2.0 |
| hassabis.jpg | https://commons.wikimedia.org/wiki/File:Demis_Hassabis_at_2024_Nobel_Week_2.jpg | Jenny8lee (2024-12-07) | CC BY-SA 4.0 |

덱(9장)에서는 잘라서(object-fit·감싼 칸) 쓰고, 해당 장 하단에 촬영자·라이선스를 적는다(9장 꼬리말과 위 표가 일치함을 PR6에서 대조).

- **확인 필요(허사비스):** 원본은 두 사람이 나오는 사진이고 덱은 오른쪽 사람으로 자른다. 자른 사람이 데미스 허사비스인지는 얼굴 인상이 아니라 Commons 파일 설명(인물 위치 설명)으로 확인해야 한다. 이 환경에서 Commons 접속이 막혀 PR6에서도 확인하지 못했다.

## 덱용 파일(PR6, 2026-10-16)

내려받은 960px 썸네일은 `../src/photos/`에 그대로 옮겨 두고, 덱용은 `../src/derive.py`로 1920×1080 렌더의 img 상자 × 1.55 크기로 줄였다(자르기 0, ICC는 원본 그대로 — amodei는 sRGB 'c2', ICC 없던 altman·hassabis는 sRGB 프로필을 붙여 명시).

| 파일 | img 상자(CSS px) | 덱용 해상도 | 용량(이전 → 지금) |
| --- | --- | --- | --- |
| altman.jpg | 322×546 | 499×847 | 427KB → 75KB |
| amodei.jpg | 227×144 | 352×563 | 413KB → 27KB |
| hassabis.jpg | 394×263 | 611×408 | 70KB → 30KB |

## 덱에서 내린 사진

| 파일 | 상태 |
| --- | --- |
| openai-livestream-thumb.jpg | 9장 영상 썸네일(1280×720, 'OpenAI' 글자 잘림). PR2가 덱에서 내림. index.html·CSS 참조 0을 확인하고 PR6에서 지움(커밋 13dc48d까지 이력에 남음). 이 표에 출처 기록이 없던 파일 |

## 장면 사진 (이미지 생성이 안 될 때 쓰려던 대체본 — 이 저장소에 파일 없음, 덱 참조 0)

| 파일 | 원본 | 촬영자·권리자 | 라이선스 |
| --- | --- | --- | --- |
| datacenter.jpg | https://commons.wikimedia.org/wiki/File:BalticServers_data_center.jpg | BalticServers.com (2013-03-17) | CC BY-SA 3.0 |
| yeouido.jpg | https://commons.wikimedia.org/wiki/File:Yeouido_Night_View_2010.jpg | Bryan Dorrough (2010-08-28) | CC BY 2.0 |
| callcenter.jpg | https://commons.wikimedia.org/wiki/File:Call_center_(8301477546).jpg | Carlos Ebert (2012-12-23) | CC BY 2.0 |
| lone-worker.jpg | https://commons.wikimedia.org/wiki/File:Lone_office_worker_(Unsplash).jpg | Jadon Barnes (2014-10-07) | CC0 |
| flapboard.jpg | https://commons.wikimedia.org/wiki/File:Flap_board_Tokyo_Intl_Airport_Arrival.jpg | Cassiopeia sweet (2003-10-09) | 퍼블릭 도메인 |

덱 1장의 `assets/img/callcenter.jpg`는 위 Commons 사진이 아니라 Gemini 생성 이미지다(원본 PNG와 PSNR 42dB로 같은 그림임을 확인, `../img/MANIFEST.md`).
