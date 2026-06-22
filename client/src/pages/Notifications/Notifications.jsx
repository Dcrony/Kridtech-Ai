import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, CheckCheck, Phone, Users, Calendar, AlertTriangle, Info } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Notifications = () => {
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications?limit=50');
      return res.data.data;
    },
  });

  const markAsRead = useMutation({
    mutationFn: (id) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['unreadNotifications']);
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: () => api.patch('/notifications/mark-all-read'),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['unreadNotifications']);
      toast.success('All notifications marked as read');
    },
  });

  const getIcon = (type) => {
    switch (type) {
      case 'call_alert': return <Phone style={{ width: 18, height: 18, color: '#1A1AFF' }} />;
      case 'lead_alert': return <Users style={{ width: 18, height: 18, color: '#6B3FA0' }} />;
      case 'appointment_alert': return <Calendar style={{ width: 18, height: 18, color: '#0A7D52' }} />;
      case 'handoff': return <AlertTriangle style={{ width: 18, height: 18, color: '#C0392B' }} />;
      default: return <Info style={{ width: 18, height: 18, color: '#888' }} />;
    }
  };

  const getPriorityColor = (priority) => ({
    urgent: '#C0392B', high: '#C99A1A', medium: '#1A1AFF',
  }[priority] || '#E5E5E5');

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .display-font { font-family: 'Syne', sans-serif; }
        .dash-card { background: #fff; border: 1px solid #E5E5E5; border-radius: 2px; }
        .section-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #888; }
        .btn-secondary-sm {
          background: transparent; color: #0A0A0A; padding: 10px 18px; border-radius: 4px;
          font-weight: 600; font-size: 13px; border: 2px solid #0A0A0A; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px; transition: background 0.15s, color 0.15s;
        }
        .btn-secondary-sm:hover { background: #0A0A0A; color: #fff; }
        .mark-read-btn { background: none; border: none; cursor: pointer; padding: 6px; color: #888; transition: color 0.15s; border-radius: 4px; }
        .mark-read-btn:hover { color: #1A1AFF; background: #EEF0FF; }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <p className="section-label" style={{ marginBottom: 8 }}>Inbox</p>
          <h1 className="display-font" style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', color: '#0A0A0A' }}>
            Notifications
          </h1>
          <p style={{ fontSize: 14, color: '#666', marginTop: 6 }}>Stay updated on your AI agent activity</p>
        </div>
        <button onClick={() => markAllAsRead.mutate()} className="btn-secondary-sm">
          <CheckCheck style={{ width: 15, height: 15 }} />
          Mark All Read
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifications?.map((notification) => (
          <div
            key={notification.id}
            className="dash-card"
            style={{
              padding: 18,
              borderLeft: `3px solid ${getPriorityColor(notification.priority)}`,
              background: !notification.isRead ? '#FAFAFA' : '#fff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 38, height: 38, background: '#F7F7F7', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {getIcon(notification.type)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A' }}>{notification.title}</h3>
                    <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{notification.message}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 16, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: '#999', whiteSpace: 'nowrap' }}>
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                    {!notification.isRead && (
                      <button onClick={() => markAsRead.mutate(notification.id)} className="mark-read-btn">
                        <Check style={{ width: 15, height: 15 }} />
                      </button>
                    )}
                  </div>
                </div>
                {notification.data && Object.keys(notification.data).length > 0 && (
                  <div style={{ marginTop: 12, padding: 12, background: '#F7F7F7', borderRadius: 2 }}>
                    <pre style={{ fontSize: 11, color: '#888', overflowX: 'auto', margin: 0 }}>
                      {JSON.stringify(notification.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {(!notifications || notifications.length === 0) && (
          <div className="dash-card" style={{ padding: 60, textAlign: 'center' }}>
            <Bell style={{ width: 36, height: 36, color: '#ccc', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>No notifications yet</h3>
            <p style={{ fontSize: 13, color: '#999', marginTop: 8 }}>
              Notifications will appear here when your AI agents handle calls
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;