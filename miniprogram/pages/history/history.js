const app = getApp();
const { request, moodEmojis, formatDate } = require('../../utils/request');

Page({
  data: {
    records: [],
    page: 1,
    limit: 20,
    hasMore: true,
    selectedMood: '',
    moodOptions: ['全部心情', '开心', '平静', '焦虑', '伤心', '生气', '害怕', '惊讶']
  },

  onShow() {
    if (app.globalData.isLoggedIn) {
      this.loadRecords(true);
    }
  },

  async loadRecords(reset = false) {
    const page = reset ? 1 : this.data.page;
    
    try {
      const { records, pagination } = await request('/mood', 'GET', {
        page,
        limit: this.data.limit,
        mood: this.data.selectedMood || undefined
      });

      const processedRecords = records.map(r => ({
        id: r._id,
        moodEmoji: moodEmojis[r.mood] || '😊',
        moodText: this.getMoodText(r.mood),
        intensity: r.intensity,
        event: r.event || '',
        tags: r.tags || [],
        time: formatDate(r.createdAt)
      }));

      this.setData({
        records: reset ? processedRecords : [...this.data.records, ...processedRecords],
        page: page + 1,
        hasMore: pagination.page < pagination.pages
      });
    } catch (err) {
      console.error('加载失败', err);
    }
  },

  getMoodText(mood) {
    const texts = { happy: '开心', calm: '平静', anxious: '焦虑', sad: '伤心', angry: '生气', fearful: '害怕', surprised: '惊讶' };
    return texts[mood] || mood;
  },

  onMoodFilter(e) {
    const index = e.detail.value;
    const selectedMood = index === 0 ? '' : ['happy', 'calm', 'anxious', 'sad', 'angry', 'fearful', 'surprised'][index - 1];
    this.setData({ selectedMood });
    this.loadRecords(true);
  },

  loadMore() {
    if (this.data.hasMore) {
      this.loadRecords(false);
    }
  }
});
