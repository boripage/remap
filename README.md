# 리맵 효심케어서비스

Stitch(`리맵 감동케어 맞춤형 웹사이트`)에서 생성한 홈 화면을 정적 사이트로 배포한 저장소입니다.

- `index.html` — 홈 화면 (재디자인 버전)
- `assets/` — Stitch 생성 이미지 (외부 임시 URL 대신 로컬 보관)

## 배포

`main` 브랜치 루트를 GitHub Pages로 서빙합니다.

## 백엔드

Supabase 프로젝트: `boripage's Project` (region: ap-southeast-1)

## Supabase 스키마

| 테이블 | 용도 | 접근 규칙 |
|---|---|---|
| `consultations` | 랜딩 페이지 상담신청 | 누구나 INSERT (개인정보 동의 필수), 조회는 본인 것만 / 관리자는 대시보드 |
| `profiles` | 회원가입 프로필 | 본인 것만 조회·수정, `role`은 클라이언트가 수정 불가 |

회원가입 시 `auth.users` 트리거가 `profiles` 행을 자동 생성합니다.
프론트엔드 연동은 `assets/supabase.js`에 있으며, 여기 담긴 publishable 키는
공개용이고 실제 접근 통제는 RLS가 담당합니다.
