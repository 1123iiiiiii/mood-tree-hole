# 🚀 部署指南

## 📋 前置要求

1. **Node.js 16+** - 后端运行环境
2. **MongoDB Atlas 账号** - 免费数据库
3. **Railway 账号** - 免费后端部署
4. **微信开发者工具** - 小程序开发

---

## 🗄️ 第一步：部署 MongoDB

### 1.1 创建 MongoDB Atlas 账号

1. 访问 https://www.mongodb.com/atlas
2. 点击 "Start Free" 注册账号
3. 选择区域（推荐：AWS Singapore 或 AWS Tokyo）

### 1.2 创建集群

1. 点击 "Build a Database"
2. 选择 **FREE** 套餐 (M0 Sandbox)
3. 选择区域和设置
4. 点击 "Create"

### 1.3 创建数据库用户

1. 点击 "Database Access"
2. 点击 "Add New Database User"
3. 设置用户名和密码（**记住这个密码**）
4. 点击 "Add User"

### 1.4 配置网络访问

1. 点击 "Network Access"
2. 点击 "Add IP Address"
3. 点击 "Allow Access from Anywhere"
4. 点击 "Confirm"

### 1.5 获取连接字符串

1. 点击 "Clusters" → 你的集群
2. 点击 "Connect"
3. 选择 "Connect your application"
4. 复制连接字符串，格式类似：
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/moodtreehole?retryWrites=true&w=majority
   ```
5. **替换** username 和 password 为你创建的用户

---

## 🚄 第二步：部署后端到 Railway

### 2.1 准备代码

代码已生成在 `backend/` 目录

### 2.2 推送代码到 GitHub

```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/mood-tree-hole-backend.git
git push -u origin main
```

### 2.3 创建 Railway 项目

1. 访问 https://railway.app
2. 点击 "Login" → 使用 GitHub 登录
3. 点击 "New Project"
4. 选择 "Deploy from GitHub repo"
5. 选择 `mood-tree-hole-backend` 仓库

### 2.4 配置环境变量

1. 在 Railway 项目中点击 "Variables"
2. 添加以下变量：

| 变量名 | 值 |
|--------|-----|
| `MONGODB_URI` | 你的 MongoDB 连接字符串 |
| `JWT_SECRET` | `mood_tree_hole_secret_2024_very_long_string` |
| `NODE_ENV` | `production` |

### 2.5 等待部署

- Railway 会自动检测并部署
- 等待 2-3 分钟
- 部署成功后，你会获得一个 URL，类似：
  ```
  https://mood-tree-hole-backend.up.railway.app
  ```

### 2.6 测试 API

访问健康检查端点：
```
https://mood-tree-hole-backend.up.railway.app/api/health
```

---

## 📱 第三步：配置微信小程序

### 3.1 修改 API 地址

编辑 `miniprogram/app.js`：

```javascript
App({
  globalData: {
    // 开发环境（本地后端）
    apiBase: 'http://localhost:3000/api',
    // 生产环境（Railway 后端）
    // apiBase: 'https://mood-tree-hole-backend.up.railway.app/api'
  }
})
```

### 3.2 打开微信开发者工具

1. 打开微信开发者工具
2. 导入项目：`train2/miniprogram`
3. AppID：使用测试号或你的 AppID

### 3.3 配置服务器域名

在微信公众平台后台：
1. 开发 → 开发管理 → 开发设置
2. 找到 "服务器域名"
3. 点击 "修改"
4. 添加 request 合法域名：
   ```
   https://mood-tree-hole-backend.up.railway.app
   ```
5. 保存

---

## ✅ 快速验证

### 测试流程

1. **后端验证**
   - 浏览器访问：`https://mood-tree-hole-backend.up.railway.app/api/health`
   - 应该返回：`{"status":"ok","timestamp":"..."}`

2. **注册测试**
   - 微信开发者工具中编译
   - 进入登录页面
   - 点击 "注册"
   - 填写信息完成注册

3. **记录测试**
   - 注册成功后
   - 进入 "记录" 页面
   - 选择心情并保存

4. **查看历史**
   - 进入 "分析" 页面
   - 查看统计数据

---

## 🐛 常见问题

### Q1: MongoDB 连接失败
**A**: 检查：
1. 用户名密码是否正确
2. 网络访问是否允许所有 IP
3. 连接字符串是否完整

### Q2: Railway 部署失败
**A**: 检查：
1. GitHub 仓库是否正确
2. 环境变量是否设置
3. 查看 Railway 日志定位错误

### Q3: 微信小程序无法请求
**A**: 检查：
1. 服务器域名是否配置
2. 是否在开发设置中勾选了 "不校验合法域名"
3. API 地址是否正确

### Q4: JWT Token 过期
**A**: Token 默认 30 天过期，小程序会自动处理重新登录

---

## 💰 成本估算

| 服务 | 费用 | 额度 |
|------|------|------|
| MongoDB Atlas | 免费 | 512MB 存储 |
| Railway | 免费 | 500小时/月 |
| 微信小程序 | 免费 | - |

**总计**: ¥0 / 月

---

## 🔄 更新代码

### 后端更新

```bash
cd backend
git add .
git commit -m "Your update message"
git push
# Railway 会自动重新部署
```

### 前端更新

直接在微信开发者工具中重新编译即可

---

## 📞 获取帮助

如果遇到问题，可以：
1. 查看 Railway 部署日志
2. 检查 MongoDB Atlas 状态
3. 确认微信开发者工具控制台错误信息
