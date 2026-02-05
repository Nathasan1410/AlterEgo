# Authentication

## Overview

AlterEgo currently uses API key-based authentication for external services. For production deployment, implement more robust authentication methods.

## Current Implementation

### API Key Authentication

```typescript
// API key from environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OPIK_API_KEY = process.env.OPIK_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Usage in adapters
const groqClient = new Groq({ apiKey: GROQ_API_KEY });
const opikClient = new Opik({
  apiKey: OPIK_API_KEY,
  projectName: 'commit-to-career',
});
const tavilyClient = tavily({ apiKey: TAVILY_API_KEY });
```

### Environment Variables

```env
# .env.example
OPIK_API_KEY=your_opik_api_key_here
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Security Best Practices

### 1. Never Commit API Keys

```gitignore
# .gitignore - Always add
.env
.env.local
.env.production
.env.development
*.key
*.pem
```

### 2. Use Environment Variables

```typescript
// ✅ Good - Use environment variables
const apiKey = process.env.API_KEY;

// ❌ Bad - Hardcode API keys
const apiKey = 'sk-xxx...';
```

### 3. Validate API Keys

```typescript
// src/utils/validation.ts
export function validateApiKey(key: string): boolean {
  if (!key || key.trim().length === 0) {
    throw new ValidationError('API key is required', 'apiKey', key);
  }

  if (!key.startsWith('sk-')) {
    throw new ValidationError('Invalid API key format', 'apiKey', key);
  }

  return true;
}

// Validate on startup
validateApiKey(process.env.GROQ_API_KEY);
validateApiKey(process.env.OPIK_API_KEY);
```

## Future Authentication Methods

### 1. JWT-Based Authentication

```typescript
// Implement JWT authentication for user sessions
import { SignJWT, VerifyJWT } from 'jose';

interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin' | 'enterprise';
}

// Generate JWT
function generateJWT(user: JWTPayload): string {
  const token = SignJWT(user, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });

  return token;
}

// Verify JWT
function verifyJWT(token: string): JWTPayload | null {
  try {
    const decoded = VerifyJWT(token, process.env.JWT_SECRET);

    return decoded;
  } catch (error) {
    return null;
  }
}

// Middleware for Next.js
export function authMiddleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const decoded = verifyJWT(token);

  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Add user info to request
  req.user = decoded;

  return NextResponse.next();
}
```

### 2. OAuth 2.0

```typescript
// Implement OAuth for social login
import { OAuth2Client } from 'oauth2-client';

const oauthClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'https://alterego.ai/auth/google/callback',
});

// Authorization endpoint
export async function googleAuth(req: NextRequest) {
  const authorizationUrl = oauthClient.authorizationURL({
    scope: ['profile', 'email'],
    state: generateState(),
  });

  return NextResponse.redirect(authorizationUrl);
}

// Callback endpoint
export async function googleCallback(req: NextRequest) {
  const { code } = req.query;

  if (code !== 'success') {
    return NextResponse.redirect('/login?error=google_auth_failed');
  }

  const { tokens } = await oauthClient.getAccessToken(code);

  // Exchange code for user token
  const userToken = await exchangeForUserToken(tokens.access_token);

  // Set session
  req.session.userToken = userToken;

  return NextResponse.redirect('/dashboard');
}
```

### 3. API Key Rotation

```typescript
// Implement API key rotation for security
interface APIKeySet {
  current: string;
  previous: string;
  expiresAt: Date;
}

class APIKeyManager {
  private currentKeys: Map<string, APIKeySet> = new Map();

  async rotateKey(service: string): Promise<string> {
    const keySet = this.currentKeys.get(service);

    if (!keySet) {
      throw new Error(`No current key for ${service}`);
    }

    // Generate new key (implementation depends on service)
    const newKey = await this.generateNewKey(service);

    // Store new key set
    this.currentKeys.set(service, {
      current: newKey,
      previous: keySet.current,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 1000), // 90 days
    });

    // Log to OPIK
    this.observabilityAdapter.trace('API_Key_Rotation', {
      input: { service },
      output: { newKey: `***${newKey.slice(-4)}***` },
      tags: ['security', 'key-management'],
    }).end();

    return newKey;
  }

  async generateNewKey(service: string): Promise<string> {
    // Implementation depends on service API
    // For Groq, use their dashboard
    // For OPIK, use their console
    // For Tavily, use their dashboard

    const newKey = await callServiceDashboard(service);

    return newKey;
  }
}
```

## Rate Limiting

### Rate Limiting Middleware

```typescript
// src/middleware/rateLimit.ts
import { NextRequest, NextResponse } from 'next/server';

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests: boolean;
  skipFailedRequests: boolean;
}

