/**
 * 图片上传工具
 */

const { upload } = require('./request');
const { showToast, compressImage } = require('./util');

/**
 * 选择并上传图片
 * @param {Object} options 配置项
 * @returns {Promise}
 */
const chooseAndUploadImage = (options = {}) => {
  const {
    count = 1,
    sizeType = ['compressed'],
    sourceType = ['album', 'camera'],
    maxSize = 10 * 1024 * 1024, // 10MB
    compress = true,
    quality = 80,
    uploadUrl = '/upload/image'
  } = options;
  
  return new Promise((resolve, reject) => {
    // 选择图片
    wx.chooseMedia({
      count,
      mediaType: ['image'],
      sizeType,
      sourceType,
      success: async (res) => {
        const tempFiles = res.tempFiles;
        const results = [];
        
        for (let i = 0; i < tempFiles.length; i++) {
          const file = tempFiles[i];
          
          // 检查文件大小
          if (file.size > maxSize) {
            showToast(`图片大小不能超过${Math.floor(maxSize / 1024 / 1024)}MB`);
            reject({ message: '图片大小超出限制' });
            return;
          }
          
          try {
            let filePath = file.tempFilePath;
            
            // 压缩图片
            if (compress) {
              try {
                filePath = await compressImage(filePath, quality);
              } catch (e) {
                console.log('图片压缩失败，使用原图', e);
              }
            }
            
            // 上传图片
            const uploadResult = await upload(filePath, { url: uploadUrl });
            
            if (uploadResult.success) {
              results.push({
                path: filePath,
                url: uploadResult.data.url,
                id: uploadResult.data.id
              });
            }
          } catch (err) {
            console.error('上传失败:', err);
            reject(err);
            return;
          }
        }
        
        resolve(results);
      },
      fail: (err) => {
        if (err.errMsg.includes('auth deny')) {
          showToast('请授权访问相册');
        } else if (!err.errMsg.includes('cancel')) {
          showToast('选择图片失败');
        }
        reject(err);
      }
    });
  });
};

/**
 * 仅选择图片（不上传）
 * @param {Object} options 配置项
 * @returns {Promise}
 */
const chooseImage = (options = {}) => {
  const {
    count = 1,
    sizeType = ['compressed'],
    sourceType = ['album', 'camera'],
    maxSize = 10 * 1024 * 1024
  } = options;
  
  return new Promise((resolve, reject) => {
    wx.chooseMedia({
      count,
      mediaType: ['image'],
      sizeType,
      sourceType,
      success: (res) => {
        const tempFiles = res.tempFiles;
        
        // 检查文件大小
        for (const file of tempFiles) {
          if (file.size > maxSize) {
            showToast(`图片大小不能超过${Math.floor(maxSize / 1024 / 1024)}MB`);
            reject({ message: '图片大小超出限制' });
            return;
          }
        }
        
        resolve(tempFiles.map(file => ({
          path: file.tempFilePath,
          size: file.size
        })));
      },
      fail: (err) => {
        if (err.errMsg.includes('auth deny')) {
          showToast('请授权访问相册');
        } else if (!err.errMsg.includes('cancel')) {
          showToast('选择图片失败');
        }
        reject(err);
      }
    });
  });
};

/**
 * 上传单张图片
 * @param {string} filePath 本地图片路径
 * @param {Object} options 配置项
 * @returns {Promise}
 */
const uploadSingleImage = (filePath, options = {}) => {
  const {
    compress = true,
    quality = 80,
    uploadUrl = '/upload/image'
  } = options;
  
  return new Promise(async (resolve, reject) => {
    try {
      let path = filePath;
      
      // 压缩图片
      if (compress) {
        try {
          path = await compressImage(filePath, quality);
        } catch (e) {
          console.log('图片压缩失败，使用原图', e);
        }
      }
      
      // 上传
      const result = await upload(path, { url: uploadUrl });
      
      if (result.success) {
        resolve({
          path,
          url: result.data.url,
          id: result.data.id
        });
      } else {
        reject(result);
      }
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 批量上传图片
 * @param {Array} filePaths 本地图片路径数组
 * @param {Object} options 配置项
 * @returns {Promise}
 */
const uploadMultipleImages = (filePaths, options = {}) => {
  const { compress = true, quality = 80, uploadUrl = '/upload/image' } = options;
  
  return new Promise(async (resolve, reject) => {
    const results = [];
    
    wx.showLoading({ title: '上传中...', mask: true });
    
    try {
      for (const filePath of filePaths) {
        const result = await uploadSingleImage(filePath, { compress, quality, uploadUrl });
        results.push(result);
      }
      
      wx.hideLoading();
      resolve(results);
    } catch (err) {
      wx.hideLoading();
      reject(err);
    }
  });
};

/**
 * 删除图片
 * @param {string} imageId 图片ID
 * @returns {Promise}
 */
const deleteImage = (imageId) => {
  const { del } = require('./request');
  return del(`/upload/image/${imageId}`);
};

/**
 * 获取图片信息
 * @param {string} src 图片路径
 * @returns {Promise}
 */
const getImageInfo = (src) => {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src,
      success: resolve,
      fail: reject
    });
  });
};

/**
 * 保存图片到相册
 * @param {string} filePath 图片路径
 * @returns {Promise}
 */
const saveImageToPhotosAlbum = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        showToast('已保存到相册', 'success');
        resolve(true);
      },
      fail: (err) => {
        if (err.errMsg.includes('auth deny')) {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存图片到相册',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting();
              }
            }
          });
        } else {
          showToast('保存失败');
        }
        reject(err);
      }
    });
  });
};

module.exports = {
  chooseAndUploadImage,
  chooseImage,
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
  getImageInfo,
  saveImageToPhotosAlbum
};
