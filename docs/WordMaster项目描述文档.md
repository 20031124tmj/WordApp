# WordMaster - 智能英语词汇学习系统

## 一、项目描述

WordMaster 是一款基于 **SM-2 间隔重复算法** 的智能英语词汇学习应用，旨在帮助用户高效记忆英语单词。系统通过科学的间隔复习机制，根据用户对每个单词的掌握程度动态调整复习时间，实现"遗忘曲线"与"记忆强化"的精准匹配。

### 核心特性

- **智能复习调度**：基于 SM-2 算法，自动计算最佳复习时间，避免过度复习和遗忘
- **多词库支持**：内置 CET-4、CET-6、雅思、考研四大官方词库，共 4346 个单词
- **真实语境学习**：从 Wiktionary 爬取 3469 个单词的真实英文例句，提供语境化学习
- **学习进度追踪**：仪表盘实时展示待复习/待学习数量、连续打卡天数、每日目标进度
- **成就系统**：12 个成就徽章，涵盖词汇量里程碑和连续打卡奖励
- **个性化设置**：用户可自定义每日学习目标（1-200 词）
- **词库订阅管理**：支持订阅/取消订阅词库，灵活选择学习内容

---

## 二、技术栈

### 后端技术

| 技术 | 版本 | 用途 |
|------|------|------|
| **Node.js** | - | 运行时环境 |
| **Express** | 5.2.1 | Web 框架 |
| **TypeScript** | 6.0.3 | 类型安全的开发语言 |
| **Knex.js** | 3.2.10 | SQL 查询构建器 / ORM |
| **better-sqlite3** | 12.9.0 | SQLite 数据库驱动（开发环境） |
| **PostgreSQL** | - | 生产环境数据库 |
| **JWT (jsonwebtoken)** | 9.0.3 | 用户认证（双令牌机制） |
| **bcryptjs** | 3.0.3 | 密码哈希加密 |
| **Zod** | 4.4.2 | 请求数据验证 |
| **express-rate-limit** | 8.4.1 | API 请求限流 |
| **helmet** | 8.1.0 | HTTP 安全头 |
| **cors** | 2.8.6 | 跨域资源共享 |
| **uuid** | 14.0.0 | 唯一标识符生成 |

### 前端技术

| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | 18.2.0 | UI 框架 |
| **TypeScript** | 4.9.5 | 类型安全 |
| **React Router** | 6.20.0 | 单页应用路由 |
| **Axios** | 1.6.0 | HTTP 客户端 |
| **Recharts** | 2.10.0 | 数据可视化图表 |
| **Create React App** | 5.0.1 | 项目构建工具链 |

### 基础设施

| 技术 | 用途 |
|------|------|
| **Docker / Docker Compose** | 容器化部署 |
| **Nginx** | 反向代理与静态资源服务 |
| **Redis** | 生产环境缓存（可选） |

---

## 三、系统架构

### 3.1 整体架构

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│    Nginx    │────▶│   Express   │
│  (React SPA)│◀────│  (Reverse   │◀────│   (API +    │
│             │     │   Proxy)    │     │   Static)   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                    ┌──────────┴──────────┐
                                    │                      │
                               ┌────▼────┐          ┌─────▼─────┐
                               │ SQLite  │          │ PostgreSQL │
                               │  (Dev)  │          │  (Prod)   │
                               └─────────┘          └───────────┘
```

### 3.2 后端模块架构

系统采用 **MVC 分层架构**，共 8 个业务模块：

```
server/src/
├── app.ts                    # Express 应用工厂
├── index.ts                  # 服务启动入口
├── setup.ts                  # 数据库初始化脚本
├── modules/
│   ├── auth/                 # 认证模块：注册、登录、令牌刷新
│   ├── learning/             # 学习模块：SM-2 算法、答题、进度
│   ├── vocabulary/           # 词库模块：词库CRUD、订阅管理
│   ├── user/                 # 用户模块：资料、设置、密码
│   ├── stats/                # 统计模块：概览、趋势、词库统计
│   ├── achievement/          # 成就模块：成就解锁、打卡
│   ├── social/               # 社交模块：分享、推荐
│   └── media/                # 媒体模块：发音、听力/拼写测验
├── middleware/
│   ├── auth.ts               # JWT 认证中间件
│   ├── errorHandler.ts       # 全局错误处理
│   ├── rateLimiter.ts        # 请求限流（100/min, auth: 10/min）
│   └── validate.ts           # Zod 数据验证中间件
├── database/
│   ├── connection.ts         # Knex 数据库连接
│   ├── migrations/           # 11 个数据库迁移文件
│   └── seeds/                # 种子数据文件
├── scripts/                  # 数据爬取与生成脚本
└── utils/
    └── response.ts           # 统一响应格式
