import React from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- BUTTON ---
interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export const CyberButton: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}) => {
  const baseStyles = "relative font-sans font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center tracking-wide overflow-hidden group active:scale-95";
  
  const variants = {
    primary: "bg-cozy-amber text-stone-900 shadow-md hover:bg-amber-400 hover:shadow-lg",
    secondary: "bg-white/10 text-stone-200 hover:bg-white/20 border border-white/10 backdrop-blur-md",
    danger: "bg-rose-900/40 text-rose-200 border border-rose-800/50 hover:bg-rose-900/60",
    ghost: "bg-transparent text-stone-400 hover:text-stone-100 hover:bg-white/5",
    neon: "bg-cozy-sage/10 text-cozy-sage border border-cozy-sage/20 hover:bg-cozy-sage/20"
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-10 py-3.5 text-base",
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      <span className="relative z-20 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};

// --- CARD ---
interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode;
}

export const CyberCard: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "cozy-panel rounded-2xl p-6 relative overflow-hidden transition-colors duration-500",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// --- INPUT ---
export const CyberInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
  return (
    <div className="relative group">
      <input
        className={cn(
          "w-full bg-black/20 border border-white/10 text-stone-100 p-3.5 rounded-xl focus:outline-none focus:border-cozy-amber/50 focus:bg-black/30 transition-all placeholder:text-stone-500 font-sans backdrop-blur-sm",
          className
        )}
        {...props}
      />
    </div>
  );
};

// --- BADGE ---
export const CyberBadge: React.FC<{ children: React.ReactNode; variant?: 'cyan' | 'magenta' | 'yellow' | 'orange' }> = ({ 
  children, 
  variant = 'cyan' 
}) => {
  const colors = {
    cyan: "bg-sky-900/40 text-sky-200 border-sky-800/30",
    magenta: "bg-fuchsia-900/40 text-fuchsia-200 border-fuchsia-800/30",
    yellow: "bg-amber-900/40 text-amber-200 border-amber-800/30",
    orange: "bg-orange-900/40 text-orange-200 border-orange-800/30",
  };
  
  return (
    <span className={cn("px-2.5 py-1 text-[10px] font-bold font-sans uppercase tracking-wider border rounded-md backdrop-blur-md", colors[variant])}>
      {children}
    </span>
  );
};

// --- TOAST ---
export const ToastContainer = ({ message, type }: { message: string, type: 'success' | 'error' | 'info' }) => {
  const colors = {
    success: 'bg-stone-800/90 border-l-4 border-l-cozy-sage text-cozy-sage',
    error: 'bg-stone-800/90 border-l-4 border-l-cozy-rose text-cozy-rose',
    info: 'bg-stone-800/90 border-l-4 border-l-cozy-amber text-cozy-amber',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={cn(
          "fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 backdrop-blur-xl border border-white/5",
          colors[type]
        )}
      >
        <span className="font-serif text-sm font-medium tracking-wide text-stone-100">{message}</span>
      </motion.div>
    </AnimatePresence>
  );
};