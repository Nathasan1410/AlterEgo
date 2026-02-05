# Prerequisites

## Overview

Before setting up and developing AlterEgo, ensure you have the necessary tools, accounts, and knowledge. This guide covers everything you need to get started.

## System Requirements

### Operating System

AlterEgo can be developed on:

- **Windows 10/11**: Windows Subsystem for Linux (WSL) recommended
- **macOS**: 10.15 (Catalina) or higher
- **Linux**: Ubuntu 18.04+, Debian 10+, or similar

**Recommended**: macOS or Linux for best compatibility with development tools.

### Hardware Requirements

**Minimum**:
- CPU: Dual-core processor
- RAM: 4GB
- Storage: 10GB free space

**Recommended**:
- CPU: Quad-core processor or better
- RAM: 8GB or more
- Storage: 20GB free space (SSD preferred)
- Internet: Stable broadband connection

## Software Requirements

### 1. Node.js

**Version Required**: 18.x or higher

**Installation**:

#### Using nvm (Recommended)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js 18
nvm install 18
nvm use 18

# Set as default
nvm alias default 18
```

#### Using Direct Download

1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download LTS version (18.x or higher)
3. Run installer
4. Restart terminal

#### Verify Installation

```bash
node --version
# Should output: v18.x.x or higher

npm --version
# Should output: 9.x.x or higher
```

### 2. Package Manager

AlterEgo supports multiple package managers:

#### npm (Default)

```bash
# npm comes with Node.js
npm --version
```

#### pnpm (Faster, Less Disk Usage)

```bash
# Install pnpm
npm install -g pnpm

# Verify
pnpm --version
```

**Recommendation**: Use pnpm for faster installs and lower disk usage.

### 3. Git

**Purpose**: Version control

#### Installation

**macOS**:
```bash
# Using Homebrew
brew install git
```

**Linux (Ubuntu/Debian)**:
```bash
sudo apt-get update
sudo apt-get install git
```

**Windows**:
- Download from [https://git-scm.com/download/win](https://git-scm.com/download/win)
- Run installer with default settings

#### Verify Installation

```bash
git --version
# Should output: git version 2.x.x or higher
```

### 4. Text Editor

**Recommended**: Visual Studio Code

#### Installation

1. Download from [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Install for your OS
3. Install recommended extensions

#### Recommended Extensions

```
- ESLint              # Code linting
- Prettier             # Code formatting
- TypeScript and JavaScript Language Features  # TypeScript support
- Tailwind CSS IntelliSense  # Tailwind autocomplete
- GitLens              # Git supercharged
- Error Lens           # Inline error display
```

### 5. Browser

**Development**: Chrome, Firefox, or Edge
**Testing**: Test on multiple browsers:
- Chrome/Edge (Chromium-based)
- Firefox (Gecko-based)
- Safari (WebKit-based, macOS only)

## Account Requirements

### 1. GitHub Account

**Purpose**: Code hosting, collaboration, deployment

**Required For**:
- Cloning repository
- Contributing to project
- Setting up CI/CD

**Create Account**:
1. Visit [https://github.com/signup](https://github.com/signup)
2. Sign up (free)
3. Configure SSH keys (optional but recommended)

#### SSH Key Setup

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub
cat ~/.ssh/id_ed25519.pub
# Copy output and add to GitHub Settings → SSH Keys

# Test connection
ssh -T git@github.com
```

### 2. API Provider Accounts

You'll need accounts for the following services:

#### Groq API (Required) ⭐

**Purpose**: LLM generation (Llama 3.3 70B)

