# WordMaster 背单词软件 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个基于 SM-2 算法的智能背单词 Web 应用，包含用户认证、词库管理、学习引擎、统计仪表盘、打卡成就、社交分享、语音听力等完整功能。

**Architecture:** 单体应用架构，React 前端 + Express 后端 + PostgreSQL + Redis，Docker Compose 编排部署。后端按领域模块划分，前端使用 React Router + Context 状态管理。

**Tech Stack:** React 18, TypeScript, Express, Knex.js, PostgreSQL, Redis, JWT, Docker Compose, Nginx

---

## File Structure

```
d:\Project\Word\
├── client/                          # React 前端
│   ├── public/
│   ├── src/
│   │   ├── components/              # 通用组件
│   │   │   ├── FlashCard.tsx
│   │   │   ├── RatingButtons.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── WordBookCard.tsx
│   │   │   ├── StatsChart.tsx
│   │   │   ├── CheckInCalendar.tsx
│   │   │   ├── AchievementBadge.tsx
│   │   │   └── AudioPlayer.tsx
│   │   ├── contexts/                # 状态管理
│   │   │   ├── AuthContext.tsx
│   │   │   ├── LearningContext.tsx
│   │   │   ├── StatsContext.tsx
│   │   │   └── SettingsContext.tsx
│   │   ├── pages/                   # 页面组件
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Learn.tsx
│   │   │   ├── Review.tsx
│   │   │   ├── Vocabulary.tsx
│   │   │   ├── Stats.tsx
│   │   │   ├── Achievements.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── services/                # API 调用
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── package.json
│   └── tsconfig.json
├── server/                          # Express 后端
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.middleware.ts
│   │   │   ├── vocabulary/
│   │   │   │   ├── vocabulary.routes.ts
│   │   │   │   ├── vocabulary.controller.ts
│   │   │   │   └── vocabulary.service.ts
│   │   │   ├── learning/
│   │   │   │   ├── learning.routes.ts
│   │   │   │   ├── learning.controller.ts
│   │   │   │   ├── learning.service.ts
│   │   │   │   └── sm2.ts
│   │   │   ├── stats/
│   │   │   │   ├── stats.routes.ts
│   │   │   │   ├── stats.controller.ts
│   │   │   │   └── stats.service.ts
│   │   │   ├── achievement/
│   │   │   │   ├── achievement.routes.ts
│   │   │   │   ├── achievement.controller.ts
│   │   │   │   └── achievement.service.ts
│   │   │   ├── social/
│   │   │   │   ├── social.routes.ts
│   │   │   │   ├── social.controller.ts
│   │   │   │   └── social.service.ts
│   │   │   └── media/
│   │   │       ├── media.routes.ts
│   │   │       ├── media.controller.ts
│   │   │       └── media.service.ts
│   │   ├── database/
│   │   │   ├── connection.ts
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── rateLimiter.ts
│   │   │   └── validate.ts
│   │   ├── utils/
│   │   │   └── response.ts
│   │   ├── app.ts
│   │   └── index.ts
│   ├── knexfile.ts
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
├── docker-compose.dev.yml
├── Dockerfile
├── nginx.conf
├── .env.example
└── .gitignore
```

---

### Task 1: 项目脚手架与基础配置

**Files:**
- Create: `server/package.json`
- Create: `server/tsconfig.json`
- Create: `server/src/index.ts`
- Create: `server/src/app.ts`
- Create: `server/src/utils/response.ts`
- Create: `server/src/middleware/errorHandler.ts`
- Create: `client/package.json`
- Create: `client/tsconfig.json`
- Create: `client/src/index.tsx`
- Create: `client/src/App.tsx`
- Create: `client/src/types.ts`
- Create: `client/src/services/api.ts`
- Create: `.gitignore`
- Create: `.env.example`

- [ ] **Step 1: 初始化后端项目**

```bash
cd d:\Project\Word
mkdir -p server/src
cd server
npm init -y
```

- [ ] **Step 2: 安装后端依赖**

```bash
cd d:\Project\Word\server
npm install express knex pg redis bcryptjs jsonwebtoken cors helmet express-rate-limit multer csv-parse uuid zod
npm install -D typescript @types/express @types/node @types/bcryptjs @types/jsonwebtoken @types/cors @types/multer @types/csv-parse @types/uuid ts-node nodemon
```

- [ ] **Step 3: 创建后端 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 4: 创建后端入口文件 server/src/index.ts**

```typescript
import { createApp } from './app';

const PORT = process.env.PORT || 3001;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

- [ ] **Step 5: 创建 Express 应用 server/src/app.ts**

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use(errorHandler);

  return app;
}
```

- [ ] **Step 6: 创建响应工具 server/src/utils/response.ts**

```typescript
import { Response } from 'express';

export function success(res: Response, data: any, statusCode = 200) {
  return res.status(statusCode).json({ data });
}

export function successPaginated(
  res: Response,
  data: any,
  meta: { page: number; page_size: number; total: number }
) {
  return res.json({ data, meta });
}

export function error(res: Response, code: string, message: string, statusCode = 400) {
  return res.status(statusCode).json({ error: { code, message } });
}
```

- [ ] **Step 7: 创建错误处理中间件 server/src/middleware/errorHandler.ts**

```typescript
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(err.stack);
  return res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' }
  });
}
```

- [ ] **Step 8: 初始化前端项目**

```bash
cd d:\Project\Word
npx create-react-app client --template typescript
```

- [ ] **Step 9: 安装前端依赖**

```bash
cd d:\Project\Word\client
npm install react-router-dom axios recharts
npm install -D @types/react @types/react-dom
```

- [ ] **Step 10: 创建前端类型定义 client/src/types.ts**

```typescript
export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar_url: string | null;
  daily_goal: number;
  timezone: string;
}

export interface WordBook {
  id: string;
  name: string;
  description: string | null;
  language_pair: string;
  is_official: boolean;
  word_count: number;
  cover_url: string | null;
  created_by: string | null;
  subscribed: boolean;
  progress?: WordBookProgress;
}

export interface WordBookProgress {
  total_words: number;
  learned_words: number;
  mastered_words: number;
  new_words: number;
}

export interface Word {
  id: string;
  word: string;
  phonetic: string | null;
  definitions: WordDefinition[];
  audio_url: string | null;
  frequency_rank: number | null;
}

export interface WordDefinition {
  pos: string;
  meaning: string;
  examples: { en: string; zh: string }[];
}

export interface WordProgress {
  id: string;
  word_id: string;
  word_book_id: string;
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: string | null;
  last_review: string | null;
  status: 'new' | 'learning' | 'review' | 'mastered';
}

export interface LearningSession {
  id: string;
  word_book_id: string;
  type: 'learn' | 'review' | 'listen' | 'spell';
  started_at: string;
  ended_at: string | null;
  words_total: number;
  words_correct: number;
  words_wrong: number;
}

export interface Dashboard {
  words_to_review: number;
  words_to_learn: number;
  streak_days: number;
  today_learned: number;
  today_reviewed: number;
  daily_goal: number;
  daily_goal_progress: number;
}

export interface StatsOverview {
  total_words_learned: number;
  total_words_mastered: number;
  total_learning_days: number;
  total_reviews: number;
  average_accuracy: number;
}

export interface CheckIn {
  id: string;
  check_in_date: string;
  words_learned: number;
  words_reviewed: number;
  streak_days: number;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at: string | null;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}
```

- [ ] **Step 11: 创建 API 服务 client/src/services/api.ts**

```typescript
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api/v1';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          localStorage.setItem('access_token', data.data.access_token);
          originalRequest.headers.Authorization = `Bearer ${data.data.access_token}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

- [ ] **Step 12: 创建基础 App 组件 client/src/App.tsx**

```tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Review from './pages/Review';
import Vocabulary from './pages/Vocabulary';
import Stats from './pages/Stats';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/review" element={<Review />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
```

- [ ] **Step 13: 创建 .gitignore**

```
node_modules/
dist/
.env
*.log
.superpowers/
client/build/
```

- [ ] **Step 14: 创建 .env.example**

```
DATABASE_URL=postgresql://user:password@localhost:5432/wordmaster
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret-change-in-production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=3001
```

- [ ] **Step 15: Commit**

```bash
cd d:\Project\Word
git init
git add .
git commit -m "feat: initialize project scaffold with React + Express"
```

---

### Task 2: 数据库连接与迁移

**Files:**
- Create: `server/knexfile.ts`
- Create: `server/src/database/connection.ts`
- Create: `server/src/database/migrations/001_create_users.ts`
- Create: `server/src/database/migrations/002_create_word_books.ts`
- Create: `server/src/database/migrations/003_create_words.ts`
- Create: `server/src/database/migrations/004_create_word_book_items.ts`
- Create: `server/src/database/migrations/005_create_user_word_progress.ts`
- Create: `server/src/database/migrations/006_create_learning_sessions.ts`
- Create: `server/src/database/migrations/007_create_user_answers.ts`
- Create: `server/src/database/migrations/008_create_check_ins.ts`
- Create: `server/src/database/migrations/009_create_achievements.ts`
- Create: `server/src/database/migrations/010_create_user_achievements.ts`

- [ ] **Step 1: 创建 Knex 配置 server/knexfile.ts**

```typescript
import type { Knex } from 'knex';

module.exports = {
  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/wordmaster',
    migrations: {
      directory: './src/database/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/database/seeds',
    },
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/database/migrations',
    },
    seeds: {
      directory: './src/database/seeds',
    },
  },
} as Knex.Config;
```

- [ ] **Step 2: 创建数据库连接 server/src/database/connection.ts**

```typescript
import knex from 'knex';

export function createDb() {
  return knex({
    client: 'postgresql',
    connection: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/wordmaster',
    pool: { min: 2, max: 10 },
  });
}

export type Db = ReturnType<typeof createDb>;
```

- [ ] **Step 3: 创建 users 迁移 001_create_users.ts**

```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email', 255).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    table.string('nickname', 100).notNullable();
    table.string('avatar_url', 500).nullable();
    table.integer('daily_goal').defaultTo(20);
    table.string('timezone', 50).defaultTo('Asia/Shanghai');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
```

- [ ] **Step 4: 创建 word_books 迁移 002_create_word_books.ts**

```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('word_books', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 200).notNullable();
    table.text('description').nullable();
    table.string('language_pair', 20).notNullable().defaultTo('en-zh');
    table.boolean('is_official').defaultTo(false);
    table.integer('word_count').defaultTo(0);
    table.string('cover_url', 500).nullable();
    table.uuid('created_by').references('id').inTable('users').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('word_books');
}
```

- [ ] **Step 5: 创建 words 迁移 003_create_words.ts**

```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('words', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('word', 200).notNullable();
    table.string('phonetic', 200).nullable();
    table.jsonb('definitions').notNullable();
    table.string('audio_url', 500).nullable();
    table.integer('frequency_rank').nullable();
    table.string('language', 10).defaultTo('en');
  });
  await knex.raw('CREATE INDEX idx_words_word ON words(word)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('words');
}
```

- [ ] **Step 6: 创建 word_book_items 迁移 004_create_word_book_items.ts**

```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('word_book_items', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('word_book_id').references('id').inTable('word_books').notNullable();
    table.uuid('word_id').references('id').inTable('words').notNullable();
    table.integer('position').notNullable();
    table.unique(['word_book_id', 'word_id']);
  });
  await knex.raw('CREATE INDEX idx_word_book_items_book ON word_book_items(word_book_id, position)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('word_book_items');
}
```

