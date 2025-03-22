# IntelliLearn 后端项目

IntelliLearn 后端采用 Node.js + Express + TypeScript 技术栈构建，提供了完整的 RESTful API 服务，支持前端应用的所有功能模块。

## 项目特点

- **模块化架构**：采用清晰的模块化设计，便于维护和扩展
- **TypeScript**：完整的类型定义，提高代码质量和开发效率
- **安全性**：实现了完善的认证、授权和数据验证机制
- **性能优化**：使用缓存、索引和异步处理提高性能
- **可测试性**：完整的单元测试和集成测试覆盖

## 技术栈

- **Node.js**: JavaScript 运行时环境
- **Express**: Web 应用框架
- **TypeScript**: 静态类型检查
- **MongoDB**: 文档数据库
- **Redis**: 缓存和会话存储
- **JWT**: 用户认证和授权
- **Passport**: 多种认证策略支持
- **Jest**: 测试框架
- **Swagger**: API 文档生成

## 项目结构

```
backend/
├── dist/                # 编译输出目录
├── src/                 # 源代码
│   ├── config/          # 配置文件
│   ├── controllers/     # 控制器
│   ├── middlewares/     # 中间件
│   ├── models/          # 数据模型
│   ├── routes/          # 路由定义
│   ├── services/        # 业务逻辑服务
│   ├── types/           # TypeScript 类型定义
│   ├── utils/           # 工具函数
│   ├── validators/      # 数据验证规则
│   ├── app.ts           # 应用程序入口
│   └── server.ts        # 服务器启动
├── tests/               # 测试文件
│   ├── unit/            # 单元测试
│   ├── integration/     # 集成测试
│   └── performance/     # 性能测试
├── docs/                # API 文档和说明
├── .env                 # 环境变量
├── .env.development     # 开发环境变量
├── .env.production      # 生产环境变量
├── package.json         # 项目依赖
└── tsconfig.json        # TypeScript 配置
```

## API 模块

### 用户认证与授权 API

- 注册/登录/登出
- 密码重置/更新
- 社交媒体登录（GitHub、Google、微信）
- 双因素认证
- 会话管理
- 权限控制

### 问题管理 API

- 题目 CRUD 操作
- 题目分类和标签
- 题目批量操作
- 题目版本管理
- 题目搜索和过滤

### 提交与评测 API

- 代码提交
- 评测结果处理
- 评测状态查询
- 提交历史

### 比赛管理 API

- 比赛 CRUD 操作
- 比赛参与者管理
- 比赛题目管理
- 比赛排行榜

### 域管理 API

- 域 CRUD 操作
- 域成员管理
- 域资源管理
- 权限控制

### 讨论系统 API

- 讨论和评论 CRUD 操作
- 点赞功能
- 讨论搜索和过滤

## 环境配置

项目使用 `.env` 文件管理环境变量，支持不同环境下的配置：

- `.env`: 基础配置，被所有环境继承
- `.env.development`: 开发环境特定配置
- `.env.production`: 生产环境特定配置

### 关键环境变量

```
# 基础配置
PORT=9000
HOST=localhost
NODE_ENV=development

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/intellilearn
REDIS_URI=redis://localhost:6379

# JWT配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# 社交登录配置
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret

# 评测系统配置
JUDGER_HOST=localhost
JUDGER_PORT=8080
JUDGER_TOKEN=your_judger_token

# 安全配置
CORS_ORIGINS=http://localhost:3000
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## 开发指南

### 安装依赖

```bash
cd backend
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 运行生产版本

```bash
npm run start
```

### 运行测试

```bash
# 运行所有测试
npm test

# 运行单元测试
npm run test:unit

# 运行集成测试
npm run test:integration

# 运行性能测试
npm run test:perf
```

## 评测系统

IntelliLearn 的评测系统设计为分布式架构，主要组件包括：

1. **评测管理器**：分发评测任务，管理评测队列
2. **评测执行器**：在沙箱环境中执行代码并产生结果
3. **沙箱环境**：隔离且安全的代码运行环境

### 评测流程

1. 用户提交代码
2. API 接收提交并创建评测任务
3. 评测任务进入队列
4. 评测管理器分发任务到空闲的评测执行器
5. 评测执行器在沙箱中运行代码
6. 收集评测结果（状态、时间、内存等）
7. 返回结果到用户

### 支持的评测类型

- 标准评测：与预设输出比较
- 特殊评测：使用自定义评测程序
- 交互式评测：代码与评测程序交互
- 提交答案评测：仅提交答案文件

### 安全措施

- 资源限制（CPU时间、内存、文件大小）
- 系统调用限制
- 网络访问限制
- 文件系统隔离