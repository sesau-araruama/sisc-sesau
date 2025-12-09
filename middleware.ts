import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  // Rotas públicas que não requerem autenticação
  const publicPaths = ['/', '/login', '/api/auth/login', '/api/auth/change-password'];
  
  // Verificar se é uma rota pública
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // Se não tem sessão e não é rota pública → redirecionar para login
  if (!session && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se tem sessão
  if (session) {
    // Se tenta acessar login → redirecionar para dashboard
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Se precisa alterar senha e não está na página de alteração
    if (session.user.forcePasswordChange && 
        pathname !== '/force-password-change' &&
        !pathname.startsWith('/api/auth/change-password')) {
      return NextResponse.redirect(new URL('/force-password-change', request.url));
    }

    // Verificar permissões de admin
    if (pathname.startsWith('/admin') && session.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};