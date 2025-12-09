import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function UsuariosPage() {
  // Somente admin pode acessar
  const session = await requireAuth('admin');
  
  const usuarios = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Usuários</h1>
      
      <div className="mb-6">
        <Link 
          href="/admin/usuarios/novo"
          className="bg-[#00a859] text-white px-4 py-2 rounded hover:bg-[#008f4a]"
        >
          + Adicionar Novo Usuário
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-[#0c3f6a] text-white">
              <th className="py-3 px-4 text-left">Nome</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Função</th>
              <th className="py-3 px-4 text-left">Criado em</th>
              <th className="py-3 px-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user, index) => (
              <tr 
                key={user.id} 
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'medico' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">
                    Editar
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}