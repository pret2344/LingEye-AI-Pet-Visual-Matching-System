// pages/map/map.js
// 地图页

Page({
  /**
   * 页面数据
   */
  data: {
    // 当前位置
    latitude: 39.9995,
    longitude: 116.4733,
    scale: 14,
    
    // 筛选类型
    filterTabs: [
      { key: 'all', name: '全部' },
      { key: 'lost', name: '走失' },
      { key: 'found', name: '发现' },
      { key: 'adopt', name: '领养' }
    ],
    currentFilter: 'all',
    
    // 标记点数据
    markers: [],
    
    // 弹窗信息
    showPopup: false,
    popupData: null,
    
    // 是否正在定位
    isLocating: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getLocation();
    this.loadMarkers();
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 设置自定义tabBar选中状态
    const tabBar = this.getTabBar();
    if (tabBar) {
      tabBar.setData({ activeIndex: 2 });
    }
  },

  /**
   * 获取当前位置
   */
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          isLocating: false
        });
      },
      fail: () => {
        // 使用默认位置
        this.setData({
          isLocating: false
        });
      }
    });
  },

  /**
   * 加载标记点数据
   */
  loadMarkers() {
    // 模拟标记点数据
    const mockMarkers = [
      // 走失 - 红色
      {
        id: 1,
        type: 'lost',
        latitude: 39.9995,
        longitude: 116.4733,
        title: '金毛犬走失',
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=golden%20retriever%20dog&image_size=portrait_4_3',
        similarity: 95
      },
      {
        id: 2,
        type: 'lost',
        latitude: 39.9842,
        longitude: 116.3133,
        title: '橘猫走失',
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=orange%20cat&image_size=portrait_4_3',
        similarity: 88
      },
      {
        id: 3,
        type: 'lost',
        latitude: 39.9152,
        longitude: 116.3972,
        title: '泰迪犬走失',
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=teddy%20dog&image_size=portrait_4_3',
        similarity: 92
      },
      // 发现 - 绿色
      {
        id: 4,
        type: 'found',
        latitude: 40.0050,
        longitude: 116.4800,
        title: '发现流浪猫',
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=stray%20cat&image_size=portrait_4_3',
        similarity: 0
      },
      {
        id: 5,
        type: 'found',
        latitude: 39.9700,
        longitude: 116.4200,
        title: '发现流浪狗',
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=stray%20dog&image_size=portrait_4_3',
        similarity: 0
      },
      // 领养 - 蓝色
      {
        id: 6,
        type: 'adopt',
        latitude: 39.9500,
        longitude: 116.4500,
        title: '泰迪犬求领养',
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20teddy%20dog&image_size=portrait_4_3',
        similarity: 0
      },
      {
        id: 7,
        type: 'adopt',
        latitude: 40.0200,
        longitude: 116.4400,
        title: '英短猫求领养',
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=british%20shorthair%20cat&image_size=portrait_4_3',
        similarity: 0
      },
      {
        id: 8,
        type: 'adopt',
        latitude: 39.9300,
        longitude: 116.5000,
        title: '哈士奇求领养',
        image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=husky%20dog&image_size=portrait_4_3',
        similarity: 0
      }
    ];
    
    // 转换为map组件需要的marker格式
    const formattedMarkers = mockMarkers.map((item) => ({
      id: item.id,
      latitude: item.latitude,
      longitude: item.longitude,
      iconPath: this.getMarkerIcon(item.type),
      width: 48,
      height: 48,
      data: item
    }));
    
    this.setData({ markers: formattedMarkers });
  },

  /**
   * 获取标记点图标
   */
  getMarkerIcon(type) {
    // 返回不同类型的图标颜色标识
    // 在实际项目中，这里应该是真实的图标路径
    const icons = {
      lost: '',  // 红色
      found: '', // 绿色
      adopt: ''  // 蓝色
    };
    return icons[type];
  },

  /**
   * 点击标记点
   */
  onMarkerTap(e) {
    const marker = e.detail.marker;
    if (marker && marker.data) {
      this.setData({
        showPopup: true,
        popupData: marker.data
      });
    }
  },

  /**
   * 切换筛选
   */
  onFilterChange(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ currentFilter: key });
    
    // 根据筛选条件过滤标记点
    const allMarkers = this.data.markers;
    if (key === 'all') {
      this.setData({ markers: allMarkers });
    } else {
      const filtered = allMarkers.filter(m => m.data.type === key);
      this.setData({ markers: filtered });
    }
  },

  /**
   * 查看详情
   */
  onViewDetail() {
    const id = this.data.popupData.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
    this.setData({ showPopup: false });
  },

  /**
   * 弹窗内容点击（阻止事件冒泡）
   */
  onPopupTap() {
    // 空函数，用于阻止事件冒泡到遮罩层
  },

  /**
   * 关闭弹窗
   */
  onClosePopup() {
    this.setData({ showPopup: false });
  },

  /**
   * 回到当前位置
   */
  onLocate() {
    this.setData({ isLocating: true });
    this.getLocation();
  }
});
