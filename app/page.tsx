import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"

export default async function Home() {
  // Obtém a sessão do usuário no servidor
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-white">
      {/* Barra superior azul */}
      <header className="bg-[#0c3f6a] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Sistema de Saúde de Araruama</h1>
          {session && (
            <div className="flex items-center gap-4">
              <span>Olá, {session.user?.name}</span>
              <a 
                href="/api/auth/signout" 
                className="bg-white text-[#0c3f6a] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Sair
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Título principal */}
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            {session ? `Bem-vindo(a) de volta, ${session.user?.name}!` : 'Sistema de Gestão de Saúde'}
          </h2>
          
          {/* Descrição */}
          <p className="text-lg text-gray-600 mb-10">
            {session ? (
              'Acesse todas as funcionalidades do sistema para gerenciar pacientes, agendamentos e prontuários médicos.'
            ) : (
              'Solução completa para gestão de clínicas e consultórios médicos. Acesse com sua conta para começar.'
            )}
          </p>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              // Usuário logado: Dashboard
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-[#0c3f6a] hover:bg-[#0a3559] transition-colors shadow-sm"
              >
                Acessar Dashboard
              </a>
            ) : (
              // Usuário não logado: Login
              <a
                href="/api/auth/signin?callbackUrl=/dashboard"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-[#0c3f6a] hover:bg-[#0a3559] transition-colors shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.325 19.611c-1.445.777-3.144 1.223-4.98 1.223-4.042 0-7.345-3.303-7.345-7.345 0-4.041 3.303-7.344 7.345-7.344 1.836 0 3.535.446 4.98 1.223l-2.04 2.04c-.775-.447-1.703-.71-2.688-.71-2.848 0-5.172 2.324-5.172 5.172 0 2.848 2.324 5.172 5.172 5.172.985 0 1.913-.263 2.688-.71l2.04 2.04z"/>
                </svg>
                Entrar com Google
              </a>
            )}
            
            {/* Botão secundário (opcional) */}
            {!session && (
              <a
                href="#sobre"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-[#0c3f6a] bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Saiba Mais
              </a>
            )}
          </div>

          {/* Seção adicional para não logados */}
          {!session && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 border border-gray-200 rounded-lg">
                <div className="text-[#0c3f6a] text-2xl mb-4">👨‍⚕️</div>
                <h3 className="font-semibold text-gray-800 mb-2">Gestão de Pacientes</h3>
                <p className="text-gray-600">Cadastro completo de pacientes com histórico médico</p>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg">
                <div className="text-[#0c3f6a] text-2xl mb-4">📅</div>
                <h3 className="font-semibold text-gray-800 mb-2">Agendamento Inteligente</h3>
                <p className="text-gray-600">Controle de consultas e agenda médica integrada</p>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg">
                <div className="text-[#0c3f6a] text-2xl mb-4">📊</div>
                <h3 className="font-semibold text-gray-800 mb-2">Relatórios Completos</h3>
                <p className="text-gray-600">Geração de relatórios e estatísticas em tempo real</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Rodapé simples */}
      <footer className="mt-16 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Sistema de Saúde de Araruama © {new Date().getFullYear()} - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  )
}