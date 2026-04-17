Page({
  data: {
    selectedPreset: 'week',
    presets: [
      { value: 'today', label: '今天' },
      { value: 'week', label: '本周' },
      { value: 'month', label: '本月' },
      { value: 'quarter', label: '本季' },
      { value: 'year', label: '本年' }
    ],
    records: [],
    stats: { totalRecords: 0, avgIntensity: 0, positiveRate: 0, streakDays: 0 },
    moodEmojis: { happy: '😊', calm: '😌', anxious: '😰', sad: '😢', angry: '😠', fearful: '😨', surprised: '😲' }
  },
  onLoad() { this.loadData(); },
  onShow() { this.loadData(); },
  async loadData() {
    try {
      const res = await getApp().request('/mood', 'GET');
      const records = res.records || [];
      if (records.length > 0) {
        const totalRecords = records.length;
        const avgIntensity = (records.reduce((sum, r) => sum + r.intensity, 0) / totalRecords).toFixed(1);
        const positiveRecords = records.filter(r => ['happy', 'calm'].includes(r.mood)).length;
        const positiveRate = Math.round((positiveRecords / totalRecords) * 100);
        this.setData({
          records,
          stats: { totalRecords, avgIntensity, positiveRate, streakDays: 0 }
        });
      }
    } catch (error) { console.error(error); }
  },
  selectPreset(e) {
    this.setData({ selectedPreset: e.currentTarget.dataset.value });
  },
  getFilteredRecords() {
    const now = new Date();
    const ranges = {
      today: new Date(now.setHours(0, 0, 0, 0)),
      week: new Date(now.setDate(now.getDate() - 7)),
      month: new Date(now.setMonth(now.getMonth() - 1)),
      quarter: new Date(now.setMonth(now.getMonth() - 3)),
      year: new Date(now.setFullYear(now.getFullYear() - 1))
    };
    const start = ranges[this.data.selectedPreset] || ranges.week;
    return this.data.records.filter(r => new Date(r.createdAt) >= start);
  }
});
