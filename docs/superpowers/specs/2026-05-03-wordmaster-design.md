# WordMaster 背单词软件 — 设计文档

## 项目概述

WordMaster 是一款基于 Web 的智能背单词应用，采用 SM-2 自适应间隔重复算法，根据用户对每个单词的掌握程度动态调整复习间隔，实现高效记忆。应用提供内置词库与自定义导入、学习统计仪表盘、打卡成就系统、社交分享、语音听力练习等完整功能，支持用户注册登录与云端数据同步。

**目标平台：** Web 应用（后续可扩展 PWA 支持移动端）

**技术栈：** React + Node.js/Express + PostgreSQL + Redis

**部署方式：** Docker 容器化

---

## 功能需求分析

### 核心功能

1. **用户认证** — 注册、登录、JWT 认证、密码重置
2. **词库管理** — 内置词库浏览、自定义词库创建、CSV/JSON 导入
3. **智能学习** — SM-2 算法驱动的学习与复习调度
4. **学习会话** — 支持学习、复习、听力、拼写四种会话类型
5. **答题评分** — 四级自评（不认识/模糊/记得/很熟），驱动 SM-2 计算

### 附加功能

6. **学习统计仪表盘** — 今日概览、每日统计、词库维度统计、趋势图表
7. **打卡与成就** — 每日打卡、连续天数追踪、成就徽章解锁
8. **社交分享** — 生成学习卡片分享图、词库推荐
9. **语音与听力** — TTS 单词发音、听力练习、拼写测试

### 非功能需求

- API 响应时间 P95 < 500ms
- 支持 1000 并发用户
- 数据库每日自动备份，保留 30 天
- HTTPS 强制，JWT 短期过期 + refresh token 机制

---

## 技术架构设计

### 架构选型：单体应用架构

前后端分离但部署为单一 Docker Compose 编排，React 前端构建后由 Nginx 提供静态文件服务并反向代理 API 请求。后端按领域模块划分代码，为未来微服务拆分预留边界。

### 系统架构图

```
┌─────────────────────────────────────────────────────┐
│                   Docker Compose                     │
│                                                       │
│  ┌──────────────┐         ┌──────────────────────┐   │
│  │   Nginx      │────────▶│  Node.js API         │   │
│  │  静态资源 +   │  /api   │  (Express)           │   │
│  │   反向代理    │◀────────│                      │   │
│  └──────────────┘         └──────────┬───────────┘   │
│                                      │                │
│                           ┌──────────▼───────────┐   │
│                           │  PostgreSQL           │   │
│                           │  数据持久化            │   │
│                           └──────────────────────┘   │
│                                                       │
│  ┌──────────────┐                                     │
│  │  Redis       │  会话缓存 + SM-2 调度队列           │
│  └──────────────┘                                     │
└─────────────────────────────────────────────────────┘
```

### 请求流程

1. 浏览器请求到达 Nginx
2. 静态资源（JS/CSS/HTML）由 Nginx 直接返回
3. API 请求（`/api/*`）由 Nginx 反向代理到 Node.js 后端
4. 后端通过 Redis 缓存会话和热数据，PostgreSQL 持久化存储

---

## 模块划分

### 后端模块

| 模块 | 路径 | 职责 | 核心功能 |
|------|------|------|----------|
| auth | `src/modules/auth/` | 用户认证与授权 | 注册、登录、JWT签发/刷新、密码重置 |
| vocabulary | `src/modules/vocabulary/` | 词库管理 | 内置词库CRUD、自定义导入、词库分类、订阅 |
| learning | `src/modules/learning/` | 学习引擎 | SM-2算法、学习会话、复习调度、答题记录 |
| stats | `src/modules/stats/` | 学习统计 | 仪表盘数据、每日统计、词库维度统计、趋势 |
| achievement | `src/modules/achievement/` | 打卡与成就 | 每日打卡、连续天数、成就检测与解锁 |
| social | `src/modules/social/` | 社交分享 | 学习卡片生成、词库推荐 |
| media | `src/modules/media/` | 语音与听力 | TTS发音、听力练习生成、拼写测试生成 |

### 前端页面

