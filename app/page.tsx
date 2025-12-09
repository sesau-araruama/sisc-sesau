export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Barra superior simplificada */}
      <header className="bg-[#0c3f6a] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">SISC-SESAU</h1>
          <a
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            Acessar Sistema
          </a>
        </div>
      </header>

      {/* Conteúdo Principal - APRESENTAÇÃO DO SISTEMA */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Sistema Interno de Informação da Saúde Coletiva
            </h2>
            <p className="text-gray-600 text-lg">
              Plataforma administrativa da Secretaria Municipal de Saúde de Araruama
            </p>
          </div>

          {/* Grid de Funcionalidades */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="text-blue-800 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Cadastro de Pacientes</h3>
              <p className="text-blue-600">
                Gerencie o cadastro único de pacientes do município com histórico completo.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="text-green-800 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Agendamentos</h3>
              <p className="text-green-600">
                Controle de consultas, exames e procedimentos em todas as unidades.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <div className="text-purple-800 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-purple-800 mb-2">Relatórios</h3>
              <p className="text-purple-600">
                Acesse relatórios detalhados e indicadores de saúde para tomada de decisão.
              </p>
            </div>
          </div>

          {/* Chamada para ação */}
          <div className="text-center bg-gray-50 rounded-2xl p-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Pronto para gerenciar a saúde do município?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Acesse o sistema interno para começar a utilizar as ferramentas de gestão da saúde coletiva.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg text-white bg-[#0c3f6a] hover:bg-[#0a3559] transition-colors"
            >
              Acessar Dashboard
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </main>

      {/* Rodapé atualizado */}
      <footer className="mt-16 border-t border-gray-200 py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-700 font-bold">
                SISC-SESAU - Sistema Interno de Informação
              </p>
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} - Todos os direitos reservados.
              </p>
            </div>
            <div className="text-gray-600">
              <p>Desenvolvido por: Enf° Rodrigo Bruno.</p>
              <p className="text-sm mt-1">Secretaria Municipal de Saúde de Araruama</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}