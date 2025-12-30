import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Coffee, Tent, BookOpen, Sparkles } from 'lucide-react';
import { CyberButton } from '../components/ui/CyberComponents';
import { useStore } from '../store/useStore';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();

  const handleStart = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

  return (
    <div className="min-h-screen bg-cozy-dark text-stone-200 font-sans selection:bg-cozy-amber/30 overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
         <motion.div 
           animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
           transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-cozy-amber/5 blur-[120px]" 
         />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 p-6 md:p-10 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3 text-xl font-bold tracking-tight">
          <div className="bg-white/5 p-1 rounded-lg backdrop-blur-sm border border-white/5 text-cozy-amber overflow-hidden">
             <img src="https://i.pinimg.com/1200x/f9/72/50/f972503d193b177d10dd8e375397364c.jpg" alt="Logo" className="w-8 h-8 object-cover rounded-md" />
          </div>
          <span className="font-serif italic text-stone-100">Cozy<span className="not-italic font-sans text-stone-400">Focus</span></span>
        </div>
        <button onClick={() => navigate('/login')} className="text-sm font-bold tracking-wide hover:text-white text-stone-400 transition-colors px-6 py-2 hover:bg-white/5 rounded-full">
          {isAuthenticated ? 'Enter Sanctuary' : 'Sign In'}
        </button>
      </nav>

      {/* Hero */}
      <section className="relative py-16 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest text-cozy-sage mb-8 backdrop-blur-sm uppercase"
          >
             <Sparkles size={12} />
             <span>Mindful Productivity</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-8xl font-serif font-medium leading-tight mb-8 text-stone-100"
          >
            Find stillness in <br/>
            <span className="text-cozy-amber italic">deep work.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-sans leading-relaxed"
          >
            A calm, distraction-free environment for your mind to wander and focus. 
            No notifications, just you and your flow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <CyberButton size="lg" onClick={handleStart} className="px-12 py-4 w-full sm:w-auto shadow-xl">
              {isAuthenticated ? (
                <>Enter Studio <ArrowRight className="inline ml-2" size={18} /></>
              ) : (
                <>Begin Journey <ArrowRight className="inline ml-2" size={18} /></>
              )}
            </CyberButton>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: Tent, 
              title: "Natural Rhythms", 
              desc: "Timers designed to match your natural energy flow, not force it.",
              color: "text-cozy-amber" 
            },
            { 
              icon: BookOpen, 
              title: "Quiet Journaling", 
              desc: "Keep track of your thoughts and tasks in a distraction-free space.",
              color: "text-stone-300"
            },
            { 
              icon: Coffee, 
              title: "Restful Breaks", 
              desc: "Gentle reminders to step away, breathe, and pour a cup of tea.",
              color: "text-cozy-sage"
            }
          ].map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-10 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 bg-white/5 ${f.color}`}>
                 <f.icon size={24} />
              </div>
              <h3 className="text-xl font-serif italic font-medium mb-3 text-stone-100">{f.title}</h3>
              <p className="text-stone-400 leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      <footer className="py-12 text-center text-stone-600 text-xs font-bold uppercase tracking-widest">
         © 2024 CozyFocus. Crafted with intention.
      </footer>
    </div>
  );
};

export default Landing;