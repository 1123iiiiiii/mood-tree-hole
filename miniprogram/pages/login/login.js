const app = getApp();
const { request } = require('../../utils/request');

Page({
  data: {
    activeTab: 'login',
    email: '',
    password: '',
    username: ''
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  onEmailInput(e) {
    this.setData({ email: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },

  async onSubmit() {
    const { email, password, username, activeTab } = this.data;
    
    if (!email || !password) {
      return wx.showToast({ title: '请填写完整', icon: 'none' });
    }

    if (activeTab === 'register' && (!username || username.length < 3)) {
      return wx.showToast({ title: '用户名至少3位', icon: 'none' });
    }

    wx.showLoading({ title: '请稍候...' });

    try {
      let res;
      if (activeTab === 'login') {
        res = await request('/auth/login', 'POST', { email, password });
      } else {
        res = await request('/auth/register', 'POST', { email, password, username });
      }

      // 保存 token
      wx.setStorageSync('token', res.token);
      wx.setStorageSync('userInfo', res.user);
      
      app.globalData.token = res.token;
      app.globalData.isLoggedIn = true;
      app.globalData.userInfo = res.user;

      wx.hideLoading();
      wx.showToast({ title: activeTab === 'login' ? '登录成功' : '注册成功', icon: 'success' });
      
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 1500);
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: err, icon: 'none' });
    }
  }
});
