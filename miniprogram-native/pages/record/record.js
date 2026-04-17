Page({
  data: {
    activeTab: 'mood',
    selectedMood: '',
    intensity: 5,
    selectedTags: [],
    eventText: '',
    isAnalyzing: false,
    analysisResult: null,
    moodEmojis: {
      happy: '😊', calm: '😌', anxious: '😰',
      sad: '😢', angry: '😠', fearful: '😨', surprised: '😲'
    }
  },

  onLoad() {
    this.app = getApp();
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  selectMood(e) {
    const mood = e.currentTarget.dataset.mood;
    this.setData({ selectedMood: mood });
  },

  sliderChange(e) {
    this.setData({ intensity: e.detail.value });
  },

  toggleTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const tags = this.data.selectedTags;
    if (tags.includes(tag)) {
      this.setData({ selectedTags: tags.filter(t => t !== tag) });
    } else {
      this.setData({ selectedTags: [...tags, tag] });
    }
  },

  inputEvent(e) {
    this.setData({ eventText: e.detail.value });
  },

  async analyzeEvent() {
    if (this.data.eventText.length < 10) {
      wx.showToast({ title: '请输入至少10个字', icon: 'none' });
      return;
    }

    this.setData({ isAnalyzing: true });

    try {
      const res = await this.app.request('/deepseek/ai-analyze', 'POST', {
        event: this.data.eventText
      });

      if (res.success && res.analysis) {
        const emotionMap = {
          '开心': 'happy', '快乐': 'happy', '愉快': 'happy', '幸福': 'happy',
          '平静': 'calm', '安宁': 'calm', '放松': 'calm',
          '焦虑': 'anxious', '不安': 'anxious', '紧张': 'anxious',
          '悲伤': 'sad', '难过': 'sad', '伤心': 'sad',
          '愤怒': 'angry', '生气': 'angry', '恼火': 'angry',
          '恐惧': 'fearful', '害怕': 'fearful',
          '惊讶': 'surprised', '意外': 'surprised'
        };

        const aiMood = res.analysis.emotion ? emotionMap[res.analysis.emotion] || 'calm' : 'calm';
        this.setData({
          selectedMood: aiMood,
          intensity: res.analysis.emotionIntensity || 5,
          analysisResult: res.analysis
        });
      }
    } catch (error) {
      wx.showToast({ title: '分析失败', icon: 'none' });
    } finally {
      this.setData({ isAnalyzing: false });
    }
  },

  async submitRecord() {
    if (!this.data.selectedMood) {
      wx.showToast({ title: '请选择心情', icon: 'none' });
      return;
    }

    try {
      await this.app.request('/mood', 'POST', {
        mood: this.data.selectedMood,
        intensity: this.data.intensity,
        tags: this.data.selectedTags,
        event: this.data.eventText
      });

      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => {
        wx.switchTab({ url: '/pages/analysis/analysis' });
      }, 1500);
    } catch (error) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  }
});