- [ ] **Step 7: 创建 user_word_progress 迁移 005_create_user_word_progress.ts**

```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_word_progress', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').notNullable();
    table.uuid('word_id').references('id').inTable('words').notNullable();
    table.uuid('word_book_id').references('id').inTable('word_books').notNullable();
    table.decimal('ease_factor', 4, 2).defaultTo(2.5);
    table.integer('interval').defaultTo(0);
    table.integer('repetitions').defaultTo(0);
    table.timestamp('next_review').nullable();
    table.timestamp('last_review').nullable();
    table.string('status', 20).defaultTo('new');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.unique(['user_id', 'word_id', 'word_book_id']);
  });
  await knex.raw('CREATE INDEX idx_user_word_progress_review ON user_word_progress(user_id, next_review)');
  await knex.raw('CREATE INDEX idx_user_word_progress_status ON user_word_progress(user_id, word_book_id, status)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user_word_progress');
}
```

- [ ] **Step 8: 创建 learning_sessions 迁移 006_create_learning_sessions.ts**

```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('learning_sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').notNullable();
    table.uuid('word_book_id').references('id').inTable('word_books').notNullable();
    table.string('type', 20).notNullable();
    table.timestamp('started_at').defaultTo(knex.fn.now());
    table.timestamp('ended_at').nullable();
    table.integer('words_total').defaultTo(0);
    table.integer('words_correct').defaultTo(0);
    table.integer('words_wrong').defaultTo(0);
  });
  await knex.raw('CREATE INDEX idx_learning_sessions_user ON learning_sessions(user_id, started_at)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('learning_sessions');
}
```

- [ ] **Step 9: 创建 user_answers 迁移 007_create_user_answers.ts**

```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_answers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('session_id').references('id').inTable('learning_sessions').notNullable();
    table.uuid('word_id').references('id').inTable('words').notNullable();
    table.uuid('user_id').references('id').inTable('users').notNullable();
    table.string('answer_type', 20).notNullable();
    table.integer('response_time_ms').nullable();
    table.boolean('is_correct').notNullable();
    table.timestamp('answered_at').defaultTo(knex.fn.now());
  });
  await knex.raw('CREATE INDEX idx_user_answers_session ON user_answers(session_id)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user_answers');
}
```

- [ ] **Step 10: 创建 check_ins 迁移 008_create_check_ins.ts**

```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('check_ins', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').notNullable();
    table.date('check_in_date').notNullable();
    table.integer('words_learned').defaultTo(0);
    table.integer('words_reviewed').defaultTo(0);
    table.integer('streak_days').defaultTo(1);
    table.unique(['user_id', 'check_in_date']);
  });
  await knex.raw('CREATE INDEX idx_check_ins_user_date ON check_ins(user_id, check_in_date)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('check_ins');
}
```

- [ ] **Step 11: 创建 achievements 迁移 009_create_achievements.ts**

```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('achievements', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('code', 50).unique().notNullable();
    table.string('name', 100).notNullable();
    table.text('description').notNullable();
    table.string('icon', 100).notNullable();
    table.jsonb('condition').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('achievements');
}
```

- [ ] **Step 12: 创建 user_achievements 迁移 010_create_user_achievements.ts**

```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_achievements', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').notNullable();
    table.uuid('achievement_id').references('id').inTable('achievements').notNullable();
    table.timestamp('unlocked_at').defaultTo(knex.fn.now());
    table.unique(['user_id', 'achievement_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user_achievements');
}
```

- [ ] **Step 13: Commit**

```bash
cd d:\Project\Word
git add .
git commit -m "feat: add database migrations for all tables"
```

---

### Task 3: 用户认证模块

**Files:**
- Create: `server/src/modules/auth/auth.service.ts`
- Create: `server/src/modules/auth/auth.controller.ts`
- Create: `server/src/modules/auth/auth.routes.ts`
- Create: `server/src/modules/auth/auth.middleware.ts`
- Create: `server/src/middleware/auth.ts`
- Create: `server/src/middleware/validate.ts`
- Create: `server/src/middleware/rateLimiter.ts`

- [ ] **Step 1: 创建认证服务 server/src/modules/auth/auth.service.ts**

```typescript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Db } from '../../database/connection';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export class AuthService {
  constructor(private db: Db) {}

  async register(email: string, password: string, nickname: string) {
    const existing = await this.db('users').where({ email }).first();
    if (existing) {
      throw new Error('EMAIL_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const [user] = await this.db('users')
      .insert({ email, password_hash: passwordHash, nickname })
      .returning(['id', 'email', 'nickname']);

    const tokens = this.generateTokens(user.id);
    return { user, ...tokens };
  }

  async login(email: string, password: string) {
    const user = await this.db('users').where({ email }).first();
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const tokens = this.generateTokens(user.id);
    return {
      user: { id: user.id, email: user.email, nickname: user.nickname },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, JWT_SECRET) as { userId: string; type: string };
      if (payload.type !== 'refresh') {
        throw new Error('INVALID_TOKEN');
      }
      const user = await this.db('users').where({ id: payload.userId }).first();
      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }
      const tokens = this.generateTokens(user.id);
      return {
        user: { id: user.id, email: user.email, nickname: user.nickname },
        ...tokens,
      };
    } catch {
      throw new Error('INVALID_TOKEN');
    }
  }

  async getUserById(userId: string) {
    const user = await this.db('users').where({ id: userId }).first();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatar_url: user.avatar_url,
      daily_goal: user.daily_goal,
      timezone: user.timezone,
    };
  }

  private generateTokens(userId: string) {
    const access_token = jwt.sign({ userId, type: 'access' }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    const refresh_token = jwt.sign({ userId, type: 'refresh' }, JWT_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN,
    });
    return { access_token, refresh_token };
  }
}
```

- [ ] **Step 2: 创建认证中间件 server/src/middleware/auth.ts**

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: '未提供认证令牌' } });
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };
    if (payload.type !== 'access') {
      return res.status(401).json({ error: { code: 'INVALID_TOKEN', message: '无效的令牌类型' } });
    }
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: { code: 'TOKEN_EXPIRED', message: '令牌已过期' } });
  }
}
```

- [ ] **Step 3: 创建验证中间件 server/src/middleware/validate.ts**

```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: messages } });
      }
      next(err);
    }
  };
}
```

- [ ] **Step 4: 创建限流中间件 server/src/middleware/rateLimiter.ts**

```typescript
import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: { code: 'RATE_LIMITED', message: '请求过于频繁，请稍后再试' } },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: { code: 'RATE_LIMITED', message: '登录尝试过于频繁，请稍后再试' } },
});
```

- [ ] **Step 5: 创建认证控制器 server/src/modules/auth/auth.controller.ts**

```typescript
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { success, error } from '../../utils/response';

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response) {
    try {
      const result = await this.authService.register(req.body.email, req.body.password, req.body.nickname);
      return success(res, result, 201);
    } catch (err: any) {
      if (err.message === 'EMAIL_EXISTS') {
        return error(res, 'EMAIL_EXISTS', '该邮箱已注册', 409);
      }
      throw err;
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await this.authService.login(req.body.email, req.body.password);
      return success(res, result);
    } catch (err: any) {
      if (err.message === 'INVALID_CREDENTIALS') {
        return error(res, 'INVALID_CREDENTIALS', '邮箱或密码错误', 401);
      }
      throw err;
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const result = await this.authService.refresh(req.body.refresh_token);
      return success(res, result);
    } catch (err: any) {
      if (err.message === 'INVALID_TOKEN') {
        return error(res, 'INVALID_TOKEN', '无效的刷新令牌', 401);
      }
      throw err;
    }
  }
}
```

- [ ] **Step 6: 创建认证路由 server/src/modules/auth/auth.routes.ts**

```typescript
import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { validate } from '../../middleware/validate';
import { authLimiter } from '../../middleware/rateLimiter';
import { authMiddleware } from '../../middleware/auth';
import { Db } from '../../database/connection';

const registerSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(8, '密码至少8位'),
  nickname: z.string().min(1, '昵称不能为空').max(100),
});

const loginSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(1, '密码不能为空'),
});

const refreshSchema = z.object({
  refresh_token: z.string().min(1, '刷新令牌不能为空'),
});

export function createAuthRoutes(db: Db) {
  const router = Router();
  const authService = new AuthService(db);
  const authController = new AuthController(authService);

  router.post('/register', authLimiter, validate(registerSchema), (req, res) => authController.register(req, res));
  router.post('/login', authLimiter, validate(loginSchema), (req, res) => authController.login(req, res));
  router.post('/refresh', validate(refreshSchema), (req, res) => authController.refresh(req, res));
  router.post('/logout', authMiddleware, (_req, res) => {
    return success(res, { message: '已登出' });
  });

  return router;
}

import { success } from '../../utils/response';
```

- [ ] **Step 7: 更新 app.ts 注册路由**

在 `server/src/app.ts` 中注册认证路由：

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { createDb } from './database/connection';
import { createAuthRoutes } from './modules/auth/auth.routes';
import { generalLimiter } from './middleware/rateLimiter';

export function createApp() {
  const app = express();
  const db = createDb();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(generalLimiter);

  app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/v1/auth', createAuthRoutes(db));

  app.use(errorHandler);

  return app;
}
```

- [ ] **Step 8: Commit**

```bash
cd d:\Project\Word
git add .
git commit -m "feat: add auth module with register, login, JWT, refresh"
```

---

### Task 4: SM-2 算法与学习模块

**Files:**
- Create: `server/src/modules/learning/sm2.ts`
- Create: `server/src/modules/learning/learning.service.ts`
- Create: `server/src/modules/learning/learning.controller.ts`
- Create: `server/src/modules/learning/learning.routes.ts`

- [ ] **Step 1: 创建 SM-2 算法 server/src/modules/learning/sm2.ts**

```typescript
export interface SM2Input {
  ease_factor: number;
  interval: number;
  repetitions: number;
  status: string;
}

export interface SM2Output {
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: Date;
  status: 'new' | 'learning' | 'review' | 'mastered';
}

export function calculateSM2(progress: SM2Input, quality: number): SM2Output {
  let { ease_factor, interval, repetitions } = progress;

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease_factor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  ease_factor = Math.max(
    1.3,
    ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const next_review = new Date();
  next_review.setDate(next_review.getDate() + interval);

  const status = deriveStatus(repetitions, interval, ease_factor, progress.status);

  return { ease_factor, interval, repetitions, next_review, status };
}

function deriveStatus(
  repetitions: number,
  interval: number,
  ease_factor: number,
  currentStatus: string
): 'new' | 'learning' | 'review' | 'mastered' {
  if (currentStatus === 'new' && repetitions === 0) return 'new';
  if (repetitions >= 5 && ease_factor >= 2.0) return 'mastered';
  if (interval > 6) return 'review';
  return 'learning';
}

export function mapAnswerTypeToQuality(answerType: string): number {
  switch (answerType) {
    case 'again': return 0;
    case 'hard': return 2;
    case 'good': return 4;
    case 'easy': return 5;
    default: return 0;
  }
}
```

- [ ] **Step 2: 创建学习服务 server/src/modules/learning/learning.service.ts**

