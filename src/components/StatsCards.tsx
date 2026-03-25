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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className="bg-white p-6 rounded-[20px] shadow-[0_10px_15px_rgba(0,0,0,0.05)] border-t-[6px]"
          style={{ borderTopColor: brandColor }}
        >
          <h4 className="text-[11px] text-[#64748B] uppercase mb-2.5 font-bold tracking-wider">
            {card.title}
          </h4>
          <div 
            className="text-[32px] font-black"
            style={{ color: brandColor }}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
