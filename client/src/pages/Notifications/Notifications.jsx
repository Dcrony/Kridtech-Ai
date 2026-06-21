
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, CheckCheck, Phone, Users, Calendar, AlertTriangle, Info, Trash2 } from 'lucide-react';
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
      case 'call_alert': return <Phone className="w-5 h-5 text-primary-400" />;
      case 'lead_alert': return <Users className="w-5 h-5 text-accent-400" />;
      case 'appointment_alert': return <Calendar className="w-5 h-5 text-emerald-400" />;
      case 'handoff': return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      default: return <Info className="w-5 h-5 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-l-rose-500';
      case 'high': return 'border-l-amber-500';
      case 'medium': return 'border-l-primary-500';
      default: return 'border-l-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-slate-400 mt-1">Stay updated on your AI agent activity</p>
        </div>
        <button
          onClick={() => markAllAsRead.mutate()}
          className="btn-secondary flex items-center gap-2"
        >
          <CheckCheck className="w-4 h-4" />
          Mark All Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications?.map((notification) => (
          <div
            key={notification.id}
            className={`glass-panel p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
              !notification.isRead ? 'bg-slate-800/40' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-slate-200">{notification.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{notification.message}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-slate-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead.mutate(notification.id)}
                        className="p-1.5 text-slate-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                {notification.data && Object.keys(notification.data).length > 0 && (
                  <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
                    <pre className="text-xs text-slate-500 overflow-x-auto">
                      {JSON.stringify(notification.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {(!notifications || notifications.length === 0) && (
          <div className="glass-panel p-12 text-center">
            <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300">No notifications yet</h3>
            <p className="text-sm text-slate-500 mt-2">
              Notifications will appear here when your AI agents handle calls
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;