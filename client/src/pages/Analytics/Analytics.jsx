import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Phone, TrendingUp, CalendarCheck, Target,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../../services/api';

const PERIODS = [
  { key: '24h', label: '24 Hours' },
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: '90d', label: '90 Days' },
];

const PIE_COLORS = ['#0A0A0A', '#555', '#999', '#CCC', '#E5E5E5'];

const chartTooltipStyle = {
  contentStyle: { background: '#0A0A0A', border: '1px solid #222', borderRadius: 3, fontFamily: 'Inter, sans-serif', fontSize: 12 },
  itemStyle: { color: '#fff' },
  labelStyle: { color: '#888' },
  cursor: { stroke: '#E5E5E5', strokeWidth: 1 },
};

const StatCard = ({ title, value, change, changeType, icon: Icon }) => (
  <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 3, padding: '24px 24px 20px' }}>
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

const SectionCard = ({ title, children, style = {} }) => (
  <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 3, padding: 24, ...style }}>
    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa', marginBottom: 4 }}>Chart</p>
    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.03em', marginBottom: 20 }}>{title}</p>
    {children}
  </div>
);

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

  const sentimentData = dashboard?.sentimentBreakdown
    ? Object.entries(dashboard.sentimentBreakdown).map(([name, value]) => ({ name, value }))
    : [{ name: 'Positive', value: 60 }, { name: 'Neutral', value: 25 }, { name: 'Negative', value: 15 }];

  const statusData = dashboard?.callsByStatus
    ? Object.entries(dashboard.callsByStatus).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", padding: 28, background: '#F7F7F7', minHeight: '100%' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .vo-period-btn { background: none; border: 1px solid #E5E5E5; border-radius: 3px; padding: 7px 14px; font-size: 12px; font-weight: 600; color: #aaa; cursor: pointer; font-family: Inter, sans-serif; transition: all 0.15s; }
        .vo-period-btn:hover { border-color: #0A0A0A; color: #0A0A0A; }
        .vo-period-btn.active { background: #0A0A0A; border-color: #0A0A0A; color: #fff; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.03em', marginBottom: 2 }}>Analytics</h1>
          <p style={{ fontSize: 13, color: '#aaa' }}>Deep insights into your AI agent performance</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {PERIODS.map((p) => (
            <button key={p.key} onClick={() => setPeriod(p.key)} className={`vo-period-btn${period === p.key ? ' active' : ''}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: '#E5E5E5', marginBottom: 24 }}>
        <StatCard title="Total Calls" value={dashboard?.overview?.totalCalls || 0} icon={Phone} />
        <StatCard title="Qualified Leads" value={dashboard?.overview?.qualifiedLeads || 0} icon={Target} />
        <StatCard title="Appointments" value={dashboard?.overview?.totalAppointments || 0} icon={CalendarCheck} />
        <StatCard title="Conversion Rate" value={`${dashboard?.overview?.conversionRate || 0}%`} icon={TrendingUp} />
      </div>

      {/* Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <SectionCard title="Call Volume Over Time">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trends || []} margin={{ left: -20, right: 0 }}>
              <defs>
                <linearGradient id="fillCalls2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A0A0A" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#0A0A0A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillMinutes2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A1AFF" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#1A1AFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#bbb', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#bbb', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <Tooltip {...chartTooltipStyle} />
              <Area type="monotone" dataKey="calls" stroke="#0A0A0A" strokeWidth={2} fill="url(#fillCalls2)" dot={false} activeDot={{ r: 3, fill: '#0A0A0A', strokeWidth: 0 }} />
              <Area type="monotone" dataKey="minutes" stroke="#1A1AFF" strokeWidth={2} fill="url(#fillMinutes2)" dot={false} activeDot={{ r: 3, fill: '#1A1AFF', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
            {[['#0A0A0A', 'Calls'], ['#1A1AFF', 'Minutes']].map(([color, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 20, height: 2, background: color, borderRadius: 2 }} />
                <span style={{ fontSize: 11, color: '#aaa', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Sentiment Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                {sentimentData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8 }}>
            {sentimentData.map((entry, index) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[index % PIE_COLORS.length], border: index === PIE_COLORS.length - 1 ? '1px solid #E5E5E5' : 'none' }} />
                <span style={{ fontSize: 11, color: '#888', textTransform: 'capitalize', fontWeight: 500 }}>{entry.name}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <SectionCard title="Call Status Breakdown">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData} margin={{ left: -20, right: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#bbb', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#bbb', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="value" fill="#0A0A0A" radius={[2, 2, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Lead Pipeline">
          {leadAnalytics?.conversionFunnel ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {leadAnalytics.conversionFunnel.map((stage, idx) => {
                const maxCount = Math.max(...leadAnalytics.conversionFunnel.map(s => s.count));
                const pct = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
                return (
                  <div key={stage.status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#555', textTransform: 'capitalize', fontWeight: 500 }}>{stage.status}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0A0A0A' }}>{stage.count}</span>
                    </div>
                    <div style={{ height: 6, background: '#F0F0F0', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: idx === 0 ? '#0A0A0A' : idx === 1 ? '#555' : '#999', borderRadius: 2, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: '#ccc', textAlign: 'center', padding: '40px 0' }}>No funnel data</p>
          )}
        </SectionCard>
      </div>

      {/* Lead Analytics Row */}
      {leadAnalytics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#E5E5E5' }}>
          {[
            { title: 'Leads by Status', data: leadAnalytics.byStatus },
            { title: 'Leads by Source', data: leadAnalytics.bySource, format: (k) => k.replace('_', ' ') },
            { title: 'Leads by Score', data: leadAnalytics.byScore },
          ].map(({ title, data, format }) => (
            <div key={title} style={{ background: '#fff', padding: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa', marginBottom: 4 }}>Breakdown</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.03em', marginBottom: 20 }}>{title}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Object.entries(data || {}).map(([key, count]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #F0F0F0' }}>
                    <span style={{ fontSize: 12, color: '#555', textTransform: 'capitalize', fontWeight: 500 }}>{format ? format(key) : key}</span>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.03em' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Analytics;