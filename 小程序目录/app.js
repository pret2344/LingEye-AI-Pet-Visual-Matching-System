// app.js
// 灵眸 AI 宠物视觉匹配小程序 - 全局应用配置

App({
  /**
   * 全局数据
   */
  globalData: {
    // 用户信息
    userInfo: null,
    // 登录凭证
    token: null,
    // 是否已登录
    isLoggedIn: false,
    // 后端API基础地址（开发环境）
    baseUrl: 'https://api.lingmou-pet.com/api/v1',
    // 用户位置信息
    location: {
      latitude: null,
      longitude: null,
      address: ''
    },
    // 每日发布上限
    publishDailyLimit: 5,
    // 今日已发布数量
    todayPublishCount: 0
  },

  /**
   * 小程序初始化
   */
  onLaunch() {
    // 检查登录状态
    this.checkLoginStatus();
    // 获取用户位置
    this.getUserLocation();
    // 检查更新
    this.checkUpdate();
  },

  /**
   * 小程序显示
   */
  onShow() {
    // 刷新今日发布数量
    this.refreshTodayPublishCount();
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
      this.globalData.isLoggedIn = true;
      
      // 验证token是否有效
      this.validateToken();
    }
  },

  /**
   * 验证token有效性
   */
  validateToken() {
    const token = this.globalData.token;
    if (!token) return;

    wx.request({
      url: `${this.globalData.baseUrl}/user/validate`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.statusCode !== 200) {
          // token无效，清除登录状态
          this.logout();
        }
      },
      fail: () => {
        console.log('token验证失败');
      }
    });
  },

  /**
   * 微信登录
   */
  wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (loginRes) => {
          if (loginRes.code) {
            // 发送code到后端换取token
            wx.request({
              url: `${this.globalData.baseUrl}/auth/login`,
              method: 'POST',
              data: {
                code: loginRes.code
              },
              success: (res) => {
                if (res.statusCode === 200 && res.data.token) {
                  // 保存token
                  const token = res.data.token;
                  this.globalData.token = token;
                  this.globalData.isLoggedIn = true;
                  wx.setStorageSync('token', token);
                  
                  // 获取用户信息
                  this.getUserInfo().then(() => {
                    resolve(true);
                  }).catch(reject);
                } else {
                  reject(new Error('登录失败'));
                }
              },
              fail: (err) => {
                reject(err);
              }
            });
          } else {
            reject(new Error('获取登录凭证失败'));
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.globalData.baseUrl}/user/info`,
        method: 'GET',
        header: {
          'Authorization': `Bearer ${this.globalData.token}`
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            this.globalData.userInfo = res.data;
            wx.setStorageSync('userInfo', res.data);
            resolve(res.data);
          } else {
            reject(new Error('获取用户信息失败'));
          }
        },
        fail: reject
      });
    });
  },

  /**
   * 退出登录
   */
  logout() {
    this.globalData.token = null;
    this.globalData.userInfo = null;
    this.globalData.isLoggedIn = false;
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
  },

  /**
   * 获取用户位置
   */
  getUserLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.globalData.location.latitude = res.latitude;
        this.globalData.location.longitude = res.longitude;
        
        // 逆地理编码获取地址
        this.reverseGeocoder(res.latitude, res.longitude);
      },
      fail: (err) => {
        console.log('获取位置失败:', err);
        // 使用默认位置（北京）
        this.globalData.location.latitude = 39.9042;
        this.globalData.location.longitude = 116.4074;
      }
    });
  },

  /**
   * 逆地理编码
   */
  reverseGeocoder(latitude, longitude) {
    // 这里使用腾讯地图API（需要配置key）
    // 实际项目中需要申请腾讯地图key
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: `${latitude},${longitude}`,
        key: 'YOUR_TENCENT_MAP_KEY' // 需要替换为实际的key
      },
      success: (res) => {
        if (res.data.status === 0) {
          this.globalData.location.address = res.data.result.address;
        }
      }
    });
  },

  /**
   * 刷新今日发布数量
   */
  refreshTodayPublishCount() {
    const today = new Date().toDateString();
    const lastDate = wx.getStorageSync('lastPublishDate');
    
    if (lastDate !== today) {
      // 新的一天，重置计数
      this.globalData.todayPublishCount = 0;
      wx.setStorageSync('lastPublishDate', today);
      wx.setStorageSync('todayPublishCount', 0);
    } else {
      this.globalData.todayPublishCount = wx.getStorageSync('todayPublishCount') || 0;
    }
  },

  /**
   * 增加发布计数
   */
  incrementPublishCount() {
    this.globalData.todayPublishCount++;
    wx.setStorageSync('todayPublishCount', this.globalData.todayPublishCount);
  },

  /**
   * 检查是否可以发布
   */
  canPublish() {
    return this.globalData.todayPublishCount < this.globalData.publishDailyLimit;
  },

  /**
   * 检查小程序更新
   */
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          console.log('检测到新版本');
        }
      });
      
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });
      
      updateManager.onUpdateFailed(() => {
        wx.showToast({
          title: '更新失败，请稍后重试',
          icon: 'none'
        });
      });
    }
  }
});
