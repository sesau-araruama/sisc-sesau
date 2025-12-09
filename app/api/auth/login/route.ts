import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { createSession, logAudit } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    const ipAddress = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Se usuário não existe
    if (!user) {
      await logAudit('unknown', email, 'LOGIN_FAILED_USER_NOT_FOUND', 
        { email }, ipAddress, userAgent);
      
      // Delay para prevenir timing attacks
      await bcrypt.compare('dummy', '$2b$10$dummyhash');
      
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
    
    // Verificar se conta está bloqueada
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      await logAudit(user.id, user.email, 'LOGIN_BLOCKED_ACCOUNT', 
        { lockedUntil: user.lockedUntil }, ipAddress, userAgent);
      
      return NextResponse.json(
        { 
          error: `Conta bloqueada até ${user.lockedUntil.toLocaleString('pt-BR')}. 
                  Tente novamente mais tarde.` 
        },
        { status: 423 }
      );
    }
    
    // Verificar senha
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      // Incrementar tentativas falhas
      const newAttempts = user.failedLoginAttempts + 1;
      let lockedUntil = null;
      
      // Bloquear após 5 tentativas falhas por 15 minutos
      if (newAttempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
      }
      
      await prisma.user.update({
        where: { email },
        data: {
          failedLoginAttempts: newAttempts,
          lockedUntil
        }
      });
      
      await logAudit(user.id, user.email, 'LOGIN_FAILED_INVALID_PASSWORD', 
        { 
          attemptNumber: newAttempts, 
          locked: newAttempts >= 5,
          lockedUntil 
        }, 
        ipAddress, userAgent);
      
      return NextResponse.json(
        { 
          error: `Senha incorreta. Tentativas restantes: ${5 - newAttempts}`,
          attemptsLeft: 5 - newAttempts
        },
        { status: 401 }
      );
    }
    
    // Login bem-sucedido - Resetar tentativas falhas
    await prisma.user.update({
      where: { email },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null
      }
    });
    
    // Criar sessão
    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      forcePasswordChange: user.forcePasswordChange
    };
    
    await createSession(sessionUser);
    
    return NextResponse.json(
      { 
        success: true, 
        user: sessionUser,
        requiresPasswordChange: user.forcePasswordChange
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Erro no login:', error);
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}