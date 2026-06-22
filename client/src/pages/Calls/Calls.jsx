import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Phone, PhoneIncoming, PhoneOutgoing, Search, Play } from 'lucide-react';
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

  const getStatusTag = (status) => {
    const map = {
      completed: 'tag-success',
      in_progress: 'tag-info',
      failed: 'tag-danger',
      handoff: 'tag-purple',
      queued: 'tag-warning',
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
          transition: border-color 0.15s;
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
      `}</style>

      <div style={{ marginBottom: 32 }}>
        <p className="section-label" style={{ marginBottom: 8 }}>Activity</p>
        <h1 className="display-font" style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', color: '#0A0A0A' }}>
          Calls
        </h1>
        <p style={{ fontSize: 14, color: '#666', marginTop: 6 }}>Conversation history and transcripts</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#999' }} />
          <input
            type="text"
            placeholder="Search by name, number, or transcript..."
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
          <option value="completed">Completed</option>
          <option value="in_progress">In progress</option>
          <option value="handoff">Handoff</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="dash-card" style={{ overflow: 'hidden' }}>
        <table className="dash-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Direction</th>
              <th>Caller</th>
              <th>Agent</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Sentiment</th>
              <th>Score</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {calls?.map((call) => (
              <tr key={call.id}>
                <td>
                  {call.direction === 'inbound' ? (
                    <PhoneIncoming style={{ width: 18, height: 18, color: '#0A7D52' }} />
                  ) : (
                    <PhoneOutgoing style={{ width: 18, height: 18, color: '#1A1AFF' }} />
                  )}
                </td>
                <td>
                  <p style={{ fontWeight: 600, color: '#0A0A0A', marginBottom: 2 }}>{call.callerName || 'Unknown'}</p>
                  <p style={{ fontSize: 12, color: '#999' }}>{call.callerNumber}</p>
                </td>
                <td>{call.agent?.name || '-'}</td>
                <td>
                  {call.duration ? `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}` : '-'}
                </td>
                <td><span className={`dash-tag ${getStatusTag(call.status)}`}>{call.status}</span></td>
                <td>
                  {call.sentiment && (
                    <span className={`dash-tag ${
                      call.sentiment === 'positive' ? 'tag-success' :
                      call.sentiment === 'negative' ? 'tag-danger' : 'tag-warning'
                    }`}>{call.sentiment}</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 60, height: 6, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%', borderRadius: 3, width: `${call.leadScore}%`,
                          background: call.leadScore >= 80 ? '#0A7D52' : call.leadScore >= 50 ? '#C99A1A' : '#ccc',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 13, color: '#666' }}>{call.leadScore}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Link to={`/calls/${call.id}`} className="icon-btn">
                    <Play style={{ width: 16, height: 16 }} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!calls || calls.length === 0) && (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Phone style={{ width: 32, height: 32, color: '#ccc', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14, color: '#888' }}>No calls yet. They'll show up here once your agents start taking calls.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calls;