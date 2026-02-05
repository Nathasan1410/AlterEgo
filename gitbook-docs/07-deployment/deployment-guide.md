# Deployment Guide

## Environment Variables

### Required Variables

Create a `.env` file in project root:

```env
# Opik (Comet.ml) - AI Observability ⭐ (Required)
OPIK_API_KEY=your_opik_api_key_here
OPIK_WORKSPACE=default

# Groq - LLM Provider (Required)
GROQ_API_KEY=your_groq_api_key_here

# Tavily - Web Research (Required)
TAVILY_API_KEY=your_tavily_api_key_here

# OpenAI - Voice Transcription (Optional)
# OPENAI_API_KEY=your_openai_api_key_here
```

### Variable Reference

| Variable | Required | Description | Get From |
|----------|----------|-------------|----------|
| `OPIK_API_KEY` | ✅ Yes | OPIK AI API key for observability | [OPIK Console](https://console.opik.ai/) |
| `OPIK_WORKSPACE` | No | OPIK workspace name | Default: "default" |
| `GROQ_API_KEY` | ✅ Yes | Groq API key for LLM generation | [Groq Console](https://console.groq.com/) |
| `TAVILY_API_KEY` | ✅ Yes | Tavily API key for web research | [Tavily Console](https://tavily.com/) |
| `OPENAI_API_KEY` | ❌ No | OpenAI API key for voice transcription | [OpenAI Platform](https://platform.openai.com/) |

## Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Best For:**
- Quick deployment
- Automatic scaling
- Preview deployments
- Easy collaboration

**Steps:**

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/commit-to-career.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Sign up/log in
   - Click "Add New Project"
   - Import from GitHub
   - Select `commit-to-career` repository

3. **Configure Environment Variables**
   - In Vercel project settings
   - Go to Settings → Environment Variables
   - Add all required variables from `.env.example`

4. **Deploy**
   - Vercel automatically deploys on push
   - Monitor deployment in dashboard
   - Access at `https://your-project.vercel.app`

5. **Configure Domain (Optional)**
   - Go to Settings → Domains
   - Add custom domain
   - Update DNS records

### Option 2: Docker

**Best For:**
- Self-hosting
- Custom infrastructure
- Complete control

**Steps:**

1. **Create Dockerfile**

   ```dockerfile
   # Dockerfile
   FROM node:18-alpine AS base

   # Install dependencies only when needed
   FROM base AS deps
   WORKDIR /app

   COPY package.json package-lock.json* ./
   RUN npm ci

   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .

   RUN npm run build

   # Production image, copy all the files and run next
   FROM base AS runner
   WORKDIR /app

   ENV NODE_ENV production

   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs

   EXPOSE 3000

   ENV PORT 3000

   CMD ["node", "server.js"]
   ```

2. **Update next.config.ts**

   ```typescript
   const nextConfig = {
     output: 'standalone',
   };

   export default nextConfig;
   ```

3. **Build Docker Image**

   ```bash
   docker build -t alterego:latest .
   ```

4. **Run Container**

   ```bash
   docker run -p 3000:3000 \
     -e OPIK_API_KEY=your_key \
     -e GROQ_API_KEY=your_key \
     -e TAVILY_API_KEY=your_key \
     alterego:latest
   ```

5. **Push to Registry**

   ```bash
   docker tag alterego:latest your-registry/alterego:latest
   docker push your-registry/alterego:latest
   ```

### Option 3: Traditional VPS

**Best For:**
- Cost optimization
- Full control
- Learning purposes

**Steps:**

1. **Provision Server**
   - Ubuntu 20.04+ or similar
   - 2GB+ RAM
   - 20GB+ storage

2. **Install Node.js**

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone Repository**

   ```bash
   git clone https://github.com/your-username/commit-to-career.git
   cd commit-to-career
   ```

4. **Install Dependencies**

   ```bash
   npm install
   ```

5. **Set Environment Variables**

   ```bash
   cp .env.example .env
   nano .env  # Edit with your keys
   ```

6. **Build Application**

   ```bash
   npm run build
   ```

7. **Start with PM2**

   ```bash
   npm install -g pm2
   pm2 start npm --name "alterego" -- start
   pm2 save
   pm2 startup
   ```

8. **Configure Nginx**

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Vercel Deployment Details

### Environment Variables

1. Go to your Vercel project
2. Navigate to Settings → Environment Variables
3. Add the following:

| Name | Value | Environment |
|------|-------|-------------|
| `OPIK_API_KEY` | Your OPIK API key | Production, Preview, Development |
| `OPIK_WORKSPACE` | default | Production, Preview, Development |
| `GROQ_API_KEY` | Your Groq API key | Production, Preview, Development |
| `TAVILY_API_KEY` | Your Tavily API key | Production, Preview, Development |
| `OPENAI_API_KEY` | Your OpenAI API key (optional) | Production, Preview, Development |

### Build Configuration

Vercel automatically detects Next.js and uses these settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### Automatic Deployments

- **Main Branch**: Deploys to production
- **Pull Requests**: Creates preview deployments
- **Git Tags**: Creates production deployments

### Custom Domain

1. Go to Settings → Domains
2. Add your domain (e.g., `alterego.ai`)
3. Vercel provides DNS records to add
4. Update your DNS provider
5. SSL is automatically configured

## Monitoring & Logging

### Vercel Analytics

Vercel provides built-in analytics:

- **Web Vitals**: Core performance metrics
- **Visitors**: Page views and unique visitors
- **Routes**: Most visited routes
- **Geographic Data**: Visitor locations

### OPIK AI Monitoring

Access OPIK dashboard at [https://console.opik.ai/](https://console.opik.ai/):

- **Traces**: All AI generations
- **Quality Metrics**: Content quality scores
- **Performance**: Latency and token usage
- **Errors**: Failed requests and issues

### Console Logs

View logs in Vercel dashboard:

1. Go to your project
2. Navigate to "Deployments"
3. Click on a deployment
4. View "Build Logs" or "Function Logs"

## Troubleshooting

### Build Failures

**Issue**: Build fails on Vercel

**Solutions**:
```bash
# Clear Next.js cache locally
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Test build locally
npm run build
```

### Runtime Errors

**Issue**: Application crashes in production

**Solutions**:
- Check Vercel Function Logs
- Verify all environment variables are set
- Check OPIK API key is valid
- Review OPIK traces for errors

### API Key Issues

**Issue**: API keys not working in production

**Solutions**:
1. Verify keys are set in Vercel environment variables
2. Ensure keys are valid and not expired
3. Check API provider dashboards for usage limits
4. Redeploy after changing environment variables

### Performance Issues

**Issue**: Slow response times

**Solutions**:
1. Check OPIK traces for bottlenecks
2. Enable caching in orchestrator
3. Optimize prompts for faster generation
4. Consider increasing cache TTL

### Memory Issues

**Issue**: Out of memory errors

**Solutions**:
1. Increase Node.js memory limit: `NODE_OPTIONS=--max-old-space-size=4096`
2. Optimize cache size
3. Implement cache eviction policy
4. Scale infrastructure

## Security Best Practices

### Environment Variables

- ✅ Never commit `.env` file
- ✅ Use environment-specific variables
- ✅ Rotate API keys regularly
- ✅ Use different keys for dev/prod
- ❌ Don't log environment variables

### API Security

- ✅ Implement rate limiting
- ✅ Validate all inputs
- ✅ Use HTTPS in production
- ✅ Monitor for abuse
- ✅ Implement CORS policy

### Dependencies

- ✅ Keep dependencies updated
- ✅ Run `npm audit` regularly
- ✅ Use `npm ci` in production
- ✅ Lock package versions

## Cost Optimization

### Groq API

- Use caching for repeated requests
- Batch similar generations
- Optimize token usage
- Monitor free tier limits

### OPIK AI

- Free tier available
- Monitor trace volume
- Flush traces periodically
- Consider sampling for high-traffic

### Infrastructure

- Use serverless (Vercel) for cost efficiency
- Scale based on demand
- Implement caching to reduce API calls
- Monitor usage and optimize

## Performance Targets

For production deployment:

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |
| API Response Time | < 2s (cached), < 5s (uncached) | OPIK |
| Uptime | > 99.9% | Vercel |
| Error Rate | < 0.1% | OPIK |

## Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Build succeeds without errors
- [ ] Application loads correctly
- [ ] API endpoints respond
- [ ] OPIK traces appear in dashboard
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate valid
- [ ] Monitoring enabled
- [ ] Error tracking configured
- [ ] Performance baseline established

## Next Steps

- [ ] Set up CI/CD pipeline
- [ ] Configure automated testing
- [ ] Set up error alerting
- [ ] Implement A/B testing
- [ ] Create analytics dashboard

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [OPIK AI Console](https://console.opik.ai/)
- [Docker Documentation](https://docs.docker.com/)
