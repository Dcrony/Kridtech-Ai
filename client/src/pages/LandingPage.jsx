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
    },
    {
      icon: Bot,
      title: 'AI-Powered Conversations',
      description: 'Natural, human-like dialogue powered by GPT-4. Callers won\'t realize they\'re speaking with AI until you tell them.',
    },
    {
      icon: CalendarCheck,
      title: 'Smart Scheduling',
      description: 'Automatically book appointments, send confirmations, and handle rescheduling without human intervention.',
    },
    {
      icon: Target,
      title: 'Lead Qualification',
      description: 'AI scores every lead in real-time based on your custom criteria. Only hot prospects reach your sales team.',
    },
    {
      icon: Shield,
      title: 'Reputation Protection',
      description: 'Eliminate "couldn\'t reach anyone" reviews. Every caller gets a prompt, professional response.',
    },
    {
      icon: Headphones,
      title: 'Human Handoff',
      description: 'Seamlessly transfer complex calls to your team with full context, transcripts, and caller history.',
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
      duration: '24–48 hrs'
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
    { value: '40+', label: 'Businesses' },
    { value: '50K+', label: 'Calls Handled' },
    { value: '98%', label: 'Answer Rate' },
    { value: '4.9★', label: 'Avg Rating' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }} className="min-h-screen bg-white text-black overflow-x-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');

        .display-font { font-family: 'Syne', sans-serif; }

        .hero-headline {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -0.03em;
        }

        .hero-headline .outline-text {
          -webkit-text-stroke: 2px #0A0A0A;
          color: transparent;
        }

        .btn-primary {
          background: #0A0A0A;
          color: #fff;
          padding: 14px 28px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.01em;
          border: 2px solid #0A0A0A;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s, color 0.15s;
          text-decoration: none;
        }
        .btn-primary:hover {
          background: #1A1AFF;
          border-color: #1A1AFF;
        }

        .btn-secondary {
          background: transparent;
          color: #0A0A0A;
          padding: 14px 28px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 14px;
          border: 2px solid #0A0A0A;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s, color 0.15s;
          text-decoration: none;
        }
        .btn-secondary:hover {
          background: #0A0A0A;
          color: #fff;
        }

        .nav-link {
          font-size: 13px;
          font-weight: 500;
          color: #555;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.15s;
        }
        .nav-link:hover { color: #0A0A0A; }

        .stat-divider {
          border-top: 1px solid #E5E5E5;
          border-bottom: 1px solid #E5E5E5;
        }

        .section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #888;
        }

        .card-black {
          background: #0A0A0A;
          color: #fff;
          border-radius: 2px;
        }

        .card-outline {
          border: 1px solid #E5E5E5;
          border-radius: 2px;
          transition: border-color 0.2s;
        }
        .card-outline:hover { border-color: #0A0A0A; }

        .faq-item {
          border-bottom: 1px solid #E5E5E5;
        }

        .accent-dot {
          width: 6px;
          height: 6px;
          background: #1A1AFF;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }

        .tag {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: #F0F0F0;
          color: #555;
          padding: 3px 8px;
          border-radius: 2px;
        }

        .tag-blue {
          background: #1A1AFF;
          color: #fff;
        }

        .check-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 12px;
        }

        .hairline {
          height: 1px;
          background: #E5E5E5;
        }

        footer a {
          color: #888;
          text-decoration: none;
          font-size: 13px;
          transition: color 0.15s;
        }
        footer a:hover { color: #0A0A0A; }
      `}</style>

      {/* Navigation */}
      <nav style={{ borderBottom: '1px solid #E5E5E5', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, background: '#0A0A0A', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap style={{ width: 14, height: 14, color: '#fff' }} />
            </div>
            <span className="display-font" style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>VoiceAI</span>
          </div>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden-mobile">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="nav-link">{link.label}</a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="hidden-mobile">
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>Get Started</Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} className="show-mobile">
            {mobileMenuOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div style={{ background: '#fff', borderTop: '1px solid #E5E5E5', padding: '20px 24px' }}>
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} className="nav-link" style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid #F0F0F0' }}>{link.label}</a>
            ))}
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/login" style={{ textAlign: 'center', color: '#555', textDecoration: 'none', fontSize: 14 }}>Sign In</Link>
              <Link to="/register" className="btn-primary" style={{ justifyContent: 'center' }}>Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 140, paddingBottom: 100, maxWidth: 1200, margin: '0 auto', padding: '140px 24px 100px' }}>
        <div style={{ maxWidth: 820 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32, padding: '6px 12px', border: '1px solid #E5E5E5', borderRadius: 2 }}>
            <span className="accent-dot" />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#555' }}>Trusted by 40+ businesses — never miss a call again</span>
          </div>

          <h1 className="hero-headline" style={{ fontSize: 'clamp(52px, 8vw, 96px)', marginBottom: 32, color: '#0A0A0A' }}>
            Your reputation<br />
            took <span className="outline-text">years</span> to build.
          </h1>

          <p style={{ fontSize: 18, color: '#555', lineHeight: 1.7, maxWidth: 540, marginBottom: 40 }}>
            Every unanswered call is a lost customer — and a potential 1-star review. 
            Our AI phone agent answers every call, 24/7, and has you live in 48 hours.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 48 }}>
            <Link to="/register" className="btn-primary">
              Start Free Trial <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
            <button className="btn-secondary">
              <Play style={{ width: 16, height: 16 }} /> Watch Demo
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {['Live in 48 hours', 'Every call answered, 24/7', 'Pay per minute — no retainers', 'No long-term contracts'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="accent-dot" />
                <span style={{ fontSize: 13, color: '#555' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stat-divider">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {stats.map((stat, i) => (
            <div key={stat.label} style={{ textAlign: 'center', padding: '24px 16px', borderLeft: i > 0 ? '1px solid #E5E5E5' : 'none' }}>
              <p className="display-font" style={{ fontSize: 36, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.03em', marginBottom: 4 }}>{stat.value}</p>
              <p style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem Section */}
      <section style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <p className="section-label" style={{ marginBottom: 16 }}>The Problem</p>
          <h2 className="display-font" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0A0A0A', maxWidth: 560, lineHeight: 1.05, marginBottom: 16 }}>
            The problem hiding in your reviews
          </h2>
          <p style={{ fontSize: 16, color: '#555', maxWidth: 480 }}>
            Missed calls don't just lose sales. They damage the reputation you've built.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#E5E5E5', marginBottom: 56 }}>
          {[
            { value: '62%', label: "Callers don't leave a voicemail", desc: "Most people who reach voicemail hang up and call the next option. They're gone before you even know they called." },
            { value: '4.3h', label: 'Average follow-up delay', desc: 'Leads contacted within 5 minutes convert 9× more often. Most businesses respond hours later — if at all.' },
            { value: '1★', label: "The review you can't afford", desc: '"Great business but impossible to reach." Those six words quietly undermine every 5-star review you\'ve earned.' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#fff', padding: '40px 32px' }}>
              <p className="display-font" style={{ fontSize: 48, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.04em', marginBottom: 8 }}>{stat.value}</p>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', marginBottom: 10 }}>{stat.label}</h3>
              <p style={{ fontSize: 13, color: '#777', lineHeight: 1.6 }}>{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Before / After */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#E5E5E5' }}>
          <div style={{ background: '#F7F7F7', padding: '40px 36px' }}>
            <p className="section-label" style={{ color: '#C0392B', marginBottom: 20 }}>Without VoiceAI</p>
            {[
              'Call comes in — goes to voicemail or rings out',
              'Caller moves on to a competitor within 60 seconds',
              'Some leave a frustrated 1- or 2-star review',
              'After-hours and weekend calls are always lost',
              'Your reputation suffers — despite great work',
            ].map((item, i) => (
              <div key={i} className="check-row">
                <X style={{ width: 14, height: 14, color: '#C0392B', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: '#555' }}>{item}</span>
              </div>
            ))}
          </div>
          <div className="card-black" style={{ padding: '40px 36px' }}>
            <p className="section-label" style={{ color: '#6EE7B7', marginBottom: 20 }}>With VoiceAI</p>
            {[
              'Every call answered in seconds — 24/7, including weekends',
              'Caller gets real answers, qualifies, and books on the spot',
              '"Couldn\'t reach anyone" reviews stop entirely',
              'After-hours enquiries captured and booked automatically',
              'Your 5-star rating reflects your actual business',
            ].map((item, i) => (
              <div key={i} className="check-row">
                <span className="accent-dot" style={{ background: '#6EE7B7', marginTop: 5 }} />
                <span style={{ fontSize: 14, color: '#ccc' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ background: '#F7F7F7', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <p className="section-label" style={{ marginBottom: 16 }}>Features</p>
            <h2 className="display-font" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0A0A0A', maxWidth: 480, lineHeight: 1.05 }}>
              Built to protect what you've earned
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#E5E5E5' }}>
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card-outline" style={{ background: '#fff', padding: '36px 32px', border: 'none', borderBottom: '1px solid #E5E5E5' }}>
                  <div style={{ width: 36, height: 36, background: '#0A0A0A', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <Icon style={{ width: 16, height: 16, color: '#fff' }} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0A0A0A', marginBottom: 10 }}>{feature.title}</h3>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65 }}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <p className="section-label" style={{ marginBottom: 16 }}>Process</p>
            <h2 className="display-font" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0A0A0A', maxWidth: 540, lineHeight: 1.05 }}>
              Live in 48 hours. No code required.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: '#E5E5E5' }}>
            {steps.map((step) => (
              <div key={step.number} style={{ background: '#fff', padding: '36px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <span className="display-font" style={{ fontSize: 48, fontWeight: 800, color: '#E5E5E5', letterSpacing: '-0.04em' }}>{step.number}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#1A1AFF', background: 'rgba(26,26,255,0.08)', padding: '3px 8px', borderRadius: 2 }}>{step.duration}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0A0A0A', marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Types */}
      <section style={{ background: '#0A0A0A', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <p className="section-label" style={{ color: '#555', marginBottom: 16 }}>Agents</p>
            <h2 className="display-font" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', maxWidth: 520, lineHeight: 1.05 }}>
              One platform. Every voice role.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#222' }}>
            {agentTypes.map((agent) => {
              const Icon = agent.icon;
              return (
                <div key={agent.title} style={{ background: '#0A0A0A', padding: '36px 32px', transition: 'background 0.15s', cursor: 'default' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#111'}
                  onMouseLeave={e => e.currentTarget.style.background = '#0A0A0A'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <span className="tag" style={{ background: '#1A1AFF', color: '#fff' }}>{agent.type}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <Icon style={{ width: 18, height: 18, color: '#fff' }} />
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{agent.title}</h3>
                  </div>
                  <p style={{ fontSize: 13, color: '#777', lineHeight: 1.65, marginBottom: 20 }}>{agent.description}</p>
                  <div className="hairline" style={{ background: '#222', marginBottom: 20 }} />
                  {agent.features.map((feature) => (
                    <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span className="accent-dot" style={{ background: '#1A1AFF' }} />
                      <span style={{ fontSize: 12, color: '#aaa' }}>{feature}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <p className="section-label" style={{ marginBottom: 16 }}>Testimonials</p>
            <h2 className="display-font" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0A0A0A', maxWidth: 560, lineHeight: 1.05 }}>
              What happens when you never miss a call
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#E5E5E5' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F7F7F7', padding: '40px 36px' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} style={{ width: 14, height: 14, color: '#0A0A0A', fill: '#0A0A0A' }} />
                  ))}
                </div>
                <p style={{ fontSize: 15, color: '#0A0A0A', lineHeight: 1.7, marginBottom: 28 }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, background: '#0A0A0A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{t.author[0]}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A' }}>{t.author}</p>
                    <p style={{ fontSize: 11, color: '#888' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ background: '#F7F7F7', padding: '100px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <p className="section-label" style={{ marginBottom: 16 }}>Pricing</p>
            <h2 className="display-font" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0A0A0A', maxWidth: 480, lineHeight: 1.05 }}>
              Pay only for what you use
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#E5E5E5' }}>
            {/* Human */}
            <div style={{ background: '#fff', padding: '44px 36px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888', marginBottom: 12 }}>Hiring a human rep</p>
              <p className="display-font" style={{ fontSize: 44, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.04em', marginBottom: 32 }}>
                $50–80k<span style={{ fontSize: 16, color: '#888', fontWeight: 400 }}>/yr</span>
              </p>
              {['8 hours/day only', 'Takes sick days', 'Needs training & management', 'Quits after 18 months', "Can't scale overnight", 'Still misses calls at peak times'].map((item, i) => (
                <div key={i} className="check-row">
                  <X style={{ width: 13, height: 13, color: '#C0392B', marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#666' }}>{item}</span>
                </div>
              ))}
            </div>

            {/* AI */}
            <div className="card-black" style={{ padding: '44px 36px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, background: '#1A1AFF', color: '#fff', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 12px' }}>
                Recommended
              </div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>VoiceAI Agent</p>
              <p className="display-font" style={{ fontSize: 44, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', marginBottom: 4 }}>
                from $0.09<span style={{ fontSize: 16, color: '#555', fontWeight: 400 }}>/min</span>
              </p>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 32 }}>Pay per minute of call time only</p>
              {['24/7/365 operation', 'Never calls in sick', 'Live in 48 hours', 'Scales to 1,000 calls/day instantly', 'Consistent, trained performance', 'Full transcripts & recordings'].map((item, i) => (
                <div key={i} className="check-row">
                  <span className="accent-dot" style={{ background: '#6EE7B7', marginTop: 5 }} />
                  <span style={{ fontSize: 13, color: '#ccc' }}>{item}</span>
                </div>
              ))}
              <div style={{ marginTop: 32 }}>
                <Link to="/register" className="btn-primary" style={{ background: '#fff', color: '#0A0A0A', border: '2px solid #fff', width: '100%', justifyContent: 'center' }}>
                  Get My Custom Quote
                </Link>
                <p style={{ fontSize: 11, color: '#555', textAlign: 'center', marginTop: 12 }}>Exact pricing depends on volume. Takes 10 minutes to scope.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <p className="section-label" style={{ marginBottom: 16 }}>FAQ</p>
            <h2 className="display-font" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0A0A0A', lineHeight: 1.05 }}>
              Common questions
            </h2>
          </div>

          <div>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A', paddingRight: 24 }}>{faq.question}</span>
                  <ChevronDown style={{ width: 16, height: 16, color: '#888', flexShrink: 0, transform: activeFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {activeFaq === i && (
                  <div style={{ paddingBottom: 24 }}>
                    <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0A0A0A', padding: '100px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p className="section-label" style={{ color: '#444', marginBottom: 24 }}>Get Started</p>
          <h2 className="display-font" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.0, marginBottom: 24 }}>
            You've earned a great reputation.<br />
            <span style={{ WebkitTextStroke: '2px #fff', color: 'transparent' }}>Don't let missed calls undo it.</span>
          </h2>
          <p style={{ fontSize: 16, color: '#666', maxWidth: 520, lineHeight: 1.7, marginBottom: 40 }}>
            Every unanswered call is a customer who went elsewhere — and possibly a review that works against you. VoiceAI makes sure that never happens again.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/register" className="btn-primary" style={{ background: '#fff', color: '#0A0A0A', border: '2px solid #fff' }}>
              Protect My Reputation — Free Strategy Call <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
          </div>
          <p style={{ fontSize: 12, color: '#444', marginTop: 20 }}>No commitment · Live in 48 hours · Pay per minute</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E5E5E5', padding: '60px 24px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 26, height: 26, background: '#0A0A0A', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap style={{ width: 12, height: 12, color: '#fff' }} />
                </div>
                <span className="display-font" style={{ fontSize: 15, fontWeight: 700, color: '#0A0A0A' }}>VoiceAI</span>
              </div>
              <p style={{ fontSize: 13, color: '#888', lineHeight: 1.65, maxWidth: 240 }}>
                AI phone agents that answer every call, qualify leads, and book appointments — 24/7.
              </p>
            </div>
            {[
              { heading: 'Product', links: ['Features', 'Pricing', 'Integrations', 'API Docs', 'Changelog'] },
              { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Contact', 'Partners'] },
              { heading: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'] },
            ].map((col) => (
              <div key={col.heading}>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0A0A0A', marginBottom: 16 }}>{col.heading}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {col.links.map((item) => (
                    <li key={item} style={{ marginBottom: 10 }}><a href="#">{item}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="hairline" style={{ marginBottom: 24 }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 12, color: '#bbb' }}>© 2026 VoiceAI. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 16 }}>
              <Globe style={{ width: 14, height: 14, color: '#ccc' }} />
              <Lock style={{ width: 14, height: 14, color: '#ccc' }} />
              <BarChart3 style={{ width: 14, height: 14, color: '#ccc' }} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;