```typescript
import { Db } from '../../database/connection';
import { calculateSM2, mapAnswerTypeToQuality } from './sm2';

export class LearningService {
  constructor(private db: Db) {}

  async getDashboard(userId: string) {
    const today = new Date().toISOString().split('T')[0];

    const toReview = await this.db('user_word_progress')
      .where({ user_id: userId, status: 'review' })
      .where('next_review', '<=', new Date())
      .count('* as count')
      .first();

    const toLearn = await this.db('user_word_progress')
      .where({ user_id: userId, status: 'new' })
      .count('* as count')
      .first();

    const checkIn = await this.db('check_ins')
      .where({ user_id: userId, check_in_date: today })
      .first();

    const user = await this.db('users').where({ id: userId }).first();

    return {
      words_to_review: Number(toReview?.count || 0),
      words_to_learn: Number(toLearn?.count || 0),
      streak_days: checkIn?.streak_days || 0,
      today_learned: checkIn?.words_learned || 0,
      today_reviewed: checkIn?.words_reviewed || 0,
      daily_goal: user?.daily_goal || 20,
      daily_goal_progress: Math.min(
        100,
        Math.round(((checkIn?.words_learned || 0) + (checkIn?.words_reviewed || 0)) / (user?.daily_goal || 20) * 100)
      ),
    };
  }

  async getNextReview(userId: string) {
    const progress = await this.db('user_word_progress')
      .where({ user_id: userId })
      .where('status', 'in', ['learning', 'review'])
      .where('next_review', '<=', new Date())
      .orderBy('next_review', 'asc')
      .limit(20);

    if (progress.length === 0) return [];

    const wordIds = progress.map((p) => p.word_id);
    const words = await this.db('words').whereIn('id', wordIds);

    return progress.map((p) => ({
      ...p,
      word: words.find((w) => w.id === p.word_id),
    }));
  }

  async getNextNew(userId: string, wordBookId: string, count: number = 20) {
    const existing = await this.db('user_word_progress')
      .where({ user_id: userId, word_book_id: wordBookId })
      .select('word_id');

    const existingIds = existing.map((e) => e.word_id);

    const items = await this.db('word_book_items')
      .where({ word_book_id: wordBookId })
      .whereNotIn('word_id', existingIds)
      .orderBy('position', 'asc')
      .limit(count);

    const wordIds = items.map((i) => i.word_id);
    const words = await this.db('words').whereIn('id', wordIds);

    return words;
  }

  async startSession(userId: string, wordBookId: string, type: string) {
    let words: any[] = [];

    if (type === 'learn') {
      words = await this.getNextNew(userId, wordBookId, 20);
    } else if (type === 'review') {
      const progress = await this.db('user_word_progress')
        .where({ user_id: userId, word_book_id: wordBookId })
        .where('status', 'in', ['learning', 'review'])
        .where('next_review', '<=', new Date())
        .orderBy('next_review', 'asc')
        .limit(20);

      const wordIds = progress.map((p) => p.word_id);
      words = await this.db('words').whereIn('id', wordIds);

      for (const p of progress) {
        if (!p.word_id) continue;
        await this.db('user_word_progress')
          .where({ user_id: userId, word_id: p.word_id, word_book_id: wordBookId })
          .first();
      }
    }

    const [session] = await this.db('learning_sessions')
      .insert({
        user_id: userId,
        word_book_id: wordBookId,
        type,
        words_total: words.length,
      })
      .returning(['id']);

    return { session_id: session.id, words };
  }

  async submitAnswer(userId: string, sessionId: string, wordId: string, answerType: string, responseTimeMs: number | null) {
    const quality = mapAnswerTypeToQuality(answerType);

    const session = await this.db('learning_sessions').where({ id: sessionId }).first();
    if (!session) throw new Error('SESSION_NOT_FOUND');

    let progress = await this.db('user_word_progress')
      .where({ user_id: userId, word_id: wordId, word_book_id: session.word_book_id })
      .first();

    if (!progress) {
      const [created] = await this.db('user_word_progress')
        .insert({
          user_id: userId,
          word_id: wordId,
          word_book_id: session.word_book_id,
          ease_factor: 2.5,
          interval: 0,
          repetitions: 0,
          status: 'new',
        })
        .returning(['*']);
      progress = created;
    }

    const result = calculateSM2(
      {
        ease_factor: Number(progress.ease_factor),
        interval: progress.interval,
        repetitions: progress.repetitions,
        status: progress.status,
      },
      quality
    );

    await this.db('user_word_progress').where({ id: progress.id }).update({
      ease_factor: result.ease_factor,
      interval: result.interval,
      repetitions: result.repetitions,
      next_review: result.next_review,
      last_review: new Date(),
      status: result.status,
    });

    const isCorrect = quality >= 3;
    await this.db('user_answers').insert({
      session_id: sessionId,
      word_id: wordId,
      user_id: userId,
      answer_type: answerType,
      response_time_ms: responseTimeMs,
      is_correct: isCorrect,
    });

    if (isCorrect) {
      await this.db('learning_sessions').where({ id: sessionId }).increment('words_correct', 1);
    } else {
      await this.db('learning_sessions').where({ id: sessionId }).increment('words_wrong', 1);
    }

    return {
      next_review: result.next_review,
      ease_factor: result.ease_factor,
      interval: result.interval,
      status: result.status,
    };
  }

  async endSession(userId: string, sessionId: string) {
    await this.db('learning_sessions').where({ id: sessionId, user_id: userId }).update({
      ended_at: new Date(),
    });

    const session = await this.db('learning_sessions').where({ id: sessionId }).first();

    const today = new Date().toISOString().split('T')[0];
    const existing = await this.db('check_ins')
      .where({ user_id: userId, check_in_date: today })
      .first();

    if (!existing) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const yesterdayCheckIn = await this.db('check_ins')
        .where({ user_id: userId, check_in_date: yesterdayStr })
        .first();

      const streakDays = yesterdayCheckIn ? yesterdayCheckIn.streak_days + 1 : 1;

      await this.db('check_ins').insert({
        user_id: userId,
        check_in_date: today,
        words_learned: session.type === 'learn' ? session.words_correct : 0,
        words_reviewed: session.type === 'review' ? session.words_correct : 0,
        streak_days: streakDays,
      });
    } else {
      const updates: any = {};
      if (session.type === 'learn') {
        updates.words_learned = existing.words_learned + session.words_correct;
      } else {
        updates.words_reviewed = existing.words_reviewed + session.words_correct;
      }
      await this.db('check_ins').where({ id: existing.id }).update(updates);
    }

    return session;
  }

  async getProgress(userId: string, wordBookId: string) {
    const total = await this.db('word_book_items')
      .where({ word_book_id: wordBookId })
      .count('* as count')
      .first();

    const byStatus = await this.db('user_word_progress')
      .where({ user_id: userId, word_book_id: wordBookId })
      .select('status')
      .count('* as count')
      .groupBy('status');

    const statusMap: Record<string, number> = { new: 0, learning: 0, review: 0, mastered: 0 };
    byStatus.forEach((row: any) => {
      statusMap[row.status] = Number(row.count);
    });

    return {
      total_words: Number(total?.count || 0),
      learned_words: statusMap.learning + statusMap.review + statusMap.mastered,
      mastered_words: statusMap.mastered,
      new_words: Number(total?.count || 0) - statusMap.learning - statusMap.review - statusMap.mastered,
    };
  }
}
```

- [ ] **Step 3: 创建学习控制器 server/src/modules/learning/learning.controller.ts**

```typescript
import { Request, Response } from 'express';
import { LearningService } from './learning.service';
import { AuthRequest } from '../../middleware/auth';
import { success, error } from '../../utils/response';

export class LearningController {
  constructor(private learningService: LearningService) {}

  async dashboard(req: AuthRequest, res: Response) {
    const data = await this.learningService.getDashboard(req.userId!);
    return success(res, data);
  }

  async nextReview(req: AuthRequest, res: Response) {
    const data = await this.learningService.getNextReview(req.userId!);
    return success(res, data);
  }

  async nextNew(req: AuthRequest, res: Response) {
    const wordBookId = req.query.word_book_id as string;
    const count = Number(req.query.count) || 20;
    if (!wordBookId) return error(res, 'MISSING_PARAM', '缺少 word_book_id 参数', 400);
    const data = await this.learningService.getNextNew(req.userId!, wordBookId, count);
    return success(res, data);
  }

  async startSession(req: AuthRequest, res: Response) {
    const { word_book_id, type } = req.body;
    if (!word_book_id || !type) return error(res, 'MISSING_PARAM', '缺少必要参数', 400);
    const data = await this.learningService.startSession(req.userId!, word_book_id, type);
    return success(res, data);
  }

  async submitAnswer(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { word_id, answer_type, response_time_ms } = req.body;
    if (!word_id || !answer_type) return error(res, 'MISSING_PARAM', '缺少必要参数', 400);
    try {
      const data = await this.learningService.submitAnswer(req.userId!, id, word_id, answer_type, response_time_ms || null);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'SESSION_NOT_FOUND') return error(res, 'NOT_FOUND', '会话不存在', 404);
      throw err;
    }
  }

  async endSession(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const data = await this.learningService.endSession(req.userId!, id);
    return success(res, data);
  }

  async getProgress(req: AuthRequest, res: Response) {
    const { word_book_id } = req.params;
    const data = await this.learningService.getProgress(req.userId!, word_book_id);
    return success(res, data);
  }
}
```

- [ ] **Step 4: 创建学习路由 server/src/modules/learning/learning.routes.ts**

```typescript
import { Router } from 'express';
import { LearningController } from './learning.controller';
import { LearningService } from './learning.service';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { Db } from '../../database/connection';

export function createLearningRoutes(db: Db) {
  const router = Router();
  const learningService = new LearningService(db);
  const learningController = new LearningController(learningService);

  router.use(authMiddleware);

  router.get('/dashboard', (req, res) => learningController.dashboard(req as AuthRequest, res));
  router.get('/next-review', (req, res) => learningController.nextReview(req as AuthRequest, res));
  router.get('/next-new', (req, res) => learningController.nextNew(req as AuthRequest, res));
  router.post('/session/start', (req, res) => learningController.startSession(req as AuthRequest, res));
  router.post('/session/:id/answer', (req, res) => learningController.submitAnswer(req as AuthRequest, res));
  router.post('/session/:id/end', (req, res) => learningController.endSession(req as AuthRequest, res));
  router.get('/progress/:word_book_id', (req, res) => learningController.getProgress(req as AuthRequest, res));

  return router;
}
```

- [ ] **Step 5: 更新 app.ts 注册学习路由**

在 `server/src/app.ts` 中添加：

```typescript
import { createLearningRoutes } from './modules/learning/learning.routes';

// 在路由注册部分添加：
app.use('/api/v1/learning', createLearningRoutes(db));
```

- [ ] **Step 6: Commit**

```bash
cd d:\Project\Word
git add .
git commit -m "feat: add SM-2 algorithm and learning module"
```

---

### Task 5: 词库管理模块

**Files:**
- Create: `server/src/modules/vocabulary/vocabulary.service.ts`
- Create: `server/src/modules/vocabulary/vocabulary.controller.ts`
- Create: `server/src/modules/vocabulary/vocabulary.routes.ts`

- [ ] **Step 1: 创建词库服务 server/src/modules/vocabulary/vocabulary.service.ts**