```

### 3.3 前端页面架构

```
client/src/
├── App.tsx                   # 路由配置（10 个路由）
├── pages/
│   ├── Dashboard.tsx         # 主页仪表盘（统计+目标+操作）
│   ├── Learn.tsx             # 学习新单词（翻转卡片+评分）
│   ├── Review.tsx            # 复习单词
│   ├── Vocabulary.tsx        # 词库浏览/订阅/取消订阅
│   ├── Login.tsx             # 登录
│   ├── Register.tsx          # 注册
│   ├── Stats.tsx             # 学习统计
│   ├── Achievements.tsx      # 成就系统
│   └── Settings.tsx          # 设置
├── components/
│   ├── FlashCard.tsx         # 翻转卡片（正面:单词+音标, 背面:释义+例句）
│   ├── RatingButtons.tsx     # 评分按钮（不认识/模糊/记得/很熟）
│   ├── ProgressBar.tsx       # 进度条
│   └── WordBookCard.tsx      # 词库卡片
├── contexts/
│   └── AuthContext.tsx        # 认证上下文（登录/登出/Token管理）
├── services/
│   └── api.ts                # Axios 实例（自动Token+401刷新）
└── types.ts                  # TypeScript 类型定义
```

### 3.4 数据库设计

系统共 **11 张表**，核心关系如下：

```
users ──1:N── user_word_progress ──N:1── words
  │                │                           │
  │                └──N:1── word_books ──1:N── word_book_items
  │
  ├──1:N── learning_sessions ──1:N── user_answers
  ├──1:N── check_ins
  ├──1:N── user_achievements ──N:1── achievements
  └──1:N── social_shares
```

**核心表说明**：

| 表名 | 用途 | 关键字段 |
|------|------|---------|
| `users` | 用户账户 | email(唯一), password_hash, daily_goal(默认20) |
| `words` | 单词库 | word, phonetic, definitions(JSON), audio_url |
| `word_books` | 词库 | name, is_official, word_count |
| `user_word_progress` | 学习进度 | ease_factor(默认2.5), interval, repetitions, next_review, status |
| `learning_sessions` | 学习会话 | type(learn/review), words_correct, words_wrong |
| `check_ins` | 打卡记录 | check_in_date, words_learned, words_reviewed, streak_days |

---

## 四、主要工作

### 4.1 SM-2 间隔重复算法实现

实现了完整的 **SuperMemo SM-2 算法**，核心逻辑包括：

- **难度因子（Ease Factor）**：初始值 2.5，根据答题质量动态调整（范围 1.3 ~ 无上限）
- **复习间隔计算**：
  - 首次正确 → 1 天后复习
  - 第二次正确 → 6 天后复习
  - 后续 → `interval × ease_factor` 天后复习
  - 回答错误 → 重置为 1 天后复习
- **状态流转**：`new → learning → review → mastered`
- **掌握判定**：重复次数 ≥ 5 且难度因子 ≥ 2.0 时标记为已掌握

### 4.2 词汇数据工程

#### 4.2.1 多源数据整合

构建了完整的数据管线，从多个来源整合词汇数据：

| 数据源 | 内容 | 数量 |
|--------|------|------|
| `dict_compact.txt` | 精简词典（音标+词性+释义） | 2,313 词条 |
| `basicMeanings` 字典 | 基础词义映射（词性+释义） | 3,700+ 词条 |
| 后缀规则引擎 | 36 条后缀→词性推断规则 | 覆盖常见词缀 |
| `words_cet4.txt` | CET-4 原始词表 | 2,100 词 |
| `words_cet6.txt` | CET-6 原始词表 | 2,087 词 |

#### 4.2.2 例句爬取系统

从 **Free Dictionary API**（基于 Wiktionary，CC BY-SA 3.0）爬取真实英文例句：

- 爬取脚本支持**断点续传**（每 100 词自动保存缓存）
- 请求间隔 300ms，失败自动重试 2 次
- 例句按词性匹配，优先选择与当前词性一致的例句
- 每个单词最多取 2 条例句
- **最终覆盖率**：3469/4427 = 78.4%

#### 4.2.3 数据质量保障

- 多词性定义正确解析（如 `access` 同时有 n. 和 v.）
- 单词去重机制（跨词库共享单词记录）
- 缺失词自动检测与补充
- 后缀规则推断词性（如 `-tion` → n.，`-ize` → v.）

### 4.3 用户认证系统

实现了**双令牌（Access + Refresh）认证机制**：

- **Access Token**：15 分钟有效期，用于 API 请求认证
- **Refresh Token**：7 天有效期，用于无感刷新 Access Token
- **密码安全**：bcryptjs 哈希，SALT_ROUNDS=12
- **前端自动刷新**：Axios 响应拦截器检测 401，自动尝试 Refresh Token
- **请求限流**：认证接口 10 次/分钟，通用接口 100 次/分钟

### 4.4 学习流程设计

完整的学习闭环：

```
浏览词库 → 订阅词库 → 开始学习 → 翻转卡片 → 评分 → SM-2计算 → 更新进度
    ↑                                                        │
    │                    待复习单词出现 ←─────────────────────┘
    │                        │
    └── 仪表盘展示统计 ←─────┘
