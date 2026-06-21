import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Phone, PhoneIncoming, PhoneOutgoing, Search, Filter, Play } from 'lucide-react';
import api from '../../services/api';

const Calls = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data: calls } = useQuery({
    queryKey: ['calls', statusFilter, search],
    queryFn: async () => {
      let url = '/calls?limit=50';
      if (statusFilter) url += `&status=${statusFilter}`;
      if (search) url += `&search=${search}`;
      const res = await api.get(url);
      return res.data.data;
    },
  });

  const getStatusBadge = (status) => {
    const map = {
      completed: 'badge-success',
      in_progress: 'badge-info',
      failed: 'badge-danger',
      handoff: 'badge-purple',
      queued: 'badge-warning',
    };
    return map[status] || 'badge-info';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Calls</h1>
          <p className="text-slate-400 mt-1">Conversation history and transcripts</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, number, or transcript..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-40"
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="in_progress">In Progress</option>
          <option value="handoff">Handoff</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Direction</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Caller</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Agent</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Duration</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Sentiment</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Score</th>
              <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {calls?.map((call) => (
              <tr key={call.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  {call.direction === 'inbound' ? (
                    <PhoneIncoming className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <PhoneOutgoing className="w-5 h-5 text-primary-400" />
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-200">{call.callerName || 'Unknown'}</p>
                  <p className="text-xs text-slate-500">{call.callerNumber}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-300">{call.agent?.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-300">
                    {call.duration ? `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}` : '-'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`badge ${getStatusBadge(call.status)}`}>{call.status}</span>
                </td>
                <td className="px-6 py-4">
                  {call.sentiment && (
                    <span className={`badge ${
                      call.sentiment === 'positive' ? 'badge-success' : 
                      call.sentiment === 'negative' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {call.sentiment}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          call.leadScore >= 80 ? 'bg-emerald-500' : 
                          call.leadScore >= 50 ? 'bg-amber-500' : 'bg-slate-600'
                        }`}
                        style={{ width: `${call.leadScore}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-400">{call.leadScore}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    to={`/calls/${call.id}`}
                    className="p-2 text-slate-400 hover:text-primary-400 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calls;