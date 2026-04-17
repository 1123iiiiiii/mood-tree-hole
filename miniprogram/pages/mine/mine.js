const app = getApp();
const { request } = require('../../utils/request');

Page({
  data: {
    userInfo: {},
    totalRecords: 0,
    totalHappiness: 0,
    totalDays: 0
  },

  onShow() {
    if (app.globalData.isLoggedIn) {
      this.setData({ userInfo: app.globalData.userInfo || {} });
      this.loadStats();
    }
  },

  async loadStats() {
    try {
      const [moodRes, happyRes] = await Promise.all([
        request('/mood?limit=1'),
        request('/smallHappy?limit=1')
      ]);

      this.setData({
        totalRecords: moodRes.pagination?.total || 0,
        totalHappiness: happyRes.length || 0
      });
    } catch (err) {
      console.error('加载统计失败', err);
    }
  },

  onExportData() {
    wx.showLoading({ title: '导出中...' });
    Promise.all([
      request('/mood?limit=1000'),
      request('/smallHappy')
    ]).then(([moodData, happyData]) => {
      const exportData = {
        exportTime: new Date().toISOString(),
        moodRecords: moodData.records,
        smallHappiness: happyData
      };

      wx.setStorageSync('exportData', exportData);
      wx.hideLoading();
      wx.showToast({ title: '导出成功', icon: 'success' });
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: '导出失败', icon: 'none' });
    });
  },

  onImportData() {
    const exportData = wx.getStorageSync('exportData');
    if (!exportData) {
      return wx.showToast({ title: '没有可导入的数据', icon: 'none' });
    }
    wx.showModal({
      title: '确认导入',
      content: '将导入 ${exportData.moodRecords.length} 条心情记录',
      success: res => {
        if (res.confirm) {
          wx.showToast({ title: '导入功能开发中', icon: 'none' });
        }
      }
    });
  },

  onClearData() {
    wx.showModal({
      title: '警告',
      content: '确定要清空所有数据吗？此操作不可恢复！',
      success: res => {
        if (res.confirm) {
          wx.showToast({ title: '清空功能开发中', icon: 'none' });
        }
      }
    });
  },

  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: res => {
        if (res.confirm) {
          wx.clearStorageSync();
          app.globalData.token = '';
          app.globalData.isLoggedIn = false;
          app.globalData.userInfo = null;
          wx.reLaunch({ url: '/pages/login/login' });
        }
      }
    });
  }
});
