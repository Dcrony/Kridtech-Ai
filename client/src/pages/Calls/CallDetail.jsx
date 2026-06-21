
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

  if (!call) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const conversationMessages = call.conversationLog || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/calls')}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Call Details</h1>
          <p className="text-slate-400 text-sm">{call.callSid || call.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Call Info Card */}
          <div className="glass-panel p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  call.direction === 'inbound' ? 'bg-emerald-500/10' : 'bg-primary-500/10'
                }`}>
                  <Phone className={`w-6 h-6 ${
                    call.direction === 'inbound' ? 'text-emerald-400' : 'text-primary-400'
                  }`} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {call.callerName || 'Unknown Caller'}
                  </h2>
                  <p className="text-slate-400">{call.callerNumber}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {call.recordingUrl && (
                  <button className="p-2 bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 transition-all">
                    <Play className="w-4 h-4" />
                  </button>
                )}
                <button className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-all">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">Duration</span>
                </div>
                <p className="text-lg font-semibold text-white">
                  {call.duration ? `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}` : '-'}
                </p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs">Lead Score</span>
                </div>
                <p className="text-lg font-semibold text-white">{call.leadScore || 0}</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs">Intent</span>
                </div>
                <p className="text-lg font-semibold text-white capitalize">{call.intent || 'Unknown'}</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <User className="w-4 h-4" />
                  <span className="text-xs">Agent</span>
                </div>
                <p className="text-lg font-semibold text-white">{call.agent?.name || '-'}</p>
              </div>
            </div>
          </div>

          {/* Transcript */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Conversation Transcript</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {conversationMessages.length > 0 ? (
                conversationMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex gap-3 ${msg.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'assistant' 
                        ? 'bg-primary-500/20 text-primary-400' 
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {msg.role === 'assistant' ? 'AI' : 'U'}
                    </div>
                    <div className={`max-w-[80%] p-3 rounded-xl ${
                      msg.role === 'assistant' 
                        ? 'bg-primary-500/10 border border-primary-500/20' 
                        : 'bg-slate-800 border border-slate-700'
                    }`}>
                      <p className="text-sm text-slate-200">{msg.content}</p>
                      {msg.timestamp && (
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : call.transcript ? (
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">{call.transcript}</p>
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No transcript available</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sentiment */}
          <div className="glass-panel p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-4">Sentiment Analysis</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-3 h-3 rounded-full ${
                call.sentiment === 'positive' ? 'bg-emerald-500' :
                call.sentiment === 'negative' ? 'bg-rose-500' : 'bg-amber-500'
              }`} />
              <span className="text-lg font-semibold text-white capitalize">{call.sentiment || 'Unknown'}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  call.sentiment === 'positive' ? 'bg-emerald-500' :
                  call.sentiment === 'negative' ? 'bg-rose-500' : 'bg-amber-500'
                }`}
                style={{ width: `${(call.sentimentScore || 0.5) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Confidence: {Math.round((call.sentimentScore || 0) * 100)}%</p>
          </div>

          {/* Summary */}
          {call.summary && (
            <div className="glass-panel p-6">
              <h3 className="text-sm font-medium text-slate-400 mb-3">AI Summary</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{call.summary}</p>
            </div>
          )}

          {/* Qualification */}
          {call.qualificationData && Object.keys(call.qualificationData).length > 0 && (
            <div className="glass-panel p-6">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Qualification Data</h3>
              <div className="space-y-2">
                {Object.entries(call.qualificationData).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                    <span className="text-sm text-slate-500 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-sm font-medium text-slate-200">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Handoff */}
          {call.status === 'handoff' && (
            <div className="glass-panel p-6 border-rose-500/20">
              <div className="flex items-center gap-2 text-rose-400 mb-3">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-medium">Handoff Details</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">{call.handoffReason}</p>
              {call.handoffNotes && (
                <p className="text-sm text-slate-400">{call.handoffNotes}</p>
              )}
            </div>
          )}

          {/* Tags */}
          {call.tags && call.tags.length > 0 && (
            <div className="glass-panel p-6">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {call.tags.map((tag, idx) => (
                  <span key={idx} className="badge badge-info">{tag}</span>
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

