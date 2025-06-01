# 📚 Book Management Frontend (React Vite)

이 프로젝트는 Spring Boot 백엔드와 연동하여 도서 정보 관리 및 AI 이미지 생성 기능을 사용자 친화적인 웹 인터페이스로 제공하는 프론트엔드 애플리케이션입니다. React와 Vite를 사용하여 빠르고 효율적인 개발 환경을 구축했으며, Material-UI (MUI)를 통해 세련된 UI를 제공합니다.

## ✨ 주요 기능

* **사용자 인증:** 회원가입 및 로그인 페이지 제공
* **도서 목록:** 전체 도서 및 내가 등록한 도서 목록 조회
* **도서 상세:** 각 도서의 상세 정보 페이지
* **도서 CRUD:** 도서 등록, 수정, 삭제 폼 제공
* **AI 이미지 연동:** 도서 등록/수정 시 DALL-E 2를 이용한 표지 이미지 생성 기능
* **반응형 디자인:** Material-UI (MUI)를 활용한 반응형 UI

## 💻 기술 스택

* **프레임워크:** React ^19.1.0
* **빌드 도구:** Vite ^6.3.5
* **상태 관리:** React Context API (간단한 전역 상태 관리)
* **UI 라이브러리:** Material-UI (MUI) ^7.1.0
* **HTTP 클라이언트:** Axios ^1.9.0
* **라우팅:** React Router DOM ^7.6.1
* **언어:** JavaScript (ES6+)
* **린터:** ESLint

## 📁 프로젝트 구조
```
FRONTEND
├── public                   # 정적 자산 (index.html, 파비콘 등)
│   └── index.html
├── src
│   ├── api                  # 백엔드 API 연동 로직
│   │   ├── authApi.js
│   │   └── bookApi.js
│   ├── components           # 재사용 가능한 UI 컴포넌트
│   │   ├── AppHeader.jsx
│   │   ├── BookCard.jsx
│   │   └── LoadingSpinner.jsx
│   ├── contexts             # React Context API를 사용한 전역 상태 관리
│   │   └── AuthContext.jsx
│   ├── pages                # 페이지 컴포넌트
│   │   ├── auth             # 인증 관련 페이지
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── book             # 도서 관련 페이지
│   │   │   ├── BookDetailPage.jsx
│   │   │   ├── BookFormPage.jsx
│   │   │   └── MyBooksPage.jsx
│   │   └── main             # 메인 페이지
│   │       └── MainPage.jsx
│   ├── utils                # 유틸리티 함수 및 설정
│   │   └── apiClient.js     # Axios 인스턴스 및 인터셉터
│   ├── App.css
│   ├── App.jsx              # 메인 애플리케이션 컴포넌트
│   ├── index.css
│   └── main.jsx             # React 애플리케이션 진입점
├── .env.example             # 환경 변수 예시 파일
├── vite.config.js           # Vite 설정 파일
├── package.json             # 프로젝트 의존성 및 스크립트 정의
├── package-lock.json        # 정확한 의존성 버전 관리
└── README.md                # 현재 파일
```

## 🛠️ 개발 환경 설정

1.  **Node.js 설치:** Node.js 18 이상 버전이 설치되어 있어야 합니다.
2.  **의존성 설치:** 프로젝트 루트 디렉토리에서 다음 명령어를 실행하여 필요한 패키지를 설치합니다.
    ```bash
    npm install
    # 또는
    npm ci
    # 또는
    yarn install
    ```
3.  **환경 변수 설정:**
    * 프로젝트 루트에 `.env` 파일을 생성하고 `.env.example` 파일을 참고하여 다음 내용을 추가합니다.
        ```
        VITE_API_BASE_URL=http://localhost:8080/api/v1
        VITE_OPENAI_API_KEY="본인 API키를 넣어주세요"
        ```
    * `VITE_API_BASE_URL`은 백엔드 애플리케이션의 기본 API 경로로 설정합니다.
    * `VITE_OPENAI_API_KEY`는 DALL-E 이미지 생성을 위한 OpenAI API 키로 대체해야 합니다. 이 키는 프론트엔드에서 DALL-E API를 직접 호출하는 데 사용됩니다.

## ▶️ 애플리케이션 실행

프로젝트 루트 디렉토리에서 다음 명령어를 실행하여 개발 서버를 시작합니다.

```bash
npm run dev
# 또는
yarn dev
애플리케이션은 기본적으로 http://localhost:5173 포트에서 실행됩니다.