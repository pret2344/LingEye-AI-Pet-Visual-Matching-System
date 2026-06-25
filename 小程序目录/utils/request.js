/**
 * 网络请求封装工具
 * 支持JWT鉴权、RESTful JSON格式
 */

const app = getApp();

/**
 * 基础请求配置
 */
const config = {
  baseUrl: 'https://api.lingmou-pet.com/api/v1',
  timeout: 30000,
  header: {
    'Content-Type': 'application/json'
  }
};

/**
 * 请求拦截器
 * @param {Object} options 请求配置
 */
const requestInterceptor = (options) => {
  // 添加token
  const token = app.globalData.token || wx.getStorageSync('token');
  if (token) {
    options.header = {
      ...options.header,
      'Authorization': `Bearer ${token}`
    };
  }
  
  // 添加请求ID（用于追踪）
  options.header['X-Request-Id'] = generateRequestId();
  
  return options;
};

/**
 * 响应拦截器
 * @param {Object} response 响应数据
 */
const responseInterceptor = (response) => {
  const { statusCode, data } = response;
  
  // HTTP状态码处理
  switch (statusCode) {
    case 200:
    case 201:
      // 成功
      return {
        success: true,
        data: data.data || data,
        message: data.message || '请求成功',
        code: data.code || 0
      };
    
    case 400:
      // 请求参数错误
      return {
        success: false,
        data: null,
        message: data.message || '请求参数错误',
        code: 400
      };
    
    case 401:
      // 未授权，token过期或无效
      app.logout();
      wx.showToast({
        title: '登录已过期，请重新登录',
        icon: 'none'
      });
      // 跳转到登录页
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/profile/profile'
        });
      }, 1500);
      return {
        success: false,
        data: null,
        message: '登录已过期',
        code: 401
      };
    
    case 403:
      // 禁止访问
      return {
        success: false,
        data: null,
        message: data.message || '没有权限访问',
        code: 403
      };
    
    case 404:
      // 资源不存在
      return {
        success: false,
        data: null,
        message: data.message || '请求的资源不存在',
        code: 404
      };
    
    case 429:
      // 请求过于频繁
      return {
        success: false,
        data: null,
        message: data.message || '请求过于频繁，请稍后再试',
        code: 429
      };
    
    case 500:
    case 502:
    case 503:
      // 服务器错误
      return {
        success: false,
        data: null,
        message: '服务器开小差了，请稍后再试',
        code: statusCode
      };
    
    default:
      return {
        success: false,
        data: null,
        message: data.message || '网络请求失败',
        code: statusCode
      };
  }
};

/**
 * 生成请求ID
 */
const generateRequestId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 统一请求方法
 * @param {Object} options 请求配置
 * @returns {Promise}
 */
const request = (options) => {
  // 合并配置
  options = {
    ...config,
    ...options,
    header: {
      ...config.header,
      ...options.header
    },
    url: options.url.startsWith('http') ? options.url : `${config.baseUrl}${options.url}`
  };
  
  // 请求拦截
  options = requestInterceptor(options);
  
  // 显示loading
  if (options.loading !== false) {
    wx.showLoading({
      title: options.loadingText || '加载中...',
      mask: true
    });
  }
  
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      timeout: options.timeout || config.timeout,
      success: (res) => {
        // 响应拦截
        const result = responseInterceptor(res);
        
        if (result.success) {
          resolve(result);
        } else {
          // 显示错误提示
          if (options.showError !== false) {
            wx.showToast({
              title: result.message,
              icon: 'none',
              duration: 2000
            });
          }
          reject(result);
        }
      },
      fail: (err) => {
        const result = {
          success: false,
          data: null,
          message: '网络连接失败，请检查网络设置',
          code: -1
        };
        
        // 显示错误提示
        if (options.showError !== false) {
          wx.showToast({
            title: result.message,
            icon: 'none',
            duration: 2000
          });
        }
        
        reject(result);
      },
      complete: () => {
        // 隐藏loading
        if (options.loading !== false) {
          wx.hideLoading();
        }
      }
    });
  });
};

/**
 * GET请求
 * @param {string} url 请求地址
 * @param {Object} data 请求参数
 * @param {Object} options 其他配置
 */
const get = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  });
};

/**
 * POST请求
 * @param {string} url 请求地址
 * @param {Object} data 请求体
 * @param {Object} options 其他配置
 */
const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  });
};

/**
 * PUT请求
 * @param {string} url 请求地址
 * @param {Object} data 请求体
 * @param {Object} options 其他配置
 */
const put = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  });
};

/**
 * DELETE请求
 * @param {string} url 请求地址
 * @param {Object} data 请求参数
 * @param {Object} options 其他配置
 */
const del = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  });
};

/**
 * 文件上传
 * @param {string} filePath 本地文件路径
 * @param {Object} options 配置项
 */
const upload = (filePath, options = {}) => {
  const token = app.globalData.token || wx.getStorageSync('token');
  
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: options.url || `${config.baseUrl}/upload`,
      filePath,
      name: options.name || 'file',
      formData: options.formData || {},
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.code === 0 || data.success) {
          resolve({
            success: true,
            data: data.data || data,
            message: '上传成功'
          });
        } else {
          wx.showToast({
            title: data.message || '上传失败',
            icon: 'none'
          });
          reject({
            success: false,
            message: data.message || '上传失败'
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '上传失败，请重试',
          icon: 'none'
        });
        reject({
          success: false,
          message: '上传失败'
        });
      }
    });
  });
};

module.exports = {
  request,
  get,
  post,
  put,
  del,
  upload,
  config
};
