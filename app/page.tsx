import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"

export default async function Home() {
  // Obtém a sessão do usuário no servidor
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Barra superior azul com título e botão de login */}
      <header className="bg-[#0c3f6a] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">SISC-SESAU</h1>
          {!session && (
            <a
              href="/api/auth/signin?callbackUrl=/dashboard"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.325 19.611c-1.445.777-3.144 1.223-4.98 1.223-4.042 0-7.345-3.303-7.345-7.345 0-4.041 3.303-7.344 7.345-7.344 1.836 0 3.535.446 4.98 1.223l-2.04 2.04c-.775-.447-1.703-.71-2.688-.71-2.848 0-5.172 2.324-5.172 5.172 0 2.848 2.324 5.172 5.172 5.172.985 0 1.913-.263 2.688-.71l2.04 2.04z"/>
              </svg>
              Login
            </a>
          )}
        </div>
      </header>

      {/* Conteúdo Principal: Área do Chat */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Sistema interno de Informação
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Chat público para comunicação interna.
          </p>

          {/* Container do Chat (Estrutura Básica) */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-6 h-[500px] flex flex-col">
            
            {/* Área de Mensagens (A ser populada dinamicamente) */}
            <div className="flex-grow overflow-y-auto mb-4 p-3 bg-white rounded border">
              <div className="text-center text-gray-500 py-10">
                <p>As mensagens do chat público aparecerão aqui.</p>
                <p className="text-sm mt-2">(Esta é uma visualização estática. A implementação em tempo real requer um backend.)</p>
              </div>
              {/* Exemplo de uma mensagem (para visualização) */}
              <div className="mb-3 text-right">
                <div className="inline-block bg-blue-100 text-gray-800 rounded-lg px-4 py-2 max-w-xs">
                  <p className="font-medium">Você</p>
                  <p>Olá, pessoal! Bem-vindos ao sistema.</p>
                  <p className="text-xs text-gray-500 mt-1">Agora há pouco</p>
                </div>
              </div>
            </div>

            {/* Área de Entrada de Texto */}
            <div className="border-t pt-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Digite sua mensagem pública aqui..."
                  className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  disabled // Desabilitado até a implementação do backend
                />
                <button
                  className="px-6 py-3 bg-[#0c3f6a] text-white font-medium rounded-lg hover:bg-[#0a3559] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled // Desabilitado até a implementação do backend
                >
                  Enviar
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Este é um protótipo. Para um chat funcional, é necessário conectar a um serviço como Firebase ou Socket.io.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Novo Rodapé */}
      <footer className="mt-16 border-t border-gray-200 py-6 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-700">
          <p>
            <strong>SISC-SESAU - Sistema interno de Informação</strong> © {new Date().getFullYear()} - Todos os direitos reservados.
          </p>
          <p className="mt-1">
            Desenvolvido por: Enf° Rodrigo Bruno.
          </p>
        </div>
      </footer>
    </div>
  )
}