```typescript
import { Db } from '../../database/connection';

export class VocabularyService {
  constructor(private db: Db) {}

  async listWordBooks(filters: { search?: string; language_pair?: string; is_official?: boolean }, page: number = 1, pageSize: number = 20) {
    let query = this.db('word_books');

    if (filters.search) {
      query = query.where('name', 'ilike', `%${filters.search}%`);
    }
    if (filters.language_pair) {
      query = query.where({ language_pair: filters.language_pair });
    }
    if (filters.is_official !== undefined) {
      query = query.where({ is_official: filters.is_official });
    }

    const total = await query.clone().count('* as count').first();
    const data = await query
      .orderBy('is_official', 'desc')
      .orderBy('created_at', 'desc')
      .offset((page - 1) * pageSize)
      .limit(pageSize);

    return { data, total: Number(total?.count || 0), page, page_size: pageSize };
  }

  async getWordBook(wordBookId: string) {
    const wordBook = await this.db('word_books').where({ id: wordBookId }).first();
    if (!wordBook) return null;
    return wordBook;
  }

  async getWordBookWords(wordBookId: string, page: number = 1, pageSize: number = 20) {
    const total = await this.db('word_book_items')
      .where({ word_book_id: wordBookId })
      .count('* as count')
      .first();

    const items = await this.db('word_book_items')
      .where({ word_book_id: wordBookId })
      .orderBy('position', 'asc')
      .offset((page - 1) * pageSize)
      .limit(pageSize);

    const wordIds = items.map((i) => i.word_id);
    const words = await this.db('words').whereIn('id', wordIds);

    return { data: words, total: Number(total?.count || 0), page, page_size: pageSize };
  }

  async createWordBook(userId: string, name: string, description: string, languagePair: string) {
    const [wordBook] = await this.db('word_books')
      .insert({
        name,
        description,
        language_pair: languagePair,
        is_official: false,
        created_by: userId,
      })
      .returning(['id', 'name', 'description', 'language_pair', 'is_official', 'word_count', 'created_at']);

    return wordBook;
  }

  async updateWordBook(wordBookId: string, userId: string, updates: { name?: string; description?: string }) {
    const wordBook = await this.db('word_books').where({ id: wordBookId }).first();
    if (!wordBook) throw new Error('NOT_FOUND');
    if (wordBook.created_by !== userId) throw new Error('FORBIDDEN');

    await this.db('word_books').where({ id: wordBookId }).update({
      ...updates,
      updated_at: new Date(),
    });

    return this.db('word_books').where({ id: wordBookId }).first();
  }

  async deleteWordBook(wordBookId: string, userId: string) {
    const wordBook = await this.db('word_books').where({ id: wordBookId }).first();
    if (!wordBook) throw new Error('NOT_FOUND');
    if (wordBook.created_by !== userId) throw new Error('FORBIDDEN');
    if (wordBook.is_official) throw new Error('CANNOT_DELETE_OFFICIAL');

    await this.db('word_book_items').where({ word_book_id: wordBookId }).del();
    await this.db('word_books').where({ id: wordBookId }).del();
  }

  async importWords(wordBookId: string, words: Array<{ word: string; phonetic?: string; definitions: any }>) {
    const wordRecords = [];
    for (const w of words) {
      let existing = await this.db('words').where({ word: w.word }).first();
      if (!existing) {
        const [created] = await this.db('words')
          .insert({
            word: w.word,
            phonetic: w.phonetic || null,
            definitions: JSON.stringify(w.definitions),
            language: 'en',
          })
          .returning(['id']);
        existing = created;
      }
      wordRecords.push(existing);
    }

    const maxPos = await this.db('word_book_items')
      .where({ word_book_id: wordBookId })
      .max('position as max_pos')
      .first();

    let position = Number(maxPos?.max_pos || 0) + 1;
    for (const wr of wordRecords) {
      const exists = await this.db('word_book_items')
        .where({ word_book_id: wordBookId, word_id: wr.id })
        .first();
      if (!exists) {
        await this.db('word_book_items').insert({
          word_book_id: wordBookId,
          word_id: wr.id,
          position,
        });
        position++;
      }
    }

    await this.db('word_books').where({ id: wordBookId }).update({
      word_count: this.db('word_book_items').where({ word_book_id: wordBookId }).count('*'),
      updated_at: new Date(),
    });

    return { imported: wordRecords.length };
  }

  async subscribe(userId: string, wordBookId: string) {
    const wordBook = await this.db('word_books').where({ id: wordBookId }).first();
    if (!wordBook) throw new Error('NOT_FOUND');

    const items = await this.db('word_book_items')
      .where({ word_book_id: wordBookId })
      .select('word_id');

    for (const item of items) {
      const existing = await this.db('user_word_progress')
        .where({ user_id: userId, word_id: item.word_id, word_book_id: wordBookId })
        .first();
      if (!existing) {
        await this.db('user_word_progress').insert({
          user_id: userId,
          word_id: item.word_id,
          word_book_id: wordBookId,
          ease_factor: 2.5,
          interval: 0,
          repetitions: 0,
          status: 'new',
        });
      }
    }
  }

  async unsubscribe(userId: string, wordBookId: string) {
    await this.db('user_word_progress')
      .where({ user_id: userId, word_book_id: wordBookId })
      .del();
  }
}
```

- [ ] **Step 2: 创建词库控制器 server/src/modules/vocabulary/vocabulary.controller.ts**

```typescript
import { Request, Response } from 'express';
import { VocabularyService } from './vocabulary.service';
import { AuthRequest } from '../../middleware/auth';
import { success, error } from '../../utils/response';

export class VocabularyController {
  constructor(private vocabularyService: VocabularyService) {}

  async list(req: Request, res: Response) {
    const { search, language_pair, is_official, page, page_size } = req.query;
    const result = await this.vocabularyService.listWordBooks(
      {
        search: search as string,
        language_pair: language_pair as string,
        is_official: is_official === 'true' ? true : is_official === 'false' ? false : undefined,
      },
      Number(page) || 1,
      Number(page_size) || 20
    );
    return success(res, result.data, 200);
  }

  async get(req: Request, res: Response) {
    const data = await this.vocabularyService.getWordBook(req.params.id);
    if (!data) return error(res, 'NOT_FOUND', '词库不存在', 404);
    return success(res, data);
  }

  async getWords(req: Request, res: Response) {
    const { page, page_size } = req.query;
    const result = await this.vocabularyService.getWordBookWords(
      req.params.id,
      Number(page) || 1,
      Number(page_size) || 20
    );
    return success(res, result.data, 200);
  }

  async create(req: AuthRequest, res: Response) {
    const { name, description, language_pair } = req.body;
    const data = await this.vocabularyService.createWordBook(
      req.userId!,
      name,
      description || '',
      language_pair || 'en-zh'
    );
    return success(res, data, 201);
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const data = await this.vocabularyService.updateWordBook(req.params.id, req.userId!, req.body);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') return error(res, 'NOT_FOUND', '词库不存在', 404);
      if (err.message === 'FORBIDDEN') return error(res, 'FORBIDDEN', '无权限修改此词库', 403);
      throw err;
    }
  }

  async remove(req: AuthRequest, res: Response) {
    try {
      await this.vocabularyService.deleteWordBook(req.params.id, req.userId!);
      return success(res, { message: '已删除' });
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') return error(res, 'NOT_FOUND', '词库不存在', 404);
      if (err.message === 'FORBIDDEN') return error(res, 'FORBIDDEN', '无权限删除此词库', 403);
      if (err.message === 'CANNOT_DELETE_OFFICIAL') return error(res, 'FORBIDDEN', '不能删除官方词库', 403);
      throw err;
    }
  }

  async importWords(req: AuthRequest, res: Response) {
    const { words } = req.body;
    if (!Array.isArray(words)) return error(res, 'VALIDATION_ERROR', 'words 必须是数组', 400);
    const data = await this.vocabularyService.importWords(req.params.id, words);
    return success(res, data);
  }

  async subscribe(req: AuthRequest, res: Response) {
    try {
      await this.vocabularyService.subscribe(req.userId!, req.params.id);
      return success(res, { message: '已订阅' });
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') return error(res, 'NOT_FOUND', '词库不存在', 404);
      throw err;
    }
  }

  async unsubscribe(req: AuthRequest, res: Response) {
    await this.vocabularyService.unsubscribe(req.userId!, req.params.id);
    return success(res, { message: '已取消订阅' });
  }
}
```

- [ ] **Step 3: 创建词库路由 server/src/modules/vocabulary/vocabulary.routes.ts**

```typescript
import { Router } from 'express';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyService } from './vocabulary.service';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { Db } from '../../database/connection';

export function createVocabularyRoutes(db: Db) {
  const router = Router();
  const vocabularyService = new VocabularyService(db);
  const vocabularyController = new VocabularyController(vocabularyService);

  router.get('/', (req, res) => vocabularyController.list(req, res));
  router.get('/:id', (req, res) => vocabularyController.get(req, res));
  router.get('/:id/words', (req, res) => vocabularyController.getWords(req, res));
  router.post('/', authMiddleware, (req, res) => vocabularyController.create(req as AuthRequest, res));
  router.put('/:id', authMiddleware, (req, res) => vocabularyController.update(req as AuthRequest, res));
  router.delete('/:id', authMiddleware, (req, res) => vocabularyController.remove(req as AuthRequest, res));
  router.post('/:id/import', authMiddleware, (req, res) => vocabularyController.importWords(req as AuthRequest, res));
  router.post('/:id/subscribe', authMiddleware, (req, res) => vocabularyController.subscribe(req as AuthRequest, res));
  router.delete('/:id/subscribe', authMiddleware, (req, res) => vocabularyController.unsubscribe(req as AuthRequest, res));

  return router;
}
```

- [ ] **Step 4: 更新 app.ts 注册词库路由**

在 `server/src/app.ts` 中添加：

```typescript
import { createVocabularyRoutes } from './modules/vocabulary/vocabulary.routes';

// 在路由注册部分添加：
app.use('/api/v1/word-books', createVocabularyRoutes(db));
```

- [ ] **Step 5: Commit**

```bash
cd d:\Project\Word
git add .
git commit -m "feat: add vocabulary module with CRUD, import, subscribe"
```

---

### Task 6: 统计、成就、社交、媒体模块

**Files:**
- Create: `server/src/modules/stats/stats.service.ts`
- Create: `server/src/modules/stats/stats.controller.ts`
- Create: `server/src/modules/stats/stats.routes.ts`
- Create: `server/src/modules/achievement/achievement.service.ts`
- Create: `server/src/modules/achievement/achievement.controller.ts`
- Create: `server/src/modules/achievement/achievement.routes.ts`
- Create: `server/src/modules/social/social.service.ts`
- Create: `server/src/modules/social/social.controller.ts`
- Create: `server/src/modules/social/social.routes.ts`
- Create: `server/src/modules/media/media.service.ts`
- Create: `server/src/modules/media/media.controller.ts`
- Create: `server/src/modules/media/media.routes.ts`

- [ ] **Step 1: 创建统计服务 server/src/modules/stats/stats.service.ts**

