import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  Phone, 
  Users, 
  CalendarDays, 
  BarChart3, 
  Bell, 
  Settings,
  LogOut,
  Zap
} from 'lucide-react';
import { useAuthStore } from '../../context/authStore';

const Sidebar = () => {
  const { user, clearAuth } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/agents', icon: Bot, label: 'AI Agents' },
    { path: '/calls', icon: Phone, label: 'Calls' },
    { path: '/leads', icon: Users, label: 'Leads' },
    { path: '/appointments', icon: CalendarDays, label: 'Appointments' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .vo-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 3px;
          font-size: 13px;
          font-weight: 500;
          color: #777;
          text-decoration: none;
          transition: color 0.15s, background 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .vo-nav-item:hover {
          color: #0A0A0A;
          background: #F0F0F0;
        }
        .vo-nav-item.active {
          color: #0A0A0A;
          background: #F0F0F0;
          font-weight: 600;
        }
        .vo-nav-item.active svg {
          color: #1A1AFF;
        }
        .vo-signout:hover {
          background: #FEF2F2 !important;
          color: #DC2626 !important;
        }
      `}</style>

      <aside style={{
        width: 220,
        background: '#fff',
        borderRight: '1px solid #E5E5E5',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 18px', borderBottom: '1px solid #E5E5E5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 28, height: 28, background: '#0A0A0A', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap style={{ width: 13, height: 13, color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em', lineHeight: 1 }}>VoiceAI</p>
              <p style={{ fontSize: 10, color: '#bbb', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginTop: 2 }}>Agent Platform</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#ccc', padding: '4px 12px 10px' }}>Main</p>
          {navItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink key={item.path} to={item.path} className={`vo-nav-item${isActive ? ' active' : ''}`}>
                <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
                {item.label}
              </NavLink>
            );
          })}

          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#ccc', padding: '14px 12px 10px', marginTop: 4 }}>Account</p>
          {navItems.slice(6).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink key={item.path} to={item.path} className={`vo-nav-item${isActive ? ' active' : ''}`}>
                <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ borderTop: '1px solid #E5E5E5', padding: '12px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4 }}>
            <div style={{ width: 30, height: 30, background: '#0A0A0A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#0A0A0A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={clearAuth}
            className="vo-signout"
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: 'none', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#aaa', transition: 'all 0.15s' }}
          >
            <LogOut style={{ width: 14, height: 14, flexShrink: 0 }} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;