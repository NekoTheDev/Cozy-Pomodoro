# 🔮 COZY FOCUS | 数字休憩所

<div align="center">

**🇨🇳 中文文档** | [🇺🇸 English](./README.md)

</div>

![License](https://img.shields.io/badge/license-BSD_3--Clause-blue.svg)
![React](https://img.shields.io/badge/react-v18.3.1-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/typescript-v5.0-3178C6.svg)
![Vite](https://img.shields.io/badge/vite-v5.0-646CFF.svg)
![State](https://img.shields.io/badge/state-Zustand-orange.svg)

> **"在深度工作中寻找宁静。"**
> 一个融合了赛博朋克美学与舒适氛围的高级生产力环境，专为专注而生。

---

## 📖 概览

**Cozy Focus** 是一个精心设计的单页应用 (SPA)，旨在提升生产力体验。它超越了简单的时间追踪工具，为用户创造了一个沉浸式的“精神避难所”。

基于 **React 18** 和 **TypeScript** 构建，它具有模拟的后端环境，通过 **Zustand** 进行复杂的状态管理，并使用 **Framer Motion** 实现流畅的硬件加速动画。

## ⚡ 核心功能

### 🕰️ 精密计时器 (Chronometer)
- **流体视觉效果**: 基于 SVG 的进度环，带有实时平滑插值动画。
- **智能模式**: 在专注 (琥珀色)、短休 (鼠尾草绿) 和长休 (靛蓝色) 之间智能切换。
- **自动流转**: 可配置的自动开始选项，实现无缝的会话转换。

### 📋 任务控制台 (Mission Control)
- **任务管理**: 创建、编辑并设定任务优先级 (低/中/高)。
- **工作量预估**: 分配 "番茄钟" 估算值，并追踪实际完成情况与预测的对比。
- **深度专注集成**: 将特定任务固定在计时器视图中，保持上下文连贯。

### 📊 神经分析 (Analytics)
- **数据可视化**: 交互式 Recharts 图表展示随时间变化的专注分布。
- **核心指标**: 追踪每日连胜 (Streak)、总专注时长和会话完成率。
- **CSV 导出**: 下载生产力数据以便进行外部分析。

### 🎨 氛围与个性化
- **视觉环境**: 在预设壁纸之间切换，或上传本地图片（存储在浏览器内存中）。
- **禅模式 (Zen Mode)**: 一键隐藏 UI 杂项，享受绝对的极简主义。
- **环境音效**: 切换舒缓的背景白噪音（模拟）。

### 🔐 模拟身份系统
- **Mock Auth**: 一个强大的伪后端服务，模拟 JWT 令牌、网络延迟和会话持久化。
- **个人资料管理**: 在本地更新用户信息、头像和凭据。

---

## 🛠️ 技术栈

| 领域 | 技术 | 用途 |
| :--- | :--- | :--- |
| **核心** | React 18, TypeScript | 组件架构与类型安全。 |
| **构建** | Vite | 极速 HMR 和打包。 |
| **状态** | Zustand | 全局状态管理 (认证, 计时器, 任务)。 |
| **样式** | Tailwind CSS | 带有自定义配置的实用优先样式。 |
| **动画** | Framer Motion | 布局过渡、微交互和物理效果。 |
| **路由** | React Router v6 | 带有受保护守卫的客户端路由。 |
| **数据** | LocalStorage API | 在刷新之间持久化状态 (模拟数据库)。 |

---

## 🚀 快速开始

### 前置要求
- Node.js (v16 或更高版本)
- npm 或 yarn

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/cozy-focus.git
   cd cozy-focus
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动服务器**
   ```bash
   npm run dev
   ```

4. **进入休憩所**
   在浏览器中打开 `http://localhost:5173`。

---

## 🔐 模拟凭据 (开发环境)

该应用程序使用复杂模拟服务层 (`src/services/fakeBackend.ts`) 来模拟网络请求。虽然您可以注册新帐户，但也可以使用预设的开发者配置文件：

- **邮箱**: `nekothedev@nekoterminal.com`
- **密码**: `password` (或任意字符串)

*注意：数据持久化在您的浏览器 LocalStorage 中。要清除数据，请转到 设置 > 危险区域 > 恢复出厂设置 (Factory Reset)。*

---

## 📂 架构结构

```text
src/
├── api/                # API 定义接口
├── components/         # 共享 UI 原子组件 (Buttons, Cards, Inputs)
│   └── ui/             # 赛博朋克特定 UI 套件
├── features/           # 复杂业务逻辑组件
│   ├── Timer.tsx       # 核心计时器逻辑 & SVG 渲染
│   ├── TaskBoard.tsx   # 任务管理系统
│   └── StatsBoard.tsx  # 数据分析可视化
├── hooks/              # 自定义 React hooks
├── layouts/            # 主应用程序包装器
├── pages/              # 路由视图 (Dashboard, Login, Settings)
├── services/           # 模拟后端 & 数据播种
├── store/              # Zustand 全局状态定义
└── types/              # TypeScript 接口定义
```

## 🎨 设计哲学

UI 遵循 **"暖石与霓虹 (Warm Stone & Neon)"** 配色方案。与刺眼的传统赛博朋克主题不同，Cozy Focus 使用：
- **背景**: 深暖灰色 (`#1c1917`) 而非纯黑。
- **强调色**: 
  - *琥珀色 (Amber)* (`#fbbf24`) 用于 专注/主要操作。
  - *青色 (Cyan)* (`#06b6d4`) 用于 科技/数据。
  - *玫瑰色 (Rose)* (`#fda4af`) 用于 警报。
- **玻璃拟态**: 大量使用 `backdrop-blur` 和半透明边框来创造深度感。

---

## 🔮 未来路线图

- [ ] **声景系统**: 集成 Howler.js 以提供真实的雨声/咖啡馆环境音。
- [ ] **PWA 支持**: 离线能力和移动端安装支持。
- [ ] **团队协作**: 用于协作会话的共享任务板。
- [ ] **快捷键**: 用于计时器控制的全局热键。

---

<div align="center">

**CRAFTED WITH INTENTION.**  
*System Status: Online*

</div>