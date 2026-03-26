import React from 'react';
import { Unidade } from '../types';

interface StatsCardsProps {
  unidade: Unidade;
  total: number;
  open: number;
  late: number;
  efficiency: string;
}

export default function StatsCards({ unidade, total, open, late, efficiency }: StatsCardsProps) {
  const brandColor = unidade === 'sesc' ? '#003F7F' : '#F47920';

  const cards = [
    { title: 'Total', value: total },
    { title: 'Em Aberto', value: open },
    { title: 'Atrasos', value: late },
    { title: 'Eficiência', value: efficiency },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className="card-modern p-8 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300"
        >
          <div 
            className="absolute top-0 left-0 w-1.5 h-full"
            style={{ backgroundColor: brandColor }}
          />
          <h4 className="text-[11px] text-slate-400 uppercase mb-3 font-black tracking-[0.2em]">
            {card.title}
          </h4>
          <div 
            className="text-4xl font-black tracking-tighter"
            style={{ color: brandColor }}
          >
            {card.value}
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
        </div>
      ))}
    </div>
  );
}
