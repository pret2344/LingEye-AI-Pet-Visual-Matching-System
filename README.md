# 灵眸AI宠物视觉匹配系统
基于微信小程序的宠物互助公益平台，通过AI视觉特征匹配技术实现走失宠物与流浪动物的智能撮合，支持走失发布、发现上报、领养对接三大核心场景。

## 一、运行环境
### 1. 操作系统
- 开发环境：Windows 11 / macOS 12+
- 部署环境：CentOS 7 / Ubuntu 20.04（Linux服务器）

### 2. 核心依赖与版本
| 技术模块 | 依赖包 | 版本要求 |
|----------|--------|----------|
| 前端小程序 | uni-app + Vue3 | Vue 3.2+，HBuilderX 3.8+ |
| 后端服务 | Node.js + Express | Node.js 18.0+，Express 4.18+ |
| 数据库 | MySQL | 8.0 及以上 |
| AI能力 | 百度AI开放平台 SDK | 动物识别API v2 |
| 地图服务 | 腾讯地图小程序SDK | 1.2+ |
| 进程管理 | PM2 | 5.3+（部署环境） |

### 3. 环境前置
- 微信开发者工具
- HBuilderX 编辑器
- MySQL 数据库服务
- 腾讯云COS对象存储（可选，本地开发可使用本地存储）

## 二、安装与启动步骤
### 1. 后端服务启动
1. 克隆项目仓库到本地
```bash
git clone https://github.com/pret2344/LingEye-AI-Pet-Visual-Matching-System.git
cd server
