
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Star, Phone, Mail, Building2, Tag, Edit2, Save, X, Calendar, DollarSign, User } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const { data: lead } = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const res = await api.get(`/leads/${id}`);
      return res.data.data;
    },
  });

  const updateLead = useMutation({
    mutationFn: (data) => api.patch(`/leads/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['lead', id]);
      queryClient.invalidateQueries(['leads']);
      setIsEditing(false);
      toast.success('Lead updated successfully');
    },
    onError: () => toast.error('Failed to update lead'),
  });

  React.useEffect(() => {
    if (lead) setFormData(lead);
  }, [lead]);

  if (!lead) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleSave = () => {
    updateLead.mutate(formData);
  };

  const statusOptions = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'nurture'];
  const priorityOptions = ['low', 'medium', 'high', 'urgent'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/leads')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {lead.firstName} {lead.lastName}
            </h1>
            <p className="text-slate-400 text-sm">{lead.company || 'No company'}</p>
          </div>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="btn-secondary flex items-center gap-2"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
          {isEditing ? 'Save Changes' : 'Edit Lead'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Info */}
          <div className="glass-panel p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {lead.firstName?.[0]}{lead.lastName?.[0]}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-white">
                    {lead.firstName} {lead.lastName}
                  </h2>
                  <span className={`badge ${
                    lead.status === 'won' ? 'badge-success' :
                    lead.status === 'lost' ? 'badge-danger' :
                    lead.status === 'qualified' ? 'badge-success' : 'badge-info'
                  }`}>{lead.status}</span>
                </div>
                <p className="text-slate-400 mt-1">{lead.company}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-200">
                    <Mail className="w-4 h-4 text-slate-500" />
                    {lead.email || '-'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-200">
                    <Phone className="w-4 h-4 text-slate-500" />
                    {lead.phone || '-'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Company</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-200">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    {lead.company || '-'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
                {isEditing ? (
                  <select
                    value={formData.status || 'new'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input-field"
                  >
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <span className={`badge ${
                    lead.status === 'won' ? 'badge-success' :
                    lead.status === 'lost' ? 'badge-danger' :
                    lead.status === 'qualified' ? 'badge-success' : 'badge-info'
                  }`}>{lead.status}</span>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
            {isEditing ? (
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-field min-h-[120px]"
                placeholder="Add notes about this lead..."
              />
            ) : (
              <p className="text-slate-300 whitespace-pre-wrap">{lead.notes || 'No notes added yet.'}</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Score Card */}
          <div className="glass-panel p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-4">Lead Score</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" 
                    stroke={lead.score >= 80 ? '#10b981' : lead.score >= 50 ? '#f59e0b' : '#64748b'}
                    strokeWidth="8" 
                    strokeDasharray={`${(lead.score / 100) * 283} 283`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{lead.score}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-5 h-5 ${i <= Math.ceil(lead.score / 20) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
              ))}
            </div>
          </div>

          {/* Priority & Value */}
          <div className="glass-panel p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Priority</label>
                {isEditing ? (
                  <select
                    value={formData.priority || 'medium'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="input-field"
                  >
                    {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                ) : (
                  <span className={`badge ${
                    lead.priority === 'urgent' ? 'badge-danger' :
                    lead.priority === 'high' ? 'badge-warning' :
                    lead.priority === 'medium' ? 'badge-info' : 'badge-info'
                  }`}>{lead.priority}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Estimated Value</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.estimatedValue || ''}
                    onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-200">
                    <DollarSign className="w-4 h-4 text-slate-500" />
                    {lead.estimatedValue ? parseFloat(lead.estimatedValue).toLocaleString() : '-'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div className="glass-panel p-6">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag, idx) => (
                  <span key={idx} className="badge badge-info">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Source Info */}
          <div className="glass-panel p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Source</h3>
            <div className="flex items-center gap-2 text-slate-300">
              <User className="w-4 h-4 text-slate-500" />
              <span className="capitalize">{lead.source?.replace('_', ' ')}</span>
            </div>
            {lead.agent && (
              <div className="mt-2 text-sm text-slate-500">
                Handled by: {lead.agent.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
