# Troubleshooting

## Common Issues

### Installation Issues

#### Node.js Version Incompatible

**Problem**: Installation fails with Node.js version errors

**Solution**:
```bash
# Check current Node.js version
node --version

# Should be 18.x or higher
# If not, install correct version

# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download from https://nodejs.org/
```

#### Dependencies Not Installing

**Problem**: `npm install` fails

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use yarn
yarn install

# Or use pnpm
pnpm install
```

### Build Issues

#### Build Fails

**Problem**: `npm run build` fails

**Solutions**:
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

#### TypeScript Errors

**Problem**: TypeScript compilation errors

**Solution**:
```bash
# Check TypeScript errors
npx tsc --noEmit

# Install missing types
npm install --save-dev @types/package-name

# Update TypeScript
npm install typescript@latest --save-dev
```

### Runtime Issues

#### Application Won't Start

**Problem**: `npm run dev` fails to start

**Solutions**:
```bash
# Check if port is in use
lsof -ti:3000 | xargs kill -9  # Mac/Linux
# or
netstat -ano | findstr :3000  # Windows

# Try different port
PORT=3001 npm run dev

# Check for syntax errors in files
npm run lint
npm run typecheck
```

#### White Screen on Load

**Problem**: Application loads but shows white screen

**Solutions**:
```bash
# Check browser console for errors
# Open DevTools (F12) and check Console tab

# Check Next.js build
npm run build
npm start

# Verify environment variables
# Ensure .env file exists with correct values

# Check for import errors
npm run lint
npm run typecheck
```

### API Issues

#### API Returns Errors

**Problem**: API endpoints return 500 errors

**Solutions**:
```bash
# Check API keys in .env
cat .env

# Verify API keys are valid
# Test keys in provider dashboards:
# - Groq: https://console.groq.com/
# - OPIK: https://console.opik.ai/
# - Tavily: https://tavily.com/

# Check API logs
# In Vercel: Project → Deployments → Function Logs
# Locally: Check terminal output

# Test API health
curl http://localhost:3000/api/generate
```

#### OPIK Traces Not Appearing

**Problem**: Traces not showing in OPIK dashboard

**Solutions**:
```bash
# Verify OPIK_API_KEY is set
echo $OPIK_API_KEY

# Check key is valid
# Visit https://console.opik.ai/

# Ensure opik.flush() is called
# Check code for await opik.flush()

# Check project name matches
# Should be "commit-to-career" in both code and OPIK console

# Test OPIK connection
node -e "const {Opik} = require('opik'); const opik = new Opik({apiKey: process.env.OPIK_API_KEY, projectName: 'test'}); console.log('OPIK connected')"
```

#### Generation Fails

**Problem**: Content generation fails

**Solutions**:
```bash
# Check Groq API status
# Visit https://status.groq.com/

# Verify API key is not expired
# Check Groq console: https://console.groq.com/

# Check rate limits
# Free tier: 500K requests/day

# Test Groq API directly
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"
```

### Performance Issues

#### Slow Response Times

**Problem**: API takes too long to respond

**Solutions**:
```bash
# Check OPIK traces for bottlenecks
# Visit https://console.opik.ai/

# Enable caching
# Ensure cache adapter is initialized

# Check network latency
ping api.groq.com

# Reduce token usage
# Optimize prompts for brevity
```

#### High Memory Usage

**Problem**: Application uses too much memory

**Solutions**:
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm run dev

# Clear cache regularly
# Implement cache eviction

# Check for memory leaks
# Use Chrome DevTools Memory profiler
```

### Environment Issues

#### Environment Variables Not Working

**Problem**: Environment variables undefined in code

**Solutions**:
```bash
# Verify .env file exists
ls -la .env

# Check .env file content
cat .env

# Ensure .env is in project root
# Should be at same level as package.json

# Restart dev server after changing .env
# Stop server (Ctrl+C) and start again

# Check variable loading
node -e "console.log(process.env.OPIK_API_KEY)"
```

#### Different Behavior in Production

**Problem**: Works locally but not in production

**Solutions**:
```bash
# Ensure environment variables set in production
# Vercel: Settings → Environment Variables

# Check production logs
# Vercel: Deployments → Logs

# Test production build locally
npm run build
npm start

# Check for hardcoded paths
# Use process.env for configuration
```

### OPIK AI Specific Issues

