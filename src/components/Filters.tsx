import React from 'react';
import { Search } from 'lucide-react';

interface FiltersProps {
  dateStart: string;
  setDateStart: (d: string) => void;
  dateEnd: string;
  setDateEnd: (d: string) => void;
  search: string;
  setSearch: (s: string) => void;
}

export default function Filters({ 
  dateStart, 
  setDateStart, 
  dateEnd, 
  setDateEnd, 
  search, 
  setSearch 
}: FiltersProps) {
  return (
    <div className="card-modern p-6 mb-10 flex flex-col md:flex-row gap-6 items-stretch md:items-end animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col gap-2 flex-1 w-full">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Data Início</label>
        <input 
          type="date" 
          value={dateStart}
          onChange={(e) => setDateStart(e.target.value)}
          className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-[13px] w-full focus:ring-4 focus:ring-slate-200/50 focus:bg-white transition-all font-medium text-slate-600"
        />
      </div>
      <div className="flex flex-col gap-2 flex-1 w-full">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Data Fim</label>
        <input 
          type="date" 
          value={dateEnd}
          onChange={(e) => setDateEnd(e.target.value)}
          className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-[13px] w-full focus:ring-4 focus:ring-slate-200/50 focus:bg-white transition-all font-medium text-slate-600"
        />
      </div>
      <div className="flex flex-col gap-2 flex-[2] w-full">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Pesquisar Protocolo</label>
        <div className="relative group">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Número, localidade ou tipo de demanda..."
            className="p-3.5 pl-12 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-[13px] w-full focus:ring-4 focus:ring-slate-200/50 focus:bg-white transition-all font-medium text-slate-600 placeholder:text-slate-400"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
        </div>
      </div>
    </div>
  );
}