```typescript
import { Db } from '../../database/connection';

export class StatsService {
  constructor(private db: Db) {}

  async getOverview(userId: string) {
    const totalLearned = await this.db('user_word_progress')
      .where({ user_id: userId })
      .whereNot('status', 'new')
      .count('* as count')
      .first();

    const totalMastered = await this.db('user_word_progress')
      .where({ user_id: userId, status: 'mastered' })
      .count('* as count')
      .first();

    const totalDays = await this.db('check_ins')
      .where({ user_id: userId })
      .countDistinct('check_in_date as count')
      .first();

    const totalReviews = await this.db('user_answers')
      .where({ user_id: userId, is_correct: true })
      .count('* as count')
      .first();

    const totalAnswers = await this.db('user_answers')
      .where({ user_id: userId })
      .count('* as count')
      .first();

    return {
      total_words_learned: Number(totalLearned?.count || 0),
      total_words_mastered: Number(totalMastered?.count || 0),
      total_learning_days: Number(totalDays?.count || 0),
      total_reviews: Number(totalReviews?.count || 0),
      average_accuracy: totalAnswers?.count ? Math.round((Number(totalReviews?.count || 0) / Number(totalAnswers.count)) * 100) : 0,
    };
  }

  async getDaily(userId: string, startDate: string, endDate: string) {
    const data = await this.db('check_ins')
      .where({ user_id: userId })
      .whereBetween('check_in_date', [startDate, endDate])
      .orderBy('check_in_date', 'asc');

    return data;
  }

  async getWordBookStats(userId: string, wordBookId: string) {
    const byStatus = await this.db('user_word_progress')
      .where({ user_id: userId, word_book_id: wordBookId })
      .select('status')
      .count('* as count')
      .groupBy('status');

    const statusMap: Record<string, number> = { new: 0, learning: 0, review: 0, mastered: 0 };
    byStatus.forEach((row: any) => {
      statusMap[row.status] = Number(row.count);
    });

    const sessions = await this.db('learning_sessions')
      .where({ user_id: userId, word_book_id: wordBookId })
      .count('* as count')
      .first();

    return {
      ...statusMap,
      total_sessions: Number(sessions?.count || 0),
    };
  }

  async getTrend(userId: string, period: string) {
    const days = period === '90d' ? 90 : period === '30d' ? 30 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const data = await this.db('check_ins')
      .where({ user_id: userId })
      .where('check_in_date', '>=', startDateStr)
      .orderBy('check_in_date', 'asc');

    return data;
  }
}
```

- [ ] **Step 2: 创建统计控制器和路由**

`server/src/modules/stats/stats.controller.ts`:
```typescript
import { Response } from 'express';
import { StatsService } from './stats.service';
import { AuthRequest } from '../../middleware/auth';
import { success, error } from '../../utils/response';

export class StatsController {
  constructor(private statsService: StatsService) {}

  async overview(req: AuthRequest, res: Response) {
    const data = await this.statsService.getOverview(req.userId!);
    return success(res, data);
  }

  async daily(req: AuthRequest, res: Response) {
    const { start_date, end_date } = req.query;
    if (!start_date || !end_date) return error(res, 'MISSING_PARAM', '缺少日期参数', 400);
    const data = await this.statsService.getDaily(req.userId!, start_date as string, end_date as string);
    return success(res, data);
  }

  async wordBookStats(req: AuthRequest, res: Response) {
    const data = await this.statsService.getWordBookStats(req.userId!, req.params.id);
    return success(res, data);
  }

  async trend(req: AuthRequest, res: Response) {
    const period = (req.query.period as string) || '7d';
    const data = await this.statsService.getTrend(req.userId!, period);
    return success(res, data);
  }
}
```

`server/src/modules/stats/stats.routes.ts`:
```typescript
import { Router } from 'express';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { Db } from '../../database/connection';

export function createStatsRoutes(db: Db) {
  const router = Router();
  const statsService = new StatsService(db);
  const statsController = new StatsController(statsService);

  router.use(authMiddleware);

  router.get('/overview', (req, res) => statsController.overview(req as AuthRequest, res));
  router.get('/daily', (req, res) => statsController.daily(req as AuthRequest, res));
  router.get('/word-book/:id', (req, res) => statsController.wordBookStats(req as AuthRequest, res));
  router.get('/trend', (req, res) => statsController.trend(req as AuthRequest, res));

  return router;
}
```

- [ ] **Step 3: 创建成就服务、控制器和路由**

`server/src/modules/achievement/achievement.service.ts`:
```typescript
import { Db } from '../../database/connection';

export class AchievementService {
  constructor(private db: Db) {}

  async listAchievements() {
    return this.db('achievements').orderBy('created_at', 'asc');
  }

  async getUserAchievements(userId: string) {
    const all = await this.db('achievements').orderBy('created_at', 'asc');
    const unlocked = await this.db('user_achievements')
      .where({ user_id: userId })
      .select('achievement_id', 'unlocked_at');

    const unlockedMap = new Map(unlocked.map((u) => [u.achievement_id, u.unlocked_at]));

    return all.map((a) => ({
      ...a,
      unlocked: unlockedMap.has(a.id),
      unlocked_at: unlockedMap.get(a.id) || null,
    }));
  }

  async checkAndUnlock(userId: string) {
    const overview = await this.getOverviewStats(userId);
    const allAchievements = await this.db('achievements');
    const unlocked = await this.db('user_achievements')
      .where({ user_id: userId })
      .select('achievement_id');

    const unlockedIds = new Set(unlocked.map((u) => u.achievement_id));
    const newlyUnlocked = [];

    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement.id)) continue;
      const condition = typeof achievement.condition === 'string' ? JSON.parse(achievement.condition) : achievement.condition;
      if (this.meetsCondition(condition, overview)) {
        await this.db('user_achievements').insert({
          user_id: userId,
          achievement_id: achievement.id,
        });
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  }

  async checkIn(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const existing = await this.db('check_ins')
      .where({ user_id: userId, check_in_date: today })
      .first();

    if (existing) return existing;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yesterdayCheckIn = await this.db('check_ins')
      .where({ user_id: userId, check_in_date: yesterdayStr })
      .first();

    const streakDays = yesterdayCheckIn ? yesterdayCheckIn.streak_days + 1 : 1;

    const [checkIn] = await this.db('check_ins')
      .insert({
        user_id: userId,
        check_in_date: today,
        streak_days: streakDays,
      })
      .returning(['*']);

    await this.checkAndUnlock(userId);

    return checkIn;
  }

  async getCheckIns(userId: string, month: string) {
    const startDate = `${month}-01`;
    const [year, mon] = month.split('-').map(Number);
    const endDate = new Date(year, mon, 0).toISOString().split('T')[0];

    return this.db('check_ins')
      .where({ user_id: userId })
      .whereBetween('check_in_date', [startDate, endDate])
      .orderBy('check_in_date', 'asc');
  }

  private async getOverviewStats(userId: string) {
    const totalWords = await this.db('user_word_progress')
      .where({ user_id: userId })
      .whereNot('status', 'new')
      .count('* as count')
      .first();

    const streakDays = await this.db('check_ins')
      .where({ user_id: userId })
      .max('streak_days as max_streak')
      .first();

    const perfectSessions = await this.db('learning_sessions')
      .where({ user_id: userId })
      .whereRaw('words_total > 0 AND words_correct = words_total')
      .count('* as count')
      .first();

    return {
      total_words: Number(totalWords?.count || 0),
      streak_days: Number(streakDays?.max_streak || 0),
      perfect_sessions: Number(perfectSessions?.count || 0),
    };
  }

  private meetsCondition(condition: any, stats: any): boolean {
    switch (condition.type) {
      case 'total_words': return stats.total_words >= condition.threshold;
      case 'streak_days': return stats.streak_days >= condition.threshold;
      case 'perfect_session': return stats.perfect_sessions >= condition.threshold;
      default: return false;
    }
  }
}
```

`server/src/modules/achievement/achievement.controller.ts`:
```typescript
import { Response } from 'express';
import { AchievementService } from './achievement.service';
import { AuthRequest } from '../../middleware/auth';
import { success } from '../../utils/response';

export class AchievementController {
  constructor(private achievementService: AchievementService) {}

  async list(req: AuthRequest, res: Response) {
    const data = await this.achievementService.listAchievements();
    return success(res, data);
  }

  async mine(req: AuthRequest, res: Response) {
    const data = await this.achievementService.getUserAchievements(req.userId!);
    return success(res, data);
  }

  async checkIn(req: AuthRequest, res: Response) {
    const data = await this.achievementService.checkIn(req.userId!);
    return success(res, data);
  }

  async getCheckIns(req: AuthRequest, res: Response) {
    const month = (req.query.month as string) || new Date().toISOString().slice(0, 7);
    const data = await this.achievementService.getCheckIns(req.userId!, month);
    return success(res, data);
  }
}
```

`server/src/modules/achievement/achievement.routes.ts`:
```typescript
import { Router } from 'express';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { Db } from '../../database/connection';

export function createAchievementRoutes(db: Db) {
  const router = Router();
  const achievementService = new AchievementService(db);
  const achievementController = new AchievementController(achievementService);

  router.use(authMiddleware);

  router.get('/achievements', (req, res) => achievementController.list(req as AuthRequest, res));
  router.get('/achievements/mine', (req, res) => achievementController.mine(req as AuthRequest, res));
  router.get('/check-ins', (req, res) => achievementController.getCheckIns(req as AuthRequest, res));
  router.post('/check-ins', (req, res) => achievementController.checkIn(req as AuthRequest, res));

  return router;
}
```

- [ ] **Step 4: 创建社交服务、控制器和路由**

`server/src/modules/social/social.service.ts`:
```typescript
import { Db } from '../../database/connection';
import crypto from 'crypto';

export class SocialService {
  constructor(private db: Db) {}

  async createShare(userId: string, type: string, content: any) {
    const shareId = crypto.randomUUID();
    const [share] = await this.db('social_shares')
      .insert({
        id: shareId,
        user_id: userId,
        type,
        content: JSON.stringify(content),
      })
      .returning(['*']);

    return share;
  }

  async getShare(shareId: string) {
    const share = await this.db('social_shares').where({ id: shareId }).first();
    if (!share) return null;

    const user = await this.db('users').where({ id: share.user_id }).first();
    return {
      ...share,
      user: user ? { nickname: user.nickname, avatar_url: user.avatar_url } : null,
    };
  }

  async recommendWordBook(userId: string, wordBookId: string) {
    const wordBook = await this.db('word_books').where({ id: wordBookId }).first();
    if (!wordBook) throw new Error('NOT_FOUND');

    await this.db('word_books').where({ id: wordBookId }).increment('recommend_count', 1);

    return { recommended: true };
  }
}
```

`server/src/modules/social/social.controller.ts`:
```typescript
import { Response } from 'express';
import { SocialService } from './social.service';
import { AuthRequest } from '../../middleware/auth';
import { success, error } from '../../utils/response';

export class SocialController {
  constructor(private socialService: SocialService) {}

  async share(req: AuthRequest, res: Response) {
    const { type, content } = req.body;
    const data = await this.socialService.createShare(req.userId!, type, content);
    return success(res, data, 201);
  }

  async getShare(req: AuthRequest, res: Response) {
    const data = await this.socialService.getShare(req.params.id);
    if (!data) return error(res, 'NOT_FOUND', '分享不存在', 404);
    return success(res, data);
  }

  async recommend(req: AuthRequest, res: Response) {
    try {
      const data = await this.socialService.recommendWordBook(req.userId!, req.params.word_book_id);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') return error(res, 'NOT_FOUND', '词库不存在', 404);
      throw err;
    }
  }
}
```

