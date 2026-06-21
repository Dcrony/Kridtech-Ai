
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, Search, Filter, Plus, Star, Phone, Mail, MoreHorizontal } from 'lucide-react';
import api from '../../services/api';

const Leads = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data: leads } = useQuery({
    queryKey: ['leads', statusFilter, search],
    queryFn: async () => {
      let url = '/leads?limit=50';
      if (statusFilter) url += `&status=${statusFilter}`;
      if (search) url += `&search=${search}`;
      const res = await api.get(url);
      return res.data.data;
    },
  });

  const getPriorityColor = (priority) => {
    const map = {
      urgent: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      high: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      medium: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
      low: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    };
    return map[priority] || map.medium;
  };

  const getStatusBadge = (status) => {
    const map = {
      new: 'badge-info',
      contacted: 'badge-warning',
      qualified: 'badge-success',
      proposal: 'badge-purple',
      won: 'badge-success',
      lost: 'badge-danger',
      nurture: 'badge-info',
    };
    return map[status] || 'badge-info';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-slate-400 mt-1">Manage and qualify your leads</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search leads..."
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
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Lead</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Company</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Score</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Priority</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Value</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Source</th>
              <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {leads?.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {lead.firstName?.[0]}{lead.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {lead.firstName} {lead.lastName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {lead.phone && <Phone className="w-3 h-3 text-slate-500" />}
                        {lead.email && <Mail className="w-3 h-3 text-slate-500" />}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-300">{lead.company || '-'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`badge ${getStatusBadge(lead.status)}`}>{lead.status}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Star className={`w-4 h-4 ${lead.score >= 80 ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                    <span className="text-sm font-medium text-slate-200">{lead.score}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`badge ${getPriorityColor(lead.priority)}`}>{lead.priority}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-300">
                    ${lead.estimatedValue ? parseFloat(lead.estimatedValue).toLocaleString() : '-'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-400 capitalize">{lead.source?.replace('_', ' ')}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    to={`/leads/${lead.id}`}
                    className="p-2 text-slate-400 hover:text-primary-400 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
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

export default Leads;
