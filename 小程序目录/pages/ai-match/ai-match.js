// pages/ai-match/ai-match.js
// AI匹配页

Page({
  /**
   * 页面数据
   */
  data: {
    // 上传的图片
    imagePath: '',
    
    // 是否正在识别
    isRecognizing: false,
    
    // AI识别结果
    aiResult: null,
    
    // 匹配结果列表
    matchResults: [],
    
    // 是否显示匹配结果
    showMatchResults: false
  },

  /**
   * 选择图片
   */
  onChooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          imagePath: res.tempFilePaths[0],
          aiResult: null,
          matchResults: [],
          showMatchResults: false
        });
        
        // 自动开始识别
        this.startRecognize();
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
   * 开始AI识别
   */
  startRecognize() {
    if (!this.data.imagePath) return;
    
    this.setData({
      isRecognizing: true,
      aiResult: null
    });
    
    // 模拟AI识别过程
    setTimeout(() => {
      // AI识别结果
      const aiResults = [
        { breed: '金毛寻回犬', color: '金黄色', confidence: 95 },
        { breed: '英国短毛猫', color: '蓝色', confidence: 88 },
        { breed: '泰迪犬', color: '棕色', confidence: 92 },
        { breed: '哈士奇', color: '黑白', confidence: 85 },
        { breed: '橘猫', color: '橘色', confidence: 98 }
      ];
      
      const aiResult = aiResults[Math.floor(Math.random() * aiResults.length)];
      
      this.setData({ aiResult });
      
      // 开始匹配
      this.startMatch(aiResult);
    }, 2000);
  },

  /**
   * 开始匹配
   */
  startMatch(aiResult) {
    // 模拟匹配过程
    setTimeout(() => {
      const mockMatches = [
        {
          id: 'm1',
          similarity: 95,
          pet: {
            id: '1',
            title: '黄色金毛犬走失',
            breed: '金毛寻回犬',
            color: '金黄色',
            location: '北京市朝阳区望京SOHO',
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20golden%20retriever%20dog%20portrait&image_size=portrait_4_3'
          }
        },
        {
          id: 'm2',
          similarity: 88,
          pet: {
            id: '2',
            title: '金毛犬走失',
            breed: '金毛寻回犬',
            color: '浅金色',
            location: '北京市海淀区中关村',
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=golden%20retriever%20dog%20side%20view&image_size=portrait_4_3'
          }
        },
        {
          id: 'm3',
          similarity: 82,
          pet: {
            id: '3',
            title: '发现金毛犬一只',
            breed: '金毛寻回犬',
            color: '金黄色',
            location: '北京市东城区王府井',
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=golden%20retriever%20dog%20running&image_size=portrait_4_3'
          }
        },
        {
          id: 'm4',
          similarity: 75,
          pet: {
            id: '4',
            title: '走失金毛犬',
            breed: '金毛寻回犬',
            color: '深金色',
            location: '北京市西城区西单',
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=golden%20retriever%20dog%20sitting&image_size=portrait_4_3'
          }
        },
        {
          id: 'm5',
          similarity: 68,
          pet: {
            id: '5',
            title: '疑似走失金毛',
            breed: '金毛寻回犬',
            color: '金黄色',
            location: '北京市丰台区',
            image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=golden%20retriever%20dog%20playing&image_size=portrait_4_3'
          }
        }
      ];
      
      this.setData({
        isRecognizing: false,
        matchResults: mockMatches,
        showMatchResults: true
      });
    }, 1500);
  },

  /**
   * 查看详情
   */
  onViewDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  /**
   * 重新上传
   */
  onReupload() {
    this.setData({
      imagePath: '',
      aiResult: null,
      matchResults: [],
      showMatchResults: false,
      isRecognizing: false
    });
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 设置自定义tabBar选中状态
    const tabBar = this.getTabBar();
    if (tabBar) {
      tabBar.setData({ activeIndex: 1 });
    }
  }
});
