import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Phone, 
  Bot, 
  Clock, 
  Shield, 
  Zap, 
  TrendingUp, 
  Users, 
  CalendarCheck,
  MessageSquare,
  Headphones,
  ArrowRight,
  CheckCircle2,
  Star,
  Menu,
  X,
  Play,
  ChevronDown,
  BarChart3,
  Globe,
  Lock,
  Sparkles,
  Target
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ];

  const features = [
    {
      icon: Phone,
      title: '24/7 Call Answering',
      description: 'Never miss a call again. Our AI agents answer every incoming call instantly, day or night, weekends and holidays included.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Bot,
      title: 'AI-Powered Conversations',
      description: 'Natural, human-like dialogue powered by GPT-4. Callers won\'t realize they\'re speaking with AI until you tell them.',
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: CalendarCheck,
      title: 'Smart Scheduling',
      description: 'Automatically book appointments, send confirmations, and handle rescheduling without human intervention.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Target,
      title: 'Lead Qualification',
      description: 'AI scores every lead in real-time based on your custom criteria. Only hot prospects reach your sales team.',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Reputation Protection',
      description: 'Eliminate "couldn\'t reach anyone" reviews. Every caller gets a prompt, professional response.',
      color: 'from-rose-500 to-pink-500'
    },
    {
      icon: Headphones,
      title: 'Human Handoff',
      description: 'Seamlessly transfer complex calls to your team with full context, transcripts, and caller history.',
      color: 'from-indigo-500 to-blue-500'
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Tell Us Your Business',
      description: 'One 30-minute onboarding call. We learn your services, tone, FAQs, and workflows. No technical skills required.',
      duration: '~30 min'
    },
    {
      number: '02',
      title: 'We Build Your Agent',
      description: 'Custom-trained on your business knowledge. You review and approve the agent before it goes live.',
      duration: '24-48 hours'
    },
    {
      number: '03',
      title: 'Agent Goes Live',
      description: 'Handles inbound calls, qualifies leads, books appointments, and sends you summaries — all automatically.',
      duration: 'Day 2'
    },
    {
      number: '04',
      title: 'Scale & Optimize',
      description: 'Monitor performance in real-time, refine scripts, and watch your availability transform your reputation.',
      duration: 'Ongoing'
    },
  ];

  const agentTypes = [
    {
      title: 'AI Receptionist',
      type: 'INBOUND',
      description: 'Answers every inbound call instantly — even at 2am. Greets callers professionally, handles FAQs, and books appointments.',
      features: ['Instant call answering', 'Appointment scheduling', 'After-hours coverage', 'Professional tone'],
      icon: Phone
    },
    {
      title: 'Sales Caller',
      type: 'OUTBOUND',
      description: 'Dials your lead list around the clock. Handles objections naturally, qualifies prospects, and books meetings.',
      features: ['Cold & warm outreach', 'Objection handling', 'Auto calendar booking', 'Lead scoring'],
      icon: TrendingUp
    },
    {
      title: 'Support Agent',
      type: 'SUPPORT',
      description: 'Handles tier-1 support calls — FAQs, order status, troubleshooting — so your team focuses on complex issues.',
      features: ['FAQ automation', 'Order lookups', 'Troubleshooting', 'Escalation rules'],
      icon: MessageSquare
    },
    {
      title: 'Lead Qualifier',
      type: 'QUALIFICATION',
      description: 'Calls every inbound lead within seconds, asks the right questions, scores them, and passes only serious prospects.',
      features: ['Instant lead response', 'Custom scoring', 'Smart filtering', 'CRM sync'],
      icon: Users
    },
    {
      title: 'Appointment Setter',
      type: 'SCHEDULING',
      description: 'Re-engages cold leads, confirms bookings, sends reminders, and reschedules cancellations — fully automated.',
      features: ['Re-engagement calls', 'Confirmation calls', 'Reminder calls', 'Rescheduling'],
      icon: CalendarCheck
    },
    {
      title: 'After-Hours Agent',
      type: 'COVERAGE',
      description: 'Captures every lead after close. Answers every question. Makes sure no call is ever lost to voicemail again.',
      features: ['24/7 availability', 'Lead capture', 'Emergency routing', 'Global timezone support'],
      icon: Clock
    },
  ];

  const testimonials = [
    {
      quote: "I gave them a hundred of my leads, and within 15 minutes the AI voice had booked 5 appointments into my calendar automatically.",
      author: "Marcus Chen",
      role: "CEO, TechStart Inc",
      rating: 5
    },
    {
      quote: "Handles all of my calls during lunch hours, even after hours, and schedules appointments. I'm running a one-man clinic and it just works.",
      author: "Dr. Sarah Williams",
      role: "Private Practice",
      rating: 5
    },
    {
      quote: "Really good agent, asks my leads if they want to buy gold and even remembers them if they call back. The context memory is incredible.",
      author: "James Rodriguez",
      role: "Gold Broker, Precious Metals Co",
      rating: 5
    },
    {
      quote: "We went from missing 40% of after-hours calls to capturing 100%. Our conversion rate jumped 3x in the first month.",
      author: "Lisa Park",
      role: "Marketing Director, EvolveNET",
      rating: 5
    },
  ];

  const faqs = [
    {
      question: "How natural does the AI voice sound?",
      answer: "Our agents use ElevenLabs voice technology — the most natural-sounding AI available. We also offer voice cloning so the agent sounds like you or a branded persona. Most callers don't realize they're talking to AI until they're told."
    },
    {
      question: "What happens if the AI can't answer a question?",
      answer: "The agent is trained on your specific knowledge base and FAQs. For edge cases, it gracefully offers to take a message or transfer to a human. It never makes things up — and you'll see every interaction in the call transcript."
    },
    {
      question: "How long does it take to go live?",
      answer: "We've deployed in as little as 24 hours for simpler use cases. The standard is 48 hours from your onboarding call. We handle the entire build — you just review and approve. No tech skills needed."
    },
    {
      question: "How much does it cost?",
      answer: "Starting from $0.09/minute. If your agent handles 200 minutes of calls per day, that's $18/day — versus $150+ for a human doing the same work. We scope the exact cost on a 10-minute call once we know your volume and use case."
    },
    {
      question: "Does it integrate with my existing tools?",
      answer: "Yes. We integrate with Cal.com, Google Calendar, Outlook, HubSpot, GoHighLevel, Salesforce, and most major CRMs via API or Zapier. If you use something niche, we'll check on your call."
    },
    {
      question: "Is there a long-term contract?",
      answer: "No long-term contracts. You pay per minute, and you can pause or stop anytime. We're confident enough in our results that we don't need to lock you in."
    },
  ];

  const stats = [
    { value: '40+', label: 'Businesses Trust Us' },
    { value: '50K+', label: 'Calls Handled' },
    { value: '98%', label: 'Answer Rate' },
    { value: '4.9★', label: 'Average Rating' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">VoiceAI</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-blue-600/20">
                Get Started
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-slate-800 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-400 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
                <Link to="/login" className="text-center text-slate-400">Sign In</Link>
                <Link to="/register" className="text-center px-5 py-2.5 bg-blue-600 text-white rounded-xl">Get Started</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">Trusted by 40+ businesses — never miss a call again</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Your reputation took{' '}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">years to build.</span>
              <br />
              One missed call can cost it.
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Every unanswered call is a lost customer — and a potential 1-star review. 
              Our AI phone agent answers every call, 24/7, and has you live in 48 hours.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/register"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-500/30 flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-all border border-slate-700 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Live in 48 hours
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Every call answered, 24/7
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Pay per minute — no retainers
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                No long-term contracts
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-slate-800/50 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              The problem hiding in your reviews
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Missed calls don't just lose sales. They damage the reputation you've built.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { value: '62%', label: 'Callers don\'t leave a voicemail', desc: 'Most people who reach voicemail hang up and call the next option. They\'re gone before you even know they called.' },
              { value: '4.3h', label: 'Average follow-up delay', desc: 'Leads contacted within 5 minutes convert 9x more often. Most businesses respond hours later — if at all.' },
              { value: '1★', label: 'The review you can\'t afford', desc: '"Great business but impossible to reach." Those six words quietly undermine every 5-star review you\'ve earned.' },
            ].map((stat) => (
              <div key={stat.label} className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <p className="text-4xl font-bold text-rose-400 mb-3">{stat.value}</p>
                <h3 className="text-lg font-semibold text-white mb-2">{stat.label}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{stat.desc}</p>
              </div>
            ))}
          </div>

          {/* Before/After */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-2xl">
              <h3 className="text-lg font-semibold text-rose-400 mb-6 flex items-center gap-2">
                <X className="w-5 h-5" />
                Without VoiceAI
              </h3>
              <ul className="space-y-4">
                {[
                  'Call comes in — goes to voicemail or rings out',
                  'Caller moves on to a competitor within 60 seconds',
                  'Some leave a frustrated 1- or 2-star review',
                  'After-hours and weekend calls are always lost',
                  'Your reputation suffers — despite great work',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400">
                    <X className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 bg-blue-900/10 border border-blue-500/20 rounded-2xl">
              <h3 className="text-lg font-semibold text-emerald-400 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                With VoiceAI
              </h3>
              <ul className="space-y-4">
                {[
                  'Every call answered in seconds — 24/7, including weekends',
                  'Caller gets real answers, qualifies, and books on the spot',
                  '"Couldn\'t reach anyone" reviews stop entirely',
                  'After-hours enquiries captured and booked automatically',
                  'Your 5-star rating reflects your actual business',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Built to protect what you've earned
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              A great reputation needs great availability to back it up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="group p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-slate-600 transition-all duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Live in 48 hours. No code required.
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              We handle the entire build. You just review and approve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative">
                <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl h-full">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-bold text-slate-700">{step.number}</span>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full">
                      {step.duration}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-slate-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Types */}
      <section className="py-20 lg:py-32 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              One platform. Every voice role.
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Whether you need an inbound receptionist or full after-hours coverage — we build it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentTypes.map((agent) => {
              const Icon = agent.icon;
              return (
                <div key={agent.title} className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-blue-500/30 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">{agent.type}</span>
                      <h3 className="text-lg font-semibold text-white">{agent.title}</h3>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">{agent.description}</p>
                  <ul className="space-y-2">
                    {agent.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              What happens when you never miss a call again
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-lg text-slate-300 mb-6 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{t.author[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.author}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-32 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Pay only for what you use
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              No monthly retainers. No seat fees. No setup charge.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Human Comparison */}
            <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h3 className="text-lg font-semibold text-slate-300 mb-2">Hiring a human rep</h3>
              <p className="text-4xl font-bold text-white mb-6">$50–80k<span className="text-lg text-slate-500">/yr</span></p>
              <ul className="space-y-3 mb-8">
                {[
                  '8 hours/day only',
                  'Takes sick days',
                  'Needs training & management',
                  'Quits after 18 months',
                  'Can\'t scale overnight',
                  'Still misses calls at peak times',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                    <X className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Pricing */}
            <div className="p-8 bg-blue-900/10 border border-blue-500/20 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1 bg-blue-500 text-white text-xs font-medium rounded-bl-xl">
                Recommended
              </div>
              <h3 className="text-lg font-semibold text-blue-300 mb-2">VoiceAI Agent</h3>
              <p className="text-4xl font-bold text-white mb-1">from $0.09<span className="text-lg text-slate-500">/min</span></p>
              <p className="text-sm text-slate-400 mb-6">Pay per minute of call time only</p>
              <ul className="space-y-3 mb-8">
                {[
                  '24/7/365 operation',
                  'Never calls in sick',
                  'Live in 48 hours',
                  'Scales to 1000 calls/day instantly',
                  'Consistent, trained performance',
                  'Full transcripts & recordings',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="block w-full text-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all"
              >
                Get My Custom Quote
              </Link>
              <p className="text-xs text-slate-500 text-center mt-3">
                Exact pricing depends on volume. Takes 10 minutes to scope.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 lg:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Common questions
            </h2>
            <p className="text-xl text-slate-400">
              Everything you need to know before getting started.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-900/50 transition-colors"
                >
                  <span className="font-medium text-slate-200">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            You've earned a great reputation.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Don't let missed calls quietly undo it.
            </span>
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Every unanswered call is a customer who went elsewhere — and possibly a review that works against you. 
            VoiceAI makes sure that never happens again.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2"
            >
              Protect My Reputation — Free Strategy Call
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-6">
            No commitment · Live in 48 hours · Pay per minute
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">VoiceAI</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                AI phone agents that answer every call, qualify leads, and book appointments — 24/7.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'Integrations', 'API Docs', 'Changelog'].map((item) => (
                  <li key={item}><a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                {['About', 'Blog', 'Careers', 'Contact', 'Partners'].map((item) => (
                  <li key={item}><a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map((item) => (
                  <li key={item}><a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600">© 2026 VoiceAI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Globe className="w-4 h-4 text-slate-600" />
              <Lock className="w-4 h-4 text-slate-600" />
              <BarChart3 className="w-4 h-4 text-slate-600" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
