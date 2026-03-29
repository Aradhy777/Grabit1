'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DashboardNavbar({ role }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('grabit_token');
    router.push('/login');
  };

  return (
    <nav className="flex items-center justify-between px-10 py-6 bg-[#E0E0E0] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#E0E0E0] shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] flex items-center justify-center">
          <Sparkles size={20} className="text-blue-600" />
        </div>
        <Link href="/" className="text-xl font-black italic tracking-tighter text-gray-700 hover:text-blue-600 transition-colors">
          GrabitAI
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 px-5 py-2 rounded-2xl bg-[#E0E0E0] shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]">
          <User size={16} className="text-gray-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
            {role || 'User'}
          </span>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#E0E0E0] text-red-500 font-bold text-[10px] uppercase tracking-widest shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] transition-all active:scale-95"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
}
