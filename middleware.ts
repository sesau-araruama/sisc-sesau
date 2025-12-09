import { NextRequest, NextResponse } from 'next/server';

// Rotas que requerem autenticação
const protectedRoutes = ['/dashboard', '/admin', '/pacientes', '/agendamentos'];

export function middleware(request: NextRequest) {
  const session = request.cookies.get('sisc-session');
  const { pathname } = request.nextUrl;

  // Verificar se a rota requer autenticação
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !session) {
    // Redirecionar para login se não estiver autenticado
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se estiver na página de login e já tiver sessão, redirecionar para dashboard
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};