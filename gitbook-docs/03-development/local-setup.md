# Local Setup

## Overview

This guide walks you through setting up AlterEgo on your local machine for development. Follow these steps to get up and running quickly.

## Quick Start (5 Minutes)

If you're experienced with Node.js development, here's the quick version:

```bash
# 1. Clone repository
git clone https://github.com/your-username/commit-to-career.git
cd commit-to-career

# 2. Install dependencies
npm install
# or
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# 4. Run development server
npm run dev
# or
pnpm dev

# 5. Open browser
# Navigate to http://localhost:3000
```

## Detailed Setup

### Step 1: Clone Repository

#### Option A: HTTPS (Recommended for beginners)

```bash
# Clone using HTTPS
git clone https://github.com/your-username/commit-to-career.git

# Navigate to project directory
cd commit-to-career

# Verify structure
ls -la
```

#### Option B: SSH (Recommended for contributors)

```bash
# Clone using SSH (requires SSH key setup)
git clone git@github.com:your-username/commit-to-career.git

# Navigate to project directory
cd commit-to-career

# Verify structure
ls -la
```

#### Option C: Fork and Clone (For contributing)

1. Fork repository on GitHub
2. Clone your fork:
```bash
git clone https://github.com/your-username/commit-to-career.git
cd commit-to-career

# Add upstream remote
git remote add upstream https://github.com/original-username/commit-to-career.git
```

### Step 2: Install Dependencies

#### Using npm

```bash
# Install dependencies
npm install

# This installs:
# - React, Next.js, TypeScript
# - Groq SDK, OPIK SDK
# - Tailwind CSS, Framer Motion
# - All development dependencies
```

#### Using pnpm (Faster, Less Disk Usage)

```bash
# Install pnpm globally (if not installed)
npm install -g pnpm

# Install dependencies
pnpm install
```

#### Verify Installation

```bash
# Check node_modules exists
ls node_modules

# Check package.json dependencies
cat package.json | grep -A 20 "dependencies"
```

**Expected Dependencies**:
```json
{
  "dependencies": {
    "@tavily/core": "^0.7.1",
    "framer-motion": "^12.29.0",
    "groq-sdk": "^0.5.0",
    "lucide-react": "^0.563.0",
    "next": "^16.1.4",
    "next-themes": "^0.4.6",
    "opik": "^1.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zod": "^4.3.6"
  }
}
```

### Step 3: Set Up Environment Variables

#### Copy Environment Template

```bash
# Copy .env.example to .env
cp .env.example .env

# Verify .env file exists
ls -la .env
```

#### Edit .env File

Open `.env` in your text editor:

```bash
# Using nano
nano .env

# Or using VS Code
code .env

# Or using vim
vim .env
```

#### Add Your API Keys

```env
# Opik (Comet.ml) - AI Observability ⭐
OPIK_API_KEY=your_opik_api_key_here
OPIK_WORKSPACE=default

# Groq - LLM Provider
GROQ_API_KEY=your_groq_api_key_here

# Tavily - Web Research
TAVILY_API_KEY=your_tavily_api_key_here

# OpenAI - Voice Transcription (Optional)
# OPENAI_API_KEY=your_openai_api_key_here
```

#### Get API Keys

