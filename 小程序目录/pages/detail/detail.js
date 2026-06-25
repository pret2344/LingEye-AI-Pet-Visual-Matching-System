// pages/detail/detail.js
// 信息详情页

const { formatRelativeTime } = require('../../utils/util');

Page({
  /**
   * 页面数据
   */
  data: {
    // 当前信息ID
    id: '',
    
    // 信息详情（模拟数据）
    detail: null,
    
    // 是否是自己发布的
    isOwner: false,
    
    // 是否已收藏
    isFavorite: false,
    
    // 评论列表
    comments: [],
    
    // 新评论内容
    newComment: '',
    
    // 加载状态
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id || '1';
    this.setData({ id });
    this.loadDetail(id);
    this.loadComments(id);
  },

  /**
   * 加载详情数据
   */
  loadDetail(id) {
    // 模拟详情数据
    const mockDetails = {
      '1': {
        id: '1',
        type: 'lost',
        title: '黄色金毛犬走失，非常着急！',
        breed: '金毛寻回犬',
        color: '金黄色',
        gender: '公',
        age: '3岁',
        location: '北京市朝阳区望京SOHO',
        latitude: 39.9995,
        longitude: 116.4733,
        description: '我家金毛犬于1月15日早上在望京SOHO附近走失，名字叫旺财，今年3岁，性格温顺，脖子上有红色项圈。如有看到请联系我，必有重谢！联系方式：138-xxxx-xxxx',
        status: 'published',
        createdAt: '2024-01-15 10:30:00',
        images: [
          'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20golden%20retriever%20dog%20portrait&image_size=portrait_4_3',
          'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=golden%20retriever%20playing%20in%20park&image_size=portrait_4_3',
          'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=golden%20retriever%20running&image_size=portrait_4_3'
        ],
        author: {
          id: 'user1',
          nickName: '爱犬人士',
          avatarUrl: ''
        }
      },
      '2': {
        id: '2',
        type: 'found',
        title: '小区发现一只流浪橘猫',
        breed: '橘猫',
        color: '橘色',
        gender: '公',
        age: '约1岁',
        location: '北京市海淀区中关村',
        latitude: 39.9842,
        longitude: 116.3133,
        description: '在小区楼下发现一只橘猫，看起来很温顺，像是走失的家猫。已经暂时安置在门卫室，希望主人尽快来认领。',
        status: 'published',
        createdAt: '2024-01-14 16:20:00',
        images: [
          'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20orange%20tabby%20cat%20portrait&image_size=portrait_4_3',
          'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=orange%20cat%20sitting&image_size=portrait_4_3'
        ],
        author: {
          id: 'user2',
          nickName: '好心人',
          avatarUrl: ''
        }
      },
      '3': {
        id: '3',
        type: 'adopt',
        title: '可爱泰迪犬寻找新家',
        breed: '泰迪犬',
        color: '棕色',
        gender: '母',
        age: '2岁',
        location: '北京市西城区西单',
        latitude: 39.9152,
        longitude: 116.3972,
        description: '因工作原因无法继续照顾，希望给狗狗找一个有爱心的新家。狗狗很聪明，已接种疫苗，会基本指令。',
        status: 'published',
        createdAt: '2024-01-13 09:15:00',
        images: [
          'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20brown%20teddy%20dog%20portrait&image_size=portrait_4_3',
          'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=teddy%20dog%20playing&image_size=portrait_4_3',
          'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=teddy%20dog%20sleeping&image_size=portrait_4_3',
          'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=teddy%20dog%20running&image_size=portrait_4_3'
        ],
        author: {
          id: 'user3',
          nickName: '铲屎官',
          avatarUrl: ''
        }
      }
    };
    
    setTimeout(() => {
      this.setData({
        detail: mockDetails[id] || mockDetails['1'],
        loading: false
      });
    }, 500);
  },

  /**
   * 加载评论
   */
  loadComments(id) {
    // 模拟评论数据
    const mockComments = {
      '1': [
        {
          id: 'c1',
          author: { id: 'u1', nickName: '热心市民', avatarUrl: '' },
          content: '帮你留意一下，希望狗狗早日回家！',
          createdAt: '2024-01-15 11:20:00'
        },
        {
          id: 'c2',
          author: { id: 'u2', nickName: '爱狗人士', avatarUrl: '' },
          content: '昨天在望京地铁站附近看到一只类似的金毛，你可以去那边问问',
          createdAt: '2024-01-15 12:30:00'
        },
        {
          id: 'c3',
          author: { id: 'u3', nickName: '路人甲', avatarUrl: '' },
          content: '顶一下，希望早日找到',
          createdAt: '2024-01-15 14:00:00'
        }
      ],
      '2': [
        {
          id: 'c1',
          author: { id: 'u1', nickName: '猫奴', avatarUrl: '' },
          content: '好可爱的橘猫，帮你转发',
          createdAt: '2024-01-14 17:00:00'
        }
      ],
      '3': [
        {
          id: 'c1',
          author: { id: 'u1', nickName: '想养狗', avatarUrl: '' },
          content: '请问狗狗性格怎么样？',
          createdAt: '2024-01-13 10:00:00'
        },
        {
          id: 'c2',
          author: { id: 'u2', nickName: '领养人', avatarUrl: '' },
          content: '我想领养，怎么联系你？',
          createdAt: '2024-01-13 11:30:00'
        }
      ]
    };
    
    this.setData({
      comments: mockComments[id] || []
    });
  },

  /**
   * 预览图片
   */
  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    wx.previewImage({
      current: this.data.detail.images[index],
      urls: this.data.detail.images
    });
  },

  /**
   * 导航到地图
   */
  onNavigateMap() {
    const { latitude, longitude, location } = this.data.detail;
    wx.openLocation({
      latitude,
      longitude,
      name: location,
      scale: 18
    });
  },

  /**
   * 收藏
   */
  onToggleFavorite() {
    const isFavorite = !this.data.isFavorite;
    this.setData({ isFavorite });
    
    wx.showToast({
      title: isFavorite ? '已收藏' : '已取消收藏',
      icon: 'none'
    });
  },

  /**
   * 分享
   */
  onShare() {
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  /**
   * 举报
   */
  onReport() {
    wx.showModal({
      title: '举报',
      content: '确定要举报这条信息吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '已提交举报',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 标记为已找到/已领养
   */
  onMarkCompleted() {
    const type = this.data.detail.type;
    const message = type === 'lost' ? '标记为已找到' : type === 'adopt' ? '标记为已领养' : '标记为已处理';
    
    wx.showModal({
      title: message,
      content: `确定要${message}吗？`,
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: message + '成功',
            icon: 'success'
          });
          
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      }
    });
  },

  /**
   * 提交评论
   */
  onSubmitComment() {
    if (!this.data.newComment.trim()) {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none'
      });
      return;
    }
    
    const newComment = {
      id: 'c' + Date.now(),
      author: { id: 'current', nickName: '我', avatarUrl: '' },
      content: this.data.newComment,
      createdAt: new Date().toLocaleString()
    };
    
    this.setData({
      comments: [...this.data.comments, newComment],
      newComment: ''
    });
    
    wx.showToast({
      title: '评论成功',
      icon: 'success'
    });
  },

  /**
   * 分享配置
   */
  onShareAppMessage() {
    return {
      title: this.data.detail?.title || '灵眸AI宠物',
      path: `/pages/detail/detail?id=${this.data.id}`
    };
  }
});
