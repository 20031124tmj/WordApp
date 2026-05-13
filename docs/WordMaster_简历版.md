# WordMaster - 智能英语词汇学习系统

## 项目简介

基于 SM-2 间隔重复算法的智能英语词汇学习平台，支持多词库订阅、自适应复习调度、学习数据统计与成就系统。从 Free Dictionary API 爬取真实例句，覆盖 4346 个单词（78.4% 有真实语境例句）。

## 技术栈

**前端**：React 18 + TypeScript + React Router + Axios + Recharts
**后端**：Node.js + Express 5 + TypeScript + Knex.js + SQLite/PostgreSQL
**认证**：JWT 双令牌机制（Access + Refresh）+ bcryptjs
**部署**：Docker + Nginx + Redis

## 核心工作

- **SM-2 算法引擎**：实现完整的间隔重复算法，根据用户答题质量（4 级评分）动态调整难度因子与复习间隔，状态自动流转 new → learning → review → mastered
- **词汇数据工程**：构建多源数据管线，整合 2313 词条精简词典 + 3700+ 基础词义字典 + 36 条后缀推断规则，实现 4346 词 100% 释义覆盖；编写爬虫从 Free Dictionary API 获取 3469 词真实英文例句，支持断点续传与自动重试
- **双令牌认证系统**：Access Token（15min）+ Refresh Token（7d），前端 Axios 拦截器实现无感刷新，bcryptjs 加盐哈希存储密码，Zod Schema 验证请求数据
- **学习闭环设计**：词库订阅 → 翻转卡片学习 → 4 级评分 → SM-2 调度 → 自动复习提醒 → 实时进度更新，每次答题即时写入打卡记录与进度统计
- **RESTful API**：设计并实现 30 个 API 端点，8 个业务模块（auth/learning/vocabulary/user/stats/achievement/social/media），统一响应格式与全局错误处理
- **前端交互优化**：CSS 3D 翻转卡片动画、页面焦点自动刷新数据、本地时区日期计算修复、订阅/取消二次确认、可自定义每日目标的模态框交互

## 项目成果

- 内置 CET-4（2100 词）、CET-6（2087 词）、雅思（704 词）、考研（666 词）四大词库，共 4346 个去重单词
- 3469 个单词拥有从 Wiktionary 爬取的真实英文例句，覆盖率 78.4%
- 12 个成就徽章 + 连续打卡系统，支持学习数据统计与趋势图表
- 完整的 Docker 容器化部署方案（Nginx 反向代理 + PostgreSQL + Redis）
