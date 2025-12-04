const express = require('express');
const router = express.Router();

// 회원가입
router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint' });
});

// 로그인
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

module.exports = router;