**Sign Up**:
1. Visit [https://console.groq.com/](https://console.groq.com/)
2. Sign up (free tier available)
3. Go to API Keys section
4. Generate new API key
5. Copy key for `.env` file

**Free Tier**:
- 500K requests/day
- Access to Llama 3.3 70B
- No credit card required

**Get API Key**: `https://console.groq.com/keys`

#### OPIK AI (Required) ⭐

**Purpose**: AI observability and quality monitoring

**Sign Up**:
1. Visit [https://www.opik.ai/](https://www.opik.ai/)
2. Create account (free tier available)
3. Create new project
4. Generate API key
5. Copy key for `.env` file

**Free Tier**:
- 10K traces/month
- Quality evaluation
- Dashboard access
- Debugging tools

**Get API Key**: `https://console.opik.ai/`

> **Note**: OPIK AI is the primary sponsor of Commit To Change 2026 Hackathon. Integration is required for hackathon participation.

#### Tavily API (Required)

**Purpose**: Web research and context gathering

**Sign Up**:
1. Visit [https://tavily.com/](https://tavily.com/)
2. Sign up (free tier available)
3. Go to API Keys section
4. Generate new API key
5. Copy key for `.env` file

**Free Tier**:
- 1K searches/month
- AI-powered search results
- Advanced search depth

**Get API Key**: `https://tavily.com/app/apikey`

#### OpenAI API (Optional)

**Purpose**: Voice transcription (Whisper)

**Sign Up**:
1. Visit [https://platform.openai.com/](https://platform.openai.com/)
2. Sign up
3. Go to API Keys section
4. Generate new API key
5. Copy key for `.env` file

**Pricing**:
- Pay-as-you-go
- $0.006/minute (Whisper Large)
- Free trial credits available

**Get API Key**: `https://platform.openai.com/api-keys`

### 3. Deployment Platforms (Optional)

#### Vercel (Recommended)

**Purpose**: Production deployment

**Sign Up**:
1. Visit [https://vercel.com/signup](https://vercel.com/signup)
2. Sign up (free tier available)
3. Connect GitHub account
4. Create team (optional)

**Free Tier**:
- Unlimited deployments
- Automatic SSL
- Global CDN
- 100GB bandwidth/month

## Knowledge Requirements

### 1. Basic Skills

**Required**:
- Basic JavaScript/TypeScript knowledge
- Familiarity with React concepts
- Understanding of Git basics
- Command line proficiency

**Helpful**:
- Next.js experience
- Tailwind CSS knowledge
- API integration experience

### 2. Recommended Learning Resources

#### React

- [React Documentation](https://react.dev)
- [React Tutorial](https://react.dev/learn)
- [React Patterns](https://reactpatterns.com/)

#### Next.js

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn](https://nextjs.org/learn)
- [Next.js Tutorial](https://nextjs.org/learn-pages-router)

#### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/)
- [TypeScript Cheatsheet](https://www.typescriptlang.org/docs/handbook/cheatsheet.html)

#### Tailwind CSS

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Kit](https://tailwindui.com/)
- [Headless UI](https://headlessui.com/)

#### AI/ML

- [OpenAI Documentation](https://platform.openai.com/docs)
- [Groq Documentation](https://console.groq.com/docs)
- [OPIK AI Documentation](https://docs.opik.ai/)

## Environment Setup

### 1. Verify Node.js Version

```bash
node --version
# Should be 18.x or higher

# If not, install using nvm
nvm install 18
nvm use 18
```

### 2. Install Git (if not installed)

```bash
# macOS
brew install git

# Linux (Ubuntu/Debian)
sudo apt-get install git

# Windows
# Download from https://git-scm.com/download/win
```

### 3. Configure Git

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main
```

### 4. Install VS Code Extensions

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search and install:
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense
   - GitLens

### 5. Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-username/commit-to-career.git

# Navigate to project
cd commit-to-career

# Verify structure
ls -la
```

### 6. Install Dependencies

```bash
# Using npm
npm install

# Or using pnpm
pnpm install

# Verify installation
ls node_modules
```

### 7. Set Up Environment Variables

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your API keys
nano .env  # or use VS Code
```

**Add your API keys**:

```env
# Opik (Comet.ml) - AI Observability ⭐
OPIK_API_KEY=your_opik_api_key_here
OPIK_WORKSPACE=default

# Groq - LLM Provider
GROQ_API_KEY=your_groq_api_key_here

# Tavily - Web Research
TAVILY_API_KEY=your_tavily_api_key_here

# OpenAI - Voice Transcription (Optional)
OPENAI_API_KEY=your_openai_api_key_here
```

### 8. Verify Setup

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check git version
git --version

# Verify dependencies installed
ls node_modules

# Verify .env file exists
cat .env

# Try running dev server
npm run dev
```

## Troubleshooting

### Node.js Version Issues

**Problem**: Node.js version too old or not found

**Solution**:
```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js 18
nvm install 18
nvm use 18

# Verify
node --version
```

### Git Installation Issues

**Problem**: Git not installed or wrong version

**Solution**:
```bash
# macOS
brew install git

# Linux (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install git

# Verify
git --version
```

### API Key Issues

**Problem**: API keys not working

**Solution**:
1. Verify keys are correct (no extra spaces)
2. Check if keys are active in provider dashboard
3. Ensure you haven't exceeded free tier limits
4. Regenerate keys if necessary

### Permission Issues

**Problem**: Permission denied errors

**Solution**:
```bash
# macOS/Linux: Use sudo for global installs
sudo npm install -g some-package

# Better: Use nvm (no sudo needed)
nvm install 18

# Windows: Run terminal as Administrator
```

## Next Steps

After completing prerequisites:

1. ✅ Verify all tools installed
2. ✅ Get all API keys
3. ✅ Set up environment variables
4. ✅ Clone repository
5. ✅ Install dependencies
6. ✅ Run development server

Proceed to [Local Setup](./local-setup) for detailed setup instructions.

## Summary

Prerequisites Checklist:

- [ ] Operating System: Windows 10/11, macOS 10.15+, or Linux
- [ ] Node.js: 18.x or higher installed
- [ ] Package Manager: npm or pnpm installed
- [ ] Git: Installed and configured
- [ ] Text Editor: VS Code with extensions installed
- [ ] GitHub Account: Created and configured
- [ ] Groq API Key: Obtained from console.groq.com
- [ ] OPIK API Key: Obtained from console.opik.ai ⭐
- [ ] Tavily API Key: Obtained from tavily.com
- [ ] OpenAI API Key: Obtained (optional)

Once all prerequisites are met, you're ready to set up AlterEgo!

---

**Built with ❤️ for Commit To Change 2026 Hackathon**

🚀 **Powered by OPIK AI**
