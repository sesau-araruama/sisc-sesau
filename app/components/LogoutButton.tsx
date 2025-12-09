'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Redireciona para a página de login após logout bem-sucedido
        router.push('/login');
        router.refresh(); // Importante: força a atualização do estado de autenticação
      } else {
        console.error('Falha no logout');
      }
    } catch (error) {
      console.error('Erro durante logout:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
    >
      Sair do Sistema
    </button>
  );
}