import { getSession } from '@/app/lib/auth';
import LogoutButton from '@/app/components/LogoutButton';

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session) {
    return <div>Redirecionando para login...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard SISC-SESAU</h1>
          <p className="text-gray-600">
            Bem-vindo, <span className="font-semibold">{session.name}</span>
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
              {session.role}
            </span>
          </p>
        </div>
        <LogoutButton />
      </div>
      
      {/* Seu conteúdo do dashboard aqui */}
    </div>
  );
}