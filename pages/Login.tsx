import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { CyberInput, CyberButton, CyberCard, ToastContainer } from '../components/ui/CyberComponents';
import { Feather, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('nekothedev@nekoterminal.com');
  const [password, setPassword] = useState('password');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register, toast, isAuthenticated } = useStore();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, name);
      }
      navigate('/dashboard');
    } catch (err) {
      // Toast handled in store
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#1c1917]">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.pinimg.com/1200x/fb/4e/b9/fb4eb9ee4ec6bb207bc2c3efcc439695.jpg" 
          alt="Cozy Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c1917]/20 via-[#1c1917]/60 to-[#1c1917]/90" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10"
      >
        <CyberCard className="border-t-4 border-t-cozy-amber border-l-0 shadow-2xl backdrop-blur-xl bg-[#1c1917]/80">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white/5 p-3 rounded-full text-cozy-amber border border-white/5 shadow-inner">
                <Feather size={28} />
              </div>
            </div>
            <h1 className="text-3xl font-serif font-medium text-stone-100 mb-2">
              {isLogin ? 'Welcome Back' : 'Join the Sanctuary'}
            </h1>
            <p className="text-stone-500 font-sans text-sm">
              {isLogin ? 'Continue your journey of focus.' : 'Create your space for deep work.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-cozy-amber mb-1.5 uppercase tracking-wider ml-1">Name</label>
                <CyberInput 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required={!isLogin}
                  placeholder="How should we call you?"
                  className="bg-black/20 border-white/5 focus:border-cozy-amber/50"
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-cozy-amber mb-1.5 uppercase tracking-wider ml-1">Email Address</label>
              <CyberInput 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
                className="bg-black/20 border-white/5 focus:border-cozy-amber/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-cozy-amber mb-1.5 uppercase tracking-wider ml-1">Password</label>
              <CyberInput 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required
                className="bg-black/20 border-white/5 focus:border-cozy-amber/50"
              />
            </div>

            <CyberButton 
              className="w-full mt-6 py-3 text-sm" 
              size="lg" 
              disabled={loading}
              variant="primary"
            >
              {loading ? (
                <span className="animate-pulse">Connecting...</span>
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? 'Enter Studio' : 'Create Account'} 
                  <ArrowRight size={16} />
                </span>
              )}
            </CyberButton>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="group text-stone-500 hover:text-stone-200 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <Sparkles size={12} className="group-hover:text-cozy-amber transition-colors" />
              {isLogin ? 'New here? Create account' : 'Already have an account? Sign in'}
            </button>
          </div>
        </CyberCard>
        
        <div className="mt-6 text-center">
          <p className="text-stone-600 text-xs font-serif italic">
            "Quiet the mind, and the soul will speak."
          </p>
        </div>
      </motion.div>

      {toast && <ToastContainer message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Login;