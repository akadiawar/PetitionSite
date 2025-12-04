const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 회원가입
router.post('/register', authController.register);

// 로그인 (자동 회원가입 포함)
router.post('/login', authController.login);

module.exports = router;
