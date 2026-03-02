# 2025 年度四十问 (40 Questions Review 2025)

一个充满仪式感的年度回顾 Web 应用，陪伴你通过 40 个深度问题回顾过去一年，并生成一份精美的年度画卷。

[Live Demo →](https://40-questions-review-2025.vercel.app)

---

## ✨ Features

- **深度问卷** — 分为四个章节，陪伴你静心思考
- **AI 智能解析** — 上传手写图片或 PDF，自动识别填充回答
- **年度画卷生成** — AI 文学化重构，生成 4 张个性化总结卡片
- **一键导出** — 高保真图片导出，方便社交媒体分享

## 🛠 Tech Stack

- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **AI**: OpenAI-compatible API (e.g. Zhipu AI, DeepSeek, OpenAI)
- **Export**: html-to-image

## 🚀 Getting Started

### Prerequisites

- Node.js v18+

### Installation

```bash
git clone https://github.com/your-username/your-repo.git
cd 40-Questions-Review-2025
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_BIGMODEL_API_KEY=your_api_key_here
VITE_BIGMODEL_BASE_URL=https://your-api-base-url/v4/
VITE_OPENAI_MODEL=your-model-name
```

This project works with any OpenAI-compatible API provider.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## ☁️ Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub.
2. Import the repository on [Vercel](https://vercel.com).
3. Set the three environment variables above in **Project Settings → Environment Variables**.
4. Click **Deploy**.

## 📄 License

[MIT](./LICENSE)