| 页面 | 路由 | 功能 |
|------|------|------|
| 首页/仪表盘 | `/` | 今日任务概览、学习统计、快捷入口 |
| 学习页 | `/learn` | 单词学习主界面（卡片翻转、评分） |
| 复习页 | `/review` | 待复习单词列表、复习会话 |
| 词库页 | `/vocabulary` | 词库浏览、搜索、导入 |
| 统计页 | `/stats` | 详细学习数据、图表 |
| 成就页 | `/achievements` | 打卡日历、成就列表 |
| 个人设置 | `/settings` | 个人信息、学习偏好、通知设置 |

### 前端状态管理

| Context | 管理内容 |
|---------|----------|
| AuthContext | 用户信息、登录状态、token |
| LearningContext | 当前学习会话、单词队列、答题状态 |
| StatsContext | 仪表盘数据、缓存的学习统计 |
| SettingsContext | 用户偏好、每日目标、通知设置 |

### 前端核心组件

| 组件 | 功能 |
|------|------|
| FlashCard | 单词卡片（翻转动画、正面/背面） |
| RatingButtons | 自评按钮组（不认识/模糊/记得/很熟） |
| ProgressBar | 学习进度条 |
| StudySession | 学习会话容器 |
| WordBookCard | 词库卡片（封面、进度、单词数） |
| StatsChart | 统计图表（Recharts） |
| CheckInCalendar | 打卡日历热力图 |
| AchievementBadge | 成就徽章组件 |
| AudioPlayer | 发音播放器 |

---

## 数据库设计

### ER 关系概览

```
users ──1:N── user_word_progress ──N:1── words
  │                │                          │
  │                └──N:1── word_books ────────┘
  │                         │
  │                    word_book_items
  │
  ├──1:N── learning_sessions ──1:N── user_answers
  ├──1:N── check_ins
  ├──1:N── user_achievements ──N:1── achievements
  └──1:N── (social shares)
```

### users（用户表）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 登录邮箱 |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt加密 |
| nickname | VARCHAR(100) | NOT NULL | 显示昵称 |
| avatar_url | VARCHAR(500) | | 头像URL |
| daily_goal | INTEGER | DEFAULT 20 | 每日学习目标（单词数） |
| timezone | VARCHAR(50) | DEFAULT 'Asia/Shanghai' | 用户时区 |
| created_at | TIMESTAMP | DEFAULT NOW() | 注册时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

### word_books（词库表）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| name | VARCHAR(200) | NOT NULL | 词库名称 |
| description | TEXT | | 词库描述 |
| language_pair | VARCHAR(20) | NOT NULL, DEFAULT 'en-zh' | 语言对 |
| is_official | BOOLEAN | DEFAULT false | 是否官方内置 |
| word_count | INTEGER | DEFAULT 0 | 单词总数 |
| cover_url | VARCHAR(500) | | 封面图 |
| created_by | UUID | FK → users.id | 创建者（官方为null） |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

### words（单词表）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| word | VARCHAR(200) | NOT NULL | 单词文本 |
| phonetic | VARCHAR(200) | | 音标 |
| definitions | JSONB | NOT NULL | 释义列表 |
| audio_url | VARCHAR(500) | | 发音音频URL |
| frequency_rank | INTEGER | | 使用频率排名 |
| language | VARCHAR(10) | DEFAULT 'en' | 语言代码 |

definitions JSONB 结构：
```json
[
  {
    "pos": "n.",
    "meaning": "苹果",
    "examples": [
      { "en": "I ate an apple.", "zh": "我吃了一个苹果。" }
    ]
  }
]
```

### word_book_items（词库-单词关联表）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| word_book_id | UUID | FK → word_books.id, NOT NULL | 关联词库 |
| word_id | UUID | FK → words.id, NOT NULL | 关联单词 |
| position | INTEGER | NOT NULL | 在词库中的排序 |

UNIQUE 约束：(word_book_id, word_id)

### user_word_progress（用户学习进度表）— SM-2 核心

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| user_id | UUID | FK → users.id, NOT NULL | 用户ID |
| word_id | UUID | FK → words.id, NOT NULL | 单词ID |
| word_book_id | UUID | FK → word_books.id, NOT NULL | 所属词库 |
| ease_factor | DECIMAL(4,2) | DEFAULT 2.50 | SM-2 难度因子 |
| interval | INTEGER | DEFAULT 0 | 复习间隔（天） |
| repetitions | INTEGER | DEFAULT 0 | 成功复习次数 |
| next_review | TIMESTAMP | | 下次复习时间 |
| last_review | TIMESTAMP | | 上次复习时间 |
| status | VARCHAR(20) | DEFAULT 'new' | 状态：new/learning/review/mastered |
| created_at | TIMESTAMP | DEFAULT NOW() | 首次学习时间 |

UNIQUE 约束：(user_id, word_id, word_book_id)

### learning_sessions（学习会话表）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| user_id | UUID | FK → users.id, NOT NULL | 用户ID |
| word_book_id | UUID | FK → word_books.id, NOT NULL | 词库ID |
| type | VARCHAR(20) | NOT NULL | 类型：learn/review/listen/spell |
| started_at | TIMESTAMP | DEFAULT NOW() | 开始时间 |
| ended_at | TIMESTAMP | | 结束时间 |
| words_total | INTEGER | DEFAULT 0 | 总单词数 |
| words_correct | INTEGER | DEFAULT 0 | 正确数 |
| words_wrong | INTEGER | DEFAULT 0 | 错误数 |

### user_answers（答题记录表）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| session_id | UUID | FK → learning_sessions.id, NOT NULL | 学习会话ID |
| word_id | UUID | FK → words.id, NOT NULL | 单词ID |
| user_id | UUID | FK → users.id, NOT NULL | 用户ID |
| answer_type | VARCHAR(20) | NOT NULL | 回答类型：again/hard/good/easy |
| response_time_ms | INTEGER | | 响应时间（毫秒） |
| is_correct | BOOLEAN | NOT NULL | 是否正确 |
| answered_at | TIMESTAMP | DEFAULT NOW() | 答题时间 |

### check_ins（打卡记录表）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| user_id | UUID | FK → users.id, NOT NULL | 用户ID |
| check_in_date | DATE | NOT NULL | 打卡日期 |
| words_learned | INTEGER | DEFAULT 0 | 当日学习单词数 |
| words_reviewed | INTEGER | DEFAULT 0 | 当日复习单词数 |
| streak_days | INTEGER | DEFAULT 1 | 连续打卡天数 |

UNIQUE 约束：(user_id, check_in_date)

### achievements（成就定义表）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| code | VARCHAR(50) | UNIQUE, NOT NULL | 成就编码 |
| name | VARCHAR(100) | NOT NULL | 成就名称 |
| description | TEXT | NOT NULL | 成就描述 |
| icon | VARCHAR(100) | NOT NULL | 图标标识 |
| condition | JSONB | NOT NULL | 达成条件 |

condition JSONB 结构示例：
```json
{ "type": "total_words", "threshold": 100 }
{ "type": "streak_days", "threshold": 7 }
{ "type": "perfect_session", "threshold": 1 }
```

### user_achievements（用户成就表）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| user_id | UUID | FK → users.id, NOT NULL | 用户ID |
| achievement_id | UUID | FK → achievements.id, NOT NULL | 成就ID |
| unlocked_at | TIMESTAMP | DEFAULT NOW() | 解锁时间 |

UNIQUE 约束：(user_id, achievement_id)

### 关键索引

```sql
CREATE INDEX idx_user_word_progress_review ON user_word_progress(user_id, next_review);
CREATE INDEX idx_user_word_progress_status ON user_word_progress(user_id, word_book_id, status);
CREATE INDEX idx_words_word ON words(word);
CREATE INDEX idx_check_ins_user_date ON check_ins(user_id, check_in_date);
CREATE INDEX idx_learning_sessions_user ON learning_sessions(user_id, started_at);
CREATE INDEX idx_user_answers_session ON user_answers(session_id);
CREATE INDEX idx_word_book_items_book ON word_book_items(word_book_id, position);
```

---

## API 接口规范

### 通用约定

