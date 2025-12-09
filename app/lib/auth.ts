import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { prisma } from './prisma';

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error('SESSION_SECRET não configurada');
}
const encodedKey = new TextEncoder().encode(secretKey);

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  forcePasswordChange: boolean;
}

export interface Session {
  user: SessionUser;
  expires: string;
}

// Tempo de expiração da sessão (8 horas)
const SESSION_EXPIRY_HOURS = 8;

export async function encrypt(payload: any): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRY_HOURS}h`)
    .sign(encodedKey);
}

export async function decrypt(session: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error('Erro ao descriptografar sessão:', error);
    return null;
  }
}

export async function createSession(user: SessionUser) {
  const expires = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000);
  const session = await encrypt({ user, expires: expires.toISOString() });
  
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires,
    sameSite: 'lax',
    path: '/',
  });
  
  // Registrar login no audit log
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      userEmail: user.email,
      action: 'LOGIN_SUCCESS',
      details: JSON.stringify({ role: user.role })
    }
  }).catch(err => console.error('Erro ao registrar log:', err));
}

export async function updateSession() {
  const session = await getSession();
  if (!session) return null;
  
  const expires = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000);
  const newSession = await encrypt({ 
    user: session.user, 
    expires: expires.toISOString() 
  });
  
  const cookieStore = await cookies();
  cookieStore.set('session', newSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires,
    sameSite: 'lax',
    path: '/',
  });
  
  return session;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  
  if (!session) return null;
  
  try {
    const payload = await decrypt(session);
    if (!payload || !payload.user) return null;
    
    // Verificar se a sessão expirou
    if (new Date(payload.expires) < new Date()) {
      await deleteSession();
      return null;
    }
    
    return {
      user: payload.user,
      expires: payload.expires
    };
  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

// Função auxiliar para registrar auditoria
export async function logAudit(
  userId: string,
  userEmail: string,
  action: string,
  details?: any,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        userEmail,
        action,
        ipAddress,
        userAgent,
        details: details ? JSON.stringify(details) : null
      }
    });
  } catch (error) {
    console.error('Erro ao registrar log de auditoria:', error);
  }
}