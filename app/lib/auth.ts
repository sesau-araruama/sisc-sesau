import { cookies } from 'next/headers';

export interface SessionUser {
  userId: string;
  email: string;
  name: string;
  role: string;
  expires: string;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('sisc-session');
  
  if (!sessionCookie) {
    return null;
  }

  try {
    const session = JSON.parse(sessionCookie.value) as SessionUser;
    
    // Verificar se a sessão expirou
    if (new Date(session.expires) < new Date()) {
      return null;
    }
    
    return session;
  } catch (error) {
    return null;
  }
}

export async function requireAuth(requiredRole?: string) {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Não autenticado');
  }
  
  if (requiredRole && session.role !== requiredRole) {
    throw new Error('Permissão insuficiente');
  }
  
  return session;
}