```

- **学习模式**：展示新单词，默认显示英文面，翻转查看中文释义
- **复习模式**：展示到期需复习的单词
- **评分机制**：4 级评分（不认识/模糊/记得/很熟），映射为 SM-2 quality 值
- **实时进度更新**：每次答题后立即更新打卡记录和进度条

### 4.5 前端交互优化

- **翻转卡片动画**：CSS 3D transform 实现流畅翻转效果
- **页面焦点刷新**：Dashboard 监听 `window.focus` 事件，从学习页返回自动刷新数据
- **时区修复**：使用本地时间而非 UTC 时间计算日期，解决中国时区凌晨日期偏移问题
- **订阅状态管理**：实时更新订阅/取消订阅状态，带二次确认机制
- **今日目标设置**：模态框交互，支持快捷选择和自定义输入

---

## 五、API 接口设计

系统共提供 **30 个 API 端点**，按模块分布如下：

| 模块 | 端点数 | 认证要求 | 说明 |
|------|--------|---------|------|
| Auth | 4 | 部分需要 | 注册、登录、令牌刷新、登出 |
| Learning | 7 | 全部需要 | 仪表盘、获取单词、会话管理、答题 |
| Vocabulary | 9 | 部分需要 | 词库CRUD、单词查询、订阅管理 |
| Stats | 4 | 全部需要 | 概览、每日统计、词库统计、趋势 |
| Achievement | 4 | 全部需要 | 成就列表、我的成就、打卡 |
| Social | 3 | 部分需要 | 分享、推荐 |
| Media | 3 | 全部需要 | 发音、听力测验、拼写测验 |
| User | 5 | 全部需要 | 资料、设置、密码、已订阅词库 |

**统一响应格式**：
```json
// 成功
{ "data": { ... } }

