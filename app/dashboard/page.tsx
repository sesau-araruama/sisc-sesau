export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Dashboard do Sistema de Saúde
          </h1>
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Bem-vindo(a) ao Sistema Interno de Informação
            </h2>
            <p className="text-gray-600 mb-6">
              Selecione uma das funcionalidades abaixo para começar.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h3 className="font-semibold text-blue-800 mb-2">👥 Pacientes</h3>
                <p className="text-blue-600 text-sm">Gerencie o cadastro de pacientes</p>
                <button className="mt-3 text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Acessar
                </button>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <h3 className="font-semibold text-green-800 mb-2">📅 Agendamentos</h3>
                <p className="text-green-600 text-sm">Visualize e crie novos agendamentos</p>
                <button className="mt-3 text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Acessar
                </button>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                <h3 className="font-semibold text-purple-800 mb-2">📊 Relatórios</h3>
                <p className="text-purple-600 text-sm">Acesse relatórios e estatísticas</p>
                <button className="mt-3 text-sm bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                  Acessar
                </button>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t">
              <a 
                href="/" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Voltar para a página inicial
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}