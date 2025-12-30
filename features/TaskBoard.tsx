import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash2, Check, Search, MoreHorizontal, Calendar, PenTool, X, Flame, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CyberBadge } from '../components/ui/CyberComponents';

export const TaskBoard: React.FC = () => {
  const { tasks, fetchTasks, addTask, updateTask, deleteTask, isLoadingTasks, activeTaskId, setActiveTask } = useStore();
  
  // UI State
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [newTaskEst, setNewTaskEst] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle, newTaskPriority, newTaskEst);
    resetForm();
  };

  const resetForm = () => {
    setNewTaskTitle('');
    setNewTaskPriority('MEDIUM');
    setNewTaskEst(1);
    setIsAdding(false);
  };

  const visibleTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = showCompleted ? true : t.status !== 'DONE';
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
     // Sort by completion status (pending first), then created date
     if (a.status === 'DONE' && b.status !== 'DONE') return 1;
     if (a.status !== 'DONE' && b.status === 'DONE') return -1;
     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalPomodoros = visibleTasks.reduce((acc, t) => acc + t.estimatedPomodoros, 0);
  const completedPomodorosInView = visibleTasks.reduce((acc, t) => acc + t.completedPomodoros, 0);

  return (
    <div className="h-full flex flex-col bg-stone-900/95 backdrop-blur-xl w-full border-l border-white/5 relative">
      
      {/* Header */}
      <div className="p-8 pb-4 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif italic font-medium text-stone-100 flex items-center gap-3">
            Today's Plan
          </h2>
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-lg transition-colors ${showMenu ? 'bg-white/10 text-white' : 'text-stone-500 hover:bg-white/5 hover:text-stone-300'}`}
            >
               <MoreHorizontal size={20} />
            </button>
            
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-stone-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <button 
                    onClick={() => { setShowCompleted(!showCompleted); setShowMenu(false); }}
                    className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-stone-400 hover:bg-white/5 hover:text-white flex items-center justify-between transition-colors"
                  >
                    <span>Show Completed</span>
                    {showCompleted && <Check size={14} className="text-cozy-amber" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="flex justify-between items-end mb-6">
          <div className="flex items-center gap-4 text-xs font-bold text-stone-500 uppercase tracking-wider font-sans">
             <div className="flex items-center gap-2">
                <Calendar size={12} />
                <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
             </div>
          </div>
          <div className="text-[10px] font-mono text-stone-600">
            {completedPomodorosInView} / {totalPomodoros} POMS
          </div>
        </div>

        {/* Search */}
        <div className="relative group mb-2">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 group-hover:text-stone-300 transition-colors" size={14} />
           <input 
             type="text" 
             placeholder="Find a task..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-white/5 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm text-stone-200 focus:outline-none focus:bg-white/10 transition-all placeholder:text-stone-600 font-sans focus:border-white/10"
           />
           {searchQuery && (
             <button 
               onClick={() => setSearchQuery('')}
               className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-white transition-colors"
             >
               <X size={14} />
             </button>
           )}
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto px-6 space-y-2 pb-24 custom-scrollbar relative z-10">
        {isLoadingTasks ? (
          <div className="text-center py-10 text-stone-600 text-xs tracking-widest font-sans">LOADING ENTRIES...</div>
        ) : visibleTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-600 opacity-60">
             <PenTool size={24} className="mb-3" />
             <p className="text-sm font-serif italic">
               {searchQuery ? 'No matching tasks.' : 'Your journal is empty.'}
             </p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <AnimatePresence mode="popLayout">
              {visibleTasks.map(task => (
                <motion.div 
                  key={task.id}
                  layoutId={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onClick={() => setActiveTask(task.id)}
                  className={`group relative p-4 rounded-lg transition-all duration-300 cursor-pointer border ${
                    activeTaskId === task.id 
                    ? 'bg-white/10 border-cozy-amber/30' 
                    : 'bg-transparent border-transparent hover:bg-white/5'
                  } ${task.status === 'DONE' ? 'opacity-50 grayscale hover:grayscale-0' : ''}`}
                >
                  <div className="flex items-start gap-4 relative z-10">
                     <button 
                       onClick={(e) => { 
                         e.stopPropagation(); 
                         updateTask(task.id, { status: task.status === 'DONE' ? 'TODO' : 'DONE' }); 
                       }}
                       className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                         task.status === 'DONE' 
                            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500' 
                            : activeTaskId === task.id 
                                ? 'border-cozy-amber text-transparent hover:border-cozy-amber' 
                                : 'border-stone-600 text-transparent hover:border-stone-400'
                       }`}
                     >
                       <Check size={12} strokeWidth={3} />
                     </button>
                     <div className="flex-1 min-w-0">
                        <h4 className={`text-base font-serif leading-snug transition-colors ${
                          task.status === 'DONE' ? 'line-through text-stone-500' : 
                          activeTaskId === task.id ? 'text-stone-100' : 'text-stone-400 group-hover:text-stone-300'
                        }`}>
                          {task.title}
                        </h4>
                        <div className="flex justify-between items-center mt-2">
                           <CyberBadge variant={task.priority === 'HIGH' ? 'magenta' : task.priority === 'LOW' ? 'cyan' : 'orange'}>
                              {task.priority || 'NORMAL'}
                           </CyberBadge>
                           <div className="flex items-center gap-1.5 text-xs font-bold font-sans text-stone-600">
                              <span className={activeTaskId === task.id ? 'text-cozy-amber' : ''}>{task.completedPomodoros}</span>
                              <span className="text-stone-700">/</span>
                              <span>{task.estimatedPomodoros}</span>
                              <Flame size={10} className={activeTaskId === task.id ? 'text-cozy-amber' : 'text-stone-800'} />
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex gap-2">
                     <button 
                       onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                       className="p-1.5 hover:bg-rose-900/20 text-stone-600 hover:text-rose-400 rounded transition-colors"
                       title="Delete Task"
                     >
                       <Trash2 size={14} />
                     </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {isAdding ? (
           <motion.form 
             initial={{ opacity: 0, scale: 0.98, y: 10 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.98, y: 10 }}
             onSubmit={handleAdd}
             className="bg-stone-900 border border-white/10 rounded-xl p-4 shadow-2xl relative overflow-hidden"
           >
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cozy-amber via-transparent to-transparent opacity-50" />

              {/* Title Input */}
              <div className="mb-4">
                <input 
                  autoFocus
                  placeholder="What needs to be done?"
                  className="w-full bg-transparent text-white placeholder:text-stone-600 focus:outline-none text-lg font-serif"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                />
              </div>

              {/* Controls Row */}
              <div className="flex flex-col gap-4">
                 
                 {/* Priority Selector */}
                 <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Priority Level</span>
                    <div className="flex gap-2">
                       {(['LOW', 'MEDIUM', 'HIGH'] as const).map(p => (
                         <button
                           key={p}
                           type="button"
                           onClick={() => setNewTaskPriority(p)}
                           className={`flex-1 py-1.5 rounded text-[10px] font-bold border transition-all ${
                             newTaskPriority === p 
                             ? p === 'HIGH' ? 'bg-fuchsia-900/40 border-fuchsia-500 text-fuchsia-200 shadow-[0_0_10px_rgba(217,70,239,0.2)]'
                             : p === 'LOW' ? 'bg-sky-900/40 border-sky-500 text-sky-200 shadow-[0_0_10px_rgba(14,165,233,0.2)]'
                             : 'bg-orange-900/40 border-orange-500 text-orange-200 shadow-[0_0_10px_rgba(249,115,22,0.2)]'
                             : 'bg-white/5 border-transparent text-stone-500 hover:bg-white/10'
                           }`}
                         >
                           {p}
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Estimates */}
                 <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Est. Pomodoros</span>
                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1.5 w-fit border border-white/5">
                       <button 
                         type="button"
                         onClick={() => setNewTaskEst(Math.max(1, newTaskEst - 1))}
                         className="p-1 text-stone-400 hover:text-white hover:bg-white/10 rounded"
                       >
                         <ChevronDown size={14} />
                       </button>
                       <span className="font-mono text-sm font-bold text-cozy-amber w-4 text-center">{newTaskEst}</span>
                       <button 
                         type="button"
                         onClick={() => setNewTaskEst(Math.min(10, newTaskEst + 1))}
                         className="p-1 text-stone-400 hover:text-white hover:bg-white/10 rounded"
                       >
                         <ChevronUp size={14} />
                       </button>
                    </div>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
                 <button 
                   type="button" 
                   onClick={resetForm} 
                   className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-300 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   className="px-6 py-2 bg-stone-100 text-stone-900 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-lg"
                 >
                   Save Task
                 </button>
              </div>
           </motion.form>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setIsAdding(true)}
            className="w-full py-4 border border-dashed border-stone-800 rounded-xl text-stone-500 hover:text-stone-300 hover:border-stone-600 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest group"
          >
             <Plus size={16} />
             <span>New Entry</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};