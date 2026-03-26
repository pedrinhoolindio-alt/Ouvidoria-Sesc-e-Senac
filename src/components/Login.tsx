import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { LogIn } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error("Erro de Autenticação:", err.code, err.message);
      
      switch (err.code) {
        case 'auth/user-not-found':
          setError('Usuário não encontrado.');
          break;
        case 'auth/wrong-password':
          setError('Senha incorreta.');
          break;
        case 'auth/invalid-email':
          setError('E-mail inválido.');
          break;
        case 'auth/user-disabled':
          setError('Este usuário foi desativado.');
          break;
        case 'auth/operation-not-allowed':
          setError('O login por e-mail não está ativado no Firebase Console.');
          break;
        case 'auth/too-many-requests':
          setError('Muitas tentativas. Tente novamente mais tarde.');
          break;
        default:
          setError('Erro ao autenticar: ' + (err.message || 'Verifique suas credenciais.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const bgImage = isMobile ? settings.loginBgMobile : settings.loginBg;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#003F7F]">
      {/* Background Image */}
      {bgImage && (
        <img 
          src={bgImage}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = '0';
          }}
        />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#003F7F]/40" />

      <div className="relative z-10 bg-white p-8 rounded-[24px] w-[90%] max-w-[340px] text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-300">
        <img 
          src={settings.logoUrl} 
          alt="Logo" 
          referrerPolicy="no-referrer"
          className="w-[100px] h-[100px] mx-auto mb-6 rounded-full bg-white object-contain p-1 shadow-sm"
        />
        <h2 className="text-[#003F7F] mb-2 text-xl font-extrabold">
          Acesso Restrito
        </h2>
        <p className="text-[12px] text-[#64748B] mb-8">
          Entre com suas credenciais de acesso
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail profissional"
            className="w-full p-3.5 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#003F7F]/20 text-sm"
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full p-3.5 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#003F7F]/20 text-sm"
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#003F7F] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#002d5c] transition-colors disabled:opacity-50"
          >
            {loading ? 'PROCESSANDO...' : (
              <>
                <LogIn size={18} />
                ENTRAR NO SISTEMA
              </>
            )}
          </button>
        </form>
        
        {error && (
          <p className="text-[#EF4444] text-[12px] mt-4 font-bold">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
