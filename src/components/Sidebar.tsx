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
          "w-[260px] text-white h-[100dvh] fixed p-6 flex flex-col z-[1000] transition-all duration-300 items-center lg:translate-x-0 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ backgroundColor: brandColor }}
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

      <div className="flex bg-white/15 rounded-xl p-1 mb-8 w-full">
        <button 
          className={clsx(
            "flex-1 py-2.5 rounded-lg cursor-pointer font-extrabold text-[11px] transition-all duration-300",
            isSesc ? "bg-white text-[#003F7F]" : "bg-transparent text-white"
          )}
          onClick={() => setUnidade('sesc')}
        >
          SESC
        </button>
        <button 
          className={clsx(
            "flex-1 py-2.5 rounded-lg cursor-pointer font-extrabold text-[11px] transition-all duration-300",
            !isSesc ? "bg-white text-[#F47920]" : "bg-transparent text-white"
          )}
          onClick={() => setUnidade('senac')}
        >
          SENAC
        </button>
      </div>

      <nav className="w-full space-y-2">
        <div 
          className={clsx(
            "p-3.5 cursor-pointer rounded-xl flex items-center gap-3 font-semibold transition-all duration-200",
            view === 'tabela' ? "bg-white text-current" : "bg-white/5 text-white"
          )}
          style={{ color: view === 'tabela' ? brandColor : undefined }}
          onClick={() => {
            setView('tabela');
            setIsOpen(false);
          }}
        >
          <Table size={18} />
          <span>Tabela</span>
        </div>
        <div 
          className={clsx(
            "p-3.5 cursor-pointer rounded-xl flex items-center gap-3 font-semibold transition-all duration-200",
            view === 'dashboard' ? "bg-white text-current" : "bg-white/5 text-white"
          )}
          style={{ color: view === 'dashboard' ? brandColor : undefined }}
          onClick={() => {
            setView('dashboard');
            setIsOpen(false);
          }}
        >
          <PieChartIcon size={18} />
          <span>Dashboard</span>
        </div>
        {isAdmin && (
          <div 
            className={clsx(
              "p-3.5 cursor-pointer rounded-xl flex items-center gap-3 font-semibold transition-all duration-200",
              view === 'settings' ? "bg-white text-current" : "bg-white/5 text-white"
            )}
            style={{ color: view === 'settings' ? brandColor : undefined }}
            onClick={() => {
              setView('settings');
              setIsOpen(false);
            }}
          >
            <SettingsIcon size={18} />
            <span>Configurações</span>
          </div>
        )}
      </nav>
      
      <div className="mt-auto flex flex-col gap-2 w-full pt-6 pb-8 border-t border-white/10">
        {isAdmin && (
          <>
            <button 
              className="flex items-center gap-3 p-3 rounded-xl bg-red-500/20 text-red-100 hover:bg-red-500/30 transition-all duration-200 text-[11px] font-bold uppercase tracking-wider w-full" 
              onClick={onClear}
            >
              <div className="bg-red-500 p-1.5 rounded-lg shadow-sm">
                <Trash2 size={14} className="text-white" />
              </div>
              LIMPAR DADOS
            </button>
            <button 
              className="flex items-center gap-3 p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-200 text-[11px] font-bold uppercase tracking-wider w-full" 
              onClick={onImport}
            >
              <div className="bg-[#F47920] p-1.5 rounded-lg shadow-sm">
                <Upload size={14} className="text-white" />
              </div>
              IMPORTAR EXCEL
            </button>
          </>
        )}
        <button 
          className="flex items-center gap-3 p-3 rounded-xl bg-transparent border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 text-[11px] font-bold uppercase tracking-wider w-full mt-2" 
          onClick={() => auth.signOut()}
        >
          <div className="p-1.5">
            <LogOut size={16} />
          </div>
          SAIR DA CONTA
        </button>
      </div>
    </aside>
    </>
  );
}
