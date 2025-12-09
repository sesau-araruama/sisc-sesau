import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import ForcePasswordChange from '@/components/ForcePasswordChange';

export default async function ForcePasswordChangePage() {
  const session = await getSession();
  
  // Se não estiver logado, redirecionar para login
  if (!session) {
    redirect('/login');
  }
  
  // Se já alterou a senha, redirecionar para dashboard
  if (!session.user.forcePasswordChange) {
    redirect('/dashboard');
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-[#0c3f6a] p-3">
            <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          SISC-SESAU Araruama
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sistema Interno de Informação da Saúde Coletiva
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ForcePasswordChange userEmail={session.user.email} />
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Importante:</strong> Esta é uma medida de segurança obrigatória. 
                    Após alterar sua senha, você terá acesso completo ao sistema.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}