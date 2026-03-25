import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { LogIn } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { settings } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('Usuário não encontrado. Deseja criar uma conta?');
      } else if (err.code === 'auth/wrong-password') {
        setError('Senha incorreta.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else {
        setError('Erro ao autenticar. Verifique suas credenciais.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-cover bg-center"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 63, 127, 0.4), rgba(0, 63, 127, 0.4)), url('${settings.loginBg}')` 
      }}
    >
      <div className="bg-white p-10 rounded-[20px] w-[90%] max-w-[400px] text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-300">
        <img 
          src={settings.logoUrl} 
          alt="Logo" 
          className="w-[80px] h-[80px] mx-auto mb-4 rounded-full bg-white object-contain p-1 shadow-sm"
        />
        <h2 className="text-[#003F7F] mb-2.5 text-2xl font-extrabold">
          {isSignUp ? 'Criar Conta' : 'Acesso Restrito'}
        </h2>
        <p className="text-[13px] text-[#64748B] mb-6">
          {isSignUp ? 'Cadastre-se para acessar o sistema' : 'Entre com suas credenciais de acesso'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail profissional"
            className="w-full p-3.5 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#003F7F]/20"
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full p-3.5 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#003F7F]/20"
          />
          <button 
            type="submit"
            disabled={loading}
            className="btn-main bg-[#003F7F] disabled:opacity-50"
          >
            {loading ? 'PROCESSANDO...' : (
              <>
                <LogIn size={18} />
                {isSignUp ? 'CADASTRAR' : 'ENTRAR NO SISTEMA'}
              </>
            )}
          </button>
        </form>
        
        {error && (
          <p className="text-[#EF4444] text-[12px] mt-4 font-bold">
            {error}
          </p>
        )}

        <div className="mt-6 pt-6 border-t border-gray-100">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#003F7F] text-[13px] font-bold hover:underline"
          >
            {isSignUp ? 'Já tem uma conta? Entre aqui' : 'Não tem uma conta? Cadastre-se'}
          </button>
        </div>
      </div>
    </div>
  );
}
