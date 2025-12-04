const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 로그인 (자동 회원가입 포함)
exports.login = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    // 학번과 비밀번호 확인
    if (!studentId || !password) {
      return res.status(400).json({ message: '학번과 비밀번호를 입력하세요' });
    }

    // 사용자 찾기
    let user = await User.findOne({ studentId });

    // 사용자가 없으면 자동 회원가입
    if (!user) {
      user = new User({
        studentId,
        password
      });
      await user.save();
      
      // JWT 토큰 생성
      const token = jwt.sign(
        { userId: user._id, studentId: user.studentId },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: '회원가입 및 로그인 성공',
        token,
        user: {
          id: user._id,
          studentId: user.studentId
        },
        isNewUser: true
      });
    }

    // 기존 사용자라면 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id, studentId: user.studentId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: '로그인 성공',
      token,
      user: {
        id: user._id,
        studentId: user.studentId
      },
      isNewUser: false
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 회원가입 (별도 엔드포인트 - 선택사항)
exports.register = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({ message: '학번과 비밀번호를 입력하세요' });
    }

    // 이미 존재하는 사용자 확인
    const existingUser = await User.findOne({ studentId });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 학번입니다' });
    }

    // 새 사용자 생성
    const user = new User({ studentId, password });
    await user.save();

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id, studentId: user.studentId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '회원가입 성공',
      token,
      user: {
        id: user._id,
        studentId: user.studentId
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};
