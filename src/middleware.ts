import { NextRequest, NextResponse } from 'next/server';

// Sliding Window In-Memory Rate Limiter
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up expired keys periodically
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((value, key) => {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  });
}, 60000);

// WAF Attack Signatures (OWASP Top 10 inspection)
const ATTACK_PATTERNS = [
  // SQL Injection
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
  /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
  /\w*((\%27)|(\'))(\s)*((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
  /(\bunion\b.*(\s+|\+|%20)\bselect\b)/i,
  /(union(\s+|\+|%20)+select)/i,
  /(select(\s+|\+|%20)+.*from)/i,
  /(information_schema|database\(\)|sleep\(\d+\))/i,

  // Cross-Site Scripting (XSS)
  /((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i,
  /(<script|javascript:|onerror=|onload=|alert\(|eval\()/i,

  // Path Traversal
  /(\.\.\/|\.\.\\|\%2e\%2e\%2f|\%2e\%2e\/)/i,
  /(\/etc\/passwd|\/etc\/shadow|c:\\windows\\system32)/i,

  // Command Injection
  /(;|\&|\|)(\s)*(powershell|cmd\.exe|bash|sh|rm(\s+)-rf|cat(\s+)\/)/i,
];

function checkWafViolation(url: string, search: string, userAgent: string): string | null {
  const stringsToCheck = [url, search];
  try {
    stringsToCheck.push(decodeURIComponent(url));
  } catch (e) {}
  try {
    stringsToCheck.push(decodeURIComponent(search));
  } catch (e) {}

  for (const str of stringsToCheck) {
    if (!str) continue;
    for (const pattern of ATTACK_PATTERNS) {
      if (pattern.test(str)) {
        return `Potential malicious payload detected: pattern violation`;
      }
    }
  }

  if (userAgent) {
    for (const pattern of ATTACK_PATTERNS) {
      if (pattern.test(userAgent)) {
        return `Malicious User-Agent header violation`;
      }
    }
  }
  return null;
}

function checkRateLimit(ip: string, pathname: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowMs = 60000; // 1 minute window

  // Stricter limits for Auth and AI APIs
  let maxRequests = 120; // 120 req/min for general browsing
  if (pathname.startsWith('/api/auth')) {
    maxRequests = 25; // 25 req/min for auth
  } else if (pathname.startsWith('/api/ai')) {
    maxRequests = 40; // 40 req/min for AI assistant
  } else if (pathname.startsWith('/api/orders')) {
    maxRequests = 60;
  }

  const key = `${ip}:${pathname.startsWith('/api/') ? pathname.split('/')[2] : 'general'}`;
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }

  record.count += 1;
  if (record.count > maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const ip = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const userAgent = request.headers.get('user-agent') || '';

  // Skip static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. WAF Inspection on Query & URL
  const fullUrl = request.url;
  const wafViolation = checkWafViolation(fullUrl, search, userAgent);
  if (wafViolation) {
    return new NextResponse(
      JSON.stringify({
        error: 'WAF_BLOCKED_SECURITY_VIOLATION',
        message: 'Your request was blocked by CanteenBites Web Application Firewall (WAF) for suspicious security patterns.',
        refId: `WAF-${Date.now()}`,
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // 2. Rate Limiting Check
  const rateLimitResult = checkRateLimit(ip, pathname);
  if (!rateLimitResult.allowed) {
    return new NextResponse(
      JSON.stringify({
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please wait a moment before trying again.',
        retryAfterSeconds: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': `${Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)}`,
        },
      }
    );
  }

  // 3. Process Request with Production Security Headers
  const response = NextResponse.next();

  // Content-Security-Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'self';"
  );

  // Strict-Transport-Security (HSTS)
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  // Referrer-Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Rate limit response headers
  response.headers.set('X-RateLimit-Limit', '120');
  response.headers.set('X-RateLimit-Remaining', `${rateLimitResult.remaining}`);

  return response;
}

export const config = {
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
