Page({
  data: { records: [], moodEmojis: { happy: '😊', calm: '😌', anxious: '😰', sad: '😢', angry: '😠', fearful: '😨', surprised: '😲' } },
  onLoad() { this.loadHistory(); },
  async loadHistory() {
    try {
      const res = await getApp().request('/mood', 'GET');
      this.setData({ records: res.records || [] });
    } catch (error) { console.error(error); }
  },
  formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  },
  async deleteRecord(e) {
    const id = e.currentTarget.dataset.id;
    try {
      await getApp().request(`/mood/${id}`, 'DELETE');
      wx.showToast({ title: '删除成功', icon: 'success' });
      this.loadHistory();
    } catch (error) { wx.showToast({ title: '删除失败', icon: 'none' }); }
  }
});