#### OPIK Connection Refused

**Problem**: Cannot connect to OPIK API

**Solutions**:
```bash
# Check network connectivity
ping api.opik.ai

# Verify API key format
# Should be a valid API key string

# Check firewall settings
# Ensure outbound connections to OPIK are allowed

# Try different workspace
OPIK_WORKSPACE=default
```

#### OPIK Traces Not Flushing

**Problem**: Traces created but not sent to OPIK

**Solutions**:
```typescript
// Ensure flush is called
await opik.flush();

// Or use flushOpik helper
import { flushOpik } from '@/lib/opik-client';
await flushOpik();

// Call flush before process exit
process.on('exit', async () => {
  await opik.flush();
});
```

### Deployment Issues

#### Vercel Build Fails

**Problem**: Build fails on Vercel but works locally

**Solutions**:
```bash
# Check Vercel build logs
# Vercel: Deployments → Build Logs

# Ensure Node.js version matches
# Vercel: Settings → General → Node Version

# Check environment variables in Vercel
# Vercel: Settings → Environment Variables

# Test build locally with Vercel CLI
npm i -g vercel
vercel build
```

#### Environment Variables Missing in Production

**Problem**: App works in preview but not production

**Solutions**:
```bash
# Check environment variable scopes
# Vercel: Settings → Environment Variables
# Ensure variables set for "Production" environment

# Redeploy after adding variables
# Vercel: Deployments → Redeploy

# Verify variable names match .env.example
# Check for typos in variable names
```

## Debugging Tips

### Enable Verbose Logging

```typescript
// In development
const logger = require('@/utils/logger').logger;
logger.level = 'debug';

// Or set environment variable
DEBUG=* npm run dev
```

### Use OPIK Traces for Debugging

```typescript
// Add detailed traces
const trace = opik.trace({
  name: "Debug_Generation",
  input: { topic, params },
  metadata: {
    step: "debugging",
    timestamp: new Date().toISOString()
  }
});

try {
  // Your code here
  trace.span({ name: "Step_1" }).end();
  trace.span({ name: "Step_2" }).end();
} catch (error) {
  trace.end({
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    }
  });
}
```

### Check API Responses

```bash
# Test API with curl
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"type":"topics","input":"test"}' \
  -v

# -v flag shows verbose output
```

### Monitor Network Requests

1. Open browser DevTools (F12)
2. Go to Network tab
3. Make API request
4. Check request/response details
5. Look for error codes or failed requests

## Getting Help

### Documentation

- [GitBook Documentation](./) - Complete documentation
- [API Reference](../05-api) - API endpoint documentation
- [OPIK AI Docs](https://docs.opik.ai/) - OPIK documentation

### Community Support

- **GitHub Issues**: [Create Issue](https://github.com/your-repo/commit-to-career/issues)
- **Discord**: Join our [Discord Server](https://discord.gg/alterego)
- **Stack Overflow**: Tag with `alterego`

### Official Support

- **OPIK AI**: support@opik.ai
- **Groq**: support@groq.com
- **Tavily**: support@tavily.com
- **Next.js**: Next.js GitHub Discussions

### Error Codes Reference

| Error Code | Description | Solution |
|------------|-------------|-----------|
| `VALIDATION_ERROR` | Invalid input data | Check request body format |
| `GENERATION_FAILED` | AI generation failed | Check API keys and quotas |
| `API_ERROR` | External API error | Check provider status |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait or upgrade plan |
| `INTERNAL_ERROR` | Internal server error | Check logs and retry |

## Prevention

### Regular Maintenance

```bash
# Keep dependencies updated
npm update

# Run security audit
npm audit
npm audit fix

# Run tests
npm test

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

### Monitoring

- Check OPIK dashboard regularly
- Monitor API usage and quotas
- Set up error alerting
- Review performance metrics

### Backup & Recovery

- Keep `.env.example` updated
- Document API key rotation process
- Maintain rollback procedures
- Test recovery procedures

## Contact

If you continue to experience issues:

- **Email**: support@alterego.ai
- **GitHub Issues**: [Create Issue](https://github.com/your-repo/commit-to-career/issues)
- **Discord**: [Join Server](https://discord.gg/alterego)

---

**Still having issues?** Check our [FAQ](../08-resources/faq) or create a [GitHub Issue](https://github.com/your-repo/commit-to-career/issues).
