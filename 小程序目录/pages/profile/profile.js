// pages/profile/profile.js
// 个人中心页

const { formatRelativeTime } = require('../../utils/util');

Page({
  /**
   * 页面数据
   */
  data: {
    // 用户信息
    userInfo: null,
    isLoggedIn: false,
    
    // 统计数据（模拟）
    stats: {
      publishCount: 3,
      matchCount: 5,
      favoriteCount: 2
    },
    
    // 功能菜单
    menuItems: [
      { id: 'publish', icon: '📝', name: '我的发布', badge: '' },
      { id: 'match', icon: '🔍', name: '我的匹配', badge: '2' },
      { id: 'favorite', icon: '❤️', name: '我的收藏', badge: '' }
    ],
    
    // 其他菜单
    otherItems: [
      { id: 'settings', icon: '⚙️', name: '消息通知设置' },
      { id: 'about', icon: 'ℹ️', name: '关于平台' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.checkLoginStatus();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 设置自定义tabBar选中状态
    const tabBar = this.getTabBar();
    if (tabBar) {
      tabBar.setData({ activeIndex: 3 });
    }
    
    this.checkLoginStatus();
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const app = getApp();
    if (app.globalData.isLoggedIn && app.globalData.userInfo) {
      this.setData({
        isLoggedIn: true,
        userInfo: app.globalData.userInfo
      });
    } else {
      this.setData({
        isLoggedIn: false,
        userInfo: null
      });
    }
  },

  /**
   * 微信一键登录
   */
  onWxLogin() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        const userInfo = {
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
          gender: res.userInfo.gender,
          registeredAt: new Date().toISOString()
        };
        
        // 保存到全局和本地
        const app = getApp();
        app.globalData.userInfo = userInfo;
        app.globalData.isLoggedIn = true;
        wx.setStorageSync('userInfo', userInfo);
        wx.setStorageSync('token', 'mock_token_' + Date.now());
        
        // 更新页面状态
        this.setData({
          isLoggedIn: true,
          userInfo: userInfo
        });
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('登录失败:', err);
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 退出登录
   */
  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          app.logout();
          
          this.setData({
            isLoggedIn: false,
            userInfo: null
          });
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 菜单点击
   */
  onMenuClick(e) {
    const { id } = e.currentTarget.dataset;
    
    const urlMap = {
      publish: '/pages/my-publish/my-publish',
      match: '/pages/my-match/my-match',
      favorite: '/pages/my-favorite/my-favorite',
      settings: '/pages/settings/settings',
      about: '/pages/about/about'
    };
    
    if (urlMap[id]) {
      wx.navigateTo({
        url: urlMap[id]
      });
    }
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '灵眸AI宠物 - 帮助走失宠物回家',
      path: '/pages/index/index'
    };
  }
});