`server/src/modules/social/social.routes.ts`:
```typescript
import { Router } from 'express';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { Db } from '../../database/connection';

export function createSocialRoutes(db: Db) {
  const router = Router();
  const socialService = new SocialService(db);
  const socialController = new SocialController(socialService);

  router.post('/share', authMiddleware, (req, res) => socialController.share(req as AuthRequest, res));
  router.get('/share/:id', (req, res) => socialController.getShare(req as AuthRequest, res));
  router.post('/recommend/:word_book_id', authMiddleware, (req, res) => socialController.recommend(req as AuthRequest, res));

  return router;
}
```

- [ ] **Step 5: 创建媒体服务、控制器和路由**

`server/src/modules/media/media.service.ts`:
```typescript
import { Db } from '../../database/connection';

export class MediaService {
  constructor(private db: Db) {}

  async getPronunciation(wordId: string) {
    const word = await this.db('words').where({ id: wordId }).first();
    if (!word) throw new Error('NOT_FOUND');
    return {
      word: word.word,
      phonetic: word.phonetic,
      audio_url: word.audio_url || `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word.word)}&type=2`,
    };
  }

  async generateListeningQuiz(userId: string, wordBookId: string, count: number = 10) {
    const progress = await this.db('user_word_progress')
      .where({ user_id: userId, word_book_id: wordBookId })
      .whereNot('status', 'new')
      .limit(count);

    const wordIds = progress.map((p) => p.word_id);
    const words = await this.db('words').whereIn('id', wordIds);

    const allWords = await this.db('word_book_items')
      .where({ word_book_id: wordBookId })
      .select('word_id');
    const allWordIds = allWords.map((w) => w.word_id);

    const quizzes = words.map((word) => {
      const distractors = allWordIds
        .filter((id) => id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      return {
        word_id: word.id,
        audio_url: word.audio_url || `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word.word)}&type=2`,
        correct_meaning: word.definitions[0]?.meaning || '',
        options: [
          word.definitions[0]?.meaning || '',
          ...distractors.map(() => '选项'),
        ].sort(() => Math.random() - 0.5),
      };
    });

    return quizzes;
  }

  async generateSpellingQuiz(userId: string, wordBookId: string, count: number = 10) {
    const progress = await this.db('user_word_progress')
      .where({ user_id: userId, word_book_id: wordBookId })
      .whereNot('status', 'new')
      .limit(count);

    const wordIds = progress.map((p) => p.word_id);
    const words = await this.db('words').whereIn('id', wordIds);

    return words.map((word) => ({
      word_id: word.id,
      meaning: word.definitions[0]?.meaning || '',
      hint: word.word[0] + '_'.repeat(word.word.length - 1),
      answer: word.word,
      phonetic: word.phonetic,
    }));
  }
}
```

`server/src/modules/media/media.controller.ts`:
```typescript
import { Response } from 'express';
import { MediaService } from './media.service';
import { AuthRequest } from '../../middleware/auth';
import { success, error } from '../../utils/response';

export class MediaController {
  constructor(private mediaService: MediaService) {}

  async pronounce(req: AuthRequest, res: Response) {
    try {
      const data = await this.mediaService.getPronunciation(req.params.word_id);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') return error(res, 'NOT_FOUND', '单词不存在', 404);
      throw err;
    }
  }

  async listeningQuiz(req: AuthRequest, res: Response) {
    const { word_book_id, count } = req.body;
    if (!word_book_id) return error(res, 'MISSING_PARAM', '缺少 word_book_id', 400);
    const data = await this.mediaService.generateListeningQuiz(req.userId!, word_book_id, count || 10);
    return success(res, data);
  }

  async spellingQuiz(req: AuthRequest, res: Response) {
    const { word_book_id, count } = req.body;
    if (!word_book_id) return error(res, 'MISSING_PARAM', '缺少 word_book_id', 400);
    const data = await this.mediaService.generateSpellingQuiz(req.userId!, word_book_id, count || 10);
    return success(res, data);
  }
}
```

`server/src/modules/media/media.routes.ts`:
```typescript
import { Router } from 'express';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { Db } from '../../database/connection';

export function createMediaRoutes(db: Db) {
  const router = Router();
  const mediaService = new MediaService(db);
  const mediaController = new MediaController(mediaService);

  router.use(authMiddleware);

  router.get('/pronounce/:word_id', (req, res) => mediaController.pronounce(req as AuthRequest, res));
  router.post('/listening-quiz', (req, res) => mediaController.listeningQuiz(req as AuthRequest, res));
  router.post('/spelling-quiz', (req, res) => mediaController.spellingQuiz(req as AuthRequest, res));

  return router;
}
```

- [ ] **Step 6: 添加 social_shares 迁移**

创建 `server/src/database/migrations/011_create_social_shares.ts`:
```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('social_shares', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').notNullable();
    table.string('type', 50).notNullable();
    table.jsonb('content').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('social_shares');
}
```

- [ ] **Step 7: 更新 app.ts 注册所有路由**

完整更新 `server/src/app.ts`:
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { createDb } from './database/connection';
import { createAuthRoutes } from './modules/auth/auth.routes';
import { createLearningRoutes } from './modules/learning/learning.routes';
import { createVocabularyRoutes } from './modules/vocabulary/vocabulary.routes';
import { createStatsRoutes } from './modules/stats/stats.routes';
import { createAchievementRoutes } from './modules/achievement/achievement.routes';
import { createSocialRoutes } from './modules/social/social.routes';
import { createMediaRoutes } from './modules/media/media.routes';
import { generalLimiter } from './middleware/rateLimiter';

