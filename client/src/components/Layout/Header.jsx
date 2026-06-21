import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

const Header = () => {
  const { data: unreadCount } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: async () => {
      const res = await api.get('/notifications/unread-count');
      return res.data.data.count;
    },
    refetchInterval: 30000,
  });

  return (
    <header className="h-16 bg-slate-900/60 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search calls, leads, transcripts..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        <div className="h-8 w-px bg-slate-700" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm text-emerald-400 font-medium">System Online</span>
        </div>
      </div>
    </header>
  );
};

export default Header;