// 错误
{ "error": { "code": "ERROR_CODE", "message": "描述信息" } }
```

---

## 六、项目成果

### 6.1 词汇数据成果

| 词库 | 单词数量 | 有音标 | 有真实例句 |
|------|---------|--------|-----------|
| CET-4 核心词汇 | 2,100 | 2,100 (100%) | 1,680+ (80%) |
| CET-6 核心词汇 | 2,087 | 1,500+ (72%) | 1,400+ (67%) |
| 雅思核心词汇 | 704 | 300+ (43%) | 500+ (71%) |
| 考研英语词汇 | 666 | 280+ (42%) | 470+ (71%) |
| **合计（去重后）** | **4,346** | - | **3,469 (78.4%)** |

### 6.2 功能完成度

| 功能模块 | 状态 | 说明 |
|---------|------|------|
| 用户注册/登录 | ✅ 完成 | 双令牌认证，bcrypt 加密 |
| 词库浏览/搜索 | ✅ 完成 | 支持关键词搜索和分页 |
| 词库订阅/取消 | ✅ 完成 | 带二次确认的取消订阅 |
| 单词学习 | ✅ 完成 | 翻转卡片 + SM-2 评分 |
| 单词复习 | ✅ 完成 | 自动调度到期复习 |
| 仪表盘 | ✅ 完成 | 统计卡片 + 进度条 + 目标设置 |
| 每日目标 | ✅ 完成 | 可自定义 1-200 词/天 |
| 学习统计 | ✅ 完成 | 概览、每日、趋势图表 |
| 成就系统 | ✅ 完成 | 12 个成就，自动解锁 |
| 打卡系统 | ✅ 完成 | 连续天数计算，自动打卡 |
| 单词发音 | ✅ 完成 | 有道词典 API 音频源 |
| 社交分享 | ✅ 完成 | 分享学习成果 |
| 听力/拼写测验 | ✅ 完成 | 媒体模块支持 |
| 个人设置 | ✅ 完成 | 昵称、头像、每日目标、时区 |

### 6.3 代码规模

| 类别 | 文件数 | 说明 |
|------|--------|------|
| 后端源码 | 30+ | 8 个模块 × (routes + controller + service) + 中间件 + 工具 |
| 前端源码 | 15+ | 9 个页面 + 4 个组件 + 上下文 + 服务 |
| 数据库迁移 | 11 | 11 张表的 Schema 定义 |
| 种子数据 | 7 | 成就 + 4 个词库 + 附加词库 |
| 数据脚本 | 10+ | 爬取、生成、验证脚本 |
| 配置文件 | 8 | TypeScript、Docker、Nginx、Knex 等 |

### 6.4 关键技术指标

| 指标 | 数值 |
|------|------|
| API 端点总数 | 30 |
| 数据库表数量 | 11 |
| 词汇总量（去重） | 4,346 |
| 真实例句覆盖 | 3,469 (78.4%) |
| 词典覆盖 | 2,313 + 3,700 basicMeanings |
| 后缀推断规则 | 36 条 |
| 成就数量 | 12 |
| SM-2 初始难度因子 | 2.5 |
| Access Token 有效期 | 15 分钟 |
| Refresh Token 有效期 | 7 天 |

---

## 七、部署方式

### 开发环境

```bash
# 后端
cd server
npm install
npx ts-node src/setup.ts    # 初始化数据库
npx ts-node src/index.ts     # 启动服务 (端口 3001)

# 前端
cd client
npm install
npm start                    # 启动开发服务器 (端口 3000, 代理到 3001)
```

### 生产环境（Docker）

```bash
docker compose up -d         # 启动 Nginx + API + PostgreSQL + Redis
```

---

## 八、项目目录结构

```
Word/
├── client/                          # 前端 React 应用
│   ├── public/index.html
│   ├── src/
│   │   ├── App.tsx                  # 路由配置
│   │   ├── index.tsx                # 入口
│   │   ├── types.ts                 # 类型定义
│   │   ├── components/              # 可复用组件
│   │   ├── contexts/                # React Context
│   │   ├── pages/                   # 页面组件
│   │   └── services/                # API 服务
│   └── package.json
├── server/                          # 后端 Express 应用
│   ├── src/
│   │   ├── app.ts                   # Express 应用工厂
│   │   ├── index.ts                 # 启动入口
│   │   ├── setup.ts                 # 数据库初始化
│   │   ├── database/
│   │   │   ├── connection.ts        # 数据库连接
│   │   │   ├── migrations/          # 数据库迁移 (001-011)
│   │   │   └── seeds/               # 种子数据
│   │   ├── middleware/              # 中间件
│   │   ├── modules/                 # 业务模块
│   │   │   ├── achievement/         # 成就模块
│   │   │   ├── auth/                # 认证模块
│   │   │   ├── learning/            # 学习模块 (含 SM-2)
│   │   │   ├── media/               # 媒体模块
│   │   │   ├── social/              # 社交模块
│   │   │   ├── stats/               # 统计模块
│   │   │   ├── user/                # 用户模块
│   │   │   └── vocabulary/          # 词库模块
│   │   ├── scripts/                 # 数据爬取与生成脚本
│   │   └── utils/                   # 工具函数
│   ├── data/wordmaster.db           # SQLite 数据库文件
│   └── package.json
├── docker-compose.yml               # 生产环境 Docker 配置
├── docker-compose.dev.yml           # 开发环境 Docker 配置
├── Dockerfile                       # 多阶段构建
└── nginx.conf                       # Nginx 反向代理配置
```
