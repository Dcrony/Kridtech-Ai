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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        .vo-search:focus {
          outline: none;
          border-color: #0A0A0A !important;
          background: #fff !important;
        }
        .vo-search::placeholder { color: #bbb; }
        .vo-bell:hover { color: #0A0A0A !important; background: #F0F0F0; border-radius: 3px; }
      `}</style>

      <header style={{
        height: 52,
        background: '#fff',
        borderBottom: '1px solid #E5E5E5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        fontFamily: "'Inter', sans-serif",
        flexShrink: 0,
      }}>
        {/* Search */}
        <div style={{ position: 'relative', width: 340 }}>
          <Search style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#ccc' }} />
          <input
            type="text"
            placeholder="Search calls, leads, transcripts…"
            className="vo-search"
            style={{
              width: '100%',
              paddingLeft: 34,
              paddingRight: 12,
              paddingTop: 7,
              paddingBottom: 7,
              fontSize: 13,
              color: '#0A0A0A',
              background: '#F7F7F7',
              border: '1px solid #E5E5E5',
              borderRadius: 3,
              boxSizing: 'border-box',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          />
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Status indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, background: '#22C55E', borderRadius: '50%' }} />
            <span style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>System Online</span>
          </div>

          <div style={{ width: 1, height: 20, background: '#E5E5E5' }} />

          {/* Bell */}
          <button
            className="vo-bell"
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
          >
            <Bell style={{ width: 16, height: 16 }} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 14,
                height: 14,
                background: '#0A0A0A',
                color: '#fff',
                fontSize: 9,
                fontWeight: 700,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;