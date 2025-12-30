import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { CyberButton, CyberInput } from '../components/ui/CyberComponents';
import { Plus, Trash2, StickyNote } from 'lucide-react';

const NotesPage: React.FC = () => {
  const { notes, addNote, deleteNote } = useStore();
  const [newNote, setNewNote] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addNote(newNote);
    setNewNote('');
  };

  const getColors = (color: string) => {
    switch(color) {
      case 'cyan': return 'border-neon-cyan text-neon-cyan bg-neon-cyan/5';
      case 'magenta': return 'border-neon-magenta text-neon-magenta bg-neon-magenta/5';
      case 'yellow': return 'border-neon-yellow text-neon-yellow bg-neon-yellow/5';
      default: return 'border-white text-white bg-white/5';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto pt-4"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-display font-bold text-white tracking-tighter">
          DATA <span className="text-emerald-400">FRAGMENTS</span>
        </h2>
        <div className="text-emerald-400 font-mono text-sm">{notes.length} RECORDS</div>
      </div>

      <div className="mb-10">
        <form onSubmit={handleAdd} className="flex gap-4">
          <CyberInput 
             placeholder="Input new data fragment..." 
             value={newNote}
             onChange={e => setNewNote(e.target.value)}
             className="border-emerald-500/50 text-emerald-400 focus:border-emerald-400 placeholder:text-emerald-900/50"
          />
          <CyberButton className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black hover:shadow-[0_0_20px_rgba(52,211,153,0.5)]">
            <Plus size={20} />
            <span className="hidden md:inline ml-2">SAVE RECORD</span>
          </CyberButton>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {notes.map((note) => (
             <motion.div
               key={note.id}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               layout
               className={`relative p-6 rounded-lg border border-l-4 shadow-lg backdrop-blur-sm group ${getColors(note.color)}`}
             >
               <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                   onClick={() => deleteNote(note.id)}
                   className="p-1 hover:bg-black/20 rounded text-inherit"
                 >
                   <Trash2 size={16} />
                 </button>
               </div>
               
               <StickyNote size={24} className="mb-4 opacity-50" />
               <p className="font-sans text-lg font-medium leading-relaxed whitespace-pre-wrap">{note.content}</p>
               
               <div className="mt-4 pt-4 border-t border-current border-opacity-20 text-[10px] uppercase font-bold tracking-widest opacity-60">
                 {new Date(note.createdAt).toLocaleString()}
               </div>
             </motion.div>
          ))}
        </AnimatePresence>
        
        {notes.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-800 rounded-lg">
            <p className="text-gray-600 font-display">NO DATA FRAGMENTS FOUND</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotesPage;