- 基础路径：`/api/v1`
- 认证方式：Bearer Token（JWT），Header: `Authorization: Bearer <token>`
- 请求/响应格式：JSON
- 分页参数：`page`（从1开始）、`page_size`（默认20，最大100）
- 成功响应：`{ "data": ..., "meta": { "page": 1, "page_size": 20, "total": 100 } }`
- 错误响应：`{ "error": { "code": "ERROR_CODE", "message": "描述" } }`
- HTTP 状态码：200 成功、201 创建、400 参数错误、401 未认证、403 无权限、404 不存在、409 冲突、429 限流、500 服务器错误

### 认证模块 `/api/v1/auth`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/auth/register` | 注册 | 否 |
| POST | `/auth/login` | 登录，返回 access_token + refresh_token | 否 |
| POST | `/auth/refresh` | 刷新 access_token | 否 |
| POST | `/auth/logout` | 登出 | 是 |
| POST | `/auth/forgot-password` | 发送密码重置邮件 | 否 |
| POST | `/auth/reset-password` | 重置密码 | 否 |

**POST /auth/register**
```
请求：{ "email": "user@example.com", "password": "Pass123!", "nickname": "小明" }
成功：201 { "data": { "user": { "id", "email", "nickname" }, "access_token", "refresh_token" } }
失败：409 { "error": { "code": "EMAIL_EXISTS", "message": "该邮箱已注册" } }
```

**POST /auth/login**
```
请求：{ "email": "user@example.com", "password": "Pass123!" }
成功：200 { "data": { "user": { "id", "email", "nickname" }, "access_token", "refresh_token" } }
失败：401 { "error": { "code": "INVALID_CREDENTIALS", "message": "邮箱或密码错误" } }
```

### 词库模块 `/api/v1/word-books`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/word-books` | 词库列表（支持 search, language_pair, is_official 筛选） | 否 |
| GET | `/word-books/:id` | 词库详情 | 否 |
| GET | `/word-books/:id/words` | 词库单词（分页） | 否 |
| POST | `/word-books` | 创建自定义词库 | 是 |
| PUT | `/word-books/:id` | 更新自定义词库 | 是 |
| DELETE | `/word-books/:id` | 删除自定义词库 | 是 |
| POST | `/word-books/:id/import` | 导入单词（CSV/JSON） | 是 |
| POST | `/word-books/:id/subscribe` | 订阅词库 | 是 |
| DELETE | `/word-books/:id/subscribe` | 取消订阅 | 是 |

### 学习模块 `/api/v1/learning`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/learning/dashboard` | 今日学习概览 | 是 |
| GET | `/learning/next-review` | 待复习单词列表 | 是 |
| GET | `/learning/next-new` | 新单词（word_book_id, count 参数） | 是 |
| POST | `/learning/session/start` | 开始学习会话 | 是 |
| POST | `/learning/session/:id/answer` | 提交答题结果 | 是 |
| POST | `/learning/session/:id/end` | 结束学习会话 | 是 |
| GET | `/learning/progress/:word_book_id` | 词库学习进度 | 是 |

**POST /learning/session/start**
```
请求：{ "word_book_id": "uuid", "type": "learn" }
成功：200 { "data": { "session_id": "uuid", "words": [{ "id", "word", "phonetic" }] } }
```

**POST /learning/session/:id/answer**
```
请求：{ "word_id": "uuid", "answer_type": "good", "response_time_ms": 2300 }
成功：200 { "data": { "next_review": "2026-05-10T08:00:00Z", "ease_factor": 2.5, "interval": 6, "status": "review" } }
```

### 统计模块 `/api/v1/stats`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/stats/overview` | 总体统计 | 是 |
| GET | `/stats/daily` | 每日统计（start_date, end_date） | 是 |
| GET | `/stats/word-book/:id` | 词库维度统计 | 是 |
| GET | `/stats/trend` | 学习趋势（period: 7d/30d/90d） | 是 |

### 成就模块 `/api/v1/achievements`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/achievements` | 所有成就定义 | 是 |
| GET | `/achievements/mine` | 我的成就（含未解锁） | 是 |
| GET | `/check-ins` | 打卡记录（month 参数） | 是 |
| POST | `/check-ins` | 今日打卡 | 是 |

