import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useSettings, convertGoogleDriveLink } from '../hooks/useSettings';
import { Save, Image as ImageIcon, Layout } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export default function Settings() {
  const { settings, loading } = useSettings();
  const [loginBg, setLoginBg] = useState('');
  const [loginBgMobile, setLoginBgMobile] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (settings && !saving) {
      setLoginBg(settings.loginBg);
      setLoginBgMobile(settings.loginBgMobile);
      setLogoUrl(settings.logoUrl);
    }
  }, [settings, saving]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await setDoc(doc(db, 'settings', 'global'), {
        loginBg,
        loginBgMobile,
        logoUrl
      });
      setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/global');
      setMessage({ type: 'error', text: 'Erro ao salvar configurações. Verifique suas permissões.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[20px] shadow-[0_10px_15px_rgba(0,0,0,0.05)] p-8 border border-[#E2E8F0]">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-[#003F7F]/10 rounded-xl text-[#003F7F]">
            <Layout size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#003F7F]">Personalização do Sistema</h2>
            <p className="text-sm text-[#64748B]">Altere as imagens de fundo e logomarca</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={14} />
              URL da Imagem de Fundo (Computador)
            </label>
            <input 
              type="text" 
              value={loginBg}
              onChange={(e) => setLoginBg(e.target.value)}
              placeholder="https://exemplo.com/imagem-desktop.jpg"
              className="w-full p-3.5 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#003F7F]/10 text-sm"
            />
            <p className="text-[10px] text-[#94A3B8]">Recomendado: Imagens horizontais (1920x1080). Certifique-se que o link do Google Drive está compartilhado como "Qualquer pessoa com o link".</p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={14} />
              URL da Imagem de Fundo (Celular)
            </label>
            <input 
              type="text" 
              value={loginBgMobile}
              onChange={(e) => setLoginBgMobile(e.target.value)}
              placeholder="https://exemplo.com/imagem-mobile.jpg"
              className="w-full p-3.5 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#003F7F]/10 text-sm"
            />
            <p className="text-[10px] text-[#94A3B8]">Recomendado: Imagens verticais (1080x1920). Certifique-se que o link do Google Drive está compartilhado como "Qualquer pessoa com o link".</p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={14} />
              URL da Logomarca
            </label>
            <input 
              type="text" 
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://exemplo.com/logo.png"
              className="w-full p-3.5 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#003F7F]/10 text-sm"
            />
            <p className="text-[10px] text-[#94A3B8]">Recomendado: Imagem quadrada com fundo transparente (PNG). Certifique-se que o link do Google Drive está compartilhado como "Qualquer pessoa com o link".</p>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={saving}
              className="btn-main bg-[#003F7F] w-full md:w-auto px-8"
            >
              <Save size={18} />
              {saving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
            </button>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm font-bold ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
        </form>

        <div className="mt-10 pt-10 border-t border-[#F1F5F9]">
          <h3 className="text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider mb-4">Pré-visualização</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <span className="text-[10px] text-[#94A3B8]">Logo:</span>
              <div className="h-32 bg-[#F8FAFC] rounded-xl flex items-center justify-center border border-dashed border-[#CBD5E1]">
                <img 
                  src={convertGoogleDriveLink(logoUrl)} 
                  alt="Preview Logo" 
                  referrerPolicy="no-referrer"
                  className="h-20 object-contain" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-[#94A3B8]">Fundo Desktop:</span>
              <div className="h-32 rounded-xl border border-dashed border-[#CBD5E1] overflow-hidden relative bg-[#F8FAFC]">
                {loginBg ? (
                  <img 
                    src={convertGoogleDriveLink(loginBg)} 
                    alt="Preview Desktop" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#94A3B8] text-[10px]">
                    Sem imagem
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-[#94A3B8]">Fundo Mobile:</span>
              <div className="h-32 rounded-xl border border-dashed border-[#CBD5E1] w-[180px] mx-auto overflow-hidden relative bg-[#F8FAFC]">
                {loginBgMobile ? (
                  <img 
                    src={convertGoogleDriveLink(loginBgMobile)} 
                    alt="Preview Mobile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#94A3B8] text-[10px] text-center px-2">
                    Usando fundo padrão (PC)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