// In-memory rate limit store
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(options: RateLimitOptions) {
  return async (req: NextRequest, res: NextResponse) => {
    const identifier = req.headers.get('x-forwarded-for') || req.ip || 'unknown';

    const now = Date.now();
    const windowStart = requestCounts.get(identifier)?.resetTime || now;
    const windowElapsed = now - windowStart;

    // Reset window if expired
    if (windowElapsed > options.windowMs) {
      requestCounts.set(identifier, {
        count: 0,
        resetTime: now,
      });
    }

    const record = requestCounts.get(identifier) || { count: 0, resetTime: now };

    // Check rate limit
    if (record.count >= options.maxRequests) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          retryAfter: new Date(now + options.windowMs).toISOString(),
        },
        { status: 429 }
      );
    }

    // Increment count
    record.count += 1;
    requestCounts.set(identifier, record);

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', options.maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', (options.maxRequests - record.count).toString());
    res.setHeader('X-RateLimit-Reset', new Date(now + options.windowMs).toISOString());
    res.setHeader('X-RateLimit-Window', options.windowMs.toString());

    // OPIK logging
    const trace = getOpikClient().trace('Rate_Limit_Check', {
      input: { identifier, count: record.count },
      tags: ['rate-limit', 'security'],
    });

    if (record.count >= options.maxRequests) {
      trace.end({
        error: {
          type: 'RATE_LIMIT_EXCEEDED',
          message: 'Client exceeded rate limit',
        },
      metadata: {
        identifier,
        retryAfter: new Date(now + options.windowMs).toISOString(),
      },
      });
    } else {
      trace.end();
    }

    return NextResponse.next();
  };
}
```

## API Key Best Practices

### 1. Key Storage

```typescript
// ✅ Good - Use environment variables
const apiKey = process.env.GROQ_API_KEY;

// ❌ Bad - Store in database without encryption
const apiKey = await db.apiKeys.findOne({ service: 'groq' });

// ❌ Bad - Commit to code
const API_KEY = 'sk-xxx...';
```

### 2. Key Rotation

```typescript
// Rotate keys every 90 days
const KEY_ROTATION_DAYS = 90;

async function shouldRotateKey(service: string): Promise<boolean> {
  const lastRotation = await getLastRotationDate(service);
  const daysSinceRotation = Date.now() - lastRotation.getTime();
  const daysPassed = daysSinceRotation / (1000 * 60 * 60 * 24);

  return daysPassed >= KEY_ROTATION_DAYS;
}
```

### 3. Key Validation

```typescript
// Validate key format and length
export function validateAPIKey(key: string, service: string): { valid: boolean; error?: string } {
  const errors: string[] = [];

  // Check length
  if (!key || key.length < 10) {
    errors.push('API key is too short');
  }

  // Check format for different services
  if (service === 'groq' && !key.startsWith('sk-')) {
    errors.push('Invalid Groq API key format');
  }

  if (errors.length > 0) {
    return { valid: false, error: errors.join(', ') };
  }

  return { valid: true };
}
```

## OPIK Integration

### Auth Logging

```typescript
// Log authentication attempts
const trace = getOpikClient().trace('Authentication_Attempt', {
  input: {
    method: 'api-key',
    service: 'groq',
    userId: userId,
  },
  tags: ['authentication', 'security'],
});

try {
  const result = await authenticate();
  trace.end({ output: { success: true, userId: result.userId } });
} catch (error) {
  trace.end({ error: { type: 'AUTH_FAILED', message: error.message } });
}
```

### Key Management Tracking

```typescript
// Track key usage and rotation
this.observabilityAdapter.trace('API_Key_Usage', {
  input: {
    service: 'groq',
    keyVersion: '1.0',
    lastRotated: lastRotationDate,
  },
  tags: ['api-management', 'security', 'cost'],
});

this.observabilityAdapter.trace('API_Key_Rotation', {
  input: {
    service: 'groq',
    oldKeyVersion: '1.0',
    newKeyVersion: '2.0',
    rotationReason: 'Scheduled rotation (90 days)',
  },
  tags: ['api-management', 'security'],
});
```

## Security Headers

### CORS Configuration

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://alterego.ai',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400', // 24 hours
          },
        ],
      },
    ];
  },
};
```

### Content Security Policy

```typescript
// Set CSP headers
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://",
              "frame-src 'self'",
              "connect-src 'self' https://alterego.ai",
              "font-src 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};
```

## Summary

Authentication for AlterEgo uses:

- ✅ **API Key Authentication**: Simple, effective for MVP
- ✅ **Environment Variables**: Secure, production-ready
- ✅ **Rate Limiting**: Prevents API abuse
- ✅ **CORS Configuration**: Allows controlled cross-origin requests
- ✅ **Key Rotation**: Regular rotation for security
- ✅ **OPIK Integration**: Track authentication attempts and key usage

**Future Enhancements**:
- JWT-based user authentication
- OAuth 2.0 social login
- API key rotation automation
- Enhanced security monitoring

---

**Built with ❤️ for Commit To Change 2026 Hackathon**

🚀 **Powered by OPIK AI - Ensuring Highest Quality AI Generation**
