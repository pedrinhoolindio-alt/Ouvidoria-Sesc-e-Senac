import React, { useState } from 'react';
import { Filter, Send, Check } from 'lucide-react';
import { Protocolo } from '../types';
import { clsx } from 'clsx';

interface ProtocolTableProps {
  data: (Protocolo & { _sit: string; _diff: number; _dataStr: string })[];
  onUpdateStatus: (id: string, status: string) => void;
  statusList: string[];
  selectedStatuses: string[];
  setSelectedStatuses: (list: string[]) => void;
  selectedPrazos: string[];
  setSelectedPrazos: (list: string[]) => void;
}

export default function ProtocolTable({ 
  data, 
  onUpdateStatus, 
  statusList,
  selectedStatuses,
  setSelectedStatuses,
  selectedPrazos,
  setSelectedPrazos
}: ProtocolTableProps) {
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showPrazoFilter, setShowPrazoFilter] = useState(false);

  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const togglePrazo = (prazo: string) => {
    if (selectedPrazos.includes(prazo)) {
      setSelectedPrazos(selectedPrazos.filter(p => p !== prazo));
    } else {
      setSelectedPrazos([...selectedPrazos, prazo]);
    }
  };

  return (
    <div className="table-container animate-in fade-in slide-in-from-bottom-6 duration-700">
      <table className="w-full border-collapse min-w-[1000px]">
        <thead>
          <tr>
            <th>Protocolo</th>
            <th>Submissão</th>
            <th className="relative">
              <div className="flex items-center gap-2">
                Status 
                <Filter 
                  size={14} 
                  className="cursor-pointer hover:text-slate-800 transition-colors" 
                  onClick={() => setShowStatusFilter(!showStatusFilter)} 
                />
              </div>
              {showStatusFilter && (
                <div className="absolute top-14 left-0 bg-white border border-slate-200 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] min-w-[240px] normal-case font-medium text-slate-600 animate-in zoom-in-95 duration-200">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">Filtrar por Status</p>
                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-1">
                    {statusList.map(s => (
                      <label key={s} className="flex items-center gap-3 p-2.5 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors">
                        <input 
                          type="checkbox" 
                          checked={selectedStatuses.includes(s)}
                          onChange={() => toggleStatus(s)}
                          className="w-4 h-4 rounded-lg border-slate-300 text-[#003F7F] focus:ring-[#003F7F] transition-all"
                        />
                        <span className="text-[13px]">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </th>
            <th>Ações Rápidas</th>
            <th>Tipo de Demanda</th>
            <th>Localidade</th>
            <th className="relative">
              <div className="flex items-center gap-2">
                Prazo 
                <Filter 
                  size={14} 
                  className="cursor-pointer hover:text-slate-800 transition-colors" 
                  onClick={() => setShowPrazoFilter(!showPrazoFilter)} 
                />
              </div>
              {showPrazoFilter && (
                <div className="absolute top-14 right-0 bg-white border border-slate-200 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] min-w-[240px] normal-case font-medium text-slate-600 animate-in zoom-in-95 duration-200">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">Filtrar por Prazo</p>
                  <div className="space-y-1">
                    {['NO PRAZO', 'CRÍTICO', 'CONCLUÍDO'].map(p => (
                      <label key={p} className="flex items-center gap-3 p-2.5 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors">
                        <input 
                          type="checkbox" 
                          checked={selectedPrazos.includes(p)}
                          onChange={() => togglePrazo(p)}
                          className="w-4 h-4 rounded-lg border-slate-300 text-[#003F7F] focus:ring-[#003F7F] transition-all"
                        />
                        <span className="text-[13px]">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/80 transition-all duration-200 group">
              <td className="font-black text-slate-900">{item['Número Sequencial'] || '-'}</td>
              <td className="font-medium text-slate-500">{item._dataStr}</td>
              <td>
                <span className={clsx(
                  "badge",
                  item._sit !== 'CONCLUÍDO' ? 'badge-open' : 'badge-done'
                )}>
                  {item.Status}
                </span>
              </td>
              <td>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => item.id && onUpdateStatus(item.id, 'Encaminhado')}
                    className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all active:scale-90"
                    title="Encaminhar Protocolo"
                  >
                    <Send size={14} />
                  </button>
                  <button 
                    onClick={() => item.id && onUpdateStatus(item.id, 'Finalizado')}
                    className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all active:scale-90"
                    title="Finalizar Protocolo"
                  >
                    <Check size={14} />
                  </button>
                </div>
              </td>
              <td className="text-slate-500 font-medium">{item.Tipo || '-'}</td>
              <td className="text-slate-500 font-medium">{item.Localidade || '-'}</td>
              <td>
                <span className={clsx(
                  "badge",
                  item._sit === 'CRÍTICO' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 
                  item._sit === 'NO PRAZO' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                  'bg-slate-100 text-slate-600 border border-slate-200'
                )}>
                  {item._sit} ({item._diff}d)
                </span>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-20 text-slate-400 font-medium italic bg-slate-50/30">
                Nenhum protocolo encontrado para os filtros aplicados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
