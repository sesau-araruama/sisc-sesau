import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Validações
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar senha atual
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Senha atual incorreta' },
        { status: 401 }
      );
    }
    
    // Validar nova senha
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        { 
          error: 'A senha deve ter pelo menos 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial (@$!%*?&)' 
        },
        { status: 400 }
      );
    }
    
    // Verificar se é diferente da atual
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'A nova senha deve ser diferente da atual' },
        { status: 400 }
      );
    }
    
    // Criptografar nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Atualizar usuário
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        forcePasswordChange: false,
        failedLoginAttempts: 0,
        lockedUntil: null
      }
    });
    
    // Registrar no log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        action: 'PASSWORD_CHANGED',
        details: JSON.stringify({ forcedChange: true })
      }
    });
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Senha alterada com sucesso!' 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}