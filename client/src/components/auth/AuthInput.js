'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { itemVariants } from './AuthCard';

export function AuthInput({ label, icon: Icon, type = 'text', rightAction, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <motion.div variants={itemVariants} className="space-y-2">
      <div className="flex items-center justify-between px-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{label}</label>
        {rightAction && (
          <div className="text-[10px] font-black uppercase tracking-widest text-accent-primary hover:opacity-70 transition-opacity">
            {rightAction}
          </div>
        )}
      </div>
      <div className="group relative">
        {Icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-accent-primary pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        
        {type === 'select' ? (
           <select
             className={`w-full rounded-2xl border border-white/20 bg-white/30 py-4 ${Icon ? 'pl-14' : 'pl-5'} pr-5 font-medium text-text-primary outline-none transition-all hover:bg-white/50 focus:border-accent-primary/40 focus:bg-white/60 focus:ring-4 focus:ring-accent-primary/5 appearance-none cursor-pointer`}
             {...props}
           >
             {props.children}
           </select>
        ) : (
          <input 
            type={currentType} 
            className={`w-full rounded-2xl border border-white/20 bg-white/30 py-4 ${Icon ? 'pl-14' : 'pl-5'} ${isPassword ? 'pr-14' : 'pr-4'} font-medium text-text-primary placeholder:text-text-muted/60 outline-none transition-all hover:bg-white/50 focus:border-accent-primary/40 focus:bg-white/60 focus:ring-4 focus:ring-accent-primary/5`}
            {...props}
          />
        )}
        
        {isPassword && (
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </motion.div>
  );
}
