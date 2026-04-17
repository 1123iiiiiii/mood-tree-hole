# 🌳 心情树洞 API 文档

## 📍 基础信息

- **Base URL**: `http://localhost:3000/api`
- **认证方式**: JWT Bearer Token
- **请求格式**: JSON
- **响应格式**: JSON

---

## 🔐 认证接口

### 注册用户
```
POST /auth/register
```

**请求体**:
```json
{
  "username": "用户名",
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "user": { "id": "...", "username": "...", "email": "..." },
  "token": "jwt_token_here"
}
```

---

### 用户登录
```
POST /auth/login
```

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "user": { "id": "...", "username": "...", "email": "..." },
  "token": "jwt_token_here"
}
```

---

## 📝 心情记录接口

### 获取心情记录
```
GET /mood
```

**查询参数**:
- `page` - 页码 (默认: 1)
- `limit` - 每页数量 (默认: 20)
- `startDate` - 开始日期 (YYYY-MM-DD)
- `endDate` - 结束日期 (YYYY-MM-DD)
- `mood` - 心情类型

**响应**:
```json
{
  "records": [
    {
      "_id": "记录ID",
      "mode": "select",
      "mood": "happy",
      "intensity": 8,
      "event": "今天很开心",
      "tags": ["work", "family"],
      "timeSlot": "morning",
      "createdAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

### 创建心情记录
```
POST /mood
```

**请求体**:
```json
{
  "mode": "select",
  "mood": "happy",
  "intensity": 8,
  "event": "今天项目上线成功",
  "tags": ["work"],
  "mixedMoods": [
    { "mood": "happy", "percentage": 70 },
    { "mood": "calm", "percentage": 30 }
  ]
}
```

---

### 删除心情记录
```
DELETE /mood/:id
```

---

## ✨ 小确幸接口

### 获取小确幸列表
```
GET /smallHappy
```

**响应**:
```json
[
  {
    "_id": "ID",
    "title": "喝一杯热茶",
    "category": "relax",
    "frequency": "daily",
    "isCustom": false,
    "streak": 5,
    "completions": [
      { "completedAt": "...", "moodBefore": "calm", "moodAfter": "happy" }
    ]
  }
]
```

---

### 获取推荐
```
GET /smallHappy/recommendations
```

**查询参数**:
- `currentMood` - 当前心情

---

### 完成小确幸
```
POST /smallHappy/:id/complete
```

**请求体**:
```json
{
  "moodBefore": "calm",
  "moodAfter": "happy",
  "intensityBefore": 5,
  "intensityAfter": 8
}
```

---

## 📊 分析接口

### 情绪分析
```
POST /analysis/analyze
```

**请求体**:
```json
{
  "mood": "happy",
  "event": "今天收到了期待已久的礼物，和朋友一起度过了愉快的时光"
}
```

**响应**:
```json
{
  "insights": [
    { "type": "happy", "keywords": ["愉快", "期待"], "message": "..." }
  ],
  "suggestions": ["保持这份愉悦心情，分享给身边的人"],
  "mood": "happy",
  "event": "..."
}
```

---

### 获取统计数据
```
GET /analysis/stats
```

**查询参数**:
- `startDate` - 开始日期
- `endDate` - 结束日期

**响应**:
```json
{
  "total": 50,
  "moodDistribution": { "happy": 20, "calm": 15, "anxious": 10, "sad": 5 },
  "avgIntensity": 6.5,
  "timeSlotDistribution": { "morning": 10, "afternoon": 20, "evening": 20 },
  "tagDistribution": { "work": 30, "family": 20 }
}
```

---

### 获取趋势数据
```
GET /analysis/trends
```

**查询参数**:
- `days` - 天数 (默认: 7)

**响应**:
```json
[
  {
    "date": "2024-01-01",
    "avgIntensity": 7.5,
    "count": 3,
    "dominantMood": "happy"
  }
]
```

---

## 🚀 部署说明

### 1. MongoDB Atlas 配置

1. 访问 https://www.mongodb.com/atlas
2. 创建免费集群 (M0 Sandbox)
3. 创建数据库用户
4. 获取连接字符串

### 2. Railway 部署

1. 访问 https://railway.app
2. 连接 GitHub 仓库
3. 添加环境变量:
   - `MONGODB_URI` - MongoDB 连接字符串
   - `JWT_SECRET` - JWT 密钥
4. 部署

### 3. 微信小程序配置

在 `app.js` 中修改 API 地址:
```javascript
globalData: {
  apiBase: 'https://your-railway-app.railway.app/api'
}
```

---

## 📋 心情类型枚举

| 值 | 描述 | 颜色 |
|----|------|------|
| happy | 开心 | #10b981 |
| calm | 平静 | #6366f1 |
| anxious | 焦虑 | #f59e0b |
| sad | 伤心 | #3b82f6 |
| angry | 生气 | #ef4444 |
| fearful | 害怕 | #8b5cf6 |
| surprised | 惊讶 | #ec4899 |

---

## ⏰ 时段枚举

| 值 | 描述 |
|----|------|
| dawn | 凌晨 (5-9) |
| morning | 早晨 (9-12) |
| noon | 中午 (12-14) |
| afternoon | 下午 (14-18) |
| evening | 傍晚 (18-22) |
| night | 夜间 (22-5) |
