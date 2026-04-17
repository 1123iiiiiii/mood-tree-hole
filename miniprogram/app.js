App({
  onLaunch() {
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      this.globalData.isLoggedIn = true;
    }
  },
  
  globalData: {
    apiBase: 'http://localhost:3000/api',
    token: '',
    isLoggedIn: false,
    userInfo: null
  }
})
