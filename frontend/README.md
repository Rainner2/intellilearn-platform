# IntelliLearn 前端项目

IntelliLearn 是一个智能编程学习与评测平台，本项目是其前端部分的实现。前端采用了 React + TypeScript 技术栈，结合了 Hydro OJ 的布局设计和 Apple 的 UI 设计风格，打造了一个现代化、用户友好的在线编程学习平台。

## 社交登录配置

要启用社交账号登录功能，需要在相应平台注册应用并获取必要的客户端ID。以下是配置步骤：

### GitHub 登录

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写应用信息：
   - Application name: IntelliLearn (或您喜欢的名称)
   - Homepage URL: http://localhost:3000 (开发环境) 或您的生产环境URL
   - Authorization callback URL: http://localhost:3000/auth/callback?provider=github
4. 点击 "Register application"
5. 获取 Client ID
6. 将获取的 Client ID 添加到 `.env.development` 或 `.env.production` 文件中:
   ```
   VITE_GITHUB_CLIENT_ID=您的GitHub客户端ID
   ```

### Google 登录

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建一个新项目或使用现有项目
3. 导航到 "APIs & Services" > "Credentials"
4. 点击 "Create Credentials" > "OAuth client ID"
5. 配置OAuth同意屏幕
6. 创建OAuth客户端ID:
   - Application type: Web application
   - Name: IntelliLearn (或您喜欢的名称)
   - Authorized JavaScript origins: http://localhost:3000
   - Authorized redirect URIs: http://localhost:3000/auth/callback?provider=google
7. 点击 "Create"
8. 获取 Client ID
9. 将获取的 Client ID 添加到 `.env.development` 或 `.env.production` 文件中:
   ```
   VITE_GOOGLE_CLIENT_ID=您的Google客户端ID
   ```

### 微信登录

1. 访问 [微信开放平台](https://open.weixin.qq.com/)
2. 注册开发者账号并创建网站应用
3. 配置授权回调域名为您的应用域名
4. 获取 AppID
5. 将获取的 AppID 添加到 `.env.development` 或 `.env.production` 文件中:
   ```
   VITE_WECHAT_APP_ID=您的微信AppID
   ```

**注意**: 对于微信登录，需要确保您的应用有一个有效的域名，本地开发环境可能需要使用代理或模拟登录。

## 项目技术栈

- **React 18**: 用于构建用户界面的 JavaScript 库
- **TypeScript**: 添加静态类型检查，提高代码质量和开发效率
- **React Router**: 处理应用内路由和导航
- **Redux Toolkit**: 管理应用状态
- **Ant Design**: UI组件库
- **CSS Modules**: 组件级别的样式隔离
- **Vite**: 现代前端构建工具，提供更快的开发体验
- **Axios**: HTTP 请求库

## 项目结构

```
frontend/
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── components/      # 可复用组件
│   │   ├── auth/        # 认证相关组件
│   │   ├── layout/      # 布局相关组件
│   │   └── problem/     # 题目相关组件
│   ├── pages/           # 页面组件
│   │   ├── auth/        # 认证相关页面
│   │   ├── user/        # 用户相关页面
│   │   └── problem/     # 题目相关页面
│   ├── services/        # API 服务
│   ├── store/           # Redux 状态管理
│   │   └── slices/      # Redux 切片
│   ├── types/           # TypeScript 类型定义
│   ├── utils/           # 工具函数
│   ├── config/          # 全局配置
│   ├── App.tsx          # 应用入口组件
│   └── main.tsx         # 应用入口文件
├── .env                 # 基础环境变量
├── .env.development     # 开发环境变量
├── .env.production      # 生产环境变量
├── package.json         # 项目依赖
└── vite.config.ts       # Vite 配置
```

## 开发指南

### 安装依赖
```bash
cd frontend
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 环境配置

项目使用了不同的环境配置文件来管理不同环境下的变量：

### 环境文件说明

- `.env`：基础配置，所有环境共享
- `.env.development`：开发环境配置，仅在开发环境加载
- `.env.production`：生产环境配置，仅在生产环境加载

### 主要环境变量

| 变量名 | 说明 | 默认值 |
|-------|------|-------|
| VITE_API_URL | API服务地址 | http://localhost:9000/api |
| VITE_GITHUB_CLIENT_ID | GitHub OAuth客户端ID | 需要替换为实际值 |
| VITE_GOOGLE_CLIENT_ID | Google OAuth客户端ID | 需要替换为实际值 |
| VITE_WECHAT_APP_ID | 微信应用ID | 需要替换为实际值 |

## 常见问题

### 登录输入框样式问题

如果在粘贴内容时输入框变为奶白色，这可能是由浏览器的自动填充功能引起的。我们已经在CSS中添加了修复，确保输入框在任何情况下都保持原始样式。

### 社交登录不起作用

1. 确认您已正确配置了相应平台的客户端ID
2. 检查网络请求是否正常，可能存在CORS或网络连接问题
3. 确认回调URL与您在第三方平台注册的一致
4. 查看浏览器控制台是否有错误信息