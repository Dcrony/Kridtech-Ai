import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Bot, Phone, TrendingUp, MoreVertical, Pause, Play, Trash2 } from 'lucide-react';
import api from '../../services/api';

const STATUS_STYLES = {
  active:  { bg: '#F0FFF4', color: '#16A34A' },
  paused:  { bg: '#FFFBEB', color: '#D97706' },
  draft:   { bg: '#F0F0F0', color: '#888' },
};

const Agents = () => {
  const [filter, setFilter] = useState('all');

  const { data: agents, refetch } = useQuery({
    queryKey: ['agents', filter],
    queryFn: async () => {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const res = await api.get(`/agents${params}`);
      return res.data.data;
    },
  });

  const toggleAgentStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    await api.patch(`/agents/${id}`, { status: newStatus });
    refetch();
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", padding: 28, background: '#F7F7F7', minHeight: '100%' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .vo-filter-btn { background: none; border: 1px solid #E5E5E5; borderRadius: 3px; padding: 6px 14px; font-size: 12px; font-weight: 600; color: #aaa; cursor: pointer; font-family: Inter, sans-serif; transition: all 0.15s; border-radius: 3px; }
        .vo-filter-btn:hover { border-color: #0A0A0A; color: #0A0A0A; }
        .vo-filter-btn.active { background: #0A0A0A; border-color: #0A0A0A; color: #fff; }
        .vo-agent-card { background: #fff; border: 1px solid #E5E5E5; border-radius: 3px; padding: 22px; transition: border-color 0.15s; }
        .vo-agent-card:hover { border-color: #0A0A0A; }
        .vo-pause-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px; padding: 9px; background: #F7F7F7; border: 1px solid #E5E5E5; border-radius: 3px; font-size: 12px; font-weight: 600; color: #555; cursor: pointer; font-family: Inter, sans-serif; transition: all 0.15s; }
        .vo-pause-btn:hover { background: #0A0A0A; border-color: #0A0A0A; color: #fff; }
        .vo-config-link { flex: 1; display: flex; align-items: center; justify-content: center; padding: 9px; background: #0A0A0A; border-radius: 3px; font-size: 12px; font-weight: 600; color: #fff; text-decoration: none; transition: background 0.15s; }
        .vo-config-link:hover { background: #1A1AFF; }
        .vo-more-btn { background: none; border: none; cursor: pointer; color: #ccc; padding: 5px; border-radius: 3px; display: flex; transition: all 0.15s; }
        .vo-more-btn:hover { background: #F0F0F0; color: #0A0A0A; }
        .vo-create-btn { display: flex; align-items: center; gap: 7px; padding: 9px 18px; background: #0A0A0A; color: #fff; border: 2px solid #0A0A0A; border-radius: 3px; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; font-family: Inter, sans-serif; transition: background 0.15s; }
        .vo-create-btn:hover { background: #1A1AFF; border-color: #1A1AFF; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.03em', marginBottom: 2 }}>AI Agents</h1>
          <p style={{ fontSize: 13, color: '#aaa' }}>Manage your voice AI agents</p>
        </div>
        <Link to="/agents/new" className="vo-create-btn">
          <Plus style={{ width: 15, height: 15 }} />
          Create Agent
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {['all', 'active', 'paused', 'draft'].map((status) => (
          <button key={status} onClick={() => setFilter(status)} className={`vo-filter-btn${filter === status ? ' active' : ''}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Agent grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {agents?.map((agent) => {
          const statusStyle = STATUS_STYLES[agent.status] || STATUS_STYLES.draft;
          return (
            <div key={agent.id} className="vo-agent-card">
              {/* Card header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, background: '#0A0A0A', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot style={{ width: 18, height: 18, color: '#fff' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', marginBottom: 4 }}>{agent.name}</p>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', background: statusStyle.bg, color: statusStyle.color, padding: '2px 8px', borderRadius: 2 }}>
                      {agent.status}
                    </span>
                  </div>
                </div>
                <button className="vo-more-btn">
                  <MoreVertical style={{ width: 14, height: 14 }} />
                </button>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#E5E5E5', marginBottom: 16 }}>
                {[
                  { icon: Phone, value: agent.totalCallsHandled, label: 'Calls' },
                  { icon: TrendingUp, value: `${Math.round(agent.successRate * 100)}%`, label: 'Success' },
                  { icon: null, value: `${Math.round(agent.totalMinutesUsed)}m`, label: 'Minutes' },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} style={{ background: '#fff', padding: '14px 10px', textAlign: 'center' }}>
                    {Icon && <Icon style={{ width: 12, height: 12, color: '#ccc', margin: '0 auto 6px' }} />}
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: label === 'Success' ? '#1A1AFF' : '#0A0A0A', letterSpacing: '-0.03em', marginBottom: 2 }}>{value}</p>
                    <p style={{ fontSize: 10, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 500 }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => toggleAgentStatus(agent.id, agent.status)} className="vo-pause-btn">
                  {agent.status === 'active'
                    ? <><Pause style={{ width: 13, height: 13 }} /> Pause</>
                    : <><Play style={{ width: 13, height: 13 }} /> Activate</>
                  }
                </button>
                <Link to={`/agents/${agent.id}`} className="vo-config-link">Configure</Link>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {(!agents || agents.length === 0) && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 48, height: 48, background: '#F0F0F0', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Bot style={{ width: 20, height: 20, color: '#ccc' }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', marginBottom: 6 }}>No agents yet</p>
            <p style={{ fontSize: 13, color: '#aaa', marginBottom: 20 }}>Create your first AI agent to get started</p>
            <Link to="/agents/new" className="vo-create-btn" style={{ display: 'inline-flex' }}>
              <Plus style={{ width: 15, height: 15 }} /> Create Agent
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agents;