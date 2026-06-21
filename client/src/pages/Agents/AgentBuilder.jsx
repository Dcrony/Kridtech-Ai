
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Bot, 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Mic, 
  Clock, 
  MessageSquare, 
  Target,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ChevronRight,
  ChevronDown
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

  // FAQ state
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  
  // Script state
  const [newScript, setNewScript] = useState('');
  
  // Handoff trigger state
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
      setFormData({
        ...formData,
        faqs: [...formData.faqs, { ...newFaq, id: Date.now() }]
      });
      setNewFaq({ question: '', answer: '' });
    }
  };

  const removeFaq = (index) => {
    setFormData({
      ...formData,
      faqs: formData.faqs.filter((_, i) => i !== index)
    });
  };

  const addScript = () => {
    if (newScript.trim()) {
      setFormData({
        ...formData,
        customScripts: [...formData.customScripts, { text: newScript, id: Date.now() }]
      });
      setNewScript('');
    }
  };

  const removeScript = (index) => {
    setFormData({
      ...formData,
      customScripts: formData.customScripts.filter((_, i) => i !== index)
    });
  };

  const addTrigger = () => {
    if (newTrigger.condition.trim() && newTrigger.action.trim()) {
      setFormData({
        ...formData,
        handoffTriggers: [...formData.handoffTriggers, { ...newTrigger, id: Date.now() }]
      });
      setNewTrigger({ condition: '', action: '' });
    }
  };

  const removeTrigger = (index) => {
    setFormData({
      ...formData,
      handoffTriggers: formData.handoffTriggers.filter((_, i) => i !== index)
    });
  };

  const updateBusinessHours = (day, field, value) => {
    setFormData({
      ...formData,
      businessHours: {
        ...formData.businessHours,
        [day]: {
          ...formData.businessHours[day],
          [field]: value
        }
      }
    });
  };

  const steps = [
    { id: 'basic', label: 'Basic Info', icon: Bot },
    { id: 'personality', label: 'Personality', icon: MessageSquare },
    { id: 'knowledge', label: 'Knowledge', icon: Target },
    { id: 'workflow', label: 'Workflow', icon: Phone },
    { id: 'schedule', label: 'Schedule', icon: Clock },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/agents')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isEditing ? 'Edit Agent' : 'Create New Agent'}
            </h1>
            <p className="text-slate-400 text-sm">
              {isEditing ? 'Update your AI agent configuration' : 'Build a new AI phone agent'}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isEditing ? 'Save Changes' : 'Create Agent'}
        </button>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeStep === idx
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                  : activeStep > idx
                  ? 'text-emerald-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {activeStep > idx ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              {step.label}
              {idx < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-2 text-slate-600" />}
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="glass-panel p-6">
        {/* Step 1: Basic Info */}
        {activeStep === 0 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white">Agent Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Agent Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="e.g., Receptionist Sarah"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-3">Agent Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {agentTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      formData.type === type.value
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <p className="font-medium text-slate-200">{type.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="input-field"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Max Call Duration (seconds)</label>
                <input
                  type="number"
                  value={formData.maxCallDuration}
                  onChange={(e) => setFormData({ ...formData, maxCallDuration: parseInt(e.target.value) })}
                  className="input-field"
                  min={60}
                  max={3600}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Personality */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white">Agent Personality</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Greeting Message</label>
              <textarea
                value={formData.greeting}
                onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                className="input-field min-h-[100px]"
                placeholder="Hello, thank you for calling. How can I help you today?"
              />
              <p className="text-xs text-slate-500 mt-1">This is what callers will hear when they connect</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Farewell Message</label>
              <textarea
                value={formData.farewell}
                onChange={(e) => setFormData({ ...formData, farewell: e.target.value })}
                className="input-field min-h-[100px]"
                placeholder="Thank you for calling. Have a great day!"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Voice Cloning</label>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
                    <Mic className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">Upload Voice Sample</p>
                    <p className="text-xs text-slate-500">MP3 or WAV, max 10MB, 30 seconds</p>
                  </div>
                  <button className="ml-auto px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-all">
                    Upload
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Sentiment Threshold</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={formData.sentimentThreshold}
                onChange={(e) => setFormData({ ...formData, sentimentThreshold: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Lenient (0.0)</span>
                <span>Current: {formData.sentimentThreshold}</span>
                <span>Strict (1.0)</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Knowledge */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white">Knowledge Base</h2>
            
            {/* Business Info */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Business Information</label>
              <textarea
                value={formData.knowledgeBase.businessInfo || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  knowledgeBase: { ...formData.knowledgeBase, businessInfo: e.target.value }
                })}
                className="input-field min-h-[120px]"
                placeholder="Describe your business, services, and what callers typically need help with..."
              />
            </div>

            {/* FAQs */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-slate-400">Frequently Asked Questions</label>
                <span className="text-xs text-slate-500">{formData.faqs.length} added</span>
              </div>
              
              <div className="space-y-3">
                {formData.faqs.map((faq, idx) => (
                  <div key={faq.id || idx} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-300">Q: {faq.question}</p>
                        <p className="text-sm text-slate-400 mt-1">A: {faq.answer}</p>
                      </div>
                      <button
                        onClick={() => removeFaq(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    className="input-field"
                    placeholder="Question"
                  />
                  <textarea
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                    className="input-field min-h-[80px]"
                    placeholder="Answer"
                  />
                  <button
                    onClick={addFaq}
                    className="btn-secondary flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add FAQ
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Scripts */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-slate-400">Custom Scripts</label>
                <span className="text-xs text-slate-500">{formData.customScripts.length} added</span>
              </div>
              
              <div className="space-y-2">
                {formData.customScripts.map((script, idx) => (
                  <div key={script.id || idx} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                    <MessageSquare className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <p className="text-sm text-slate-300 flex-1">{script.text}</p>
                    <button
                      onClick={() => removeScript(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newScript}
                  onChange={(e) => setNewScript(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Add a custom script or phrase..."
                />
                <button
                  onClick={addScript}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Workflow */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white">Workflow & Automation</h2>
            
            {/* Qualification Rules */}
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-5 h-5 text-primary-400" />
                <h3 className="font-medium text-slate-200">Lead Qualification</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Budget Question</label>
                  <input
                    type="text"
                    value={formData.qualificationRules.budget?.question || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      qualificationRules: {
                        ...formData.qualificationRules,
                        budget: { ...formData.qualificationRules.budget, question: e.target.value }
                      }
                    })}
                    className="input-field"
                    placeholder="What is your budget range?"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Timeline Question</label>
                  <input
                    type="text"
                    value={formData.qualificationRules.timeline?.question || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      qualificationRules: {
                        ...formData.qualificationRules,
                        timeline: { ...formData.qualificationRules.timeline, question: e.target.value }
                      }
                    })}
                    className="input-field"
                    placeholder="When do you need this?"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Decision Maker Question</label>
                  <input
                    type="text"
                    value={formData.qualificationRules.decisionMaker?.question || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      qualificationRules: {
                        ...formData.qualificationRules,
                        decisionMaker: { ...formData.qualificationRules.decisionMaker, question: e.target.value }
                      }
                    })}
                    className="input-field"
                    placeholder="Are you the decision maker?"
                  />
                </div>
              </div>
            </div>

            {/* Appointment Settings */}
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <h3 className="font-medium text-slate-200">Appointment Settings</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Default Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.appointmentSettings.defaultDuration || 30}
                    onChange={(e) => setFormData({
                      ...formData,
                      appointmentSettings: { ...formData.appointmentSettings, defaultDuration: parseInt(e.target.value) }
                    })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Buffer Time (minutes)</label>
                  <input
                    type="number"
                    value={formData.appointmentSettings.bufferTime || 15}
                    onChange={(e) => setFormData({
                      ...formData,
                      appointmentSettings: { ...formData.appointmentSettings, bufferTime: parseInt(e.target.value) }
                    })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Handoff Triggers */}
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="font-medium text-slate-200">Human Handoff Triggers</h3>
              </div>
              
              <div className="space-y-2 mb-4">
                {formData.handoffTriggers.map((trigger, idx) => (
                  <div key={trigger.id || idx} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-300">If: {trigger.condition}</p>
                      <p className="text-xs text-slate-500">Then: {trigger.action}</p>
                    </div>
                    <button
                      onClick={() => removeTrigger(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={newTrigger.condition}
                  onChange={(e) => setNewTrigger({ ...newTrigger, condition: e.target.value })}
                  className="input-field"
                  placeholder="Condition (e.g., caller asks for manager)"
                />
                <input
                  type="text"
                  value={newTrigger.action}
                  onChange={(e) => setNewTrigger({ ...newTrigger, action: e.target.value })}
                  className="input-field"
                  placeholder="Action (e.g., transfer to human agent)"
                />
                <button
                  onClick={addTrigger}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Trigger
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Schedule */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white">Business Hours & Schedule</h2>
            
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl">
              <input
                type="checkbox"
                checked={formData.afterHoursEnabled}
                onChange={(e) => setFormData({ ...formData, afterHoursEnabled: e.target.checked })}
                className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-primary-500 focus:ring-primary-500"
              />
              <div>
                <p className="text-sm font-medium text-slate-200">Enable After-Hours Coverage</p>
                <p className="text-xs text-slate-500">AI agent will handle calls outside business hours</p>
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(formData.businessHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
                  <input
                    type="checkbox"
                    checked={hours.enabled}
                    onChange={(e) => updateBusinessHours(day, 'enabled', e.target.checked)}
                    className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-primary-500"
                  />
                  <span className="w-24 text-sm font-medium text-slate-200 capitalize">{day}</span>
                  <input
                    type="time"
                    value={hours.start}
                    onChange={(e) => updateBusinessHours(day, 'start', e.target.value)}
                    disabled={!hours.enabled}
                    className="input-field w-32 disabled:opacity-50"
                  />
                  <span className="text-slate-500">to</span>
                  <input
                    type="time"
                    value={hours.end}
                    onChange={(e) => updateBusinessHours(day, 'end', e.target.value)}
                    disabled={!hours.enabled}
                    className="input-field w-32 disabled:opacity-50"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          className="btn-secondary disabled:opacity-50"
        >
          Previous
        </button>
        <div className="flex gap-3">
          {activeStep < steps.length - 1 ? (
            <button
              onClick={() => setActiveStep(activeStep + 1)}
              className="btn-primary flex items-center gap-2"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEditing ? 'Save Changes' : 'Create Agent'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentBuilder;
