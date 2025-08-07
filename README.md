# Project 04 #AIAugustAppADay: AI Chatbot for Portfolio

![Last Commit](https://img.shields.io/github/last-commit/davedonnellydev/ai-august-2025-04)  

**📆 Date**: 06/Aug/2025  
**🎯 Project Objective**: Add a chatbot to my portfolio website that answers questions about myself and my experience.   
**🚀 Features**: Chat UI; Preload bot with my CV/portfolio data; Answer queries about me. Stretch goals: cv/portfolio data to be updatable, can install on any website...   
**🛠️ Tech used**: Next.js, TypeScript, OpenAI API  
**▶️ Live Demo**: *[https://dave-donnelly-ai-august-04.netlify.app/](https://dave-donnelly-ai-august-04.netlify.app/)*  

## 🗒️ Summary

Probably the most polished project I’ve done so far, and one that surfaced some interesting challenges — especially around storing and retrieving previous responses. Handling the chat flow itself was fairly straightforward per session, but I wanted users to be able to close the site and return later to pick up where they left off. You can see here where my planning started off: [ai-august-2025-04.drawio.png](./ai-august-2025-04.drawio.png).  

OpenAI’s Responses API automatically stores responses for up to 30 days, and each response includes a unique ID. I stored that `previous_response_id` in `localStorage`, updating it whenever a new message came through. When the user reloads the page, the app uses that stored ID to retrieve previous responses via another API call and populate the chat window. It works well, though it did leave me wondering about the trade-offs — namely, how many API calls are too many, and when it makes more sense to store things locally vs. repeatedly querying OpenAI. Based on token/credit usage during testing, the impact seemed minimal, but it’s something I’ll want to monitor over time.  

This was also my first time implementing a chat window UI. I had to think through all the little details that make a chat interface feel intuitive — clearing the input after sending a message, automatically scrolling to the bottom of the chat window when the window opens, differentiating between user and assistant messages, etc. It gave me a newfound appreciation for all the UX polish that goes into even the simplest chat apps.  

The last major piece of the puzzle was prompt engineering. I needed to feed the API a detailed set of instructions so the assistant could reliably answer questions about the portfolio owner (in this example, me!). To do this, I moved the instructions into a separate file and structured them into sections: defining the assistant’s identity, sharing relevant background info about me, and setting clear guidelines for how to respond (including tone, format, examples). It was a helpful exercise in clarity and specificity — and a good reminder that the quality of AI output is only as good as the inputs you provide.  

**Lessons learned**  
- OpenAI’s Responses API makes it surprisingly easy to persist history — but you still need to plan how and when to store vs. re-fetch data.  
- UI polish matters. Things like scrolling behavior and input management are small touches that make the experience feel complete.  
- Prompt engineering is a beast. The more effort you put into structuring your instructions clearly, the better the assistant performs.  

**Final thoughts**  
I feel like I'm gaining traction. The app worked, the polish was there, and the prompt setup gave me a scalable way to expand and refine the assistant’s knowledge and tone. I’m starting to feel a real rhythm with these daily builds... let’s see what tomorrow brings!  


This project has been built as part of my AI August App-A-Day Challenge. You can read more information on the full project here: [https://github.com/davedonnellydev/ai-august-2025-challenge](https://github.com/davedonnellydev/ai-august-2025-challenge).  

## 🧪 Testing

![CI](https://github.com/davedonnellydev/ai-august-2025-04/actions/workflows/npm_test.yml/badge.svg)  
*Note: Test suite runs automatically with each push/merge.*  

## Quick Start

1. **Clone and install:**
   ```bash
   git clone https://github.com/davedonnellydev/ai-august-2025-04.git
   cd ai-august-2025-04
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# OpenAI API (for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: External API URLs
USER_API_URL=https://jsonplaceholder.typicode.com/users
PRODUCT_API_URL=https://dummyjson.com/products

# Optional: Proxy Settings
ENABLE_CACHE=true
CACHE_DURATION=300000
```

### Key Configuration Files

- **`next.config.mjs`** - Next.js configuration with bundle analyzer
- **`tsconfig.json`** - TypeScript configuration with path aliases (`@/*`)
- **`theme.ts`** - Mantine theme customization
- **`eslint.config.mjs`** - ESLint rules with Mantine and TypeScript support
- **`jest.config.cjs`** - Jest testing configuration
- **`.nvmrc`** - Node.js version (v24.3.0)

### Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
import { Component } from '@/components/Component';  // instead of '../../../components/Component'
```


## 📦 Available Scripts
### Build and dev scripts

- `npm run dev` – start dev server
- `npm run build` – bundle application for production
- `npm run analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Testing scripts

- `npm run typecheck` – checks TypeScript types
- `npm run lint` – runs ESLint
- `npm run prettier:check` – checks files with Prettier
- `npm run jest` – runs jest tests
- `npm run jest:watch` – starts jest watch
- `npm test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `npm run storybook` – starts storybook dev server
- `npm run storybook:build` – build production storybook bundle to `storybook-static`
- `npm run prettier:write` – formats all files with Prettier


## 📜 License
![GitHub License](https://img.shields.io/github/license/davedonnellydev/ai-august-2025-04)  
This project is licensed under the MIT License.  