### 社交模块 `/api/v1/social`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/social/share` | 生成学习卡片分享图 | 是 |
| GET | `/social/share/:id` | 获取分享卡片详情 | 否 |
| POST | `/social/recommend/:word_book_id` | 推荐词库 | 是 |

### 媒体模块 `/api/v1/media`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/media/pronounce/:word_id` | 获取单词发音 | 是 |
| POST | `/media/listening-quiz` | 生成听力练习题 | 是 |
| POST | `/media/spelling-quiz` | 生成拼写测试题 | 是 |

### 用户设置 `/api/v1/user`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/user/profile` | 获取个人信息 | 是 |
| PUT | `/user/profile` | 更新个人信息 | 是 |
| PUT | `/user/settings` | 更新学习偏好 | 是 |
| PUT | `/user/password` | 修改密码 | 是 |

---

## SM-2 算法实现

### 算法输入

用户在每个单词学习后给出自评等级，映射为 SM-2 的 quality 值（0-5）：

| 前端按钮 | quality | 含义 |
|----------|---------|------|
| 不认识 | 0 | 完全不认识 |
| 有印象 | 1 | 忘记，但答案有印象 |
| 模糊 | 2 | 忘记，但看到答案后想起来了 |
| 费劲 | 3 | 记住，但费了很大劲 |
| 记得 | 4 | 记住，但有些犹豫 |
| 很熟 | 5 | 完全记住，毫不费力 |

前端简化为4个按钮，映射关系：
- 不认识 → quality = 0
- 模糊 → quality = 2
- 记得 → quality = 4
- 很熟 → quality = 5

### 算法逻辑

```
function sm2(progress, quality):
  if quality >= 3:
    if progress.repetitions == 0:
      progress.interval = 1
    elif progress.repetitions == 1:
      progress.interval = 6
    else:
      progress.interval = round(progress.interval * progress.ease_factor)
    progress.repetitions += 1
  else:
    progress.repetitions = 0
    progress.interval = 1

  progress.ease_factor = max(
    1.3,
    progress.ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  progress.last_review = now()
  progress.next_review = now() + interval days
  progress.status = derive_status(progress)
```

### 状态转换

```
new ──(首次学习)──▶ learning ──(quality>=3, rep>=1)──▶ review ──(quality>=3, rep>=5)──▶ mastered
  │                    │                                  │
  │                    └────(quality<3)──▶ learning        └────(quality<3)──▶ learning
  │                                                          │
  └──────────────────────────────────────────────────────────┘
```

- **new**：未学习
- **learning**：正在学习（interval <= 6天）
- **review**：进入复习周期（interval > 6天）
- **mastered**：已掌握（repetitions >= 5 且 ease_factor >= 2.0）

---

## 开发进度计划

### 阶段一：基础框架（第1-2周）

- 项目脚手架搭建（前端 React + 后端 Express + 数据库）
- Docker Compose 开发环境配置
- 用户认证模块（注册、登录、JWT）
- 基础页面布局与路由

### 阶段二：核心学习功能（第3-5周）

- 词库管理模块（CRUD、导入）
- SM-2 算法实现
- 学习会话（学习 + 复习）
- 单词卡片组件与交互

### 阶段三：统计与成就（第6-7周）

- 学习统计仪表盘
- 打卡系统
- 成就系统
- 统计图表组件

### 阶段四：扩展功能（第8-9周）

- 语音发音（TTS）
- 听力练习
- 拼写测试
- 社交分享

### 阶段五：优化与上线（第10-11周）

- 性能优化（缓存、懒加载）
- E2E 测试完善
- 生产环境 Docker 配置
- CI/CD 流水线搭建
- 上线部署

---

## 测试策略

### 测试层级

| 层级 | 工具 | 覆盖范围 | 目标覆盖率 |
|------|------|----------|-----------|
| 单元测试 | Jest + React Testing Library | SM-2算法、工具函数、React组件 | >= 80% |
| 集成测试 | Supertest | API端点、数据库交互、认证流程 | >= 70% |
| E2E测试 | Playwright | 关键用户流程 | 核心流程100% |
| 性能测试 | k6 | API并发性能 | P95 < 500ms |

### 关键测试场景

**SM-2 算法测试：**
- quality=0 时 repetitions 重置为 0，interval 重置为 1
- quality>=3 且 repetitions=0 时 interval=1
- quality>=3 且 repetitions=1 时 interval=6
- quality>=3 且 repetitions>=2 时 interval=round(prev * ease_factor)
- ease_factor 最小值为 1.3
- 各种评分序列下的间隔计算正确性

**认证流程测试：**
- 注册成功返回 token
- 重复邮箱注册返回 409
- 登录成功返回 token
- 错误密码返回 401
- token 过期后 refresh 成功
- 登出后 token 失效

**学习会话测试：**
- 开始会话返回单词列表
- 提交答案更新进度
- 结束会话更新统计
- 并发答题不丢失数据

**词库导入测试：**
- CSV 格式正确导入
- JSON 格式正确导入
- 格式错误返回明确错误信息
- 大文件导入不超时

---

## 部署流程

### Docker Compose 服务编排

```yaml
services:
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes: [./nginx.conf:/etc/nginx/nginx.conf, frontend-build:/usr/share/nginx/html]
    depends_on: [api]

  api:
    build: .
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/wordmaster
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on: [postgres, redis]

  postgres:
    image: postgres:16-alpine
    volumes: [pg-data:/var/lib/postgresql/data]
    environment:
      - POSTGRES_DB=wordmaster
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=${PG_PASSWORD}

  redis:
    image: redis:7-alpine
    volumes: [redis-data:/data]
```

### CI/CD 流水线（GitHub Actions）

1. **代码推送触发**
2. **代码质量检查** — ESLint + TypeScript 类型检查
3. **运行测试** — 单元测试 + 集成测试
4. **构建 Docker 镜像**
5. **推送镜像到仓库**（Docker Hub / 阿里云容器镜像服务）
6. **部署到生产** — SSH 到服务器执行 `docker compose pull && docker compose up -d`

### 环境变量管理

| 变量 | 说明 | 环境 |
|------|------|------|
| DATABASE_URL | PostgreSQL 连接字符串 | 所有 |
| REDIS_URL | Redis 连接字符串 | 所有 |
| JWT_SECRET | JWT 签名密钥 | 所有 |
| JWT_EXPIRES_IN | Access token 过期时间（默认15m） | 所有 |
| REFRESH_TOKEN_EXPIRES_IN | Refresh token 过期时间（默认7d） | 所有 |
| SMTP_HOST | 邮件服务器 | 生产 |
| SMTP_USER | 邮件账号 | 生产 |
| SMTP_PASS | 邮件密码 | 生产 |

---

## 维护指南

### 监控与告警

- **健康检查端点**：`GET /api/v1/health` — 返回各服务状态
- **数据库连接池**：监控活跃连接数，告警阈值 80%
- **API 响应时间**：P95 > 500ms 触发告警
- **错误率**：5分钟内错误率 > 1% 触发告警
- **Redis 内存**：使用率 > 80% 触发告警

### 数据备份

- PostgreSQL 每日自动备份（pg_dump，cron 定时任务）
- 备份文件上传至对象存储（OSS/S3）
- 备份保留 30 天
- 每月第一个周日验证备份恢复

### 版本发布

- 语义化版本号（SemVer）：MAJOR.MINOR.PATCH
- CHANGELOG.md 记录每个版本变更
- 数据库迁移使用 Knex.js migrations
- 发布前必须通过全部测试

### 安全措施

- HTTPS 强制（Let's Encrypt 证书自动续期）
- JWT access token 短期过期（15分钟）+ refresh token（7天）
- 密码 bcrypt 加密（salt rounds: 12）
- API 限流（express-rate-limit：普通接口 100次/分钟，认证接口 10次/分钟）
- SQL 注入防护（Knex.js 参数化查询）
- XSS 防护（输入消毒 + Content-Security-Policy 头）
- CORS 配置仅允许指定域名
- 敏感信息通过环境变量注入，不写入代码仓库

### 故障恢复

- 数据库故障：从最近备份恢复，重放 WAL 日志
- Redis 故障：重启即可，非持久化数据自动重建
- API 故障：Docker 自动重启（restart: unless-stopped）
- 全量故障：docker compose up -d 重新拉起所有服务
