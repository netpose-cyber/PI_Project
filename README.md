 Pi Network 기반 애플리케이션 폴더 구조 및 파일명 정리
전체 프로젝트는 스마트 컨트랙트, 백엔드, 프론트엔드로 구성됩니다.

📂 프로젝트 폴더 구조
python
복사
편집
📦 pi-network-app
┣ 📂 smart-contracts          # 스마트 컨트랙트 관련 파일
┃ ┣ 📜 PiRewardContract.sol   # 보상 자동화 스마트 컨트랙트
┃ ┣ 📜 PiPaymentContract.sol  # 결제 자동화 스마트 컨트랙트
┃ ┣ 📂 build                  # 컴파일된 컨트랙트 파일 (ABI & Bytecode)
┃ ┃ ┣ 📜 PiRewardContract.abi.json
┃ ┃ ┣ 📜 PiRewardContract.bin
┃ ┃ ┣ 📜 PiPaymentContract.abi.json
┃ ┃ ┣ 📜 PiPaymentContract.bin
┃ ┗ 📜 deploy.js              # 스마트 컨트랙트 배포 스크립트
┣ 📂 backend                  # 백엔드 API 서버 (Node.js + Express)
┃ ┣ 📂 models                 # 데이터 모델 정의 (MongoDB)
┃ ┃ ┣ 📜 Post.js              # 게시글 모델
┃ ┃ ┣ 📜 Comment.js           # 댓글 모델
┃ ┃ ┣ 📜 Follow.js            # 팔로우 모델
┃ ┣ 📂 routes                 # API 라우트 정의
┃ ┃ ┣ 📜 postRoutes.js        # 게시글 관련 API
┃ ┃ ┣ 📜 commentRoutes.js     # 댓글 관련 API
┃ ┃ ┣ 📜 followRoutes.js      # 팔로우 관련 API
┃ ┃ ┣ 📜 rewardRoutes.js      # 스마트 컨트랙트 보상 API
┃ ┃ ┣ 📜 paymentRoutes.js     # 스마트 컨트랙트 결제 API
┃ ┣ 📜 server.js              # 메인 서버 파일 (Express 실행)
┃ ┣ 📜 config.js              # 환경 변수 설정 파일
┃ ┣ 📜 package.json           # Node.js 패키지 설정
┣ 📂 frontend                 # 프론트엔드 앱 (React Native)
┃ ┣ 📂 screens                # 주요 화면 컴포넌트
┃ ┃ ┣ 📜 HomeScreen.js        # 홈 화면
┃ ┃ ┣ 📜 PostScreen.js        # 게시글 목록 화면
┃ ┃ ┣ 📜 FollowScreen.js      # 팔로우 관리 화면
┃ ┃ ┣ 📜 RewardScreen.js      # 보상 출금 화면
┃ ┣ 📂 components             # 공통 UI 컴포넌트
┃ ┃ ┣ 📜 PostItem.js          # 게시글 UI
┃ ┃ ┣ 📜 CommentItem.js       # 댓글 UI
┃ ┃ ┣ 📜 Button.js            # 공통 버튼 컴포넌트
┃ ┣ 📜 App.js                 # 앱 진입점
┃ ┣ 📜 package.json           # React Native 패키지 설정
┗ 📜 README.md                # 프로젝트 설명 문서

📌 주요 파일 설명
🔹 1. 스마트 컨트랙트 (smart-contracts/)
PiRewardContract.sol → Pi 보상을 자동 지급하는 스마트 컨트랙트
PiPaymentContract.sol → Pi 결제를 자동 처리하는 스마트 컨트랙트
deploy.js → 스마트 컨트랙트를 Pi Network에 배포하는 스크립트

🔹 2. 백엔드 (backend/)
server.js → 백엔드 서버 실행 (Express API)
postRoutes.js → 게시글 관련 API
commentRoutes.js → 댓글 관련 API
followRoutes.js → 팔로우 관련 API
rewardRoutes.js → Pi 보상 관련 스마트 컨트랙트 API
paymentRoutes.js → Pi 결제 관련 스마트 컨트랙트 API

🔹 3. 프론트엔드 (frontend/)
HomeScreen.js → 메인 홈 화면
PostScreen.js → 게시판 및 글 작성 화면
FollowScreen.js → 사용자 팔로우 관리 화면
RewardScreen.js → Pi 보상 출금 화면
PostItem.js → 개별 게시글 UI
CommentItem.js → 개별 댓글 UI
Button.js → 재사용 가능한 버튼 UI

📌 개발 흐름 요약
사용자가 앱에서 게시글을 작성 → backend/routes/postRoutes.js를 통해 DB 저장
사용자가 활동하면 보상을 지급 → backend/routes/rewardRoutes.js를 통해 스마트 컨트랙트 호출
사용자가 보상을 출금 → frontend/screens/RewardScreen.js에서 스마트 컨트랙트 트랜잭션 실행
