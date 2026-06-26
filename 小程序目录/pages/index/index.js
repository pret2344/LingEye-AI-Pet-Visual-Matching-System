// pages/index/index.js
// 首页 - 宠物信息列表

const { formatRelativeTime, formatDistance } = require('../../utils/util');

Page({
  /**
   * 页面数据
   */
  data: {
    // Tab配置
    tabs: [
      { key: 'lost', name: '走失宠物', icon: 'lost' },
      { key: 'found', name: '发现流浪', icon: 'found' },
      { key: 'adopt', name: '待领养', icon: 'adopt' }
    ],
    currentTab: 'lost',
    tabLineLeft: 25, // 下划线位置（百分比）
    
    // 当前城市
    currentCity: '北京',
    
    // 列表数据 - 模拟数据
    list: [],
    leftList: [],  // 左列数据（瀑布流）
    rightList: [], // 右列数据（瀑布流）
    
    // 分页
    page: 1,
    pageSize: 10,
    hasMore: true,
    
    // 状态
    loading: false,
    refreshing: false,
    isEmpty: false,
    
    // 左右列高度（用于瀑布流布局）
    leftHeight: 0,
    rightHeight: 0
  },

  // 模拟数据 - 走失宠物
  mockData: {
    lost: [
      {
        id: '1',
        type: 'lost',
        title: '黄色金毛犬走失，非常着急！',
        breed: '金毛寻回犬',
        color: '金黄色',
        location: '北京市朝阳区望京SOHO',
        latitude: 39.9995,
        longitude: 116.4733,
        distance: 1200,
        status: 'published',
        createdAt: '2024-01-15 10:30:00',
        coverImage: '/assets/images/lost_golden_retriever.jpg',
        description: '我家金毛犬于1月15日早上在望京SOHO附近走失，名字叫旺财，今年3岁，性格温顺，脖子上有红色项圈。如有看到请联系我，必有重谢！'
      },
      {
        id: '2',
        type: 'lost',
        title: '蓝猫走失，脖子有铃铛',
        breed: '英国短毛猫',
        color: '蓝色',
        location: '北京市海淀区中关村',
        latitude: 39.9842,
        longitude: 116.3058,
        distance: 2500,
        status: 'published',
        createdAt: '2024-01-14 18:20:00',
        coverImage: '/assets/images/lost_british_shorthair.jpg',
        description: '蓝猫，公，2岁，于1月14日傍晚在中关村附近走失，脖子上有银色铃铛。'
      },
      {
        id: '3',
        type: 'lost',
        title: '泰迪犬丢失，穿红色衣服',
        breed: '泰迪犬',
        color: '棕色',
        location: '北京市西城区西单',
        latitude: 39.9139,
        longitude: 116.3877,
        distance: 4200,
        status: 'published',
        createdAt: '2024-01-14 09:15:00',
        coverImage: '/assets/images/lost_teddy_dog.jpg',
        description: '棕色泰迪，母，1岁，穿红色小衣服，于14日早上在西单商场附近走失。'
      },
      {
        id: '4',
        type: 'lost',
        title: '哈士奇走失，蓝眼睛',
        breed: '哈士奇',
        color: '黑白',
        location: '北京市丰台区方庄',
        latitude: 39.8586,
        longitude: 116.4261,
        distance: 5800,
        status: 'published',
        createdAt: '2024-01-13 16:40:00',
        coverImage: '/assets/images/lost_husky.jpg',
        description: '哈士奇，公，4岁，蓝眼睛，于13日下午在方庄附近走失。'
      },
      {
        id: '5',
        type: 'lost',
        title: '橘猫走失，体型较胖',
        breed: '橘猫',
        color: '橘色',
        location: '北京市东城区王府井',
        latitude: 39.9142,
        longitude: 116.4076,
        distance: 3800,
        status: 'published',
        createdAt: '2024-01-13 11:00:00',
        coverImage: '/assets/images/lost_orange_cat.jpg',
        description: '橘猫，公，3岁，体型较胖，13日上午在王府井附近走失。'
      },
      {
        id: '6',
        type: 'lost',
        title: '萨摩耶走失，毛很白',
        breed: '萨摩耶',
        color: '白色',
        location: '北京市通州区万达',
        latitude: 39.9087,
        longitude: 116.6566,
        distance: 8500,
        status: 'published',
        createdAt: '2024-01-12 15:30:00',
        coverImage: '/assets/images/lost_samoyed.jpg',
        description: '萨摩耶，母，2岁，毛很白很蓬松，12日下午在通州万达附近走失。'
      }
    ],
    found: [
      {
        id: '7',
        type: 'found',
        title: '在小区发现一只流浪猫',
        breed: '中华田园猫',
        color: '黑白花',
        location: '北京市朝阳区望京',
        latitude: 39.9987,
        longitude: 116.4752,
        distance: 1500,
        status: 'published',
        createdAt: '2024-01-15 08:00:00',
        coverImage: '/assets/images/found_stray_cat.jpg',
        description: '今早在望京某小区楼下发现一只黑白花猫，看起来很温顺，似乎走丢了。'
      },
      {
        id: '8',
        type: 'found',
        title: '地铁站发现小狗',
        breed: '中华田园犬',
        color: '黄色',
        location: '北京市海淀区五道口',
        latitude: 39.9966,
        longitude: 116.3205,
        distance: 2800,
        status: 'published',
        createdAt: '2024-01-14 20:15:00',
        coverImage: '/assets/images/found_chinese_dog.jpg',
        description: '晚上在五道口地铁站发现一只小黄狗，一直在原地徘徊，好像在找主人。'
      },
      {
        id: '9',
        type: 'found',
        title: '公园发现流浪橘猫',
        breed: '橘猫',
        color: '橘色',
        location: '北京市西城区中山公园',
        latitude: 39.9199,
        longitude: 116.3972,
        distance: 4000,
        status: 'published',
        createdAt: '2024-01-14 14:30:00',
        coverImage: '/assets/images/found_stray_orange.jpg',
        description: '下午在中山公园发现一只橘猫，看起来很亲人，似乎是走失的家猫。'
      },
      {
        id: '10',
        type: 'found',
        title: '便利店门口发现小狗',
        breed: '吉娃娃',
        color: '棕色',
        location: '北京市朝阳区三里屯',
        latitude: 39.9371,
        longitude: 116.4487,
        distance: 2200,
        status: 'published',
        createdAt: '2024-01-13 17:00:00',
        coverImage: '/assets/images/found_chihuahua.jpg',
        description: '在三里屯某便利店门口发现一只吉娃娃，一直在叫，好像在找主人。'
      }
    ],
    adopt: [
      {
        id: '11',
        type: 'adopt',
        title: '可爱橘猫求领养',
        breed: '橘猫',
        color: '橘色',
        location: '北京市海淀区',
        latitude: 39.9789,
        longitude: 116.3025,
        distance: 2600,
        status: 'published',
        createdAt: '2024-01-15 09:00:00',
        coverImage: '/assets/images/adopt_kitten.jpg',
        description: '三个月大的橘猫弟弟，性格温顺，已经做过驱虫，希望找个有爱心的主人。'
      },
      {
        id: '12',
        type: 'adopt',
        title: '萨摩耶幼犬求领养',
        breed: '萨摩耶',
        color: '白色',
        location: '北京市朝阳区',
        latitude: 39.9567,
        longitude: 116.4234,
        distance: 1800,
        status: 'published',
        createdAt: '2024-01-14 10:00:00',
        coverImage: '/assets/images/adopt_samoyed_puppy.jpg',
        description: '两个月大的萨摩耶妹妹，非常可爱，疫苗已打，希望给她找个温暖的家。'
      },
      {
        id: '13',
        type: 'adopt',
        title: '三花猫求领养',
        breed: '中华田园猫',
        color: '三花',
        location: '北京市西城区',
        latitude: 39.9187,
        longitude: 116.3856,
        distance: 3800,
        status: 'published',
        createdAt: '2024-01-13 11:30:00',
        coverImage: '/assets/images/adopt_calico_cat.jpg',
        description: '一岁的三花妹妹，性格活泼，已绝育，希望找个有耐心的主人。'
      },
      {
        id: '14',
        type: 'adopt',
        title: '柯基幼犬求领养',
        breed: '柯基犬',
        color: '黄白',
        location: '北京市丰台区',
        latitude: 39.8678,
        longitude: 116.3567,
        distance: 5200,
        status: 'published',
        createdAt: '2024-01-12 16:00:00',
        coverImage: '/assets/images/adopt_corgi.jpg',
        description: '三个月大的柯基弟弟，小短腿超可爱，已打疫苗，期待新家。'
      },
      {
        id: '15',
        type: 'adopt',
        title: '蓝猫求领养',
        breed: '英国短毛猫',
        color: '蓝色',
        location: '北京市通州区',
        latitude: 39.9123,
        longitude: 116.6234,
        distance: 8000,
        status: 'published',
        createdAt: '2024-01-11 14:00:00',
        coverImage: '/assets/images/adopt_blue_cat.jpg',
        description: '两岁的蓝猫弟弟，性格温顺，已绝育，希望找个安静的家。'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 从参数获取初始tab
    if (options.tab && ['lost', 'found', 'adopt'].includes(options.tab)) {
      this.setData({ currentTab: options.tab });
    }
    
    // 获取当前城市
    this.getCurrentCity();
    
    // 加载数据
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 设置自定义tabBar选中状态
    this.setTabBarActive(0);
    
    // 刷新数据（从发布页返回时）
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (prevPage && prevPage.data && prevPage.data.needRefresh) {
      this.refreshData();
      prevPage.setData({ needRefresh: false });
    }
  },
  
  /**
   * 设置tabBar选中状态
   */
  setTabBarActive(index) {
    const tabBar = this.getTabBar();
    if (tabBar) {
      tabBar.setData({ activeIndex: index });
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.refreshData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore();
    }
  },

  /**
   * 获取当前城市
   */
  getCurrentCity() {
    const app = getApp();
    if (app.globalData.location.address) {
      const addr = app.globalData.location.address;
      const city = addr.match(/[\u4e00-\u9fa5]+市/)?.[0] || '北京';
      this.setData({ currentCity: city });
    }
  },

  /**
   * 切换Tab
   */
  onTabChange(e) {
    const { key } = e.currentTarget.dataset;
    if (key !== this.data.currentTab) {
      // 计算下划线位置（三个tab平均分布）
      const tabIndex = this.data.tabs.findIndex(tab => tab.key === key);
      const tabLineLeft = 25 + tabIndex * 25; // 每个tab占33.3%，取中间位置
      
      this.setData({
        currentTab: key,
        tabLineLeft: tabLineLeft,
        list: [],
        leftList: [],
        rightList: [],
        page: 1,
        hasMore: true,
        isEmpty: false,
        leftHeight: 0,
        rightHeight: 0
      });
      
      this.loadData();
    }
  },

  /**
   * 刷新数据
   */
  refreshData() {
    this.setData({
      refreshing: true,
      page: 1,
      hasMore: true,
      leftHeight: 0,
      rightHeight: 0
    });
    
    this.loadData();
    
    this.setData({ refreshing: false });
    wx.stopPullDownRefresh();
  },

  /**
   * 加载更多
   */
  loadMore() {
    this.setData({ page: this.data.page + 1 });
    this.loadData();
  },

  /**
   * 加载数据
   */
  loadData() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const { currentTab, page, pageSize, list } = this.data;
      
      // 使用模拟数据
      const allData = this.mockData[currentTab] || [];
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const newList = allData.slice(start, end);
      
      const formattedList = this.formatListData(newList);
      
      // 瀑布流分配
      const { leftList, rightList } = this.distributeWaterfall(formattedList);
      
      this.setData({
        list: page === 1 ? formattedList : [...list, ...formattedList],
        leftList: page === 1 ? leftList : [...this.data.leftList, ...leftList],
        rightList: page === 1 ? rightList : [...this.data.rightList, ...rightList],
        hasMore: end < allData.length,
        isEmpty: page === 1 && allData.length === 0
      });
    } catch (err) {
      console.error('加载数据失败:', err);
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 格式化列表数据
   */
  formatListData(list) {
    return list.map(item => ({
      ...item,
      // 格式化时间
      publishTimeText: formatRelativeTime(item.createdAt),
      // 格式化距离
      distanceText: item.distance ? formatDistance(item.distance) : '',
      // 封面图（直接使用coverImage字段）
      coverImage: item.coverImage || '',
      // 状态标签
      statusText: this.getStatusText(item.type, item.status),
      // 随机高度（用于瀑布流）
      imageHeight: 200 + Math.floor(Math.random() * 100)
    }));
  },

  /**
   * 获取状态文本
   */
  getStatusText(type, status) {
    const statusMap = {
      lost: { published: '寻找中', found: '已找到' },
      found: { published: '待认领', claimed: '已认领' },
      adopt: { published: '待领养', adopted: '已领养' }
    };
    return statusMap[type]?.[status] || '';
  },

  /**
   * 瀑布流分配
   */
  distributeWaterfall(list) {
    const leftList = [];
    const rightList = [];
    let leftHeight = this.data.leftHeight;
    let rightHeight = this.data.rightHeight;
    
    list.forEach(item => {
      // 根据高度分配到较短的一列
      if (leftHeight <= rightHeight) {
        leftList.push(item);
        leftHeight += item.imageHeight + 120; // 120是卡片其他部分的高度
      } else {
        rightList.push(item);
        rightHeight += item.imageHeight + 120;
      }
    });
    
    this.setData({ leftHeight, rightHeight });
    
    return { leftList, rightList };
  },

  /**
   * 跳转到详情页
   */
  goToDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  /**
   * 跳转到地图页
   */
  goToMap() {
    wx.switchTab({
      url: '/pages/map/map'
    });
  },

  /**
   * 跳转到发布页
   */
  goToPublish() {
    const app = getApp();
    if (!app.globalData.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再发布信息',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/profile/profile'
            });
          }
        }
      });
      return;
    }
    
    wx.navigateTo({
      url: `/pages/publish/publish?type=${this.data.currentTab}`
    });
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
