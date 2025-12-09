import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 1. Validar entrada
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // 2. Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Não revelar se o usuário existe ou não
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // 3. Verificar senha (comparar hash)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // 4. Criar sessão segura (sem JWT complexo)
    // Vamos usar um cookie HTTP-only seguro
    const sessionData = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
    };

    const response = NextResponse.json(
      {
        message: 'Login realizado com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // 5. Configurar cookie seguro
    response.cookies.set({
      name: 'sisc-session',
      value: JSON.stringify(sessionData),
      httpOnly: true, // IMPORTANTE: não acessível via JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS em produção
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}