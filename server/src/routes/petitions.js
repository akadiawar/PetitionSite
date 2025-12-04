const express = require('express');
const router = express.Router();

// 모든 청원 조회
router.get('/', (req, res) => {
  res.json({ message: 'Get all petitions' });
});

// 청원 상세 조회
router.get('/:id', (req, res) => {
  res.json({ message: `Get petition ${req.params.id}` });
});

// 청원 생성
router.post('/', (req, res) => {
  res.json({ message: 'Create petition' });
});

module.exports = router;
