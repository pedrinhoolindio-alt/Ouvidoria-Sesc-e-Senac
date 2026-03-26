import React from 'react';
import { 
  Table, 
  PieChart as PieChartIcon, 
  Trash2, 
  Upload, 
  LogOut,
  X,
  Settings as SettingsIcon
} from 'lucide-react';
import { Unidade } from '../types';
import { auth } from '../lib/firebase';
import { clsx } from 'clsx';
import { useSettings } from '../hooks/useSettings';

interface SidebarProps {
  unidade: Unidade;
  setUnidade: (u: Unidade) => void;
  view: 'tabela' | 'dashboard' | 'settings';
  setView: (v: 'tabela' | 'dashboard' | 'settings') => void;
  onImport: () => void;
  onClear: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isAdmin: boolean;
}

export default function Sidebar({ 
  unidade, 
  setUnidade, 
  view, 
  setView, 
  onImport, 
  onClear,
  isOpen,
  setIsOpen,
  isAdmin
}: SidebarProps) {
  const isSesc = unidade === 'sesc';
  const brandColor = isSesc ? '#003F7F' : '#F47920';
  const { settings } = useSettings();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[999] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={clsx(
          "w-[260px] text-white h-screen fixed p-6 flex flex-col z-[1000] transition-all duration-500 items-center lg:translate-x-0 shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ 
          background: isSesc 
            ? 'linear-gradient(180deg, #003F7F 0%, #002a55 100%)' 
            : 'linear-gradient(180deg, #F47920 0%, #c45d13 100%)' 
        }}
      >
        <button 
          className="lg:hidden absolute top-4 right-4 text-white/70 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>
      <img 
        src={settings.logoUrl} 
        alt="Ouvidoria Logo" 
        referrerPolicy="no-referrer"
        className="w-[90px] h-[90px] rounded-full bg-white block mb-4 object-contain p-0 shadow-md"
      />
      <h2 className="text-[1.4rem] mb-1 text-white text-center font-extrabold w-full">
        {isSesc ? 'Sesc' : 'Senac'}
      </h2>
      <p className="text-[10px] text-center opacity-70 mb-6 tracking-widest w-full uppercase">
        Gestão de Ouvidoria
      </p>

      <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-1.5 mb-8 w-full border border-white/10 shadow-inner">
        <button 
          className={clsx(
            "flex-1 py-3 rounded-xl cursor-pointer font-black text-[11px] transition-all duration-300 tracking-wider",
            isSesc ? "bg-white text-[#003F7F] shadow-lg" : "bg-transparent text-white hover:bg-white/5"
          )}
          onClick={() => setUnidade('sesc')}
        >
          SESC
        </button>
        <button 
          className={clsx(
            "flex-1 py-3 rounded-xl cursor-pointer font-black text-[11px] transition-all duration-300 tracking-wider",
            !isSesc ? "bg-white text-[#F47920] shadow-lg" : "bg-transparent text-white hover:bg-white/5"
          )}
          onClick={() => setUnidade('senac')}
        >
          SENAC
        </button>
      </div>

      <nav className="w-full space-y-3">
        <div 
          className={clsx(
            "p-4 cursor-pointer rounded-2xl flex items-center gap-3 font-black text-[13px] transition-all duration-300",
            view === 'tabela' ? "bg-white text-current shadow-xl scale-[1.02]" : "bg-white/5 text-white hover:bg-white/10"
          )}
          style={{ color: view === 'tabela' ? brandColor : undefined }}
          onClick={() => {
            setView('tabela');
            setIsOpen(false);
          }}
        >
          <Table size={20} />
          <span>Tabela</span>
        </div>
        <div 
          className={clsx(
            "p-4 cursor-pointer rounded-2xl flex items-center gap-3 font-black text-[13px] transition-all duration-300",
            view === 'dashboard' ? "bg-white text-current shadow-xl scale-[1.02]" : "bg-white/5 text-white hover:bg-white/10"
          )}
          style={{ color: view === 'dashboard' ? brandColor : undefined }}
          onClick={() => {
            setView('dashboard');
            setIsOpen(false);
          }}
        >
          <PieChartIcon size={20} />
          <span>Dashboard</span>
        </div>
        {isAdmin && (
          <div 
            className={clsx(
              "p-4 cursor-pointer rounded-2xl flex items-center gap-3 font-black text-[13px] transition-all duration-300",
              view === 'settings' ? "bg-white text-current shadow-xl scale-[1.02]" : "bg-white/5 text-white hover:bg-white/10"
            )}
            style={{ color: view === 'settings' ? brandColor : undefined }}
            onClick={() => {
              setView('settings');
              setIsOpen(false);
            }}
          >
            <SettingsIcon size={20} />
            <span>Configurações</span>
          </div>
        )}
      </nav>
      
      <div className="mt-auto flex flex-col gap-4 w-full">
        {isAdmin && (
          <>
            <button 
              className="btn-relief btn-relief-red !text-[11px] !py-3.5" 
              onClick={onClear}
            >
              <Trash2 size={18} />
              LIMPAR DADOS
            </button>
            <button 
              className="btn-relief btn-relief-orange !text-[11px] !py-3.5" 
              onClick={onImport}
            >
              <Upload size={18} />
              IMPORTAR EXCEL
            </button>
          </>
        )}
        <button 
          className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-black tracking-widest hover:bg-white/10 transition-all active:scale-95 mt-4" 
          onClick={() => auth.signOut()}
        >
          <LogOut size={18} />
          SAIR DO SISTEMA
        </button>
      </div>
    </aside>
    </>
  );
}
