import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Phone, 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Bot
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '../../services/api';

const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => (
  <div className="stat-card">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-5 h-5 text-white" />
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

const Dashboard = () => {
  const { data: metrics } = useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: async () => {
      const res = await api.get('/analytics/dashboard?period=7d');
      return res.data.data;
    },
  });

  const { data: realTime } = useQuery({
    queryKey: ['realTimeMetrics'],
    queryFn: async () => {
      const res = await api.get('/analytics/real-time');
      return res.data.data;
    },
    refetchInterval: 10000,
  });

  const { data: upcoming } = useQuery({
    queryKey: ['upcomingAppointments'],
    queryFn: async () => {
      const res = await api.get('/appointments/upcoming');
      return res.data.data;
    },
  });

  const chartData = metrics?.callsOverTime || [
    { date: 'Mon', calls: 12, minutes: 45 },
    { date: 'Tue', calls: 19, minutes: 78 },
    { date: 'Wed', calls: 15, minutes: 62 },
    { date: 'Thu', calls: 22, minutes: 95 },
    { date: 'Fri', calls: 28, minutes: 120 },
    { date: 'Sat', calls: 16, minutes: 55 },
    { date: 'Sun', calls: 14, minutes: 48 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Overview of your AI phone agent performance</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400">
            {realTime?.activeCalls || 0} Active Calls
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Calls" 
          value={metrics?.overview?.totalCalls || 0} 
          change="12.5" 
          changeType="up"
          icon={Phone}
          color="bg-primary-600"
        />
        <StatCard 
          title="Qualified Leads" 
          value={metrics?.overview?.qualifiedLeads || 0} 
          change="8.2" 
          changeType="up"
          icon={Users}
          color="bg-accent-600"
        />
        <StatCard 
          title="Appointments" 
          value={metrics?.overview?.totalAppointments || 0} 
          change="3.1" 
          changeType="down"
          icon={CalendarCheck}
          color="bg-emerald-600"
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${metrics?.overview?.conversionRate || 0}%`} 
          change="5.4" 
          changeType="up"
          icon={TrendingUp}
          color="bg-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Call Volume</h3>
            <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
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
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Upcoming Appointments</h3>
          <div className="space-y-4">
            {upcoming?.map((apt) => (
              <div key={apt.id} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl">
                <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{apt.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(apt.scheduledDate).toLocaleDateString('en-US', { 
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </p>
                </div>
                <span className={`badge ${apt.status === 'confirmed' ? 'badge-success' : 'badge-info'}`}>
                  {apt.status}
                </span>
              </div>
            ))}
            {(!upcoming || upcoming.length === 0) && (
              <p className="text-sm text-slate-500 text-center py-8">No upcoming appointments</p>
            )}
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Active Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Receptionist Sarah', type: 'Inbound', status: 'active', calls: 156, success: '87%' },
            { name: 'Sales Alex', type: 'Outbound', status: 'active', calls: 89, success: '72%' },
            { name: 'Support Mike', type: 'Support', status: 'active', calls: 203, success: '91%' },
          ].map((agent) => (
            <div key={agent.name} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{agent.name}</p>
                    <p className="text-xs text-slate-500">{agent.type}</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{agent.calls} calls</span>
                <span className="text-emerald-400 font-medium">{agent.success} success</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;