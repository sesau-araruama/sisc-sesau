import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout realizado' });
  
  // Remove o cookie
  response.cookies.set({
    name: 'sisc-session',
    value: '',
    expires: new Date(0),
    path: '/',
  });
  
  return response;
}