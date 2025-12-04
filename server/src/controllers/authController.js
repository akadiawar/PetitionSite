const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 로그인 (자동 회원가입 포함)
exports.login = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // 이메일과 비밀번호 확인
    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호를 입력하세요' });
    }

    // 사용자 찾기
    let user = await User.findOne({ email });

    // 사용자가 없으면 자동 회원가입
    if (!user) {
      const userName = name || email.split('@')[0]; // name이 없으면 이메일에서 추출
      user = new User({
        email,
        password,
        name: userName
      });
      await user.save();
      
      // JWT 토큰 생성
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: '회원가입 및 로그인 성공',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
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
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.json({
      message: '로그인 성공',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
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
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: '모든 필드를 입력하세요' });
    }

    // 이미 존재하는 사용자 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다' });
    }

    // 새 사용자 생성
    const user = new User({ email, password, name });
    await user.save();

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '회원가입 성공',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};
