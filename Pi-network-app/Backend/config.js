// config.js

module.exports = {
    // 서버 포트
    PORT: process.env.PORT || 5000,
  
    // MongoDB 연결 정보
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/pi-network', // 환경변수에 연결 정보가 없으면 로컬 DB 사용
  
    // JWT 비밀 키 (환경변수로 설정 가능)
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
  
    // SMTP 설정 (메일 전송을 위한 설정)
    SMTP: {
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: process.env.SMTP_PORT || 587,
      user: process.env.SMTP_USER || 'your_smtp_user',
      pass: process.env.SMTP_PASS || 'your_smtp_pass',
    },
  
    // 기타 필요한 설정을 추가할 수 있습니다.
  };
  