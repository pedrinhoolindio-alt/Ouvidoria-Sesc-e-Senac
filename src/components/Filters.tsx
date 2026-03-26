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
    <div className="bg-white p-5 rounded-2xl mb-6 flex flex-col md:flex-row gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E2E8F0] items-stretch md:items-end">
      <div className="flex flex-col gap-1.5 flex-1 w-full">
        <label className="text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider">Início</label>
        <input 
          type="date" 
          value={dateStart}
          onChange={(e) => setDateStart(e.target.value)}
          className="p-3 border border-[#E2E8F0] rounded-xl outline-none text-[14px] w-full focus:ring-2 focus:ring-[#003F7F]/10"
        />
      </div>
      <div className="flex flex-col gap-1.5 flex-1 w-full">
        <label className="text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider">Fim</label>
        <input 
          type="date" 
          value={dateEnd}
          onChange={(e) => setDateEnd(e.target.value)}
          className="p-3 border border-[#E2E8F0] rounded-xl outline-none text-[14px] w-full focus:ring-2 focus:ring-[#003F7F]/10"
        />
      </div>
      <div className="flex flex-col gap-1.5 flex-[2] w-full">
        <label className="text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider">Busca</label>
        <div className="relative">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Número, local ou tipo..."
            className="p-3 pl-10 border border-[#E2E8F0] rounded-xl outline-none text-[14px] w-full focus:ring-2 focus:ring-[#003F7F]/10"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
