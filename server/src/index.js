const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// 라우트 임포트
const authRoutes = require('./routes/auth');
const petitionRoutes = require('./routes/petitions');
const signatureRoutes = require('./routes/signatures');
const commentRoutes = require('./routes/comments');

dotenv.config();

const app = express();

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 데이터베이스 연결
connectDB();

// 라우트 등록
app.use('/api/auth', authRoutes);
app.use('/api/petitions', petitionRoutes);
app.use('/api/signatures', signatureRoutes);
app.use('/api/comments', commentRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Petition API Server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
