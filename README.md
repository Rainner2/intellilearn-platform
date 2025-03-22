# IntelliLearn - 智能在线编程学习与评测平台

IntelliLearn是一个面向高校和公众的免费在线编程学习与评测平台，参考Hydro的功能架构，但更加简化和用户友好。平台支持用户创建独立域（Domain），实现封闭且安全的学习环境。

## 项目概述

IntelliLearn旨在提供一个现代化、用户友好的在线编程学习与评测平台，具有以下特点：

- **域隔离**：支持创建独立的学习环境（域），适合不同课程、班级或组织
- **简洁界面**：采用苹果风格UI设计，简约清晰的用户界面
- **智能辅助**：集成DeepSeek模型，提供代码分析与学习建议
- **代码诚信**：内置代码抄袭检测功能，保障学术诚信
- **无障碍设计**：优化的颜色对比度，支持亮色和暗色模式，确保良好的可读性

## 用户角色与权限

- **游客**：浏览公开内容，注册/登录系统
- **注册用户**：参与编程训练，提交代码，参加比赛，参与讨论
- **域管理员**：管理域内资源，设置访问权限，创建题目和比赛
- **系统管理员**：管理所有域，系统配置和维护，用户管理

## 核心功能模块

### 1. 用户管理系统
- 完整的用户认证流程（注册、登录、登出、密码重置）
- 高级安全特性：双因素认证、会话管理、强密码策略
- 社交媒体登录（GitHub、Google和微信）
- 用户活动日志记录与查询
- 个人资料管理

### 2. 域（Domain）管理
- 域创建与配置
- 域成员管理
- 域资源管理
- 域间资源共享
- 域统计信息

### 3. 题库系统
- 题目的创建、编辑、删除
- 题目分类和标签
- 题目难度评级
- 题目搜索和分页
- 批量操作与版本控制

### 4. 评测系统
- 多语言支持（Java、C++、Python）
- 安全沙箱环境
- 代码抄袭检测
- 分布式评测节点
- 资源限制与监控

### 5. 比赛系统
- 多种比赛模式（ACM/OI/IOI）
- 实时排行榜
- 比赛计时与管理
- 赛后分析

### 6. 论坛系统
- 讨论创建与管理
- 评论功能
- 点赞与置顶
- 讨论搜索与筛选

### 7. AI辅助功能
- 集成DeepSeek模型
- 代码分析与建议
- 学习路径推荐

## 技术栈

### 前端
- React 18 + TypeScript
- Redux Toolkit
- Ant Design
- Monaco Editor
- Vite

### 后端
- Node.js + Express
- TypeScript
- MongoDB
- Redis
- JWT认证

### 部署
- Docker + Docker Compose
- GitHub Actions
- Prometheus + Grafana监控

## 社交登录配置

要启用社交账号登录功能，需要在相应平台注册应用并获取必要的客户端ID。以下是配置步骤：

### GitHub 登录

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写应用信息：
   - Application name: IntelliLearn (或您喜欢的名称)
   - Homepage URL: 您的应用URL
   - Authorization callback URL: 您的回调URL
4. 点击 "Register application"
5. 获取 Client ID
6. 将获取的 Client ID 添加到 `.env.development` 或 `.env.production` 文件中

### Google 登录

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建一个新项目或使用现有项目
3. 导航到 "APIs & Services" > "Credentials"
4. 点击 "Create Credentials" > "OAuth client ID"
5. 配置OAuth同意屏幕
6. 创建OAuth客户端ID
7. 获取 Client ID
8. 将获取的 Client ID 添加到 `.env` 文件中

### 微信登录

1. 访问 [微信开放平台](https://open.weixin.qq.com/)
2. 注册开发者账号并创建网站应用
3. 配置授权回调域名
4. 获取 AppID
5. 将获取的 AppID 添加到 `.env` 文件中

## 快速启动

```bash
# 克隆仓库
git clone https://github.com/Rainner2/intellilearn-platform.git
cd intellilearn-platform

# 安装依赖
cd frontend
npm install

cd ../backend
npm install

# 配置环境变量
cp .env.example .env
# 编辑.env文件，添加必要的配置项

# 启动开发服务器
npm run dev
```

## 贡献指南

欢迎贡献代码、提出问题或建议！请遵循以下步骤：

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件