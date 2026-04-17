Page({
  onLoad() {},
  exportData() { wx.showToast({ title: '导出功能开发中', icon: 'none' }); },
  showAbout() {
    wx.showModal({
      title: '关于心情树洞',
      content: '心情树洞 v2.0\n\n一款智能心理分析心情记录应用\n\n技术栈：React + Node.js + DeepSeek AI',
      showCancel: false
    });
  }
});
