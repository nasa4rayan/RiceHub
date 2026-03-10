import { NextRequest } from 'next/server';

export interface RateLimitConfig {
  requests: number;
  window: number; // in seconds
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { requests: 100, window: 60 }
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = config.window * 1000;

  let record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + windowMs };
    rateLimitStore.set(identifier, record);
  }

  record.count++;
  const remaining = Math.max(0, config.requests - record.count);

  return {
    allowed: record.count <= config.requests,
    remaining,
  };
}

export function getRateLimitIdentifier(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  return ip.split(',')[0].trim();
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 1000);
}

export function validateSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 3 && slug.length <= 100;
}

export function validateWM_DE(wm_de: string): boolean {
  const validValues = ['hyprland', 'openbox', 'i3', 'bspwm', 'kde', 'gnome', 'xfce'];
  return validValues.includes(wm_de);
}

export function validateDistro(distro: string): boolean {
  const validValues = ['arch', 'debian', 'fedora'];
  return validValues.includes(distro);
}

export function generateChecksum(content: string): string {
  // Simple checksum for demo - in production use crypto
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}
