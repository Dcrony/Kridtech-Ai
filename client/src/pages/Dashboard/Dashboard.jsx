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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const StatCard = ({ title, value, change, changeType, icon: Icon }) => (
  <div style={{
    background: '#fff',
    border: '1px solid #E5E5E5',
    borderRadius: 3,
    padding: '24px 24px 20px',
    fontFamily: "'Inter', sans-serif",
  }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
      <div style={{ width: 34, height: 34, background: '#0A0A0A', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon style={{ width: 15, height: 15, color: '#fff' }} />
      </div>
      {change && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600, color: changeType === 'up' ? '#16A34A' : '#DC2626' }}>
          {changeType === 'up' ? <ArrowUpRight style={{ width: 13, height: 13 }} /> : <ArrowDownRight style={{ width: 13, height: 13 }} />}
          {change}%
        </div>
      )}
    </div>
    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa', marginBottom: 6 }}>{title}</p>
    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.03em' }}>{value}</p>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0A0A0A', border: '1px solid #222', borderRadius: 3, padding: '10px 14px', fontFamily: "'Inter', sans-serif" }}>
        <p style={{ fontSize: 11, color: '#666', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{payload[0].value} calls</p>
      </div>
    );
  }
  return null;
};

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
    { date: 'Mon', calls: 12 },
    { date: 'Tue', calls: 19 },
    { date: 'Wed', calls: 15 },
    { date: 'Thu', calls: 22 },
    { date: 'Fri', calls: 28 },
    { date: 'Sat', calls: 16 },
    { date: 'Sun', calls: 14 },
  ];

  const agents = [
    { name: 'Receptionist Sarah', type: 'Inbound', calls: 156, success: '87%' },
    { name: 'Sales Alex', type: 'Outbound', calls: 89, success: '72%' },
    { name: 'Support Mike', type: 'Support', calls: 203, success: '91%' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", padding: 28, background: '#F7F7F7', minHeight: '100%' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.03em', marginBottom: 2 }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: '#aaa' }}>Overview of your AI phone agent performance</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 13px', background: '#fff', border: '1px solid #E5E5E5', borderRadius: 3 }}>
          <div style={{ width: 6, height: 6, background: '#22C55E', borderRadius: '50%' }} />
          <Activity style={{ width: 13, height: 13, color: '#22C55E' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#22C55E' }}>
            {realTime?.activeCalls || 0} Active Calls
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: '#E5E5E5', marginBottom: 24 }}>
        <StatCard title="Total Calls" value={metrics?.overview?.totalCalls || 0} change="12.5" changeType="up" icon={Phone} />
        <StatCard title="Qualified Leads" value={metrics?.overview?.qualifiedLeads || 0} change="8.2" changeType="up" icon={Users} />
        <StatCard title="Appointments" value={metrics?.overview?.totalAppointments || 0} change="3.1" changeType="down" icon={CalendarCheck} />
        <StatCard title="Conversion Rate" value={`${metrics?.overview?.conversionRate || 0}%`} change="5.4" changeType="up" icon={TrendingUp} />
      </div>

      {/* Chart + Appointments */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Chart */}
        <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 3, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa', marginBottom: 4 }}>Call Volume</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.03em' }}>7-Day Overview</p>
            </div>
            <select style={{ fontSize: 12, color: '#555', background: '#F7F7F7', border: '1px solid #E5E5E5', borderRadius: 3, padding: '6px 10px', cursor: 'pointer' }}>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A0A0A" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#0A0A0A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#bbb', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#bbb', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E5E5', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="calls" stroke="#0A0A0A" strokeWidth={2} fill="url(#fillCalls)" dot={false} activeDot={{ r: 4, fill: '#0A0A0A', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming appointments */}
        <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 3, padding: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa', marginBottom: 4 }}>Upcoming</p>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.03em', marginBottom: 20 }}>Appointments</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcoming?.map((apt) => (
              <div key={apt.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px', background: '#F7F7F7', borderRadius: 2 }}>
                <div style={{ width: 30, height: 30, background: '#0A0A0A', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock style={{ width: 13, height: 13, color: '#fff' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{apt.title}</p>
                  <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                    {new Date(apt.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                  background: apt.status === 'confirmed' ? '#F0FFF4' : '#F0F0F0',
                  color: apt.status === 'confirmed' ? '#16A34A' : '#888',
                  padding: '3px 8px', borderRadius: 2,
                }}>
                  {apt.status}
                </span>
              </div>
            ))}
            {(!upcoming || upcoming.length === 0) && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CalendarCheck style={{ width: 24, height: 24, color: '#E5E5E5', margin: '0 auto 8px' }} />
                <p style={{ fontSize: 13, color: '#ccc' }}>No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Agents */}
      <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 3, padding: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa', marginBottom: 4 }}>Status</p>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.03em', marginBottom: 20 }}>Active Agents</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#E5E5E5' }}>
          {agents.map((agent) => (
            <div key={agent.name} style={{ background: '#fff', padding: '20px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, background: '#0A0A0A', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot style={{ width: 16, height: 16, color: '#fff' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A' }}>{agent.name}</p>
                    <p style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>{agent.type}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 6, height: 6, background: '#22C55E', borderRadius: '50%' }} />
                  <span style={{ fontSize: 10, color: '#22C55E', fontWeight: 600 }}>Live</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid #F0F0F0' }}>
                <div>
                  <p style={{ fontSize: 10, color: '#bbb', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>Calls</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.03em' }}>{agent.calls}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 10, color: '#bbb', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>Success</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#1A1AFF', letterSpacing: '-0.03em' }}>{agent.success}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;