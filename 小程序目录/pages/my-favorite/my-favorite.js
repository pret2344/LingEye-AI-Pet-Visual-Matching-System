// pages/my-favorite/my-favorite.js
// 我的收藏页

const { formatRelativeTime } = require('../../utils/util');

Page({
  data: {
    list: [],
    page: 1,
    hasMore: true,
    loading: false,
    isEmpty: false
  },

  // 模拟数据
  mockData: [
    {
      id: 'f1',
      type: 'lost',
      title: '黄色金毛犬走失，非常着急！',
      breed: '金毛寻回犬',
      color: '金黄色',
      location: '北京市朝阳区望京SOHO',
      createdAt: '2024-01-15 10:30:00',
      images: ['https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20golden%20retriever%20dog%20portrait&image_size=portrait_4_3']
    },
    {
      id: 'f2',
      type: 'adopt',
      title: '可爱橘猫求领养',
      breed: '橘猫',
      color: '橘色',
      location: '北京市海淀区',
      createdAt: '2024-01-14 09:00:00',
      images: ['https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20orange%20kitten%20for%20adoption&image_size=portrait_4_3']
    },
    {
      id: 'f3',
      type: 'found',
      title: '在小区发现一只流浪猫',
      breed: '中华田园猫',
      color: '黑白花',
      location: '北京市朝阳区望京',
      createdAt: '2024-01-13 08:00:00',
      images: ['https://neeko-copilot.bytedance.net/api/text_to_image?prompt=black%20white%20stray%20cat%20portrait&image_size=portrait_4_3']
    },
    {
      id: 'f4',
      type: 'adopt',
      title: '萨摩耶幼犬求领养',
      breed: '萨摩耶',
      color: '白色',
      location: '北京市朝阳区',
      createdAt: '2024-01-12 10:00:00',
      images: ['https://neeko-copilot.bytedance.net/api/text_to_image?prompt=samoyed%20puppy%20for%20adoption&image_size=portrait_4_3']
    }
  ],

  onLoad() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.refreshData();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore();
    }
  },

  refreshData() {
    this.setData({ page: 1, hasMore: true });
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadMore() {
    this.setData({ page: this.data.page + 1 });
    this.loadData();
  },

  loadData() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const { page, pageSize = 10 } = this.data;
      
      // 使用模拟数据
      const allData = this.mockData;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const newList = allData.slice(start, end).map(item => ({
        ...item,
        publishTimeText: formatRelativeTime(item.createdAt),
        coverImage: item.images && item.images[0] ? item.images[0] : ''
      }));
      
      this.setData({
        list: page === 1 ? newList : [...this.data.list, ...newList],
        hasMore: end < allData.length,
        isEmpty: page === 1 && allData.length === 0
      });
    } catch (err) {
      console.error('加载失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  }
});