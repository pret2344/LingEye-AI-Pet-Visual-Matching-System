// pages/my-match/my-match.js
// 我的匹配页

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
      id: 'm1',
      petId: '1',
      uploadImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=golden%20retriever%20dog%20photo&image_size=portrait_4_3',
      petImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20golden%20retriever%20dog%20portrait&image_size=portrait_4_3',
      petTitle: '黄色金毛犬走失',
      similarity: 95,
      createdAt: '2024-01-15 10:30:00'
    },
    {
      id: 'm2',
      petId: '2',
      uploadImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=orange%20cat%20photo&image_size=portrait_4_3',
      petImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=fat%20orange%20tabby%20cat%20portrait&image_size=portrait_4_3',
      petTitle: '橘猫走失',
      similarity: 88,
      createdAt: '2024-01-14 16:20:00'
    },
    {
      id: 'm3',
      petId: '3',
      uploadImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=teddy%20dog%20photo&image_size=portrait_4_3',
      petImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=brown%20teddy%20poodle%20dog%20in%20red%20coat&image_size=portrait_4_3',
      petTitle: '泰迪犬丢失',
      similarity: 72,
      createdAt: '2024-01-13 09:15:00'
    },
    {
      id: 'm4',
      petId: '4',
      uploadImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=british%20shorthair%20cat%20photo&image_size=portrait_4_3',
      petImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=blue%20british%20shorthair%20cat%20portrait&image_size=portrait_4_3',
      petTitle: '蓝猫走失',
      similarity: 65,
      createdAt: '2024-01-12 14:00:00'
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
        matchTimeText: formatRelativeTime(item.createdAt),
        matchLevel: item.similarity >= 70 ? 'high' : (item.similarity >= 50 ? 'medium' : 'low')
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