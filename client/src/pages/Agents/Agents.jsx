import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Bot, Phone, TrendingUp, MoreVertical, Pause, Play, Trash2 } from 'lucide-react';
import api from '../../services/api';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Agents</h1>
          <p className="text-slate-400 mt-1">Manage your voice AI agents</p>
        </div>
        <Link to="/agents/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Agent
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {['all', 'active', 'paused', 'draft'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === status 
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents?.map((agent) => (
          <div key={agent.id} className="glass-panel p-6 group hover:border-slate-600 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{agent.name}</h3>
                  <span className={`badge ${
                    agent.status === 'active' ? 'badge-success' : 
                    agent.status === 'paused' ? 'badge-warning' : 'badge-info'
                  }`}>
                    {agent.status}
                  </span>
                </div>
              </div>
              <button className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <Phone className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{agent.totalCallsHandled}</p>
                <p className="text-xs text-slate-500">Calls</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{Math.round(agent.successRate * 100)}%</p>
                <p className="text-xs text-slate-500">Success</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{Math.round(agent.totalMinutesUsed)}m</p>
                <p className="text-xs text-slate-500">Minutes</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleAgentStatus(agent.id, agent.status)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                  agent.status === 'active' 
                    ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                }`}
              >
                {agent.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {agent.status === 'active' ? 'Pause' : 'Activate'}
              </button>
              <Link 
                to={`/agents/${agent.id}`}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium text-center transition-all"
              >
                Configure
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agents;