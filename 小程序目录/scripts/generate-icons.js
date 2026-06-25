// 创建tabBar图标脚本
const fs = require('fs');
const path = require('path');

// 简单的PNG图标数据（81x81像素的纯色方块）
// 这是一个最小的有效PNG文件（1x1像素），我们需要81x81
const createPNG = (color) => {
  // 简单的81x81 PNG生成
  const width = 81;
  const height = 81;
  
  // PNG签名
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  
  const ihdrChunk = createChunk('IHDR', ihdrData);
  
  // IDAT chunk - 简单的纯色图像
  const zlib = require('zlib');
  const rawData = Buffer.alloc((width * 3 + 1) * height);
  
  for (let y = 0; y < height; y++) {
    rawData[y * (width * 3 + 1)] = 0; // filter byte
    for (let x = 0; x < width; x++) {
      const idx = y * (width * 3 + 1) + 1 + x * 3;
      rawData[idx] = color.r;
      rawData[idx + 1] = color.g;
      rawData[idx + 2] = color.b;
    }
  }
  
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);
  
  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
};

const createChunk = (type, data) => {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type);
  const crcData = Buffer.concat([typeBuffer, data]);
  
  const crc = crc32(crcData);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0, 0);
  
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
};

const crc32 = (buf) => {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return crc ^ -1;
};

// CRC32表
const crcTable = [];
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c;
}

// 图标配置
const icons = [
  { name: 'home.png', color: { r: 153, g: 153, b: 153 } },
  { name: 'home-active.png', color: { r: 255, g: 140, b: 56 } },
  { name: 'ai.png', color: { r: 153, g: 153, b: 153 } },
  { name: 'ai-active.png', color: { r: 255, g: 140, b: 56 } },
  { name: 'map.png', color: { r: 153, g: 153, b: 153 } },
  { name: 'map-active.png', color: { r: 255, g: 140, b: 56 } },
  { name: 'profile.png', color: { r: 153, g: 153, b: 153 } },
  { name: 'profile-active.png', color: { r: 255, g: 140, b: 56 } }
];

// 输出目录
const outputDir = './assets/icons';

// 确保目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 创建图标
icons.forEach(icon => {
  const png = createPNG(icon.color);
  fs.writeFileSync(path.join(outputDir, icon.name), png);
  console.log(`Created: ${icon.name}`);
});

console.log('All icons created successfully!');
