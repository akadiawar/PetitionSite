const express = require('express');
const router = express.Router();

// 서명하기
router.post('/', (req, res) => {
  res.json({ message: 'Sign petition' });
});

// 내 서명 목록
router.get('/my-signatures', (req, res) => {
  res.json({ message: 'Get my signatures' });
});

module.exports = router;
