// custom-tab-bar/index.js
// 自定义tabBar组件

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeIndex: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // tabBar配置
    tabList: [
      {
        pagePath: '/pages/index/index',
        text: '首页',
        icon: 'home'
      },
      {
        pagePath: '/pages/ai-match/ai-match',
        text: 'AI匹配',
        icon: 'ai'
      },
      {
        pagePath: '/pages/map/map',
        text: '地图',
        icon: 'map'
      },
      {
        pagePath: '/pages/profile/profile',
        text: '我的',
        icon: 'profile'
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击tab项
     */
    onTabTap(e) {
      const index = e.currentTarget.dataset.index;
      const tab = this.data.tabList[index];
      
      // 避免重复点击
      if (index === this.properties.activeIndex) return;
      
      // 切换动画
      this.setData({
        activeIndex: index
      });
      
      // 跳转到对应页面
      wx.switchTab({
        url: tab.pagePath
      });
    }
  }
});