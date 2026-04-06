import React, { useState, useEffect, useMemo } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  writeBatch, 
  getDocs 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { FileSpreadsheet, Menu } from 'lucide-react';
import * as XLSX from 'xlsx';
import { format, parseISO, differenceInDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

import { auth, db } from './lib/firebase';
import { Protocolo, Unidade } from './types';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import StatsCards from './components/StatsCards';
import Dashboard from './components/Dashboard';
import ProtocolTable from './components/ProtocolTable';
import Filters from './components/Filters';
import Settings from './components/Settings';
import { handleFirestoreError, OperationType } from './lib/firestore-errors';

import { SettingsProvider } from './contexts/SettingsContext';

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

function AppContent() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unidade, setUnidade] = useState<Unidade>('sesc');
  const [view, setView] = useState<'tabela' | 'dashboard' | 'settings'>('tabela');
  const [allData, setAllData] = useState<Protocolo[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Filters
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [search, setSearch] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPrazos, setSelectedPrazos] = useState<string[]>(['NO PRAZO', 'CRÍTICO', 'CONCLUÍDO']);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAdmin(u?.email === 'phenrique@sesc-ce.com.br');
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    const colName = unidade === 'sesc' ? 'protocolos_sesc' : 'protocolos_senac';
    const q = query(collection(db, colName));

    const unsubscribe = onSnapshot(q, (snap) => {
      const data: Protocolo[] = [];
      const statuses = new Set<string>();
      
      snap.forEach((doc) => {
        const d = doc.data() as Protocolo;
        data.push({ id: doc.id, ...d });
        if (d.Status) statuses.add(d.Status);
      });

      // Sort by protocol number if possible
      data.sort((a, b) => {
        const numA = parseInt(a['Número Sequencial']) || 0;
        const numB = parseInt(b['Número Sequencial']) || 0;
        return numA - numB;
      });

      setAllData(data);
      // Initialize selected statuses if empty
      if (selectedStatuses.length === 0) {
        setSelectedStatuses(Array.from(statuses));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, colName);
    });

    return unsubscribe;
  }, [user, unidade]);

  const statusList = useMemo(() => {
    const set = new Set<string>();
    allData.forEach(d => {
      if (d.Status) set.add(d.Status);
    });
    return Array.from(set);
  }, [allData]);

  const parseExcelDate = (v: any) => {
    if (!v) return null;
    if (typeof v === 'number') {
      // Excel serial date to JS Date
      return new Date((v - 25569) * 86400 * 1000);
    }
    const s = String(v).trim();
    if (s.includes('/')) {
      const parts = s.split(' ')[0].split('/');
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
    return new Date(s);
  };

  const processedData = useMemo(() => {
    const startF = dateStart ? startOfDay(parseISO(dateStart)) : null;
    const endF = dateEnd ? endOfDay(parseISO(dateEnd)) : null;
    const searchTerm = search.toLowerCase();

    return allData.map(item => {
      const d = parseExcelDate(item['Data de Submissão']);
      const status = item.Status || "Sem Status";
      const isAtivo = /andamento|aberto|entregue/i.test(status);
      const diff = d ? differenceInDays(new Date(), d) : 0;
      const situacao = isAtivo ? (diff > 30 ? 'CRÍTICO' : 'NO PRAZO') : 'CONCLUÍDO';
      const dataStr = d ? format(d, 'dd/MM/yyyy') : '-';

      return {
        ...item,
        _date: d,
        _sit: situacao,
        _diff: diff,
        _dataStr: dataStr
      };
    }).filter(item => {
      const dateMatch = (!startF || (item._date && item._date >= startF)) && 
                        (!endF || (item._date && item._date <= endF));
      const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(item.Status);
      const prazoMatch = selectedPrazos.includes(item._sit);
      const searchMatch = JSON.stringify(item).toLowerCase().includes(searchTerm);

      return dateMatch && statusMatch && prazoMatch && searchMatch;
    });
  }, [allData, dateStart, dateEnd, search, selectedStatuses, selectedPrazos]);

  const stats = useMemo(() => {
    const total = processedData.length;
    let open = 0;
    let late = 0;
    const statusMap: Record<string, number> = {};
    const prazoMap: Record<string, number> = { 'NO PRAZO': 0, 'CRÍTICO': 0, 'CONCLUÍDO': 0 };
    const typeMap: Record<string, number> = {};
    const localityMap: Record<string, number> = {};
    const monthlyMap: Record<string, number> = {};

    processedData.forEach(item => {
      const isAtivo = /andamento|aberto|entregue/i.test(item.Status);
      if (isAtivo) {
        open++;
        if (item._diff > 30) late++;
      }
      statusMap[item.Status] = (statusMap[item.Status] || 0) + 1;
      prazoMap[item._sit]++;
      
      const type = item.Tipo || 'Não Informado';
      typeMap[type] = (typeMap[type] || 0) + 1;
      
      const locality = item.Localidade || 'Não Informada';
      localityMap[locality] = (localityMap[locality] || 0) + 1;

      if (item._date) {
        const monthKey = format(item._date, 'MMM/yy');
        monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + 1;
      }
    });

    const efficiency = total > 0 ? ((total - late) / total * 100).toFixed(1) + "%" : "100%";

    return {
      total,
      open,
      late,
      efficiency,
      statusData: Object.entries(statusMap).map(([name, value]) => ({ name, value })),
      slaData: Object.entries(prazoMap).map(([name, value]) => ({ name, value })),
      typeData: Object.entries(typeMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8),
      localityData: Object.entries(localityMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8),
      monthlyData: Object.entries(monthlyMap).map(([name, value]) => ({ name, value })),
      heatmapData: {
        statuses: Array.from(new Set(processedData.map(d => d.Status || 'Sem Status'))),
        localities: Array.from(new Set(processedData.map(d => d.Localidade || 'Não Informada'))).slice(0, 10), // Limit to top 10 for readability
        matrix: processedData.reduce((acc: any, curr) => {
          const s = curr.Status || 'Sem Status';
          const l = curr.Localidade || 'Não Informada';
          if (!acc[s]) acc[s] = {};
          acc[s][l] = (acc[s][l] || 0) + 1;
          return acc;
        }, {})
      }
    };
  }, [processedData]);

  const handleUpdateStatus = async (id: string, status: string) => {
    const colName = unidade === 'sesc' ? 'protocolos_sesc' : 'protocolos_senac';
    try {
      await updateDoc(doc(db, colName, id), { Status: status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${colName}/${id}`);
    }
  };

  const handleClearDatabase = async () => {
    if (!window.confirm(`Tem certeza que deseja limpar todos os dados do ${unidade.toUpperCase()}?`)) return;
    
    const colName = unidade === 'sesc' ? 'protocolos_sesc' : 'protocolos_senac';
    try {
      const snap = await getDocs(collection(db, colName));
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
      alert("Banco de dados limpo com sucesso!");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, colName);
    }
  };

  const handleImportExcel = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const dataArr = new Uint8Array(evt.target?.result as ArrayBuffer);
          const wb = XLSX.read(dataArr, { type: 'array' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
          
          const colName = unidade === 'sesc' ? 'protocolos_sesc' : 'protocolos_senac';
          const batch = writeBatch(db);
          
          data.forEach((item: any) => {
            const newDoc = doc(collection(db, colName));
            batch.set(newDoc, item);
          });
          
          await batch.commit();
          alert(`${data.length} protocolos importados com sucesso!`);
        } catch (error) {
          alert("Erro ao importar Excel. Verifique o formato do arquivo.");
          console.error(error);
        }
      };
      reader.readAsArrayBuffer(file);
    };
    input.click();
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(processedData.map(({ id, _date, _sit, _diff, _dataStr, ...rest }) => rest));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Protocolos");
    XLSX.writeFile(wb, `Ouvidoria_${unidade}_${format(new Date(), 'ddMMyyyy')}.xlsx`);
  };

  const firstName = useMemo(() => {
    if (!user) return '';
    if (user.displayName) return user.displayName.split(' ')[0];
    if (user.email) {
      const namePart = user.email.split('@')[0];
      const firstPart = namePart.split(/[._]/)[0];
      return firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
    }
    return 'Usuário';
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F0F2F5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003F7F]"></div>
      </div>
    );
  }

  if (!user) return <Login />;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar 
        unidade={unidade} 
        setUnidade={setUnidade} 
        view={view} 
        setView={setView}
        onImport={handleImportExcel}
        onClear={handleClearDatabase}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isAdmin={isAdmin}
      />
      
      <main className="flex-1 p-4 md:p-8 w-full lg:ml-[260px] transition-all duration-500">
        <div className="flex justify-between items-center mb-10 flex-wrap gap-4 bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/60 shadow-sm">
          <div className="flex items-center gap-5">
            <button 
              className="lg:hidden p-3 bg-white rounded-2xl shadow-sm text-slate-600 hover:bg-slate-50 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Olá, {firstName}! 👋</p>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: unidade === 'sesc' ? '#003F7F' : '#F47920' }}>
                Gestão de Protocolos {unidade === 'sesc' ? 'Sesc' : 'Senac'}
              </h1>
            </div>
          </div>
          <button 
            className="btn-relief btn-relief-green !w-auto !px-6 !py-2.5 !text-[11px] !rounded-2xl" 
            onClick={handleExportExcel}
          >
            <FileSpreadsheet size={16} />
            EXPORTAR EXCEL
          </button>
        </div>

        <Filters 
          dateStart={dateStart}
          setDateStart={setDateStart}
          dateEnd={dateEnd}
          setDateEnd={setDateEnd}
          search={search}
          setSearch={setSearch}
        />

        <StatsCards 
          unidade={unidade}
          total={stats.total}
          open={stats.open}
          late={stats.late}
          efficiency={stats.efficiency}
        />

        {view === 'dashboard' ? (
          <Dashboard 
            statusData={stats.statusData} 
            slaData={stats.slaData} 
            typeData={stats.typeData}
            localityData={stats.localityData}
            monthlyData={stats.monthlyData}
            heatmapData={stats.heatmapData}
          />
        ) : view === 'settings' ? (
          <Settings />
        ) : (
          <ProtocolTable 
            data={processedData}
            onUpdateStatus={handleUpdateStatus}
            statusList={statusList}
            selectedStatuses={selectedStatuses}
            setSelectedStatuses={setSelectedStatuses}
            selectedPrazos={selectedPrazos}
            setSelectedPrazos={setSelectedPrazos}
          />
        )}
      </main>
    </div>
  );
}
