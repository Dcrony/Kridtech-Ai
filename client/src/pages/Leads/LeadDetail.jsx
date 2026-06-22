import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Star, Phone, Mail, Building2, Edit2, Save, DollarSign, User } from 'lucide-react';
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

  const styles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      .display-font { font-family: 'Syne', sans-serif; }
      .dash-card { background: #fff; border: 1px solid #E5E5E5; border-radius: 2px; }
      .section-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #888; }
      .dash-input {
        width: 100%; background: #fff; border: 1px solid #E5E5E5; border-radius: 4px;
        padding: 9px 12px; font-size: 14px; color: #0A0A0A; outline: none;
      }
      .dash-input:focus { border-color: #1A1AFF; }
      .dash-select { width: 100%; background: #fff; border: 1px solid #E5E5E5; border-radius: 4px; padding: 9px 12px; font-size: 14px; color: #0A0A0A; outline: none; cursor: pointer; }
      .dash-tag {
        font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
        padding: 4px 9px; border-radius: 2px; display: inline-flex; align-items: center;
      }
      .tag-success { background: #ECFDF5; color: #0A7D52; }
      .tag-danger { background: #FDF0EE; color: #C0392B; }
      .tag-warning { background: #FFF8E8; color: #92681A; }
      .tag-info { background: #EEF0FF; color: #1A1AFF; }
      .field-label { font-size: 12px; font-weight: 500; color: #888; margin-bottom: 8px; display: block; }
      .back-btn { background: none; border: none; cursor: pointer; padding: 8px; color: #888; transition: color 0.15s; }
      .back-btn:hover { color: #0A0A0A; }
      .btn-secondary-sm {
        background: transparent; color: #0A0A0A; padding: 10px 18px; border-radius: 4px;
        font-weight: 600; font-size: 13px; border: 2px solid #0A0A0A; cursor: pointer;
        display: inline-flex; align-items: center; gap: 8px; transition: background 0.15s, color 0.15s;
      }
      .btn-secondary-sm:hover { background: #0A0A0A; color: #fff; }
    `}</style>
  );

  if (!lead) {
    return (
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        {styles}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 320 }}>
          <div style={{ width: 28, height: 28, border: '2px solid #E5E5E5', borderTopColor: '#0A0A0A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const handleSave = () => updateLead.mutate(formData);

  const statusOptions = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'nurture'];
  const priorityOptions = ['low', 'medium', 'high', 'urgent'];

  const statusTag = (status) => ({
    won: 'tag-success', lost: 'tag-danger', qualified: 'tag-success',
  }[status] || 'tag-info');

  const priorityTag = (priority) => ({
    urgent: 'tag-danger', high: 'tag-warning', medium: 'tag-info', low: 'tag-info',
  }[priority] || 'tag-info');

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {styles}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/leads')} className="back-btn">
            <ArrowLeft style={{ width: 20, height: 20 }} />
          </button>
          <div>
            <p className="section-label" style={{ marginBottom: 4 }}>Lead Record</p>
            <h1 className="display-font" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: '#0A0A0A' }}>
              {lead.firstName} {lead.lastName}
            </h1>
            <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{lead.company || 'No company'}</p>
          </div>
        </div>
        <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="btn-secondary-sm">
          {isEditing ? <Save style={{ width: 15, height: 15 }} /> : <Edit2 style={{ width: 15, height: 15 }} />}
          {isEditing ? 'Save Changes' : 'Edit Lead'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="dash-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <div style={{ width: 56, height: 56, background: '#0A0A0A', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{lead.firstName?.[0]}{lead.lastName?.[0]}</span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h2 style={{ fontSize: 17, fontWeight: 600, color: '#0A0A0A' }}>{lead.firstName} {lead.lastName}</h2>
                  <span className={`dash-tag ${statusTag(lead.status)}`}>{lead.status}</span>
                </div>
                <p style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{lead.company}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label className="field-label">Email</label>
                {isEditing ? (
                  <input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="dash-input" />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#222', fontSize: 14 }}>
                    <Mail style={{ width: 14, height: 14, color: '#999' }} />{lead.email || '-'}
                  </div>
                )}
              </div>
              <div>
                <label className="field-label">Phone</label>
                {isEditing ? (
                  <input type="tel" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="dash-input" />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#222', fontSize: 14 }}>
                    <Phone style={{ width: 14, height: 14, color: '#999' }} />{lead.phone || '-'}
                  </div>
                )}
              </div>
              <div>
                <label className="field-label">Company</label>
                {isEditing ? (
                  <input type="text" value={formData.company || ''} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="dash-input" />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#222', fontSize: 14 }}>
                    <Building2 style={{ width: 14, height: 14, color: '#999' }} />{lead.company || '-'}
                  </div>
                )}
              </div>
              <div>
                <label className="field-label">Status</label>
                {isEditing ? (
                  <select value={formData.status || 'new'} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="dash-select">
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <span className={`dash-tag ${statusTag(lead.status)}`}>{lead.status}</span>
                )}
              </div>
            </div>
          </div>

          <div className="dash-card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0A0A0A', marginBottom: 16 }}>Notes</h3>
            {isEditing ? (
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="dash-input"
                style={{ minHeight: 120, resize: 'vertical' }}
                placeholder="Add notes about this lead..."
              />
            ) : (
              <p style={{ fontSize: 14, color: '#333', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{lead.notes || 'No notes added yet.'}</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="dash-card" style={{ padding: 24 }}>
            <p className="section-label" style={{ marginBottom: 16, textAlign: 'center' }}>Lead Score</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ position: 'relative', width: 120, height: 120 }}>
                <svg width="120" height="120" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#F0F0F0" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="45" fill="none"
                    stroke={lead.score >= 80 ? '#0A7D52' : lead.score >= 50 ? '#C99A1A' : '#999'}
                    strokeWidth="8" strokeDasharray={`${(lead.score / 100) * 283} 283`} strokeLinecap="round"
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="display-font" style={{ fontSize: 28, fontWeight: 800, color: '#0A0A0A' }}>{lead.score}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} style={{ width: 16, height: 16, color: i <= Math.ceil(lead.score / 20) ? '#C99A1A' : '#eee', fill: i <= Math.ceil(lead.score / 20) ? '#C99A1A' : 'none' }} />
              ))}
            </div>
          </div>

          <div className="dash-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="field-label">Priority</label>
              {isEditing ? (
                <select value={formData.priority || 'medium'} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="dash-select">
                  {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              ) : (
                <span className={`dash-tag ${priorityTag(lead.priority)}`}>{lead.priority}</span>
              )}
            </div>
            <div>
              <label className="field-label">Estimated value</label>
              {isEditing ? (
                <input type="number" value={formData.estimatedValue || ''} onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })} className="dash-input" />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#222', fontSize: 14 }}>
                  <DollarSign style={{ width: 14, height: 14, color: '#999' }} />
                  {lead.estimatedValue ? parseFloat(lead.estimatedValue).toLocaleString() : '-'}
                </div>
              )}
            </div>
          </div>

          {lead.tags && lead.tags.length > 0 && (
            <div className="dash-card" style={{ padding: 24 }}>
              <p className="section-label" style={{ marginBottom: 12 }}>Tags</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {lead.tags.map((tag, idx) => (
                  <span key={idx} className="dash-tag tag-info">{tag}</span>
                ))}
              </div>
            </div>
          )}

          <div className="dash-card" style={{ padding: 24 }}>
            <p className="section-label" style={{ marginBottom: 12 }}>Source</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#333', fontSize: 14 }}>
              <User style={{ width: 14, height: 14, color: '#999' }} />
              <span style={{ textTransform: 'capitalize' }}>{lead.source?.replace('_', ' ')}</span>
            </div>
            {lead.agent && <p style={{ fontSize: 12, color: '#999', marginTop: 8 }}>Handled by: {lead.agent.name}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;