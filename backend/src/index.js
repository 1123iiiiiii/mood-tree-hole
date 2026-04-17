require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const moodRoutes = require('./routes/mood');
const smallHappyRoutes = require('./routes/smallHappy');
const analysisRoutes = require('./routes/analysis');
const deepseekRoutes = require('./routes/deepseek');

const app = express();

// 安全中间件
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 日志
app.use(morgan('dev'));

// 解析 JSON
app.use(express.json());

// 连接数据库（可选，不影响AI分析功能）
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moodtreehole')
  .then(() => console.log('✅ MongoDB 连接成功'))
  .catch(err => console.log('⚠️ MongoDB 连接失败，AI分析功能仍可用:', err.message));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/smallHappy', smallHappyRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/deepseek', deepseekRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});
