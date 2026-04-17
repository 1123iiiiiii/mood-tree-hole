const app = getApp();
const { request } = require('../../utils/request');

Page({
  data: {
    activeTab: 'list',
    list: [],
    recommendations: [],
    showModal: false,
    newTitle: '',
    selectedCategory: 0,
    categories: ['放松', '运动', '创作', '社交', '成长', '感官', '整理', '自然']
  },

  onShow() {
    if (app.globalData.isLoggedIn) {
      this.loadList();
    }
  },

  async loadList() {
    try {
      const list = await request('/smallHappy');
      this.setData({ list: list.map(item => ({
        id: item._id,
        title: item.title,
        category: item.category,
        frequency: item.frequency,
        isCompleted: false,
        streak: item.streak
      }))});
    } catch (err) {
      console.error('加载失败', err);
    }
  },

  async loadRecommendations() {
    try {
      const recs = await request('/smallHappy/recommendations');
      this.setData({ 
        recommendations: recs.map(item => ({
          id: item._id,
          title: item.title,
          category: item.category,
          emoji: this.getCategoryEmoji(item.category),
          completedCount: item.completions?.length || 0
        }))
      });
    } catch (err) {
      console.error('加载推荐失败', err);
    }
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    if (tab === 'recommend') {
      this.loadRecommendations();
    }
  },

  getCategoryEmoji(category) {
    const emojis = {
      relax: '☕', exercise: '🚶', create: '🎨', social: '👫',
      grow: '📖', sense: '🎵', organize: '🧹', nature: '🌿'
    };
    return emojis[category] || '✨';
  },

  showAddModal() {
    this.setData({ showModal: true, newTitle: '' });
  },

  hideModal() {
    this.setData({ showModal: false });
  },

  onTitleInput(e) {
    this.setData({ newTitle: e.detail.value });
  },

  onCategoryChange(e) {
    this.setData({ selectedCategory: e.detail.value });
  },

  async addItem() {
    const { newTitle, selectedCategory, categories } = this.data;
    if (!newTitle.trim()) {
      return wx.showToast({ title: '请输入名称', icon: 'none' });
    }

    try {
      await request('/smallHappy', 'POST', {
        title: newTitle,
        category: Object.keys({ relax: 1, exercise: 1, create: 1, social: 1, grow: 1, sense: 1, organize: 1, nature: 1 })[selectedCategory],
        frequency: 'once'
      });
      wx.showToast({ title: '添加成功', icon: 'success' });
      this.hideModal();
      this.loadList();
    } catch (err) {
      wx.showToast({ title: '添加失败', icon: 'none' });
    }
  },

  async completeItem(e) {
    const id = e.currentTarget.dataset.id;
    try {
      await request(`/smallHappy/${id}/complete`, 'POST', {
        moodBefore: 'calm',
        moodAfter: 'happy',
        intensityBefore: 5,
        intensityAfter: 8
      });
      wx.showToast({ title: '完成！继续保持~', icon: 'success' });
      this.loadList();
    } catch (err) {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  async addAndComplete(e) {
    const item = e.currentTarget.dataset.item;
    try {
      await request('/smallHappy', 'POST', {
        title: item.title,
        category: item.category,
        frequency: 'once'
      });
      wx.showToast({ title: '已添加', icon: 'success' });
    } catch (err) {
      wx.showToast({ title: '添加失败', icon: 'none' });
    }
  }
});
