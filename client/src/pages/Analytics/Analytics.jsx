
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Phone, 
  CalendarCheck, 
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import api from '../../services/api';

const COLORS = ['#3b82f6', '#d946ef', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Analytics = () => {
  const [period, setPeriod] = useState('7d');

  const { data: dashboard } = useQuery({
    queryKey: ['dashboardMetrics', period],
    queryFn: async () => {
      const res = await api.get(`/analytics/dashboard?period=${period}`);
      return res.data.data;
    },
  });

  const { data: leadAnalytics } = useQuery({
    queryKey: ['leadAnalytics', period],
    queryFn: async () => {
      const res = await api.get(`/analytics/leads?period=${period}`);
      return res.data.data;
    },
  });

  const { data: trends } = useQuery({
    queryKey: ['callTrends', period],
    queryFn: async () => {
      const res = await api.get(`/analytics/calls/trends?period=${period}`);
      return res.data.data;
    },
  });

  const sentimentData = dashboard?.sentimentBreakdown ? 
    Object.entries(dashboard.sentimentBreakdown).map(([name, value]) => ({ name, value })) : [];

  const statusData = dashboard?.callsByStatus ?
    Object.entries(dashboard.callsByStatus).map(([name, value]) => ({ name, value })) : [];

  const StatCard = ({ title, value, change, changeType, icon: Icon }) => (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-primary-500/10 rounded-xl">
          <Icon className="w-5 h-5 text-primary-400" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${changeType === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {changeType === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {change}%
          </div>
        )}
      </div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-1">Deep insights into your AI agent performance</p>
        </div>
        <div className="flex bg-slate-800 rounded-lg p-1">
          {['24h', '7d', '30d', '90d'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                period === p ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {p === '24h' ? '24 Hours' : p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Calls" value={dashboard?.overview?.totalCalls || 0} icon={Phone} />
        <StatCard title="Qualified Leads" value={dashboard?.overview?.qualifiedLeads || 0} icon={Target} />
        <StatCard title="Appointments" value={dashboard?.overview?.totalAppointments || 0} icon={CalendarCheck} />
        <StatCard title="Conversion Rate" value={`${dashboard?.overview?.conversionRate || 0}%`} icon={TrendingUp} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Volume */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Call Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trends || []}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="calls" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCalls)" strokeWidth={2} />
              <Area type="monotone" dataKey="minutes" stroke="#d946ef" fillOpacity={1} fill="url(#colorMinutes)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Distribution */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {sentimentData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-slate-400 capitalize">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Status */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Call Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Pipeline */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Lead Pipeline</h3>
          {leadAnalytics?.conversionFunnel && (
            <div className="space-y-4">
              {leadAnalytics.conversionFunnel.map((stage, idx) => {
                const maxCount = Math.max(...leadAnalytics.conversionFunnel.map(s => s.count));
                const percentage = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
                return (
                  <div key={stage.status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300 capitalize">{stage.status}</span>
                      <span className="text-sm font-medium text-white">{stage.count}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: COLORS[idx % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lead Analytics */}
      {leadAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Leads by Status</h3>
            <div className="space-y-3">
              {Object.entries(leadAnalytics.byStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-slate-400 capitalize">{status}</span>
                  <span className="text-sm font-medium text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Leads by Source</h3>
            <div className="space-y-3">
              {Object.entries(leadAnalytics.bySource || {}).map(([source, count]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-sm text-slate-400 capitalize">{source.replace('_', ' ')}</span>
                  <span className="text-sm font-medium text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Leads by Score</h3>
            <div className="space-y-3">
              {Object.entries(leadAnalytics.byScore || {}).map(([score, count]) => (
                <div key={score} className="flex items-center justify-between">
                  <span className="text-sm text-slate-400 capitalize">{score}</span>
                  <span className="text-sm font-medium text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
