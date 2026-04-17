const app = getApp();
const { request, moodEmojis, formatDate } = require('../../utils/request');

Page({
  data: {
    greeting: '你好',
    today: '',
    todayCount: 0,
    todayMood: '-',
    todayIntensity: '-',
    recentRecords: []
  },

  onLoad() {
    this.checkLogin();
    this.setGreeting();
  },

  onShow() {
    if (app.globalData.isLoggedIn) {
      this.loadData();
    }
  },

  checkLogin() {
    if (!app.globalData.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录后使用',
        confirmText: '去登录',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/login/login' });
          }
        }
      });
    }
  },

  setGreeting() {
    const hour = new Date().getHours();
    let greeting = '你好';
    if (hour >= 5 && hour < 9) greeting = '早上好';
    else if (hour >= 9 && hour < 12) greeting = '上午好';
    else if (hour >= 12 && hour < 14) greeting = '中午好';
    else if (hour >= 14 && hour < 18) greeting = '下午好';
    else if (hour >= 18 && hour < 22) greeting = '晚上好';
    
    const today = new Date();
    const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`;
    
    this.setData({ greeting, today: dateStr });
  },

  async loadData() {
    try {
      // 获取今日统计
      const today = new Date().toISOString().split('T')[0];
      const stats = await request('/analysis/stats', 'GET', { startDate: today });
      
      // 获取最近记录
      const { records } = await request('/mood?limit=5');
      
      const recentRecords = records.map(r => ({
        id: r._id,
        moodEmoji: moodEmojis[r.mood] || '😊',
        moodText: this.getMoodText(r.mood),
        time: formatDate(r.createdAt)
      }));
      
      this.setData({
        todayCount: stats.total || 0,
        todayMood: stats.moodDistribution ? this.getDominantMood(stats.moodDistribution) : '-',
        todayIntensity: stats.avgIntensity || '-',
        recentRecords
      });
    } catch (err) {
      console.error('加载数据失败', err);
    }
  },

  getMoodText(mood) {
    const texts = {
      happy: '开心',
      calm: '平静',
      anxious: '焦虑',
      sad: '伤心',
      angry: '生气',
      fearful: '害怕',
      surprised: '惊讶'
    };
    return texts[mood] || mood;
  },

  getDominantMood(distribution) {
    const entries = Object.entries(distribution);
    if (entries.length === 0) return '-';
    entries.sort((a, b) => b[1] - a[1]);
    return this.getMoodText(entries[0][0]);
  },

  goToRecord() {
    wx.switchTab({ url: '/pages/record/record' });
  }
});
