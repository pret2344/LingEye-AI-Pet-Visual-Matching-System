// pages/about/about.js
// 关于页面

Page({
  data: {
    version: '1.0.0',
    features: [
      { icon: '🔍', title: 'AI智能识别', desc: '自动识别宠物品种、毛色等特征' },
      { icon: '🤝', title: '智能匹配', desc: 'AI算法匹配走失与流浪宠物信息' },
      { icon: '📍', title: '地图定位', desc: '查看周边宠物信息，快速定位' },
      { icon: '💬', title: '互动交流', desc: '留言评论，分享线索' }
    ]
  },

  onCopyWechat() {
    wx.setClipboardData({
      data: 'lingmou-pet',
      success: () => {
        wx.showToast({
          title: '已复制微信号',
          icon: 'success'
        });
      }
    });
  },

  onContactUs() {
    wx.showModal({
      title: '联系我们',
      content: '客服微信：lingmou-pet\n工作时间：9:00-18:00',
      confirmText: '复制微信',
      success: (res) => {
        if (res.confirm) {
          this.onCopyWechat();
        }
      }
    });
  },

  onPrivacyPolicy() {
    wx.navigateTo({
      url: '/pages/webview/webview?url=https://lingmou-pet.com/privacy'
    });
  },

  onUserAgreement() {
    wx.navigateTo({
      url: '/pages/webview/webview?url=https://lingmou-pet.com/agreement'
    });
  }
});
