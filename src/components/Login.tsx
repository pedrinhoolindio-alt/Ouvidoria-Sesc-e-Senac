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

      <div className="relative z-10 bg-white/90 backdrop-blur-xl p-10 rounded-[3rem] w-[90%] max-w-[400px] text-center shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-white/40 animate-in fade-in zoom-in duration-500">
        <div className="relative mb-8">
          <img 
            src={settings.logoUrl} 
            alt="Logo" 
            referrerPolicy="no-referrer"
            className="w-32 h-32 mx-auto rounded-full bg-white object-contain p-2 shadow-2xl border-4 border-white"
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white uppercase tracking-widest">
            Seguro
          </div>
        </div>
        
        <h2 className="text-[#003F7F] mb-2 text-2xl font-black tracking-tight">
          Portal de Gestão
        </h2>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">
          Acesso Restrito Ouvidoria
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">E-mail Profissional</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@sesc-ce.com.br"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-[#003F7F]/10 focus:bg-white transition-all text-sm font-medium text-slate-700"
            />
          </div>
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Senha de Acesso</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-[#003F7F]/10 focus:bg-white transition-all text-sm font-medium text-slate-700"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="btn-relief btn-relief-blue w-full !py-4 !text-[12px] !rounded-2xl mt-4"
          >
            {loading ? 'AUTENTICANDO...' : (
              <>
                <LogIn size={20} />
                ENTRAR NO PORTAL
              </>
            )}
          </button>
        </form>
        
        {error && (
          <div className="mt-6 p-3 bg-rose-50 border border-rose-100 rounded-2xl">
            <p className="text-rose-600 text-[11px] font-black uppercase tracking-wider">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
