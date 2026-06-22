import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Phone, Clock, User, MessageSquare, TrendingUp, AlertCircle, Play, Download } from 'lucide-react';
import api from '../../services/api';

const CallDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: call } = useQuery({
    queryKey: ['call', id],
    queryFn: async () => {
      const res = await api.get(`/calls/${id}`);
      return res.data.data;
    },
  });

  const styles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      .display-font { font-family: 'Syne', sans-serif; }
      .dash-card { background: #fff; border: 1px solid #E5E5E5; border-radius: 2px; }
      .dash-card-dark { background: #0A0A0A; color: #fff; border-radius: 2px; }
      .section-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #888; }
      .dash-tag {
        font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
        padding: 4px 9px; border-radius: 2px; display: inline-flex; align-items: center;
      }
      .icon-btn { background: #fff; border: 1px solid #E5E5E5; border-radius: 4px; padding: 8px; cursor: pointer; color: #555; transition: all 0.15s; }
      .icon-btn:hover { border-color: #0A0A0A; color: #0A0A0A; }
      .back-btn { background: none; border: none; cursor: pointer; padding: 8px; color: #888; transition: color 0.15s; }
      .back-btn:hover { color: #0A0A0A; }
    `}</style>
  );

  if (!call) {
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

  const conversationMessages = call.conversationLog || [];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {styles}

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button onClick={() => navigate('/calls')} className="back-btn">
          <ArrowLeft style={{ width: 20, height: 20 }} />
        </button>
        <div>
          <p className="section-label" style={{ marginBottom: 4 }}>Call Record</p>
          <h1 className="display-font" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: '#0A0A0A' }}>
            {call.callSid || call.id}
          </h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Main column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="dash-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: call.direction === 'inbound' ? '#ECFDF5' : '#EEF0FF',
                }}>
                  <Phone style={{ width: 22, height: 22, color: call.direction === 'inbound' ? '#0A7D52' : '#1A1AFF' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 600, color: '#0A0A0A' }}>{call.callerName || 'Unknown caller'}</h2>
                  <p style={{ fontSize: 13, color: '#888' }}>{call.callerNumber}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {call.recordingUrl && (
                  <button className="icon-btn"><Play style={{ width: 16, height: 16 }} /></button>
                )}
                <button className="icon-btn"><Download style={{ width: 16, height: 16 }} /></button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: '#E5E5E5' }}>
              {[
                { icon: Clock, label: 'Duration', value: call.duration ? `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}` : '-' },
                { icon: TrendingUp, label: 'Lead score', value: call.leadScore || 0 },
                { icon: MessageSquare, label: 'Intent', value: call.intent || 'Unknown', cap: true },
                { icon: User, label: 'Agent', value: call.agent?.name || '-' },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} style={{ background: '#fff', padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Icon style={{ width: 13, height: 13, color: '#999' }} />
                      <span style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</span>
                    </div>
                    <p style={{ fontSize: 18, fontWeight: 700, color: '#0A0A0A', textTransform: stat.cap ? 'capitalize' : 'none' }}>{stat.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="dash-card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0A0A0A', marginBottom: 20 }}>Conversation transcript</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 420, overflowY: 'auto' }}>
              {conversationMessages.length > 0 ? (
                conversationMessages.map((msg, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 12, flexDirection: msg.role === 'assistant' ? 'row' : 'row-reverse' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                      background: msg.role === 'assistant' ? '#EEF0FF' : '#F0F0F0',
                      color: msg.role === 'assistant' ? '#1A1AFF' : '#555',
                    }}>
                      {msg.role === 'assistant' ? 'AI' : 'U'}
                    </div>
                    <div style={{
                      maxWidth: '80%', padding: '12px 14px', borderRadius: 2,
                      background: msg.role === 'assistant' ? '#EEF0FF' : '#F7F7F7',
                      border: `1px solid ${msg.role === 'assistant' ? '#D6DAFF' : '#E5E5E5'}`,
                    }}>
                      <p style={{ fontSize: 13, color: '#222' }}>{msg.content}</p>
                      {msg.timestamp && (
                        <p style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : call.transcript ? (
                <div style={{ padding: 16, background: '#F7F7F7', borderRadius: 2 }}>
                  <p style={{ fontSize: 13, color: '#333', whiteSpace: 'pre-wrap' }}>{call.transcript}</p>
                </div>
              ) : (
                <p style={{ color: '#999', textAlign: 'center', padding: '40px 0', fontSize: 13 }}>No transcript available</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="dash-card" style={{ padding: 24 }}>
            <p className="section-label" style={{ marginBottom: 16 }}>Sentiment</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: call.sentiment === 'positive' ? '#0A7D52' : call.sentiment === 'negative' ? '#C0392B' : '#C99A1A',
              }} />
              <span style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A', textTransform: 'capitalize' }}>{call.sentiment || 'Unknown'}</span>
            </div>
            <div style={{ width: '100%', height: 6, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 3, width: `${(call.sentimentScore || 0.5) * 100}%`,
                background: call.sentiment === 'positive' ? '#0A7D52' : call.sentiment === 'negative' ? '#C0392B' : '#C99A1A',
              }} />
            </div>
            <p style={{ fontSize: 11, color: '#999', marginTop: 8 }}>Confidence: {Math.round((call.sentimentScore || 0) * 100)}%</p>
          </div>

          {call.summary && (
            <div className="dash-card" style={{ padding: 24 }}>
              <p className="section-label" style={{ marginBottom: 12 }}>AI summary</p>
              <p style={{ fontSize: 13, color: '#333', lineHeight: 1.65 }}>{call.summary}</p>
            </div>
          )}

          {call.qualificationData && Object.keys(call.qualificationData).length > 0 && (
            <div className="dash-card" style={{ padding: 24 }}>
              <p className="section-label" style={{ marginBottom: 12 }}>Qualification data</p>
              {Object.entries(call.qualificationData).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0F0F0' }}>
                  <span style={{ fontSize: 13, color: '#888', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A' }}>
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {call.status === 'handoff' && (
            <div className="dash-card" style={{ padding: 24, borderColor: '#F3C9C0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#C0392B', marginBottom: 12 }}>
                <AlertCircle style={{ width: 16, height: 16 }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Handoff details</span>
              </div>
              <p style={{ fontSize: 13, color: '#333', marginBottom: 6 }}>{call.handoffReason}</p>
              {call.handoffNotes && <p style={{ fontSize: 13, color: '#888' }}>{call.handoffNotes}</p>}
            </div>
          )}

          {call.tags && call.tags.length > 0 && (
            <div className="dash-card" style={{ padding: 24 }}>
              <p className="section-label" style={{ marginBottom: 12 }}>Tags</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {call.tags.map((tag, idx) => (
                  <span key={idx} className="dash-tag" style={{ background: '#EEF0FF', color: '#1A1AFF' }}>{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallDetail;