import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bot, Save, ArrowLeft, Plus, Trash2, Mic, Clock, MessageSquare, Target,
  Phone, Calendar, AlertTriangle, CheckCircle, Loader2, ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AgentBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;
  const [activeStep, setActiveStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'inbound',
    greeting: '',
    farewell: '',
    knowledgeBase: {},
    faqs: [],
    customScripts: [],
    qualificationRules: {},
    appointmentSettings: {},
    handoffTriggers: [],
    businessHours: {
      monday: { start: '09:00', end: '17:00', enabled: true },
      tuesday: { start: '09:00', end: '17:00', enabled: true },
      wednesday: { start: '09:00', end: '17:00', enabled: true },
      thursday: { start: '09:00', end: '17:00', enabled: true },
      friday: { start: '09:00', end: '17:00', enabled: true },
      saturday: { start: '09:00', end: '13:00', enabled: false },
      sunday: { start: '09:00', end: '13:00', enabled: false }
    },
    afterHoursEnabled: true,
    maxCallDuration: 600,
    language: 'en-US',
    sentimentThreshold: 0.3,
  });

  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newScript, setNewScript] = useState('');
  const [newTrigger, setNewTrigger] = useState({ condition: '', action: '' });

  const { data: existingAgent } = useQuery({
    queryKey: ['agent', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get(`/agents/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (existingAgent) {
      setFormData({
        name: existingAgent.name || '',
        type: existingAgent.type || 'inbound',
        greeting: existingAgent.greeting || '',
        farewell: existingAgent.farewell || '',
        knowledgeBase: existingAgent.knowledgeBase || {},
        faqs: existingAgent.faqs || [],
        customScripts: existingAgent.customScripts || [],
        qualificationRules: existingAgent.qualificationRules || {},
        appointmentSettings: existingAgent.appointmentSettings || {},
        handoffTriggers: existingAgent.handoffTriggers || [],
        businessHours: existingAgent.businessHours || formData.businessHours,
        afterHoursEnabled: existingAgent.afterHoursEnabled ?? true,
        maxCallDuration: existingAgent.maxCallDuration || 600,
        language: existingAgent.language || 'en-US',
        sentimentThreshold: existingAgent.sentimentThreshold || 0.3,
      });
    }
  }, [existingAgent]);

  const createAgent = useMutation({
    mutationFn: (data) => api.post('/agents', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['agents']);
      toast.success('Agent created successfully');
      navigate('/agents');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to create agent'),
  });

  const updateAgent = useMutation({
    mutationFn: (data) => api.patch(`/agents/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['agents']);
      queryClient.invalidateQueries(['agent', id]);
      toast.success('Agent updated successfully');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to update agent'),
  });

  const handleSave = async () => {
    setIsSaving(true);
    if (isEditing) {
      await updateAgent.mutateAsync(formData);
    } else {
      await createAgent.mutateAsync(formData);
    }
    setIsSaving(false);
  };

  const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      setFormData({ ...formData, faqs: [...formData.faqs, { ...newFaq, id: Date.now() }] });
      setNewFaq({ question: '', answer: '' });
    }
  };
  const removeFaq = (index) => setFormData({ ...formData, faqs: formData.faqs.filter((_, i) => i !== index) });

  const addScript = () => {
    if (newScript.trim()) {
      setFormData({ ...formData, customScripts: [...formData.customScripts, { text: newScript, id: Date.now() }] });
      setNewScript('');
    }
  };
  const removeScript = (index) => setFormData({ ...formData, customScripts: formData.customScripts.filter((_, i) => i !== index) });

  const addTrigger = () => {
    if (newTrigger.condition.trim() && newTrigger.action.trim()) {
      setFormData({ ...formData, handoffTriggers: [...formData.handoffTriggers, { ...newTrigger, id: Date.now() }] });
      setNewTrigger({ condition: '', action: '' });
    }
  };
  const removeTrigger = (index) => setFormData({ ...formData, handoffTriggers: formData.handoffTriggers.filter((_, i) => i !== index) });

  const updateBusinessHours = (day, field, value) => {
    setFormData({
      ...formData,
      businessHours: { ...formData.businessHours, [day]: { ...formData.businessHours[day], [field]: value } }
    });
  };

  const steps = [
    { id: 'basic', label: 'Basic Info', icon: Bot, num: '01' },
    { id: 'personality', label: 'Personality', icon: MessageSquare, num: '02' },
    { id: 'knowledge', label: 'Knowledge', icon: Target, num: '03' },
    { id: 'workflow', label: 'Workflow', icon: Phone, num: '04' },
    { id: 'schedule', label: 'Schedule', icon: Clock, num: '05' },
  ];

  const agentTypes = [
    { value: 'inbound', label: 'Inbound Receptionist', desc: 'Answers incoming calls 24/7' },
    { value: 'outbound', label: 'Sales Caller', desc: 'Makes outbound sales calls' },
    { value: 'support', label: 'Customer Support', desc: 'Handles support inquiries' },
    { value: 'qualifier', label: 'Lead Qualifier', desc: 'Qualifies and scores leads' },
    { value: 'scheduler', label: 'Appointment Setter', desc: 'Books and manages appointments' },
    { value: 'after_hours', label: 'After-Hours Agent', desc: 'Covers calls outside business hours' },
  ];

  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .display-font { font-family: 'Syne', sans-serif; }
        .dash-card { background: #fff; border: 1px solid #E5E5E5; border-radius: 2px; }
        .section-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #888; }
        .field-label { font-size: 12px; font-weight: 500; color: #888; margin-bottom: 8px; display: block; }
        .dash-input {
          width: 100%; background: #fff; border: 1px solid #E5E5E5; border-radius: 4px;
          padding: 10px 14px; font-size: 14px; color: #0A0A0A; outline: none; font-family: inherit;
        }
        .dash-input:focus { border-color: #1A1AFF; }
        .dash-input::placeholder { color: #aaa; }
        .dash-select { width: 100%; background: #fff; border: 1px solid #E5E5E5; border-radius: 4px; padding: 10px 14px; font-size: 14px; color: #0A0A0A; outline: none; cursor: pointer; }
        .btn-primary { background: #0A0A0A; color: #fff; padding: 11px 22px; border-radius: 4px; font-weight: 600; font-size: 13px; border: 2px solid #0A0A0A; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: background 0.15s; }
        .btn-primary:hover { background: #1A1AFF; border-color: #1A1AFF; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-secondary { background: transparent; color: #0A0A0A; padding: 11px 22px; border-radius: 4px; font-weight: 600; font-size: 13px; border: 2px solid #0A0A0A; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: background 0.15s, color 0.15s; }
        .btn-secondary:hover { background: #0A0A0A; color: #fff; }
        .btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }
        .back-btn { background: none; border: none; cursor: pointer; padding: 8px; color: #888; transition: color 0.15s; }
        .back-btn:hover { color: #0A0A0A; }
        .type-card { padding: 16px; border-radius: 2px; border: 1px solid #E5E5E5; text-align: left; cursor: pointer; background: #fff; transition: border-color 0.15s; }
        .type-card:hover { border-color: #bbb; }
        .type-card.active { border-color: #1A1AFF; background: #EEF0FF; }
        .step-pill { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 4px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; background: none; transition: color 0.15s; }
        .item-row { display: flex; align-items: flex-start; gap: 12px; padding: 14px; background: #F7F7F7; border-radius: 2px; }
        .remove-btn { background: none; border: none; cursor: pointer; padding: 4px; color: #aaa; transition: color 0.15s; }
        .remove-btn:hover { color: #C0392B; }
        .add-panel { padding: 16px; background: #fff; border-radius: 2px; border: 1px dashed #E5E5E5; }
        .toggle-row { display: flex; align-items: center; gap: 14px; padding: 16px; background: #F7F7F7; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/agents')} className="back-btn">
            <ArrowLeft style={{ width: 20, height: 20 }} />
          </button>
          <div>
            <p className="section-label" style={{ marginBottom: 4 }}>{isEditing ? 'Edit' : 'New'} Agent</p>
            <h1 className="display-font" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: '#0A0A0A' }}>
              {isEditing ? 'Edit Agent' : 'Create New Agent'}
            </h1>
          </div>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="btn-primary">
          {isSaving ? <Loader2 style={{ width: 15, height: 15, animation: 'spin 0.8s linear infinite' }} /> : <Save style={{ width: 15, height: 15 }} />}
          {isEditing ? 'Save Changes' : 'Create Agent'}
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Steps */}
      <div className="dash-card" style={{ display: 'flex', alignItems: 'center', padding: '6px', marginBottom: 24, overflowX: 'auto' }}>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          const isDone = activeStep > idx;
          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => setActiveStep(idx)}
                className="step-pill"
                style={{ color: isActive ? '#1A1AFF' : isDone ? '#0A7D52' : '#999' }}
              >
                <span className="display-font" style={{ fontSize: 13, fontWeight: 800, opacity: isActive ? 1 : 0.5 }}>{step.num}</span>
                {isDone ? <CheckCircle style={{ width: 14, height: 14 }} /> : <Icon style={{ width: 14, height: 14 }} />}
                <span style={{ whiteSpace: 'nowrap' }}>{step.label}</span>
              </button>
              {idx < steps.length - 1 && <ChevronRight style={{ width: 14, height: 14, color: '#ddd', flexShrink: 0 }} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="dash-card" style={{ padding: 32 }}>
        {/* Step 1: Basic Info */}
        {activeStep === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: '#0A0A0A' }}>Agent Information</h2>

            <div>
              <label className="field-label">Agent Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="dash-input"
                placeholder="e.g., Receptionist Sarah"
              />
            </div>

            <div>
              <label className="field-label" style={{ marginBottom: 12 }}>Agent Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {agentTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`type-card ${formData.type === type.value ? 'active' : ''}`}
                  >
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A' }}>{type.label}</p>
                    <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label className="field-label">Language</label>
                <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="dash-select">
                  {languages.map((lang) => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Max Call Duration (seconds)</label>
                <input
                  type="number"
                  value={formData.maxCallDuration}
                  onChange={(e) => setFormData({ ...formData, maxCallDuration: parseInt(e.target.value) })}
                  className="dash-input"
                  min={60}
                  max={3600}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Personality */}
        {activeStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: '#0A0A0A' }}>Agent Personality</h2>

            <div>
              <label className="field-label">Greeting Message</label>
              <textarea
                value={formData.greeting}
                onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                className="dash-input"
                style={{ minHeight: 100, resize: 'vertical' }}
                placeholder="Hello, thank you for calling. How can I help you today?"
              />
              <p style={{ fontSize: 12, color: '#999', marginTop: 6 }}>This is what callers will hear when they connect</p>
            </div>

            <div>
              <label className="field-label">Farewell Message</label>
              <textarea
                value={formData.farewell}
                onChange={(e) => setFormData({ ...formData, farewell: e.target.value })}
                className="dash-input"
                style={{ minHeight: 100, resize: 'vertical' }}
                placeholder="Thank you for calling. Have a great day!"
              />
            </div>

            <div>
              <label className="field-label">Voice Cloning</label>
              <div className="add-panel">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, background: '#EEF0FF', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mic style={{ width: 20, height: 20, color: '#1A1AFF' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A' }}>Upload Voice Sample</p>
                    <p style={{ fontSize: 12, color: '#999' }}>MP3 or WAV, max 10MB, 30 seconds</p>
                  </div>
                  <button className="btn-secondary" style={{ marginLeft: 'auto', padding: '8px 16px', fontSize: 12 }}>Upload</button>
                </div>
              </div>
            </div>

            <div>
              <label className="field-label">Sentiment Threshold</label>
              <input
                type="range" min="0" max="1" step="0.1"
                value={formData.sentimentThreshold}
                onChange={(e) => setFormData({ ...formData, sentimentThreshold: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: '#1A1AFF' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#999', marginTop: 6 }}>
                <span>Lenient (0.0)</span>
                <span>Current: {formData.sentimentThreshold}</span>
                <span>Strict (1.0)</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Knowledge */}
        {activeStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: '#0A0A0A' }}>Knowledge Base</h2>

            <div>
              <label className="field-label">Business Information</label>
              <textarea
                value={formData.knowledgeBase.businessInfo || ''}
                onChange={(e) => setFormData({ ...formData, knowledgeBase: { ...formData.knowledgeBase, businessInfo: e.target.value } })}
                className="dash-input"
                style={{ minHeight: 120, resize: 'vertical' }}
                placeholder="Describe your business, services, and what callers typically need help with..."
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <label className="field-label" style={{ marginBottom: 0 }}>Frequently Asked Questions</label>
                <span style={{ fontSize: 12, color: '#999' }}>{formData.faqs.length} added</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {formData.faqs.map((faq, idx) => (
                  <div key={faq.id || idx} className="item-row">
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Q: {faq.question}</p>
                      <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>A: {faq.answer}</p>
                    </div>
                    <button onClick={() => removeFaq(idx)} className="remove-btn"><Trash2 style={{ width: 15, height: 15 }} /></button>
                  </div>
                ))}
              </div>

              <div className="add-panel" style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input type="text" value={newFaq.question} onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })} className="dash-input" placeholder="Question" />
                  <textarea value={newFaq.answer} onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })} className="dash-input" style={{ minHeight: 80, resize: 'vertical' }} placeholder="Answer" />
                  <button onClick={addFaq} className="btn-secondary" style={{ alignSelf: 'flex-start', fontSize: 12, padding: '8px 16px' }}>
                    <Plus style={{ width: 14, height: 14 }} /> Add FAQ
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <label className="field-label" style={{ marginBottom: 0 }}>Custom Scripts</label>
                <span style={{ fontSize: 12, color: '#999' }}>{formData.customScripts.length} added</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {formData.customScripts.map((script, idx) => (
                  <div key={script.id || idx} className="item-row" style={{ alignItems: 'center' }}>
                    <MessageSquare style={{ width: 15, height: 15, color: '#999', flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: '#333', flex: 1 }}>{script.text}</p>
                    <button onClick={() => removeScript(idx)} className="remove-btn"><Trash2 style={{ width: 15, height: 15 }} /></button>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
                <input type="text" value={newScript} onChange={(e) => setNewScript(e.target.value)} className="dash-input" placeholder="Add a custom script or phrase..." />
                <button onClick={addScript} className="btn-secondary" style={{ fontSize: 12, padding: '0 18px' }}>
                  <Plus style={{ width: 14, height: 14 }} /> Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Workflow */}
        {activeStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: '#0A0A0A' }}>Workflow & Automation</h2>

            <div className="add-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Target style={{ width: 17, height: 17, color: '#1A1AFF' }} />
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A' }}>Lead Qualification</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label className="field-label" style={{ fontSize: 11 }}>Budget Question</label>
                  <input
                    type="text"
                    value={formData.qualificationRules.budget?.question || ''}
                    onChange={(e) => setFormData({ ...formData, qualificationRules: { ...formData.qualificationRules, budget: { ...formData.qualificationRules.budget, question: e.target.value } } })}
                    className="dash-input"
                    placeholder="What is your budget range?"
                  />
                </div>
                <div>
                  <label className="field-label" style={{ fontSize: 11 }}>Timeline Question</label>
                  <input
                    type="text"
                    value={formData.qualificationRules.timeline?.question || ''}
                    onChange={(e) => setFormData({ ...formData, qualificationRules: { ...formData.qualificationRules, timeline: { ...formData.qualificationRules.timeline, question: e.target.value } } })}
                    className="dash-input"
                    placeholder="When do you need this?"
                  />
                </div>
                <div>
                  <label className="field-label" style={{ fontSize: 11 }}>Decision Maker Question</label>
                  <input
                    type="text"
                    value={formData.qualificationRules.decisionMaker?.question || ''}
                    onChange={(e) => setFormData({ ...formData, qualificationRules: { ...formData.qualificationRules, decisionMaker: { ...formData.qualificationRules.decisionMaker, question: e.target.value } } })}
                    className="dash-input"
                    placeholder="Are you the decision maker?"
                  />
                </div>
              </div>
            </div>

            <div className="add-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Calendar style={{ width: 17, height: 17, color: '#0A7D52' }} />
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A' }}>Appointment Settings</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label className="field-label" style={{ fontSize: 11 }}>Default Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.appointmentSettings.defaultDuration || 30}
                    onChange={(e) => setFormData({ ...formData, appointmentSettings: { ...formData.appointmentSettings, defaultDuration: parseInt(e.target.value) } })}
                    className="dash-input"
                  />
                </div>
                <div>
                  <label className="field-label" style={{ fontSize: 11 }}>Buffer Time (minutes)</label>
                  <input
                    type="number"
                    value={formData.appointmentSettings.bufferTime || 15}
                    onChange={(e) => setFormData({ ...formData, appointmentSettings: { ...formData.appointmentSettings, bufferTime: parseInt(e.target.value) } })}
                    className="dash-input"
                  />
                </div>
              </div>
            </div>

            <div className="add-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <AlertTriangle style={{ width: 17, height: 17, color: '#C0392B' }} />
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A' }}>Human Handoff Triggers</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {formData.handoffTriggers.map((trigger, idx) => (
                  <div key={trigger.id || idx} className="item-row" style={{ background: '#fff', border: '1px solid #F0F0F0', alignItems: 'center' }}>
                    <AlertTriangle style={{ width: 15, height: 15, color: '#C0392B', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, color: '#333' }}>If: {trigger.condition}</p>
                      <p style={{ fontSize: 12, color: '#999' }}>Then: {trigger.action}</p>
                    </div>
                    <button onClick={() => removeTrigger(idx)} className="remove-btn"><Trash2 style={{ width: 15, height: 15 }} /></button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input type="text" value={newTrigger.condition} onChange={(e) => setNewTrigger({ ...newTrigger, condition: e.target.value })} className="dash-input" placeholder="Condition (e.g., caller asks for manager)" />
                <input type="text" value={newTrigger.action} onChange={(e) => setNewTrigger({ ...newTrigger, action: e.target.value })} className="dash-input" placeholder="Action (e.g., transfer to human agent)" />
                <button onClick={addTrigger} className="btn-secondary" style={{ alignSelf: 'flex-start', fontSize: 12, padding: '8px 16px' }}>
                  <Plus style={{ width: 14, height: 14 }} /> Add Trigger
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Schedule */}
        {activeStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: '#0A0A0A' }}>Business Hours & Schedule</h2>

            <div className="toggle-row">
              <input
                type="checkbox"
                checked={formData.afterHoursEnabled}
                onChange={(e) => setFormData({ ...formData, afterHoursEnabled: e.target.checked })}
                style={{ width: 18, height: 18, accentColor: '#1A1AFF' }}
              />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A' }}>Enable After-Hours Coverage</p>
                <p style={{ fontSize: 12, color: '#999' }}>AI agent will handle calls outside business hours</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(formData.businessHours).map(([day, hours]) => (
                <div key={day} className="toggle-row" style={{ flexWrap: 'wrap' }}>
                  <input
                    type="checkbox"
                    checked={hours.enabled}
                    onChange={(e) => updateBusinessHours(day, 'enabled', e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#1A1AFF' }}
                  />
                  <span style={{ width: 90, fontSize: 13, fontWeight: 600, color: '#0A0A0A', textTransform: 'capitalize' }}>{day}</span>
                  <input
                    type="time"
                    value={hours.start}
                    onChange={(e) => updateBusinessHours(day, 'start', e.target.value)}
                    disabled={!hours.enabled}
                    className="dash-input"
                    style={{ width: 130, opacity: hours.enabled ? 1 : 0.4 }}
                  />
                  <span style={{ color: '#999', fontSize: 13 }}>to</span>
                  <input
                    type="time"
                    value={hours.end}
                    onChange={(e) => updateBusinessHours(day, 'end', e.target.value)}
                    disabled={!hours.enabled}
                    className="dash-input"
                    style={{ width: 130, opacity: hours.enabled ? 1 : 0.4 }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
        <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0} className="btn-secondary">
          Previous
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          {activeStep < steps.length - 1 ? (
            <button onClick={() => setActiveStep(activeStep + 1)} className="btn-primary">
              Next Step <ChevronRight style={{ width: 15, height: 15 }} />
            </button>
          ) : (
            <button onClick={handleSave} disabled={isSaving} className="btn-primary">
              {isSaving ? <Loader2 style={{ width: 15, height: 15, animation: 'spin 0.8s linear infinite' }} /> : <Save style={{ width: 15, height: 15 }} />}
              {isEditing ? 'Save Changes' : 'Create Agent'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentBuilder;