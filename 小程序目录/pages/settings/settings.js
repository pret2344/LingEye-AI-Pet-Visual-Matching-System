// pages/settings/settings.js
// 设置页

Page({
  data: {
    settings: {
      notification: true,
      matchNotify: true,
      commentNotify: true
    }
  },

  onLoad() {
    this.loadSettings();
  },

  loadSettings() {
    const settings = wx.getStorageSync('userSettings');
    if (settings) {
      this.setData({ settings });
    }
  },

  saveSettings() {
    wx.setStorageSync('userSettings', this.data.settings);
  },

  onSwitchChange(e) {
    const { key } = e.currentTarget.dataset;
    const value = e.detail.value;
    
    this.setData({
      [`settings.${key}`]: value
    });
    
    this.saveSettings();
    wx.showToast({
      title: value ? '已开启' : '已关闭',
      icon: 'success'
    });
  },

  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除缓存吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            // 保留用户登录信息
            const token = wx.getStorageSync('token');
            const userInfo = wx.getStorageSync('userInfo');
            
            wx.clearStorageSync();
            
            // 恢复登录信息
            if (token) wx.setStorageSync('token', token);
            if (userInfo) wx.setStorageSync('userInfo', userInfo);
            
            wx.showToast({
              title: '清除成功',
              icon: 'success'
            });
          } catch (err) {
            wx.showToast({
              title: '清除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  }
});
