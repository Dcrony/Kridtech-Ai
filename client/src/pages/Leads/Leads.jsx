import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, Search, Plus, Star, Phone, Mail, MoreHorizontal } from 'lucide-react';
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

  const getPriorityTag = (priority) => {
    const map = {
      urgent: 'tag-danger',
      high: 'tag-warning',
      medium: 'tag-info',
      low: 'tag-neutral',
    };
    return map[priority] || 'tag-info';
  };

  const getStatusTag = (status) => {
    const map = {
      new: 'tag-info',
      contacted: 'tag-warning',
      qualified: 'tag-success',
      proposal: 'tag-purple',
      won: 'tag-success',
      lost: 'tag-danger',
      nurture: 'tag-neutral',
    };
    return map[status] || 'tag-neutral';
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .display-font { font-family: 'Syne', sans-serif; }
        .dash-card { background: #fff; border: 1px solid #E5E5E5; border-radius: 2px; }
        .dash-input {
          width: 100%; background: #fff; border: 1px solid #E5E5E5; border-radius: 4px;
          padding: 10px 14px 10px 38px; font-size: 14px; color: #0A0A0A; outline: none;
        }
        .dash-input:focus { border-color: #1A1AFF; }
        .dash-select {
          background: #fff; border: 1px solid #E5E5E5; border-radius: 4px; padding: 10px 14px;
          font-size: 14px; color: #0A0A0A; outline: none; cursor: pointer;
        }
        .section-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #888; }
        .dash-tag {
          font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 4px 9px; border-radius: 2px; display: inline-flex; align-items: center;
        }
        .tag-success { background: #ECFDF5; color: #0A7D52; }
        .tag-danger { background: #FDF0EE; color: #C0392B; }
        .tag-warning { background: #FFF8E8; color: #92681A; }
        .tag-info { background: #EEF0FF; color: #1A1AFF; }
        .tag-purple { background: #F3EEFB; color: #6B3FA0; }
        .tag-neutral { background: #F0F0F0; color: #555; }
        .dash-table th {
          font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
          color: #888; text-align: left; padding: 14px 20px; border-bottom: 1px solid #E5E5E5;
        }
        .dash-table td { padding: 16px 20px; border-bottom: 1px solid #F0F0F0; font-size: 14px; color: #333; }
        .dash-table tr:hover td { background: #FAFAFA; }
        .icon-btn { color: #888; transition: color 0.15s; }
        .icon-btn:hover { color: #1A1AFF; }
        .btn-primary-sm {
          background: #0A0A0A; color: #fff; padding: 10px 18px; border-radius: 4px;
          font-weight: 600; font-size: 13px; border: 2px solid #0A0A0A; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px; transition: background 0.15s;
        }
        .btn-primary-sm:hover { background: #1A1AFF; border-color: #1A1AFF; }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <p className="section-label" style={{ marginBottom: 8 }}>Pipeline</p>
          <h1 className="display-font" style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', color: '#0A0A0A' }}>
            Leads
          </h1>
          <p style={{ fontSize: 14, color: '#666', marginTop: 6 }}>Manage and qualify your leads</p>
        </div>
        <button className="btn-primary-sm">
          <Plus style={{ width: 16, height: 16 }} />
          Add Lead
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#999' }} />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dash-input"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="dash-select"
          style={{ width: 170 }}
        >
          <option value="">All status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      <div className="dash-card" style={{ overflow: 'hidden' }}>
        <table className="dash-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Lead</th>
              <th>Company</th>
              <th>Status</th>
              <th>Score</th>
              <th>Priority</th>
              <th>Value</th>
              <th>Source</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads?.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 2, background: '#0A0A0A',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
                        {lead.firstName?.[0]}{lead.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#0A0A0A' }}>{lead.firstName} {lead.lastName}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        {lead.phone && <Phone style={{ width: 11, height: 11, color: '#aaa' }} />}
                        {lead.email && <Mail style={{ width: 11, height: 11, color: '#aaa' }} />}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{lead.company || '-'}</td>
                <td><span className={`dash-tag ${getStatusTag(lead.status)}`}>{lead.status}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Star style={{ width: 14, height: 14, color: lead.score >= 80 ? '#C99A1A' : '#ddd', fill: lead.score >= 80 ? '#C99A1A' : 'none' }} />
                    <span style={{ fontWeight: 600, color: '#0A0A0A' }}>{lead.score}</span>
                  </div>
                </td>
                <td><span className={`dash-tag ${getPriorityTag(lead.priority)}`}>{lead.priority}</span></td>
                <td>${lead.estimatedValue ? parseFloat(lead.estimatedValue).toLocaleString() : '-'}</td>
                <td style={{ textTransform: 'capitalize', color: '#666' }}>{lead.source?.replace('_', ' ')}</td>
                <td style={{ textAlign: 'right' }}>
                  <Link to={`/leads/${lead.id}`} className="icon-btn">
                    <MoreHorizontal style={{ width: 16, height: 16 }} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!leads || leads.length === 0) && (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Users style={{ width: 32, height: 32, color: '#ccc', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14, color: '#888' }}>No leads yet. They'll appear here as your agents capture them.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;