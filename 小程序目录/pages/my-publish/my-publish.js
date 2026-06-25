// pages/my-publish/my-publish.js
// 我的发布页

const { formatRelativeTime } = require('../../utils/util');

Page({
  data: {
    // Tab配置
    tabs: [
      { key: 'all', name: '全部' },
      { key: 'pending', name: '审核中' },
      { key: 'published', name: '已发布' },
      { key: 'completed', name: '已完成' },
      { key: 'rejected', name: '已拒绝' }
    ],
    currentTab: 'all',
    
    // 列表数据
    list: [],
    page: 1,
    hasMore: true,
    
    // 状态
    loading: false,
    isEmpty: false
  },

  // 模拟数据
  mockData: {
    pending: [
      {
        id: 'p1',
        type: 'lost',
        title: '黄色金毛犬走失',
        breed: '金毛寻回犬',
        color: '金黄色',
        location: '北京市朝阳区望京SOHO',
        status: 'pending',
        statusText: '审核中',
        createdAt: '2024-01-15 10:30:00',
        images: ['https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20golden%20retriever%20dog%20portrait&image_size=portrait_4_3']
      }
    ],
    published: [
      {
        id: 'p2',
        type: 'lost',
        title: '蓝猫走失，脖子有铃铛',
        breed: '英国短毛猫',
        color: '蓝色',
        location: '北京市海淀区中关村',
        status: 'published',
        statusText: '寻找中',
        createdAt: '2024-01-14 18:20:00',
        images: ['https://neeko-copilot.bytedance.net/api/text_to_image?prompt=blue%20british%20shorthair%20cat%20portrait&image_size=portrait_4_3']
      },
      {
        id: 'p3',
        type: 'adopt',
        title: '可爱橘猫求领养',
        breed: '橘猫',
        color: '橘色',
        location: '北京市海淀区',
        status: 'published',
        statusText: '待领养',
        createdAt: '2024-01-13 09:00:00',
        images: ['https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20orange%20kitten%20for%20adoption&image_size=portrait_4_3']
      }
    ],
    completed: [
      {
        id: 'p4',
        type: 'found',
        title: '小区发现流浪猫已认领',
        breed: '中华田园猫',
        color: '黑白花',
        location: '北京市朝阳区望京',
        status: 'completed',
        statusText: '已认领',
        createdAt: '2024-01-12 08:00:00',
        images: ['https://neeko-copilot.bytedance.net/api/text_to_image?prompt=black%20white%20stray%20cat%20portrait&image_size=portrait_4_3']
      }
    ],
    rejected: [
      {
        id: 'p5',
        type: 'lost',
        title: '哈士奇走失',
        breed: '哈士奇',
        color: '黑白',
        location: '北京市丰台区方庄',
        status: 'rejected',
        statusText: '已拒绝',
        createdAt: '2024-01-11 16:40:00',
        images: ['https://neeko-copilot.bytedance.net/api/text_to_image?prompt=husky%20dog%20with%20blue%20eyes%20portrait&image_size=portrait_4_3']
      }
    ]
  },

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

  onTabChange(e) {
    const { key } = e.currentTarget.dataset;
    if (key !== this.data.currentTab) {
      this.setData({
        currentTab: key,
        list: [],
        page: 1,
        hasMore: true,
        isEmpty: false
      });
      this.loadData();
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
      const { currentTab, page, pageSize = 10 } = this.data;
      
      // 使用模拟数据
      let allData = [];
      if (currentTab === 'all') {
        // 合并所有状态的数据
        Object.values(this.mockData).forEach(arr => {
          allData = [...allData, ...arr];
        });
      } else {
        allData = this.mockData[currentTab] || [];
      }
      
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
  },

  deleteItem(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除吗？',
      success: (res) => {
        if (res.confirm) {
          // 从列表中移除
          const newList = this.data.list.filter(item => item.id !== id);
          this.setData({ 
            list: newList,
            isEmpty: newList.length === 0
          });
          wx.showToast({ title: '删除成功', icon: 'success' });
        }
      }
    });
  }
});