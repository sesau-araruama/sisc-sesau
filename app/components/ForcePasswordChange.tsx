"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ForcePasswordChangeProps {
  userEmail: string;
}

export default function ForcePasswordChange({ userEmail }: ForcePasswordChangeProps) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Validar força da senha em tempo real
  const validatePassword = (password: string) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validações
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Todos os campos são obrigatórios');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    // Verificar força da senha
    const isStrong = Object.values(passwordStrength).every(Boolean);
    if (!isStrong) {
      setError('A senha não atende a todos os requisitos de segurança');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          currentPassword,
          newPassword
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao alterar senha');
      }
      
      setSuccess('Senha alterada com sucesso! Redirecionando...');
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.refresh();
        router.push('/dashboard');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Alteração de Senha Obrigatória
        </h3>
        <p className="text-sm text-gray-600">
          Para garantir a segurança do sistema, você deve alterar sua senha.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha Atual
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c3f6a] focus:border-transparent"
            placeholder="Digite sua senha atual"
            required
            autoComplete="current-password"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nova Senha
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              validatePassword(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c3f6a] focus:border-transparent"
            placeholder="Digite a nova senha"
            required
            autoComplete="new-password"
          />
          
          {/* Requisitos da senha */}
          <div className="mt-3 space-y-1">
            <p className="text-sm font-medium text-gray-700">A senha deve conter:</p>
            <ul className="text-sm space-y-1">
              <li className={`flex items-center ${passwordStrength.length ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="mr-2">{passwordStrength.length ? '✓' : '○'}</span>
                Pelo menos 8 caracteres
              </li>
              <li className={`flex items-center ${passwordStrength.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="mr-2">{passwordStrength.uppercase ? '✓' : '○'}</span>
                Uma letra maiúscula
              </li>
              <li className={`flex items-center ${passwordStrength.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="mr-2">{passwordStrength.lowercase ? '✓' : '○'}</span>
                Uma letra minúscula
              </li>
              <li className={`flex items-center ${passwordStrength.number ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="mr-2">{passwordStrength.number ? '✓' : '○'}</span>
                Um número
              </li>
              <li className={`flex items-center ${passwordStrength.special ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="mr-2">{passwordStrength.special ? '✓' : '○'}</span>
                Um caractere especial (!@#$%^&*)
              </li>
            </ul>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Nova Senha
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c3f6a] focus:border-transparent"
            placeholder="Confirme a nova senha"
            required
            autoComplete="new-password"
          />
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00a859] hover:bg-[#008f4c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0c3f6a] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Alterando...
              </>
            ) : 'Alterar Senha'}
          </button>
        </div>
      </form>
    </div>
  );
}