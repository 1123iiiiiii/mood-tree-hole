// 工具函数

const app = getApp();

// API 请求封装
function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
    
    wx.request({
      url: `${app.globalData.apiBase}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: res => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('token');
          wx.reLaunch({ url: '/pages/login/login' });
          reject('请先登录');
        } else {
          reject(res.data.error || '请求失败');
        }
      },
      fail: err => {
        reject('网络请求失败');
      }
    });
  });
}

// 获取当前时间段
function getTimeSlot() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) return 'dawn';
  if (hour >= 9 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

// 时间段显示文字
const timeSlotText = {
  dawn: '凌晨',
  morning: '早晨',
  noon: '中午',
  afternoon: '下午',
  evening: '傍晚',
  night: '夜间'
};

// 情绪颜色
const moodColors = {
  happy: '#10b981',
  calm: '#6366f1',
  anxious: '#f59e0b',
  sad: '#3b82f6',
  angry: '#ef4444',
  fearful: '#8b5cf6',
  surprised: '#ec4899'
};

// 情绪图标
const moodEmojis = {
  happy: '😊',
  calm: '😌',
  anxious: '😰',
  sad: '😢',
  angry: '😠',
  fearful: '😨',
  surprised: '😲'
};

// 格式化日期
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${month}月${day}日 ${hour}:${minute}`;
}

// 导出
module.exports = {
  request,
  getTimeSlot,
  timeSlotText,
  moodColors,
  moodEmojis,
  formatDate
};
