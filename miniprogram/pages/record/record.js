const app = getApp();
const { request, moodEmojis, getTimeSlot } = require('../../utils/request');

Page({
  data: {
    mode: 'select',
    moods: [
      { value: 'happy', name: '开心', emoji: '😊' },
      { value: 'calm', name: '平静', emoji: '😌' },
      { value: 'anxious', name: '焦虑', emoji: '😰' },
      { value: 'sad', name: '伤心', emoji: '😢' },
      { value: 'angry', name: '生气', emoji: '😠' },
      { value: 'fearful', name: '害怕', emoji: '😨' },
      { value: 'surprised', name: '惊讶', emoji: '😲' }
    ],
    tags: ['工作', '家庭', '健康', '人际', '财务', '学业', '其他'],
    selectedMood: '',
    intensity: 5,
    selectedTags: [],
    event: '',
    essay: '',
    isAnalyzing: false,
    analysisResult: null,
    mixedMoods: [],
    canSubmit: false
  },

  onLoad() {
    if (!app.globalData.isLoggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/login/login' });
      }, 1500);
    }
  },

  switchMode(e) {
    this.setData({ mode: e.currentTarget.dataset.mode });
    this.updateCanSubmit();
  },

  selectMood(e) {
    this.setData({ selectedMood: e.currentTarget.dataset.mood });
    this.updateCanSubmit();
  },

  onIntensityChange(e) {
    this.setData({ intensity: e.detail.value });
  },

  toggleTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const { selectedTags } = this.data;
    const index = selectedTags.indexOf(tag);
    if (index > -1) {
      selectedTags.splice(index, 1);
    } else {
      selectedTags.push(tag);
    }
    this.setData({ selectedTags });
  },

  onEventInput(e) {
    this.setData({ event: e.detail.value });
  },

  onEssayInput(e) {
    const essay = e.detail.value;
    this.setData({ essay });
    
    if (essay.length >= 20 && !this.data.isAnalyzing) {
      this.analyzeEssay(essay);
    }
  },

  async analyzeEssay(essay) {
    this.setData({ isAnalyzing: true });
    
    try {
      const result = await request('/analysis/analyze', 'POST', { event: essay });
      
      // 将分析结果转换为混合心情显示
      const mixedMoods = result.insights.map(insight => ({
        mood: insight.type,
        name: this.data.moods.find(m => m.value === insight.type)?.name || insight.type,
        percentage: Math.round(70 + Math.random() * 30)
      }));

      if (mixedMoods.length === 0) {
        mixedMoods.push({ mood: 'calm', name: '平静', percentage: 100 });
      }

      this.setData({
        analysisResult: result,
        mixedMoods,
        selectedMood: mixedMoods[0]?.mood || 'calm',
        isAnalyzing: false,
        canSubmit: true
      });
    } catch (err) {
      this.setData({ isAnalyzing: false });
      wx.showToast({ title: '分析失败', icon: 'none' });
    }
  },

  updateCanSubmit() {
    const { mode, selectedMood, essay } = this.data;
    let canSubmit = false;
    
    if (mode === 'select') {
      canSubmit = !!selectedMood;
    } else {
      canSubmit = essay.length >= 20;
    }
    
    this.setData({ canSubmit });
  },

  async submitRecord() {
    const { mode, selectedMood, intensity, selectedTags, event, essay, mixedMoods } = this.data;
    
    wx.showLoading({ title: '保存中...' });

    try {
      const recordData = {
        mode,
        mood: selectedMood || 'calm',
        intensity,
        tags: selectedTags,
        event: mode === 'essay' ? essay : event,
        mixedMoods: mode === 'essay' ? mixedMoods : [],
        timeSlot: getTimeSlot()
      };

      await request('/mood', 'POST', recordData);
      
      wx.hideLoading();
      wx.showToast({ title: '保存成功', icon: 'success' });
      
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 1500);
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: err || '保存失败', icon: 'none' });
    }
  }
});
