// pages/publish/publish.js
// 信息发布页

Page({
  /**
   * 页面数据
   */
  data: {
    // 类型选择
    typeTabs: [
      { key: 'lost', name: '走失宠物' },
      { key: 'found', name: '发现流浪' },
      { key: 'adopt', name: '送养宠物' }
    ],
    currentType: 'lost',
    
    // 图片列表
    images: [],
    maxImages: 6,
    
    // 表单数据
    formData: {
      title: '',
      description: '',
      location: '',
      latitude: null,
      longitude: null,
      breed: '',
      color: '',
      gender: '',
      age: '',
      reward: ''
    },
    
    // AI识别结果
    aiResult: null,
    isAiLoading: false,
    
    // 每日发布上限
    dailyLimit: 5,
    todayCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 从参数获取类型
    if (options.type && ['lost', 'found', 'adopt'].includes(options.type)) {
      this.setData({ currentType: options.type });
    }
    
    // 获取今日发布数量
    this.getTodayPublishCount();
  },

  /**
   * 获取今日发布数量
   */
  getTodayPublishCount() {
    const today = new Date().toDateString();
    const lastDate = wx.getStorageSync('lastPublishDate');
    
    if (lastDate !== today) {
      this.setData({ todayCount: 0 });
      wx.setStorageSync('lastPublishDate', today);
      wx.setStorageSync('todayPublishCount', 0);
    } else {
      this.setData({ todayCount: wx.getStorageSync('todayPublishCount') || 0 });
    }
  },

  /**
   * 切换类型
   */
  onTypeChange(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ currentType: key });
  },

  /**
   * 选择图片
   */
  onChooseImage() {
    const { images, maxImages } = this.data;
    const count = maxImages - images.length;
    
    wx.chooseImage({
      count: count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = [...images, ...res.tempFilePaths];
        this.setData({ images: newImages });
      },
      fail: () => {
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 预览图片
   */
  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    wx.previewImage({
      current: this.data.images[index],
      urls: this.data.images
    });
  },

  /**
   * 删除图片
   */
  onDeleteImage(e) {
    const { index } = e.currentTarget.dataset;
    const newImages = [...this.data.images];
    newImages.splice(index, 1);
    this.setData({ images: newImages });
  },

  /**
   * AI识别
   */
  onAiRecognize() {
    if (this.data.images.length === 0) {
      wx.showToast({
        title: '请先上传图片',
        icon: 'none'
      });
      return;
    }
    
    this.setData({ isAiLoading: true });
    
    // 模拟AI识别
    setTimeout(() => {
      const aiResults = [
        { breed: '金毛寻回犬', color: '金黄色', confidence: 95 },
        { breed: '英国短毛猫', color: '蓝色', confidence: 88 },
        { breed: '泰迪犬', color: '棕色', confidence: 92 },
        { breed: '哈士奇', color: '黑白', confidence: 85 },
        { breed: '橘猫', color: '橘色', confidence: 98 }
      ];
      
      const randomResult = aiResults[Math.floor(Math.random() * aiResults.length)];
      
      this.setData({
        aiResult: randomResult,
        isAiLoading: false,
        'formData.breed': randomResult.breed,
        'formData.color': randomResult.color
      });
      
      wx.showToast({
        title: 'AI识别完成',
        icon: 'success'
      });
    }, 1500);
  },

  /**
   * 选择位置
   */
  onChooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          'formData.location': res.name,
          'formData.latitude': res.latitude,
          'formData.longitude': res.longitude
        });
      },
      fail: () => {
        wx.showToast({
          title: '选择位置失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 表单输入
   */
  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },

  /**
   * 表单校验
   */
  validateForm() {
    const { currentType, formData, images } = this.data;
    
    // 检查图片
    if (images.length === 0) {
      wx.showToast({
        title: '请至少上传一张图片',
        icon: 'none'
      });
      return false;
    }
    
    // 检查标题
    if (!formData.title.trim()) {
      wx.showToast({
        title: '请填写标题',
        icon: 'none'
      });
      return false;
    }
    
    // 检查描述
    if (!formData.description.trim()) {
      wx.showToast({
        title: '请填写详细描述',
        icon: 'none'
      });
      return false;
    }
    
    // 检查位置
    if (!formData.location.trim()) {
      wx.showToast({
        title: '请选择地点',
        icon: 'none'
      });
      return false;
    }
    
    return true;
  },

  /**
   * 提交表单
   */
  onSubmit() {
    if (!this.validateForm()) return;
    
    // 检查发布限制
    if (this.data.todayCount >= this.data.dailyLimit) {
      wx.showToast({
        title: `今日发布次数已达上限（${this.data.dailyLimit}次）`,
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({ title: '提交中...' });
    
    // 模拟提交
    setTimeout(() => {
      wx.hideLoading();
      
      // 更新发布计数
      const newCount = this.data.todayCount + 1;
      wx.setStorageSync('todayPublishCount', newCount);
      
      wx.showToast({
        title: '提交成功，等待管理员审核',
        icon: 'success',
        duration: 2000
      });
      
      // 2秒后跳转
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/my-publish/my-publish'
        });
      }, 2000);
    }, 1500);
  },

  /**
   * 返回
   */
  onBack() {
    wx.navigateBack();
  }
});