**OPIK API Key** ⭐:
1. Visit [https://console.opik.ai/](https://console.opik.ai/)
2. Create account or login
3. Create new project
4. Go to API Keys
5. Generate new key
6. Copy to `.env`

**Groq API Key**:
1. Visit [https://console.groq.com/](https://console.groq.com/)
2. Create account or login
3. Go to API Keys
4. Generate new key
5. Copy to `.env`

**Tavily API Key**:
1. Visit [https://tavily.com/](https://tavily.com/)
2. Create account or login
3. Go to API Keys
4. Generate new key
5. Copy to `.env`

**OpenAI API Key** (Optional):
1. Visit [https://platform.openai.com/](https://platform.openai.com/)
2. Create account or login
3. Go to API Keys
4. Generate new key
5. Copy to `.env`

#### Verify .env File

```bash
# Check .env file content
cat .env

# Should show your API keys
```

#### Important Notes

- ✅ `.env` file is in `.gitignore` (won't be committed)
- ✅ Never share your `.env` file
- ✅ Use `.env.example` as template
- ✅ Keep `.env` file secure
- ✅ Regenerate keys if compromised

### Step 4: Run Development Server

#### Start Server

```bash
# Using npm
npm run dev

# Or using pnpm
pnpm dev

# Or using yarn
yarn dev
```

#### Expected Output

```bash
> commit-to-career@1.0.0 dev
> next dev

  ▲ Next.js 16.1.4
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.5:3000

 ✓ Starting...
 ✓ Ready in 2.3s
```

#### Open in Browser

1. Open browser
2. Navigate to [http://localhost:3000](http://localhost:3000)
3. Verify application loads
4. Check browser console for errors (F12 → Console)

### Step 5: Verify Setup

#### Check Application

1. **Main Page Loads**: http://localhost:3000 should show AlterEgo UI
2. **No Console Errors**: Open DevTools (F12), check Console tab
3. **API Health**: Navigate to http://localhost:3000/api/generate (GET)

#### Check OPIK Integration

1. Generate content in UI
2. Navigate to [OPIK Console](https://console.opik.ai/)
3. Check if traces appear
4. Verify project name: "commit-to-career"

#### Check API Connectivity

```bash
# Test Groq API
curl -H "Authorization: Bearer $GROQ_API_KEY" \
  https://api.groq.com/openai/v1/models

# Should return list of available models
```

## Advanced Setup Options

### Using Docker

#### Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Build and Run

```bash
# Build image
docker build -t alterego:latest .

# Run container
docker run -p 3000:3000 \
  -e OPIK_API_KEY=your_key \
  -e GROQ_API_KEY=your_key \
  -e TAVILY_API_KEY=your_key \
  alterego:latest
```

### Using VS Code Dev Containers

#### Create .devcontainer/devcontainer.json

```json
{
  "name": "AlterEgo Dev",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:18",
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "bradlc.vscode-tailwindcss"
      ]
    }
  },
  "features": {
    "ghcr.io/devcontainers/features/node:1": {
      "version": "lts"
    }
  },
  "postCreateCommand": "npm install"
}
```

#### Use Dev Container

1. Open project in VS Code
2. Install "Dev Containers" extension
3. Click "Reopen in Container"
4. VS Code sets up containerized environment

### Using Yarn Workspaces (Monorepo)

#### Setup

```bash
# Install yarn
npm install -g yarn

# Install dependencies
yarn install

# Run dev server
yarn dev
```

## Common Issues & Solutions

### Issue: Port Already in Use

**Error**:
```
Port 3000 is already in use
```

**Solution**:
```bash
# Option 1: Kill process on port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Use different port
PORT=3001 npm run dev
```

### Issue: Module Not Found

**Error**:
```
Module not found: Can't resolve 'opik'
```

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or using pnpm
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: API Key Not Found

**Error**:
```
OPIK_API_KEY is not defined
```

**Solution**:
```bash
# Verify .env file exists
ls -la .env

# Check .env file content
cat .env

# Restart dev server after changing .env
# Stop server (Ctrl+C)
# Start again
npm run dev
```

### Issue: TypeScript Errors

**Error**:
```
TS2307: Cannot find module '@/components/...'
```

**Solution**:
```bash
# Check tsconfig.json paths
cat tsconfig.json | grep -A 10 "paths"

# Should include:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Build Failures

**Error**:
```
Build failed with errors
```

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Clear TypeScript cache
rm -rf .tsbuildinfo

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

## Development Workflow

### Daily Workflow

```bash
# 1. Pull latest changes
git pull origin main

# 2. Start dev server
npm run dev

# 3. Make changes in VS Code
# Edit files, save, see hot reload

# 4. Check browser for changes
# http://localhost:3000

# 5. Test changes
# Run tests, check console

# 6. Commit changes
git add .
git commit -m "feat: add new feature"

# 7. Push to remote
git push origin main
```

### Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server

# Quality
npm run lint         # Lint code
npm run lint:fix     # Fix linting issues
npm run format       # Format code
npm run typecheck    # Type checking

# Testing
npm test             # Run tests
npm run test:watch   # Watch mode

# Evaluation
npm run evaluate     # Run evaluation scripts
```

## IDE Configuration

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^]*?)\\)", "[\"'`$1$2\"'`]"],
    ["clsx\\(([^]*?)\\)", "[\"'`$1$2\"'`]"]
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### VS Code Extensions

**Required**:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features

**Recommended**:
- Tailwind CSS IntelliSense
- GitLens
- Error Lens
- Auto Rename Tag
- Path Intellisense

### VS Code Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

## Performance Tips

### Speed Up Development

1. **Use pnpm**: Faster than npm
2. **Disable Hot Reload for Large Files**: If hot reload is slow
3. **Use .env.local**: For local-only environment variables
4. **Optimize Imports**: Use tree-shaking
5. **Enable Compression**: gzip compression in Next.js config

### Reduce Memory Usage

1. **Limit Dev Server Workers**: Set in next.config.ts
2. **Use ES Modules**: Faster than CommonJS
3. **Disable Source Maps**: In production
4. **Use Production Build**: For testing

## Next Steps

After successful local setup:

1. ✅ Explore the codebase: [Project Structure](./project-structure)
2. ✅ Follow code style: [Code Style Guidelines](./code-style-guidelines)
3. ✅ Run tests: [Testing](./testing)
4. ✅ Start developing!

## Summary

Local Setup Checklist:

- [ ] Repository cloned to local machine
- [ ] Dependencies installed (npm/pnpm install)
- [ ] Environment variables configured (.env file)
- [ ] All API keys added to .env
- [ ] Development server running (npm run dev)
- [ ] Application loads in browser
- [ ] No console errors
- [ ] OPIK traces visible in console
- [ ] IDE configured (VS Code settings)

Once setup is complete, you're ready to start developing AlterEgo!

---

**Built with ❤️ for Commit To Change 2026 Hackathon**

🚀 **Powered by OPIK AI**
