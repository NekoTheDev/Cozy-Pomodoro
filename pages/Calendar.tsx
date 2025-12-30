import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Check, Trash2, CheckCircle2, Circle, ListTodo, CalendarRange } from 'lucide-react';
import { CyberCard, CyberButton, CyberInput } from '../components/ui/CyberComponents';
import { useStore } from '../store/useStore';

const CalendarPage: React.FC = () => {
  const { plans, addPlan, addPlanRange, togglePlan, deletePlan } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newPlanTitle, setNewPlanTitle] = useState('');
  
  // Multi-day State
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [rangeEndDate, setRangeEndDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });

  // Calendar Helpers
  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const handlePrev = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const handleNext = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const formatDateKey = (date: Date) => date.toISOString().split('T')[0];
  const selectedDateKey = formatDateKey(selectedDate);
  const selectedPlans = plans.filter(p => p.date === selectedDateKey);

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanTitle.trim()) return;
    
    if (isMultiDay) {
        // Ensure range is valid
        if (rangeEndDate < selectedDate) {
            alert("End date cannot be before start date");
            return;
        }
        addPlanRange(selectedDateKey, formatDateKey(rangeEndDate), newPlanTitle);
    } else {
        addPlan(selectedDateKey, newPlanTitle);
    }
    
    setNewPlanTitle('');
    setIsMultiDay(false);
  };

  const handleDateClick = (day: number) => {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(newDate);
      
      // Reset range end date if it becomes invalid or just for UX reset
      if (isMultiDay) {
          const nextDay = new Date(newDate);
          nextDay.setDate(nextDay.getDate() + 1);
          setRangeEndDate(nextDay);
      }
  };

  // Calendar Grid Generation
  const totalDays = daysInMonth(currentDate);
  const start = startDay(currentDate);
  const days = Array(start).fill(null).concat(Array.from({ length: totalDays }, (_, i) => i + 1));

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day: number) => {
    return day === selectedDate.getDate() && 
           currentDate.getMonth() === selectedDate.getMonth() && 
           currentDate.getFullYear() === selectedDate.getFullYear();
  };

  const isInRange = (day: number) => {
      if (!isMultiDay) return false;
      const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      // Normalize time for comparison
      checkDate.setHours(0,0,0,0);
      const start = new Date(selectedDate);
      start.setHours(0,0,0,0);
      const end = new Date(rangeEndDate);
      end.setHours(0,0,0,0);
      
      return checkDate >= start && checkDate <= end;
  };

  const hasPlans = (day: number) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const key = formatDateKey(d);
    return plans.some(p => p.date === key && !p.isCompleted);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto pt-2 md:pt-8 h-full flex flex-col lg:flex-row gap-6 lg:gap-8 pb-24 md:pb-0"
    >
      {/* LEFT: CALENDAR GRID */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tighter">
            TEMPORAL <span className="text-neon-yellow">GRID</span>
          </h2>
          <div className="flex gap-2">
            <CyberButton size="sm" variant="ghost" onClick={handlePrev}><ChevronLeft size={20} /></CyberButton>
            <CyberButton size="sm" onClick={handleToday} className="hidden md:flex">TODAY</CyberButton>
            <CyberButton size="sm" variant="ghost" onClick={handleNext}><ChevronRight size={20} /></CyberButton>
          </div>
        </div>

        <CyberCard className="border-l-neon-yellow/50 p-3 md:p-6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
             <CalendarIcon className="text-neon-yellow" size={24} />
             <span className="text-lg md:text-2xl font-display font-bold text-white uppercase">
               {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
             </span>
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-4 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <div key={d} className="text-center text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-4">
            {days.map((day, idx) => {
               const isRange = day && isInRange(day);
               return (
                <button 
                    key={idx} 
                    disabled={!day}
                    onClick={() => day && handleDateClick(day)}
                    className={`
                    aspect-square border rounded-md md:rounded-xl p-0.5 md:p-2 flex flex-col items-center justify-center relative transition-all duration-300 group
                    ${!day ? 'border-transparent cursor-default' : 'cursor-pointer'}
                    ${day && isSelected(day) ? 'border-neon-yellow bg-neon-yellow/10 shadow-[0_0_15px_rgba(252,238,10,0.2)] scale-105 z-20' : ''}
                    ${isRange && !isSelected(day!) ? 'bg-neon-yellow/5 border-neon-yellow/30 relative overflow-hidden' : ''}
                    ${!isRange && !isSelected(day!) && day ? 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10' : ''}
                    ${day && isToday(day) && !isSelected(day) ? 'border-neon-cyan/50' : ''}
                    `}
                >
                    {isRange && !isSelected(day!) && (
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(252,238,10,0.05)_5px,rgba(252,238,10,0.05)_10px)]" />
                    )}
                    {day && (
                    <>
                        <span className={`text-xs md:text-base font-bold font-display z-10 ${isSelected(day) ? 'text-neon-yellow' : isToday(day) ? 'text-neon-cyan' : isRange ? 'text-neon-yellow/70' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        {day}
                        </span>
                        {hasPlans(day) && (
                        <div className="absolute bottom-1 md:bottom-2 w-1 h-1 md:w-1.5 md:h-1.5 bg-neon-magenta rounded-full shadow-[0_0_5px_rgba(255,0,255,0.8)] z-10" />
                        )}
                    </>
                    )}
                </button>
               );
            })}
          </div>
        </CyberCard>
      </div>

      {/* RIGHT: PLANNER */}
      <div className="w-full lg:w-[400px]">
        <div className="flex items-center justify-between mb-4 md:mb-8 h-[44px]"> {/* Height matching header */}
          <div className="flex items-center gap-2 text-gray-400">
             <ListTodo size={20} />
             <span className="font-bold text-sm tracking-wider uppercase">Objectives</span>
          </div>
          <div className="text-xs font-mono text-neon-yellow">
            {selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Height is auto on mobile to use page scroll, fixed on desktop to use internal scroll */}
        <CyberCard className="h-auto min-h-[400px] md:h-[500px] flex flex-col relative overflow-hidden border-t-neon-magenta/50">
          
          {/* Add Input Form */}
          <form onSubmit={handleAddPlan} className="mb-6 flex flex-col gap-3">
             <div className="flex gap-2">
                <CyberInput 
                placeholder="New objective..." 
                value={newPlanTitle}
                onChange={(e) => setNewPlanTitle(e.target.value)}
                className="bg-black/40 border-white/10 focus:border-neon-magenta/50 text-sm flex-1"
                />
                <button 
                type="submit"
                className="bg-white/10 hover:bg-neon-magenta/20 text-white p-3 rounded-xl border border-white/10 hover:border-neon-magenta/50 transition-all"
                >
                <Plus size={20} />
                </button>
            </div>
            
            {/* Range Controls */}
            <div className="flex flex-wrap items-center justify-between px-1 gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsMultiDay(!isMultiDay)}
                  className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${isMultiDay ? 'text-neon-yellow' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <CalendarRange size={14} />
                    {isMultiDay ? 'Multi-Day' : 'Single Day'}
                </button>

                <AnimatePresence>
                    {isMultiDay && (
                        <motion.div 
                          initial={{ opacity: 0, width: 0 }} 
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="flex items-center gap-2 overflow-hidden"
                        >
                            <span className="text-[10px] text-gray-500 font-bold">UNTIL</span>
                            <input 
                              type="date"
                              required={isMultiDay}
                              min={formatDateKey(selectedDate)}
                              value={formatDateKey(rangeEndDate)}
                              onChange={(e) => setRangeEndDate(new Date(e.target.value))}
                              className="bg-black/40 border border-white/10 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-neon-yellow max-w-[120px]"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </form>

          {/* List - Scrollable on desktop, naturally expanding on mobile */}
          <div className="flex-1 space-y-3 pr-2 md:overflow-y-auto md:custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {selectedPlans.length > 0 ? (
                selectedPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`group flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      plan.isCompleted 
                      ? 'bg-white/5 border-transparent opacity-50' 
                      : 'bg-black/20 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <button 
                      onClick={() => togglePlan(plan.id)}
                      className={`shrink-0 transition-colors ${plan.isCompleted ? 'text-neon-cyan' : 'text-gray-600 hover:text-neon-cyan'}`}
                    >
                      {plan.isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </button>
                    
                    <span className={`flex-1 text-sm font-medium break-words ${plan.isCompleted ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                      {plan.title}
                    </span>

                    <button 
                      onClick={() => deletePlan(plan.id)}
                      className="opacity-100 md:opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-gray-600 gap-2">
                   <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
                      <ListTodo size={24} opacity={0.5} />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-widest">No objectives set</span>
                </div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Footer Decoration */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-magenta via-purple-500 to-transparent opacity-50" />
        </CyberCard>
      </div>
    </motion.div>
  );
};

export default CalendarPage;