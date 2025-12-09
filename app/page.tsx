'use client' // 👈 Isso é ESSENCIAL: transforma o componente em "Client Component"

import { useState, useEffect, FormEvent } from 'react'

// Define a "forma" (tipo) de uma mensagem que vem da nossa API
interface ChatMessage {
  id: string
  text: string
  createdAt: string // A API envia como string, depois convertemos para Date se precisar
}

export default function Home() {
  // 1. ESTADOS (VARIÁVEIS REATIVAS) DO COMPONENTE
  const [messages, setMessages] = useState<ChatMessage[]>([]) // Lista de mensagens
  const [newMessage, setNewMessage] = useState('') // Texto digitado no input
  const [isLoading, setIsLoading] = useState(false) // Controla o "carregando..."
  const [isSending, setIsSending] = useState(false) // Controla o "enviando..."

  // 2. FUNÇÃO: Buscar o histórico de mensagens da nossa API
  const fetchMessages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat/messages') // Chama a rota GET
      if (!response.ok) throw new Error('Falha ao carregar mensagens')
      const data = await response.json()
      setMessages(data) // Atualiza o estado com as mensagens recebidas
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
      alert('Não foi possível carregar o chat. Tente recarregar a página.')
    } finally {
      setIsLoading(false)
    }
  }

  // 3. FUNÇÃO: Enviar uma nova mensagem para a nossa API
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault() // Impede o recarregamento padrão do formulário
    if (!newMessage.trim() || isSending) return // Não envia se estiver vazio ou já enviando

    const messageToSend = newMessage.trim()
    setIsSending(true)

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: messageToSend }),
      })

      if (!response.ok) throw new Error('Falha ao enviar mensagem')

      // Limpa o campo de input e busca as mensagens atualizadas
      setNewMessage('')
      await fetchMessages() // Recarrega a lista com a nova mensagem

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      alert('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setIsSending(false)
    }
  }

  // 4. EFEITO: Buscar mensagens quando a página for carregada
  useEffect(() => {
    fetchMessages()
  }, [])

  // 5. RENDERIZAÇÃO DA INTERFACE
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Barra superior (inalterada) */}
      <header className="bg-[#0c3f6a] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">SISC-SESAU</h1>
          <a
            href="/api/auth/signin?callbackUrl=/dashboard"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.325 19.611c-1.445.777-3.144 1.223-4.98 1.223-4.042 0-7.345-3.303-7.345-7.345 0-4.041 3.303-7.344 7.345-7.344 1.836 0 3.535.446 4.98 1.223l-2.04 2.04c-.775-.447-1.703-.71-2.688-.71-2.848 0-5.172 2.324-5.172 5.172 0 2.848 2.324 5.172 5.172 5.172.985 0 1.913-.263 2.688-.71l2.04 2.04z"/>
            </svg>
            Login
          </a>
        </div>
      </header>

      {/* Conteúdo Principal: Chat Ativo */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Sistema interno de Informação
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Chat público para comunicação interna.
          </p>

          {/* Container do Chat */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-6 h-[500px] flex flex-col">
            
            {/* Área de Mensagens (AGORA DINÂMICA) */}
            <div className="flex-grow overflow-y-auto mb-4 p-3 bg-white rounded border">
              {isLoading ? (
                // Estado de Carregamento
                <div className="text-center text-gray-500 py-10">
                  <p>Carregando mensagens...</p>
                </div>
              ) : messages.length === 0 ? (
                // Estado Vazio
                <div className="text-center text-gray-500 py-10">
                  <p>Nenhuma mensagem ainda. Seja o primeiro a escrever!</p>
                </div>
              ) : (
                // Lista de Mensagens
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="mb-3">
                      <div className="inline-block bg-blue-50 text-gray-800 rounded-lg px-4 py-2 max-w-xs md:max-w-md">
                        <p>{msg.text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Formulário para Enviar Nova Mensagem */}
            <div className="border-t pt-4">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem pública aqui..."
                  className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0c3f6a] text-white font-medium rounded-lg hover:bg-[#0a3559] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSending || !newMessage.trim()}
                >
                  {isSending ? 'Enviando...' : 'Enviar'}
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2 text-center">
                As mensagens são públicas e aparecerão para todos.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé (inalterado) */}
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