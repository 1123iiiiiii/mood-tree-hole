const moods = [
  { value: 'happy', label: '开心', emoji: '😊' },
  { value: 'calm', label: '平静', emoji: '😌' },
  { value: 'anxious', label: '焦虑', emoji: '😰' },
  { value: 'sad', label: '伤心', emoji: '😢' },
  { value: 'angry', label: '生气', emoji: '😠' },
  { value: 'fearful', label: '害怕', emoji: '😨' },
  { value: 'surprised', label: '惊讶', emoji: '😲' }
];

const tags = [
  { value: 'work', label: '工作' },
  { value: 'family', label: '家庭' },
  { value: 'health', label: '健康' },
  { value: 'relationship', label: '人际关系' },
  { value: 'finance', label: '财务' },
  { value: 'study', label: '学习' },
  { value: 'other', label: '其他' }
];

const BASE_URL = 'http://localhost:3000/api';

App({
  globalData: {
    userInfo: null,
    token: ''
  },
  
  onLaunch() {
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
    }
  },

  async request(url, method = 'GET', data = null) {
    const header = { 'Content-Type': 'application/json' };
    if (this.globalData.token) {
      header['Authorization'] = `Bearer ${this.globalData.token}`;
    }

    try {
      const res = await wx.request({
        url: BASE_URL + url,
        method,
        data,
        header
      });
      return res.data;
    } catch (error) {
      console.error('请求失败:', error);
      throw error;
    }
  },

  moods,
  tags
});
