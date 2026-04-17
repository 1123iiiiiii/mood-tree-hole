const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// 注册
router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 20 }).withMessage('用户名3-20字符'),
  body('email').isEmail().withMessage('无效的邮箱'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6位')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: '用户名或邮箱已存在' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: '注册失败' });
  }
});

// 登录
router.post('/login', [
  body('email').isEmail().withMessage('无效的邮箱'),
  body('password').exists().withMessage('请输入密码')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: '登录失败' });
  }
});

// 获取当前用户
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

// 更新用户信息
router.put('/me', auth, async (req, res) => {
  try {
    const updates = ['avatar', 'settings'];
    updates.forEach(field => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });
    req.user.updatedAt = Date.now();
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: '更新失败' });
  }
});

module.exports = router;
