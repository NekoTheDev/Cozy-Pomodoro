import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { CyberCard, CyberButton } from '../components/ui/CyberComponents';
import { apiGetStats } from '../services/fakeBackend';
import { DailyStat } from '../types';
import { Download, RefreshCw, Calendar, TrendingUp } from 'lucide-react';

export const StatsBoard: React.FC = () => {
  const [data, setData] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<number>(7);

  const loadData = async (days: number) => {
    setLoading(true);
    try {
      const stats = await apiGetStats(days);
      setData(stats);
    } catch (error) {
      console.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(range);
  }, [range]);

  const handleRefresh = () => {
    loadData(range);
  };

  const handleExport = () => {
    if (data.length === 0) return;
    
    const headers = ['Date', 'Focus Minutes', 'Tasks Completed'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => `${row.date},${row.focusMinutes},${row.tasksCompleted}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cozy_focus_stats_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalFocus = data.reduce((acc, curr) => acc + curr.focusMinutes, 0);
  const totalTasks = data.reduce((acc, curr) => acc + curr.tasksCompleted, 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-0 md:px-0">
      
      {/* Controls Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-stone-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-md">
         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 w-full lg:w-auto">
           <span className="text-stone-400 text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-2">
             <Calendar size={14} /> Time Range:
           </span>
           <div className="flex bg-stone-950 rounded-lg p-1 border border-white/5 w-full sm:w-auto justify-between sm:justify-start">
             <button 
               onClick={() => setRange(7)}
               className={`flex-1 sm:flex-none px-4 py-2 sm:py-1.5 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider ${range === 7 ? 'bg-white/10 text-stone-200' : 'text-stone-600 hover:text-stone-300'}`}
             >
               7 Days
             </button>
             <button 
               onClick={() => setRange(30)}
               className={`flex-1 sm:flex-none px-4 py-2 sm:py-1.5 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider ${range === 30 ? 'bg-white/10 text-stone-200' : 'text-stone-600 hover:text-stone-300'}`}
             >
               30 Days
             </button>
           </div>
         </div>

         <div className="flex gap-2 w-full lg:w-auto justify-end">
           <CyberButton size="sm" variant="ghost" onClick={handleRefresh} title="Refresh Data" className="flex-1 lg:flex-none justify-center">
             <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
           </CyberButton>
           <CyberButton size="sm" variant="secondary" onClick={handleExport} title="Download CSV" className="flex-[3] lg:flex-none justify-center">
             <Download size={16} className="mr-2" />
             Export CSV
           </CyberButton>
         </div>
      </div>

      {loading ? (
        <div className="h-[200px] flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/5">
           <div className="text-stone-500 animate-pulse font-sans tracking-widest text-sm uppercase">Gathering Insights...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <CyberCard className="flex flex-col items-center justify-center py-8 md:py-10 relative overflow-hidden">
              <span className="text-stone-500 font-sans text-xs uppercase tracking-[0.2em] mb-3 z-10">Total Focus Time</span>
              <span className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-200 text-center z-10">
                {Math.floor(totalFocus / 60)}<span className="text-2xl text-stone-600 ml-1 font-sans">h</span> {totalFocus % 60}<span className="text-2xl text-stone-600 ml-1 font-sans">m</span>
              </span>
            </CyberCard>
            <CyberCard className="flex flex-col items-center justify-center py-8 md:py-10 relative overflow-hidden">
              <span className="text-stone-500 font-sans text-xs uppercase tracking-[0.2em] mb-3 z-10">Completed Entries</span>
              <span className="text-4xl md:text-5xl lg:text-6xl font-serif text-cozy-amber z-10">
                {totalTasks}
              </span>
            </CyberCard>
          </div>

          <CyberCard className="h-[350px] md:h-[450px] pr-2">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-3">
                 <TrendingUp className="text-stone-400" />
                 <h3 className="text-lg md:text-xl font-serif font-medium text-stone-200">Progress History</h3>
               </div>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 10, left: -25, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#44403c" 
                  tick={{ fill: '#78716c', fontSize: 10, fontFamily: 'Nunito' }} 
                  tickFormatter={(val) => range > 7 ? val.slice(5) : val}
                  dy={10}
                  interval={range > 14 ? 2 : 0}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#44403c" 
                  tick={{ fill: '#78716c', fontSize: 10, fontFamily: 'Nunito' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar 
                  dataKey="focusMinutes" 
                  fill="url(#barGradient)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={range > 7 ? 12 : 30}
                />
              </BarChart>
            </ResponsiveContainer>
          </CyberCard>
        </>
      )}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-stone-900 border border-stone-700 p-4 rounded-lg shadow-xl z-50">
        <p className="font-serif text-stone-400 text-xs mb-2">{label}</p>
        <p className="text-cozy-amber text-lg font-bold font-sans">
          {payload[0].value} <span className="text-xs font-sans font-normal text-stone-500">min</span>
        </p>
        <div className="h-[1px] w-full bg-white/5 my-2" />
        <p className="text-stone-400 text-xs flex justify-between gap-4">
          <span>Tasks:</span>
          <span className="text-stone-200 font-bold">{payload[0].payload.tasksCompleted}</span>
        </p>
      </div>
    );
  }
  return null;
};