import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LabelList
} from 'recharts';

interface DashboardProps {
  statusData: { name: string; value: number }[];
  slaData: { name: string; value: number }[];
  typeData: { name: string; value: number }[];
  localityData: { name: string; value: number }[];
  monthlyData: { name: string; value: number }[];
}

const COLORS = ['#003F7F', '#F47920', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6', '#EC4899'];

export default function Dashboard({ statusData, slaData, typeData, localityData, monthlyData }: DashboardProps) {
  const totalStatus = statusData.reduce((acc, curr) => acc + curr.value, 0);
  const totalSla = slaData.reduce((acc, curr) => acc + curr.value, 0);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-[10px] font-bold">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col gap-6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-[20px] shadow-[0_10px_15px_rgba(0,0,0,0.05)] min-h-[350px] flex flex-col items-center">
          <h3 className="text-[13px] font-bold text-[#64748B] uppercase mb-4">Status das Demandas (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-5 rounded-[20px] shadow-[0_10px_15px_rgba(0,0,0,0.05)] min-h-[350px] flex flex-col items-center">
          <h3 className="text-[13px] font-bold text-[#64748B] uppercase mb-4">Situação de SLA (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={slaData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {slaData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === 'CRÍTICO' ? '#EF4444' : entry.name === 'NO PRAZO' ? '#10B981' : '#003F7F'} />
                ))}
                <LabelList 
                  dataKey="value" 
                  position="top" 
                  formatter={(v: number) => `${((v / (totalSla || 1)) * 100).toFixed(1)}%`}
                  style={{ fontSize: 10, fontWeight: 'bold', fill: '#64748B' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-[20px] shadow-[0_10px_15px_rgba(0,0,0,0.05)] min-h-[350px] flex flex-col items-center">
          <h3 className="text-[13px] font-bold text-[#64748B] uppercase mb-4">Volume por Tipo (Top 8)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold' }} width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#003F7F" radius={[0, 10, 10, 0]}>
                <LabelList dataKey="value" position="right" style={{ fontSize: 10, fontWeight: 'bold', fill: '#64748B' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-5 rounded-[20px] shadow-[0_10px_15px_rgba(0,0,0,0.05)] min-h-[350px] flex flex-col items-center">
          <h3 className="text-[13px] font-bold text-[#64748B] uppercase mb-4">Volume por Localidade (Top 8)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={localityData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold' }} width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#F47920" radius={[0, 10, 10, 0]}>
                <LabelList dataKey="value" position="right" style={{ fontSize: 10, fontWeight: 'bold', fill: '#64748B' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-5 rounded-[20px] shadow-[0_10px_15px_rgba(0,0,0,0.05)] min-h-[350px] flex flex-col items-center">
        <h3 className="text-[13px] font-bold text-[#64748B] uppercase mb-4">Evolução Mensal</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
            <Tooltip />
            <Bar dataKey="value" fill="#6366F1" radius={[10, 10, 0, 0]}>
              <LabelList dataKey="value" position="top" style={{ fontSize: 10, fontWeight: 'bold', fill: '#64748B' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
