Page({
  data: { items: [], newItem: '' },
  onLoad() { this.loadData(); },
  async loadData() {
    try {
      const res = await getApp().request('/smallHappy', 'GET');
      this.setData({ items: res.smallHappies || [] });
    } catch (error) { console.error(error); }
  },
  inputItem(e) { this.setData({ newItem: e.detail.value }); },
  async addItem() {
    if (!this.data.newItem.trim()) return;
    try {
      await getApp().request('/smallHappy', 'POST', { title: this.data.newItem, completed: false });
      this.setData({ newItem: '' });
      this.loadData();
      wx.showToast({ title: '添加成功', icon: 'success' });
    } catch (error) { wx.showToast({ title: '添加失败', icon: 'none' }); }
  },
  async toggleComplete(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.items.find(i => i._id === id);
    try {
      await getApp().request(`/smallHappy/${id}`, 'PUT', { completed: !item.completed });
      this.loadData();
    } catch (error) { wx.showToast({ title: '更新失败', icon: 'none' }); }
  },
  async deleteItem(e) {
    const id = e.currentTarget.dataset.id;
    try {
      await getApp().request(`/smallHappy/${id}`, 'DELETE');
      this.loadData();
    } catch (error) { wx.showToast({ title: '删除失败', icon: 'none' }); }
  }
});
