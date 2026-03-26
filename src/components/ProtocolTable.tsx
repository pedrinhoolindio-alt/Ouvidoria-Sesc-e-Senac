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
    <div className="table-container">
      <table className="w-full border-collapse min-w-[900px]">
        <thead>
          <tr>
            <th>Protocolo</th>
            <th>Realização</th>
            <th className="relative">
              <div className="flex items-center gap-2">
                Status 
                <Filter 
                  size={12} 
                  className="cursor-pointer hover:text-gray-600" 
                  onClick={() => setShowStatusFilter(!showStatusFilter)} 
                />
              </div>
              {showStatusFilter && (
                <div className="absolute top-12 left-0 bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xl z-[100] min-w-[200px] normal-case font-normal text-gray-700">
                  {statusList.map(s => (
                    <label key={s} className="flex items-center gap-2.5 py-1.5 cursor-pointer hover:bg-gray-50 px-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedStatuses.includes(s)}
                        onChange={() => toggleStatus(s)}
                        className="w-4 h-4 rounded border-gray-300 text-[#003F7F] focus:ring-[#003F7F]"
                      />
                      <span className="text-[13px]">{s}</span>
                    </label>
                  ))}
                </div>
              )}
            </th>
            <th>Ação</th>
            <th>Tipo</th>
            <th>Localidade</th>
            <th className="relative">
              <div className="flex items-center gap-2">
                Prazo 
                <Filter 
                  size={12} 
                  className="cursor-pointer hover:text-gray-600" 
                  onClick={() => setShowPrazoFilter(!showPrazoFilter)} 
                />
              </div>
              {showPrazoFilter && (
                <div className="absolute top-12 right-0 bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xl z-[100] min-w-[200px] normal-case font-normal text-gray-700">
                  {['NO PRAZO', 'CRÍTICO', 'CONCLUÍDO'].map(p => (
                    <label key={p} className="flex items-center gap-2.5 py-1.5 cursor-pointer hover:bg-gray-50 px-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedPrazos.includes(p)}
                        onChange={() => togglePrazo(p)}
                        className="w-4 h-4 rounded border-gray-300 text-[#003F7F] focus:ring-[#003F7F]"
                      />
                      <span className="text-[13px]">{p}</span>
                    </label>
                  ))}
                </div>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="font-extrabold">{item['Número Sequencial'] || '-'}</td>
              <td>{item._dataStr}</td>
              <td>
                <span className={clsx(
                  "badge",
                  item._sit !== 'CONCLUÍDO' ? 'badge-open' : 'badge-done'
                )}>
                  {item.Status}
                </span>
              </td>
              <td>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => item.id && onUpdateStatus(item.id, 'Encaminhado')}
                    className="badge cursor-pointer bg-[#E0E7FF] text-[#4338CA] border-none hover:bg-[#C7D2FE] transition-colors"
                    title="Encaminhar"
                  >
                    <Send size={12} />
                  </button>
                  <button 
                    onClick={() => item.id && onUpdateStatus(item.id, 'Finalizado')}
                    className="badge cursor-pointer bg-[#DCFCE7] text-[#166534] border-none hover:bg-[#BBF7D0] transition-colors"
                    title="Finalizar"
                  >
                    <Check size={12} />
                  </button>
                </div>
              </td>
              <td className="text-gray-600">{item.Tipo || '-'}</td>
              <td className="text-gray-600">{item.Localidade || '-'}</td>
              <td>
                <span className={clsx(
                  "badge",
                  item._sit === 'CRÍTICO' ? 'bg-[#FEE2E2] text-[#B91C1C]' : 'bg-gray-100 text-gray-600'
                )}>
                  {item._sit} ({item._diff}d)
                </span>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-10 text-gray-400 font-medium italic">
                Nenhum protocolo encontrado para os filtros aplicados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
