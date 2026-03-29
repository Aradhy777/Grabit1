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
    <motion.div variants={itemVariants} className="space-y-2 relative">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-text-primary tracking-wide">
          {label}
        </label>
        {rightAction && (
          <div className="text-[11px] font-bold uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors">
            {rightAction}
          </div>
        )}
      </div>
      
      <div className="group relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-border-subtle transition-colors group-focus-within:text-text-primary pointer-events-none">
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}
        
        {type === 'select' ? (
           <select
             className={`w-full rounded-lg border-2 border-border-subtle bg-white py-3.5 ${Icon ? 'pl-11' : 'pl-4'} pr-4 font-semibold text-text-primary outline-none transition-all hover:border-text-muted focus:border-text-primary focus:ring-4 focus:ring-text-primary/10 appearance-none cursor-pointer`}
             {...props}
           >
             {props.children}
           </select>
        ) : (
          <input 
            type={currentType} 
            className={`w-full rounded-lg border-2 border-border-subtle bg-white py-3.5 ${Icon ? 'pl-11' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'} font-semibold text-text-primary placeholder:font-medium placeholder:text-border-subtle outline-none transition-all hover:border-text-muted focus:border-text-primary focus:ring-4 focus:ring-text-primary/10`}
            {...props}
          />
        )}
        
        {isPassword && (
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
          </button>
        )}
      </div>
    </motion.div>
  );
}
