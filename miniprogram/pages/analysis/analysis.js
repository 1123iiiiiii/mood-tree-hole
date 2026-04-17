const app = getApp();
const { request, moodColors, timeSlotText } = require('../../utils/request');

Page({
  data: {
    timeRange: 'week',
    stats: { total: 0, avgIntensity: 0, positivePercent: 0 },
    moodDistribution: [],
    timeSlotDistribution: [],
    trends: []
  },

  onShow() {
    if (app.globalData.isLoggedIn) {
      this.loadStats();
    }
  },

  selectTime(e) {
    const range = e.currentTarget.dataset.range;
    this.setData({ timeRange: range });
    this.loadStats();
  },

  async loadStats() {
    const { timeRange } = this.data;
    const now = new Date();
    let startDate, endDate = now.toISOString().split('T')[0];

    if (timeRange === 'today') {
      startDate = endDate;
    } else if (timeRange === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      startDate = weekAgo.toISOString().split('T')[0];
    } else if (timeRange === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      startDate = monthAgo.toISOString().split('T')[0];
    }

    try {
      const stats = await request('/analysis/stats', 'GET', { startDate, endDate });
      this.processStats(stats);
    } catch (err) {
      console.error('加载失败', err);
    }
  },

  processStats(stats) {
    // 处理情绪分布
    const moodNames = { happy: '开心', calm: '平静', anxious: '焦虑', sad: '伤心', angry: '生气', fearful: '害怕', surprised: '惊讶' };
    const moodDistribution = Object.entries(stats.moodDistribution || {})
      .map(([mood, count]) => ({
        mood,
        name: moodNames[mood] || mood,
        count,
        color: moodColors[mood] || '#999',
        percent: stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    // 处理时段分布
    const timeSlotDistribution = Object.entries(stats.timeSlotDistribution || {})
      .map(([slot, count]) => ({
        slot,
        name: timeSlotText[slot] || slot,
        count
      }));

    // 计算正向情绪比例
    const positiveMoods = ['happy', 'calm'];
    let positiveCount = 0;
    Object.entries(stats.moodDistribution || {}).forEach(([mood, count]) => {
      if (positiveMoods.includes(mood)) {
        positiveCount += count;
      }
    });
    const positivePercent = stats.total > 0 ? Math.round((positiveCount / stats.total) * 100) : 0;

    this.setData({
      stats: {
        total: stats.total || 0,
        avgIntensity: stats.avgIntensity || 0,
        positivePercent
      },
      moodDistribution,
      timeSlotDistribution
    });
  }
});
