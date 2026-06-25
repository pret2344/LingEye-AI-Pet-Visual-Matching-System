/**
 * 通用工具函数
 */

/**
 * 格式化时间
 * @param {Date|string|number} date 时间对象/字符串/时间戳
 * @param {string} format 格式化模板
 * @returns {string}
 */
const formatTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '';
  
  // 转换为Date对象
  let d;
  if (typeof date === 'string') {
    d = new Date(date.replace(/-/g, '/'));
  } else if (typeof date === 'number') {
    d = new Date(date);
  } else {
    d = date;
  }
  
  // 检查日期有效性
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();
  
  const formatObj = {
    YYYY: year,
    MM: padZero(month),
    DD: padZero(day),
    HH: padZero(hour),
    mm: padZero(minute),
    ss: padZero(second)
  };
  
  return format.replace(/(YYYY|MM|DD|HH|mm|ss)/g, (match) => formatObj[match]);
};

/**
 * 补零
 * @param {number} num 数字
 * @returns {string}
 */
const padZero = (num) => {
  return num < 10 ? `0${num}` : `${num}`;
};

/**
 * 相对时间格式化
 * @param {Date|string|number} date 时间
 * @returns {string}
 */
const formatRelativeTime = (date) => {
  if (!date) return '';
  
  let d;
  if (typeof date === 'string') {
    d = new Date(date.replace(/-/g, '/'));
  } else if (typeof date === 'number') {
    d = new Date(date);
  } else {
    d = date;
  }
  
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚';
  }
  
  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}分钟前`;
  }
  
  // 小于24小时
  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
  }
  
  // 小于7天
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`;
  }
  
  // 小于30天
  if (diff < 30 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (7 * 24 * 60 * 60 * 1000))}周前`;
  }
  
  // 小于1年
  if (diff < 365 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (30 * 24 * 60 * 60 * 1000))}个月前`;
  }
  
  // 大于1年
  return `${Math.floor(diff / (365 * 24 * 60 * 60 * 1000))}年前`;
};

/**
 * 格式化距离
 * @param {number} distance 距离（米）
 * @returns {string}
 */
const formatDistance = (distance) => {
  if (!distance && distance !== 0) return '';
  
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  }
  
  return `${(distance / 1000).toFixed(1)}km`;
};

/**
 * 防抖函数
 * @param {Function} fn 要执行的函数
 * @param {number} delay 延迟时间
 * @returns {Function}
 */
const debounce = (fn, delay = 300) => {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

/**
 * 节流函数
 * @param {Function} fn 要执行的函数
 * @param {number} interval 间隔时间
 * @returns {Function}
 */
const throttle = (fn, interval = 300) => {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
};

/**
 * 深拷贝
 * @param {Object} obj 要拷贝的对象
 * @returns {Object}
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (obj instanceof Object) {
    const copy = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key]);
    });
    return copy;
  }
  
  return obj;
};

/**
 * 检查手机号格式
 * @param {string} phone 手机号
 * @returns {boolean}
 */
const isValidPhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone);
};

/**
 * 检查身份证号格式
 * @param {string} idCard 身份证号
 * @returns {boolean}
 */
const isValidIdCard = (idCard) => {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard);
};

/**
 * 生成唯一ID
 * @returns {string}
 */
const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 获取图片完整URL
 * @param {string} path 图片路径
 * @returns {string}
 */
const getImageUrl = (path) => {
  if (!path) return '';
  
  // 已经是完整URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // 拼接基础URL
  const app = getApp();
  return `${app.globalData.baseUrl.replace('/api/v1', '')}${path}`;
};

/**
 * 压缩图片
 * @param {string} src 图片路径
 * @param {number} quality 压缩质量 0-100
 * @returns {Promise}
 */
const compressImage = (src, quality = 80) => {
  return new Promise((resolve, reject) => {
    wx.compressImage({
      src,
      quality,
      success: (res) => {
        resolve(res.tempFilePath);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

/**
 * 预览图片
 * @param {string} current 当前图片URL
 * @param {Array} urls 图片URL列表
 */
const previewImage = (current, urls) => {
  wx.previewImage({
    current,
    urls: urls || [current]
  });
};

/**
 * 拨打电话
 * @param {string} phoneNumber 电话号码
 */
const makePhoneCall = (phoneNumber) => {
  wx.makePhoneCall({
    phoneNumber,
    fail: () => {
      wx.showToast({
        title: '拨打电话失败',
        icon: 'none'
      });
    }
  });
};

/**
 * 复制到剪贴板
 * @param {string} data 要复制的内容
 */
const copyToClipboard = (data) => {
  wx.setClipboardData({
    data,
    success: () => {
      wx.showToast({
        title: '已复制',
        icon: 'success'
      });
    }
  });
};

/**
 * 显示加载中
 * @param {string} title 提示文字
 */
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title,
    mask: true
  });
};

/**
 * 隐藏加载中
 */
const hideLoading = () => {
  wx.hideLoading();
};

/**
 * 显示提示
 * @param {string} title 提示文字
 * @param {string} icon 图标类型
 */
const showToast = (title, icon = 'none') => {
  wx.showToast({
    title,
    icon,
    duration: 2000
  });
};

/**
 * 显示确认弹窗
 * @param {string} title 标题
 * @param {string} content 内容
 * @returns {Promise}
 */
const showConfirm = (title, content) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      success: (res) => {
        if (res.confirm) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      fail: reject
    });
  });
};

/**
 * 页面跳转
 * @param {string} url 页面路径
 * @param {string} type 跳转类型 navigate/redirect/switchTab/reLaunch
 */
const navigateTo = (url, type = 'navigate') => {
  const methods = {
    navigate: wx.navigateTo,
    redirect: wx.redirectTo,
    switchTab: wx.switchTab,
    reLaunch: wx.reLaunch
  };
  
  const method = methods[type] || wx.navigateTo;
  
  method({
    url,
    fail: () => {
      wx.showToast({
        title: '页面跳转失败',
        icon: 'none'
      });
    }
  });
};

/**
 * 计算两点之间的距离
 * @param {number} lat1 纬度1
 * @param {number} lng1 经度1
 * @param {number} lat2 纬度2
 * @param {number} lng2 经度2
 * @returns {number} 距离（米）
 */
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const rad = (d) => d * Math.PI / 180.0;
  
  const EARTH_RADIUS = 6378137; // 地球半径（米）
  
  const radLat1 = rad(lat1);
  const radLat2 = rad(lat2);
  const radLng1 = rad(lng1);
  const radLng2 = rad(lng2);
  
  const a = radLat1 - radLat2;
  const b = radLng1 - radLng2;
  
  let s = 2 * Math.asin(Math.sqrt(
    Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
  ));
  
  s = s * EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  
  return s;
};

module.exports = {
  formatTime,
  formatRelativeTime,
  formatDistance,
  padZero,
  debounce,
  throttle,
  deepClone,
  isValidPhone,
  isValidIdCard,
  generateId,
  getImageUrl,
  compressImage,
  previewImage,
  makePhoneCall,
  copyToClipboard,
  showLoading,
  hideLoading,
  showToast,
  showConfirm,
  navigateTo,
  calculateDistance
};