export function createApp() {
  const app = express();
  const db = createDb();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(generalLimiter);

  app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/v1/auth', createAuthRoutes(db));
  app.use('/api/v1/learning', createLearningRoutes(db));
  app.use('/api/v1/word-books', createVocabularyRoutes(db));
  app.use('/api/v1/stats', createStatsRoutes(db));
  app.use('/api/v1', createAchievementRoutes(db));
  app.use('/api/v1/social', createSocialRoutes(db));
  app.use('/api/v1/media', createMediaRoutes(db));

  app.use(errorHandler);

  return app;
}
```

- [ ] **Step 8: Commit**

```bash
cd d:\Project\Word
git add .
git commit -m "feat: add stats, achievement, social, media modules"
```

---

### Task 7: 前端页面与组件

**Files:**
- Create: `client/src/contexts/AuthContext.tsx`
- Create: `client/src/contexts/LearningContext.tsx`
- Create: `client/src/components/FlashCard.tsx`
- Create: `client/src/components/RatingButtons.tsx`
- Create: `client/src/components/ProgressBar.tsx`
- Create: `client/src/components/WordBookCard.tsx`
- Create: `client/src/pages/Login.tsx`
- Create: `client/src/pages/Register.tsx`
- Create: `client/src/pages/Dashboard.tsx`
- Create: `client/src/pages/Learn.tsx`
- Create: `client/src/pages/Review.tsx`
- Create: `client/src/pages/Vocabulary.tsx`
- Create: `client/src/pages/Stats.tsx`
- Create: `client/src/pages/Achievements.tsx`
- Create: `client/src/pages/Settings.tsx`

- [ ] **Step 1: 创建 AuthContext client/src/contexts/AuthContext.tsx**

```tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      api.get('/user/profile')
        .then((res) => setUser(res.data.data))
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('access_token', data.data.access_token);
    localStorage.setItem('refresh_token', data.data.refresh_token);
    setUser(data.data.user);
  };

  const register = async (email: string, password: string, nickname: string) => {
    const { data } = await api.post('/auth/register', { email, password, nickname });
    localStorage.setItem('access_token', data.data.access_token);
    localStorage.setItem('refresh_token', data.data.refresh_token);
    setUser(data.data.user);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

- [ ] **Step 2: 创建 FlashCard 组件 client/src/components/FlashCard.tsx**

```tsx
import React, { useState } from 'react';
import { Word } from '../types';

interface FlashCardProps {
  word: Word;
  onFlip?: () => void;
}

const FlashCard: React.FC<FlashCardProps> = ({ word, onFlip }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
    if (!flipped && onFlip) onFlip();
  };

  return (
    <div
      onClick={handleFlip}
      style={{
        width: '100%',
        maxWidth: 480,
        height: 320,
        perspective: 1000,
        cursor: 'pointer',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
            padding: 32,
          }}
        >
          <h1 style={{ fontSize: 48, margin: 0, color: '#1a1a2e' }}>{word.word}</h1>
          {word.phonetic && <p style={{ fontSize: 18, color: '#666', marginTop: 8 }}>{word.phonetic}</p>}
          <p style={{ fontSize: 14, color: '#999', marginTop: 24 }}>点击翻转查看释义</p>
        </div>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
            padding: 32,
            overflowY: 'auto',
          }}
        >
          <h2 style={{ fontSize: 28, margin: 0, color: '#1a1a2e' }}>{word.word}</h2>
          <div style={{ marginTop: 16, textAlign: 'left', width: '100%' }}>
            {word.definitions.map((def, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <span style={{ color: '#6c63ff', fontWeight: 600, marginRight: 8 }}>{def.pos}</span>
                <span style={{ fontSize: 18, color: '#333' }}>{def.meaning}</span>
                {def.examples && def.examples.map((ex, j) => (
                  <div key={j} style={{ marginTop: 4, paddingLeft: 16, color: '#888', fontSize: 14 }}>
                    <div>{ex.en}</div>
                    <div>{ex.zh}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
```

- [ ] **Step 3: 创建 RatingButtons 组件 client/src/components/RatingButtons.tsx**

```tsx
import React from 'react';

interface RatingButtonsProps {
  onRate: (answerType: 'again' | 'hard' | 'good' | 'easy') => void;
  disabled?: boolean;
}

const buttons = [
  { type: 'again' as const, label: '不认识', color: '#e74c3c', desc: '< 1分钟' },
  { type: 'hard' as const, label: '模糊', color: '#f39c12', desc: '< 6天' },
  { type: 'good' as const, label: '记得', color: '#2ecc71', desc: '< 1月' },
  { type: 'easy' as const, label: '很熟', color: '#6c63ff', desc: '< 4月' },
];

const RatingButtons: React.FC<RatingButtonsProps> = ({ onRate, disabled }) => {
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
      {buttons.map((btn) => (
        <button
          key={btn.type}
          onClick={() => onRate(btn.type)}
          disabled={disabled}
          style={{
            padding: '12px 20px',
            borderRadius: 12,
            border: `2px solid ${btn.color}`,
            backgroundColor: 'transparent',
            color: btn.color,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            minWidth: 80,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              (e.target as HTMLElement).style.backgroundColor = btn.color;
              (e.target as HTMLElement).style.color = '#fff';
            }
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = 'transparent';
            (e.target as HTMLElement).style.color = btn.color;
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 16 }}>{btn.label}</span>
          <span style={{ fontSize: 12 }}>{btn.desc}</span>
        </button>
      ))}
    </div>
  );
};

export default RatingButtons;
```

- [ ] **Step 4: 创建 ProgressBar 组件 client/src/components/ProgressBar.tsx**

```tsx
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 14, color: '#666' }}>{current} / {total}</span>
        <span style={{ fontSize: 14, color: '#6c63ff', fontWeight: 600 }}>{percent}%</span>
      </div>
      <div style={{ width: '100%', height: 8, backgroundColor: '#eee', borderRadius: 4 }}>
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            backgroundColor: '#6c63ff',
            borderRadius: 4,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
```

- [ ] **Step 5: 创建 WordBookCard 组件 client/src/components/WordBookCard.tsx**

```tsx
import React from 'react';
import { WordBook } from '../types';

interface WordBookCardProps {
  wordBook: WordBook;
  onSubscribe?: (id: string) => void;
  onClick?: (id: string) => void;
}

const WordBookCard: React.FC<WordBookCardProps> = ({ wordBook, onSubscribe, onClick }) => {
  return (
    <div
      onClick={() => onClick?.(wordBook.id)}
      style={{
        border: '1px solid #eee',
        borderRadius: 12,
        padding: 20,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        backgroundColor: '#fff',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, color: '#1a1a2e' }}>{wordBook.name}</h3>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#888' }}>{wordBook.description}</p>
        </div>
        {wordBook.is_official && (
          <span style={{ fontSize: 12, backgroundColor: '#6c63ff', color: '#fff', padding: '2px 8px', borderRadius: 4 }}>
            官方
          </span>
        )}
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 14, color: '#666' }}>
        <span>{wordBook.word_count} 词</span>
        <span>{wordBook.language_pair}</span>
      </div>
      {!wordBook.subscribed && onSubscribe && (
        <button
          onClick={(e) => { e.stopPropagation(); onSubscribe(wordBook.id); }}
          style={{
            marginTop: 12,
            padding: '6px 16px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: '#6c63ff',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          订阅学习
        </button>
      )}
    </div>
  );
};

export default WordBookCard;
```

- [ ] **Step 6: 创建 Login 页面 client/src/pages/Login.tsx**

```tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    try {
      await login(email, password);
      navigate('/');
    } catch (any: any) {
      setErr(any.response?.data?.error?.message || '登录失败');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 32 }}>
      <h1 style={{ textAlign: 'center', color: '#1a1a2e' }}>WordMaster</h1>
      <h2 style={{ textAlign: 'center', color: '#666', fontWeight: 400 }}>登录</h2>
      {err && <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: 16 }}>{err}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <input
            type="email" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box' }}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box' }}
            required
          />
        </div>
        <button type="submit" style={{
          width: '100%', padding: 12, borderRadius: 8, border: 'none',
          backgroundColor: '#6c63ff', color: '#fff', fontSize: 16, cursor: 'pointer',
        }}>
          登录
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 16, color: '#888' }}>
        还没有账号？<Link to="/register" style={{ color: '#6c63ff' }}>注册</Link>
      </p>
    </div>
  );
};

export default Login;
```

- [ ] **Step 7: 创建 Register 页面 client/src/pages/Register.tsx**

```tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [err, setErr] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    try {
      await register(email, password, nickname);
      navigate('/');
    } catch (any: any) {
      setErr(any.response?.data?.error?.message || '注册失败');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 32 }}>
      <h1 style={{ textAlign: 'center', color: '#1a1a2e' }}>WordMaster</h1>
      <h2 style={{ textAlign: 'center', color: '#666', fontWeight: 400 }}>注册</h2>
      {err && <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: 16 }}>{err}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <input type="email" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box' }} required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input type="text" placeholder="昵称" value={nickname} onChange={(e) => setNickname(e.target.value)}
            style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box' }} required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input type="password" placeholder="密码（至少8位）" value={password} onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box' }} required minLength={8} />
        </div>
        <button type="submit" style={{
          width: '100%', padding: 12, borderRadius: 8, border: 'none',
          backgroundColor: '#6c63ff', color: '#fff', fontSize: 16, cursor: 'pointer',
        }}>
          注册
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 16, color: '#888' }}>
        已有账号？<Link to="/login" style={{ color: '#6c63ff' }}>登录</Link>
      </p>
    </div>
  );
};

export default Register;
```

- [ ] **Step 8: 创建 Dashboard 页面 client/src/pages/Dashboard.tsx**

```tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Dashboard as DashboardData } from '../types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get('/learning/dashboard').then((res) => setData(res.data.data)).catch(() => {});
  }, []);

  if (!user) { navigate('/login'); return null; }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0, color: '#1a1a2e' }}>你好，{user.nickname} 👋</h1>
          <p style={{ margin: '4px 0 0', color: '#888' }}>今天也要加油背单词哦</p>
        </div>
        <button onClick={logout} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer' }}>
          退出
        </button>
      </div>

      {data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            <div style={{ padding: 20, borderRadius: 12, backgroundColor: '#f0eeff', textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#6c63ff' }}>{data.words_to_review}</div>
              <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>待复习</div>
            </div>
            <div style={{ padding: 20, borderRadius: 12, backgroundColor: '#e8f8f0', textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#2ecc71' }}>{data.words_to_learn}</div>
              <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>待学习</div>
            </div>
            <div style={{ padding: 20, borderRadius: 12, backgroundColor: '#fff3e0', textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#f39c12' }}>{data.streak_days}</div>
              <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>连续打卡</div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <h3>今日目标</h3>
            <div style={{ width: '100%', height: 12, backgroundColor: '#eee', borderRadius: 6, marginTop: 8 }}>
              <div style={{ width: `${data.daily_goal_progress}%`, height: '100%', backgroundColor: '#6c63ff', borderRadius: 6, transition: 'width 0.3s' }} />
            </div>
            <p style={{ fontSize: 14, color: '#888', marginTop: 4 }}>
              已完成 {data.today_learned + data.today_reviewed} / {data.daily_goal} 词
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={() => navigate('/learn')} style={{
              flex: 1, padding: 16, borderRadius: 12, border: 'none',
              backgroundColor: '#6c63ff', color: '#fff', fontSize: 18, cursor: 'pointer',
            }}>
              开始学习
            </button>
            <button onClick={() => navigate('/review')} style={{
              flex: 1, padding: 16, borderRadius: 12, border: 'none',
              backgroundColor: '#2ecc71', color: '#fff', fontSize: 18, cursor: 'pointer',
            }}>
              开始复习
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
```

- [ ] **Step 9: 创建 Learn 页面 client/src/pages/Learn.tsx**

```tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Word } from '../types';
import FlashCard from '../components/FlashCard';
import RatingButtons from '../components/RatingButtons';
import ProgressBar from '../components/ProgressBar';

const Learn: React.FC = () => {
  const navigate = useNavigate();
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string>('');
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const wordBookId = localStorage.getItem('current_word_book_id');
    if (!wordBookId) { navigate('/vocabulary'); return; }
    api.post('/learning/session/start', { word_book_id: wordBookId, type: 'learn' })
      .then((res) => {
        setWords(res.data.data.words);
        setSessionId(res.data.data.session_id);
        setLoading(false);
      })
      .catch(() => navigate('/'));
  }, [navigate]);

  const handleRate = useCallback(async (answerType: 'again' | 'hard' | 'good' | 'easy') => {
    if (!sessionId || currentIndex >= words.length) return;
    const word = words[currentIndex];
    await api.post(`/learning/session/${sessionId}/answer`, {
      word_id: word.id,
      answer_type: answerType,
    });

    if (currentIndex + 1 >= words.length) {
      await api.post(`/learning/session/${sessionId}/end`);
      navigate('/');
    } else {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  }, [sessionId, currentIndex, words, navigate]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80, fontSize: 18, color: '#888' }}>加载中...</div>;
  if (words.length === 0) return <div style={{ textAlign: 'center', marginTop: 80 }}><p>没有新单词了</p><button onClick={() => navigate('/')}>返回首页</button></div>;

  const currentWord = words[currentIndex];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <ProgressBar current={currentIndex + 1} total={words.length} />
      <div style={{ marginTop: 24 }}>
        <FlashCard word={currentWord} onFlip={() => setFlipped(true)} />
      </div>
      {flipped && <RatingButtons onRate={handleRate} />}
    </div>
  );
};

export default Learn;
```

- [ ] **Step 10: 创建 Review 页面 client/src/pages/Review.tsx**

```tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Word } from '../types';
import FlashCard from '../components/FlashCard';
import RatingButtons from '../components/RatingButtons';
import ProgressBar from '../components/ProgressBar';

const Review: React.FC = () => {
  const navigate = useNavigate();
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string>('');
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const wordBookId = localStorage.getItem('current_word_book_id');
    if (!wordBookId) { navigate('/vocabulary'); return; }
    api.post('/learning/session/start', { word_book_id: wordBookId, type: 'review' })
      .then((res) => {
        setWords(res.data.data.words);
        setSessionId(res.data.data.session_id);
        setLoading(false);
      })
      .catch(() => navigate('/'));
  }, [navigate]);

  const handleRate = useCallback(async (answerType: 'again' | 'hard' | 'good' | 'easy') => {
    if (!sessionId || currentIndex >= words.length) return;
    const word = words[currentIndex];
    await api.post(`/learning/session/${sessionId}/answer`, {
      word_id: word.id,
      answer_type: answerType,
    });

    if (currentIndex + 1 >= words.length) {
      await api.post(`/learning/session/${sessionId}/end`);
      navigate('/');
    } else {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  }, [sessionId, currentIndex, words, navigate]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80, fontSize: 18, color: '#888' }}>加载中...</div>;
  if (words.length === 0) return <div style={{ textAlign: 'center', marginTop: 80 }}><p>没有待复习的单词</p><button onClick={() => navigate('/')}>返回首页</button></div>;

  const currentWord = words[currentIndex];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <ProgressBar current={currentIndex + 1} total={words.length} />
      <div style={{ marginTop: 24 }}>
        <FlashCard word={currentWord} onFlip={() => setFlipped(true)} />
      </div>
      {flipped && <RatingButtons onRate={handleRate} />}
    </div>
  );
};

export default Review;
```

- [ ] **Step 11: 创建 Vocabulary 页面 client/src/pages/Vocabulary.tsx**

```tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { WordBook } from '../types';
import WordBookCard from '../components/WordBookCard';

const Vocabulary: React.FC = () => {
  const navigate = useNavigate();
  const [wordBooks, setWordBooks] = useState<WordBook[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/word-books').then((res) => setWordBooks(res.data.data)).catch(() => {});
  }, []);

  const handleSubscribe = async (id: string) => {
    await api.post(`/word-books/${id}/subscribe`);
    setWordBooks(wordBooks.map((wb) => wb.id === id ? { ...wb, subscribed: true } : wb));
  };

  const handleSelect = (id: string) => {
    localStorage.setItem('current_word_book_id', id);
    navigate('/learn');
  };

  const filtered = wordBooks.filter((wb) => wb.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h1 style={{ color: '#1a1a2e' }}>词库</h1>
      <input
        type="text" placeholder="搜索词库..." value={search} onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, marginBottom: 24, boxSizing: 'border-box' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {filtered.map((wb) => (
          <WordBookCard key={wb.id} wordBook={wb} onSubscribe={handleSubscribe} onClick={handleSelect} />
        ))}
      </div>
    </div>
  );
};

export default Vocabulary;
```

- [ ] **Step 12: 创建 Stats、Achievements、Settings 页面**

`client/src/pages/Stats.tsx`:
```tsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { StatsOverview } from '../types';

const Stats: React.FC = () => {
  const [overview, setOverview] = useState<StatsOverview | null>(null);

  useEffect(() => {
    api.get('/stats/overview').then((res) => setOverview(res.data.data)).catch(() => {});
  }, []);

  if (!overview) return <div style={{ textAlign: 'center', marginTop: 80 }}>加载中...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h1 style={{ color: '#1a1a2e' }}>学习统计</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 24 }}>
        <div style={{ padding: 24, borderRadius: 12, backgroundColor: '#f0eeff' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#6c63ff' }}>{overview.total_words_learned}</div>
          <div style={{ fontSize: 14, color: '#666' }}>已学单词</div>
        </div>
        <div style={{ padding: 24, borderRadius: 12, backgroundColor: '#e8f8f0' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#2ecc71' }}>{overview.total_words_mastered}</div>
          <div style={{ fontSize: 14, color: '#666' }}>已掌握</div>
        </div>
        <div style={{ padding: 24, borderRadius: 12, backgroundColor: '#fff3e0' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#f39c12' }}>{overview.total_learning_days}</div>
          <div style={{ fontSize: 14, color: '#666' }}>学习天数</div>
        </div>
        <div style={{ padding: 24, borderRadius: 12, backgroundColor: '#fce4ec' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#e74c3c' }}>{overview.average_accuracy}%</div>
          <div style={{ fontSize: 14, color: '#666' }}>正确率</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
```

`client/src/pages/Achievements.tsx`:
```tsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Achievement } from '../types';

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    api.get('/achievements/mine').then((res) => setAchievements(res.data.data)).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h1 style={{ color: '#1a1a2e' }}>成就</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginTop: 24 }}>
        {achievements.map((a) => (
          <div key={a.id} style={{
            padding: 20, borderRadius: 12, border: '1px solid #eee',
            opacity: a.unlocked ? 1 : 0.5, backgroundColor: a.unlocked ? '#f0eeff' : '#f5f5f5',
          }}>
            <div style={{ fontSize: 32, textAlign: 'center' }}>{a.icon}</div>
            <h3 style={{ textAlign: 'center', margin: '8px 0 4px', color: a.unlocked ? '#6c63ff' : '#999' }}>{a.name}</h3>
            <p style={{ textAlign: 'center', fontSize: 14, color: '#888', margin: 0 }}>{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
```

`client/src/pages/Settings.tsx`:
```tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [dailyGoal, setDailyGoal] = useState(user?.daily_goal || 20);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await api.put('/user/settings', { daily_goal: dailyGoal });
    await api.put('/user/profile', { nickname });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 32 }}>
      <h1 style={{ color: '#1a1a2e' }}>设置</h1>
      <div style={{ marginTop: 24 }}>
        <label style={{ display: 'block', marginBottom: 8, color: '#666' }}>昵称</label>
        <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
          style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box' }} />
      </div>
      <div style={{ marginTop: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, color: '#666' }}>每日学习目标</label>
        <input type="number" value={dailyGoal} onChange={(e) => setDailyGoal(Number(e.target.value))}
          style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box' }} min={5} max={200} />
      </div>
      <button onClick={handleSave} style={{
        marginTop: 24, padding: '12px 32px', borderRadius: 8, border: 'none',
        backgroundColor: '#6c63ff', color: '#fff', fontSize: 16, cursor: 'pointer',
      }}>
        {saved ? '已保存 ✓' : '保存'}
      </button>
    </div>
  );
};

export default Settings;
```

- [ ] **Step 13: Commit**

```bash
cd d:\Project\Word
git add .
git commit -m "feat: add frontend pages and components"
```

---

### Task 8: Docker 配置与部署

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `docker-compose.dev.yml`
- Create: `nginx.conf`

- [ ] **Step 1: 创建 Dockerfile**

```dockerfile
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:20-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=server-build /app/server/dist ./dist
COPY --from=server-build /app/server/node_modules ./node_modules
COPY --from=server-build /app/server/package.json ./
COPY --from=client-build /app/client/build ./public
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

- [ ] **Step 2: 创建 docker-compose.yml**

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - api
    restart: unless-stopped

  api:
    build: .
    environment:
      - DATABASE_URL=postgresql://wordmaster:${PG_PASSWORD}@postgres:5432/wordmaster
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRES_IN=15m
      - REFRESH_TOKEN_EXPIRES_IN=7d
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    volumes:
      - pg-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=wordmaster
      - POSTGRES_USER=wordmaster
      - POSTGRES_PASSWORD=${PG_PASSWORD}
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    restart: unless-stopped

volumes:
  pg-data:
  redis-data:
```

- [ ] **Step 3: 创建 docker-compose.dev.yml**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    volumes:
      - pg-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=wordmaster
      - POSTGRES_USER=wordmaster
      - POSTGRES_PASSWORD=password

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pg-data:
```

- [ ] **Step 4: 创建 nginx.conf**

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    upstream api {
        server api:3001;
    }

    server {
        listen 80;
        server_name localhost;

        location /api/ {
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location / {
            proxy_pass http://api;
            proxy_set_header Host $host;
        }
    }
}
```

- [ ] **Step 5: Commit**

```bash
cd d:\Project\Word
git add .
git commit -m "feat: add Docker and Nginx configuration"
```

---

### Task 9: 种子数据与最终整合

**Files:**
- Create: `server/src/database/seeds/001_achievements.ts`
- Create: `server/src/database/seeds/002_sample_wordbook.ts`

- [ ] **Step 1: 创建成就种子数据 server/src/database/seeds/001_achievements.ts**

```typescript
import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('achievements').del();
  await knex('achievements').insert([
    { code: 'first_word', name: '初出茅庐', description: '学习第一个单词', icon: '🌱', condition: JSON.stringify({ type: 'total_words', threshold: 1 }) },
    { code: 'words_10', name: '小试牛刀', description: '学习10个单词', icon: '📖', condition: JSON.stringify({ type: 'total_words', threshold: 10 }) },
    { code: 'words_50', name: '渐入佳境', description: '学习50个单词', icon: '📚', condition: JSON.stringify({ type: 'total_words', threshold: 50 }) },
    { code: 'words_100', name: '百词斩', description: '学习100个单词', icon: '💯', condition: JSON.stringify({ type: 'total_words', threshold: 100 }) },
    { code: 'words_500', name: '词汇达人', description: '学习500个单词', icon: '🏆', condition: JSON.stringify({ type: 'total_words', threshold: 500 }) },
    { code: 'words_1000', name: '词海无涯', description: '学习1000个单词', icon: '🌟', condition: JSON.stringify({ type: 'total_words', threshold: 1000 }) },
    { code: 'streak_3', name: '三天成习', description: '连续打卡3天', icon: '🔥', condition: JSON.stringify({ type: 'streak_days', threshold: 3 }) },
    { code: 'streak_7', name: '一周坚持', description: '连续打卡7天', icon: '💪', condition: JSON.stringify({ type: 'streak_days', threshold: 7 }) },
    { code: 'streak_30', name: '月度之星', description: '连续打卡30天', icon: '⭐', condition: JSON.stringify({ type: 'streak_days', threshold: 30 }) },
    { code: 'streak_100', name: '百日筑基', description: '连续打卡100天', icon: '👑', condition: JSON.stringify({ type: 'streak_days', threshold: 100 }) },
    { code: 'perfect_1', name: '完美一轮', description: '完成一次全对学习会话', icon: '🎯', condition: JSON.stringify({ type: 'perfect_session', threshold: 1 }) },
    { code: 'perfect_10', name: '十全十美', description: '完成10次全对学习会话', icon: '✨', condition: JSON.stringify({ type: 'perfect_session', threshold: 10 }) },
  ]);
}
```

- [ ] **Step 2: 创建示例词库种子数据 server/src/database/seeds/002_sample_wordbook.ts**

```typescript
import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  const sampleWords = [
    { word: 'abandon', phonetic: '/əˈbændən/', definitions: JSON.stringify([{ pos: 'v.', meaning: '放弃；遗弃', examples: [{ en: 'He abandoned his car.', zh: '他遗弃了他的车。' }] }]), language: 'en' },
    { word: 'ability', phonetic: '/əˈbɪləti/', definitions: JSON.stringify([{ pos: 'n.', meaning: '能力；才能', examples: [{ en: 'She has the ability to solve problems.', zh: '她有解决问题的能力。' }] }]), language: 'en' },
    { word: 'absorb', phonetic: '/əbˈzɔːrb/', definitions: JSON.stringify([{ pos: 'v.', meaning: '吸收；理解', examples: [{ en: 'Plants absorb water.', zh: '植物吸收水分。' }] }]), language: 'en' },
    { word: 'abstract', phonetic: '/ˈæbstrækt/', definitions: JSON.stringify([{ pos: 'adj.', meaning: '抽象的', examples: [{ en: 'Love is an abstract concept.', zh: '爱是一个抽象的概念。' }] }]), language: 'en' },
    { word: 'academic', phonetic: '/ˌækəˈdemɪk/', definitions: JSON.stringify([{ pos: 'adj.', meaning: '学术的', examples: [{ en: 'She has an academic background.', zh: '她有学术背景。' }] }]), language: 'en' },
    { word: 'accept', phonetic: '/əkˈsept/', definitions: JSON.stringify([{ pos: 'v.', meaning: '接受；承认', examples: [{ en: 'I accept your apology.', zh: '我接受你的道歉。' }] }]), language: 'en' },
    { word: 'access', phonetic: '/ˈækses/', definitions: JSON.stringify([{ pos: 'n.', meaning: '通道；访问权', examples: [{ en: 'You need a password to access the system.', zh: '你需要密码才能访问系统。' }] }]), language: 'en' },
    { word: 'accident', phonetic: '/ˈæksɪdənt/', definitions: JSON.stringify([{ pos: 'n.', meaning: '事故；意外', examples: [{ en: 'There was a car accident.', zh: '发生了一起车祸。' }] }]), language: 'en' },
    { word: 'accomplish', phonetic: '/əˈkɑːmplɪʃ/', definitions: JSON.stringify([{ pos: 'v.', meaning: '完成；实现', examples: [{ en: 'She accomplished her goal.', zh: '她实现了她的目标。' }] }]), language: 'en' },
    { word: 'accurate', phonetic: '/ˈækjərət/', definitions: JSON.stringify([{ pos: 'adj.', meaning: '准确的', examples: [{ en: 'The information is accurate.', zh: '这个信息是准确的。' }] }]), language: 'en' },
  ];

  const wordIds: string[] = [];
  for (const w of sampleWords) {
    const existing = await knex('words').where({ word: w.word }).first();
    if (existing) {
      wordIds.push(existing.id);
    } else {
      const [created] = await knex('words').insert(w).returning(['id']);
      wordIds.push(created.id);
    }
  }

  const existingBook = await knex('word_books').where({ name: 'CET-4 核心词汇（示例）' }).first();
  if (!existingBook) {
    const [book] = await knex('word_books')
      .insert({
        name: 'CET-4 核心词汇（示例）',
        description: '大学英语四级核心词汇精选示例',
        language_pair: 'en-zh',
        is_official: true,
        word_count: wordIds.length,
      })
      .returning(['id']);

    for (let i = 0; i < wordIds.length; i++) {
      await knex('word_book_items').insert({
        word_book_id: book.id,
        word_id: wordIds[i],
        position: i + 1,
      });
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
cd d:\Project\Word
git add .
git commit -m "feat: add seed data for achievements and sample wordbook"
```
