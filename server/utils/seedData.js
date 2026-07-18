
const { sequelize } = require('../config/database');
const User = require('../models/User');
const AIAgent = require('../models/AIAgent');
const Call = require('../models/Call');
const Appointment = require('../models/Appointment');
const Lead = require('../models/Lead');
const Metric = require('../models/Metric');
const Notification = require('../models/Notification');
const dayjs = require('dayjs');

const seedData = async () => {
  try {
    console.log('Seeding database...');

    // Create demo user
    const [user, created] = await User.findOrCreate({
      where: { email: 'demo@krid-replica.com' },
      defaults: {
        password: 'DemoPass123!',
        firstName: 'Demo',
        lastName: 'User',
        phone: '+1234567890',
        companyName: 'Demo Company',
        role: 'admin'
      }
    });

    // Create AI Agents
    const agents = await AIAgent.bulkCreate([
      {
        userId: user.id,
        name: 'Receptionist Sarah',
        type: 'inbound',
        status: 'active',
        greeting: 'Hello, thank you for calling Demo Company. This is Sarah. How may I assist you today?',
        farewell: 'Thank you for calling. Have a wonderful day!',
        knowledgeBase: {
          businessName: 'Demo Company',
          services: ['Consulting', 'Support', 'Training'],
          hours: 'Monday to Friday, 9 AM to 5 PM'
        },
        faqs: [
          { question: 'What are your hours?', answer: 'We are open Monday to Friday, 9 AM to 5 PM.' },
          { question: 'Do you offer support?', answer: 'Yes, we offer 24/7 support through our AI agents.' }
        ],
        qualificationRules: {
          budget: { min: 1000, question: 'What is your budget range?' },
          timeline: { question: 'When do you need this completed?' },
          decisionMaker: { question: 'Are you the decision maker?' }
        },
        totalCallsHandled: 156,
        totalMinutesUsed: 420.5,
        successRate: 0.87
      },
      {
        userId: user.id,
        name: 'Sales Alex',
        type: 'outbound',
        status: 'active',
        greeting: 'Hi, this is Alex from Demo Company. Do you have a moment to discuss how we can help your business?',
        knowledgeBase: {
          businessName: 'Demo Company',
          services: ['Sales Consulting', 'Lead Generation', 'CRM Integration']
        },
        totalCallsHandled: 89,
        totalMinutesUsed: 234.2,
        successRate: 0.72
      },
      {
        userId: user.id,
        name: 'Support Mike',
        type: 'support',
        status: 'active',
        greeting: 'Hello, this is Mike from Demo Company Support. How can I help you today?',
        totalCallsHandled: 203,
        totalMinutesUsed: 567.8,
        successRate: 0.91
      }
    ]);

    // Create sample calls
    const calls = await Call.bulkCreate([
      {
        agentId: agents[0].id,
        userId: user.id,
        direction: 'inbound',
        status: 'completed',
        callerNumber: '+15551234567',
        callerName: 'John Smith',
        duration: 245,
        cost: 0.3675,
        transcript: "User: Hello, I need help with my account.\nAssistant: Of course, I'd be happy to help. Can you provide your account number?\nUser: It's 12345.\nAssistant: Thank you. I see your account. What issue are you experiencing?",
        summary: 'Customer called regarding account access issue. Provided account number and described login problems.',
        sentiment: 'neutral',
        sentimentScore: 0.5,
        intent: 'support_request',
        leadScore: 45,
        isQualified: false,
        startedAt: dayjs().subtract(2, 'hour').toDate(),
        endedAt: dayjs().subtract(1, 'hour').toDate()
      },
      {
        agentId: agents[0].id,
        userId: user.id,
        direction: 'inbound',
        status: 'completed',
        callerNumber: '+15559876543',
        callerName: 'Emily Johnson',
        duration: 380,
        cost: 0.57,
        transcript: "User: Hi, I'm interested in your consulting services.\nAssistant: Great! I'd love to help you with that. Could you tell me more about your business needs?\nUser: We're a startup looking to scale our sales process.\nAssistant: That sounds exciting. What's your current monthly revenue?\nUser: About $50,000.\nAssistant: Excellent. Let me schedule a consultation with our team.",
        summary: 'High-value lead interested in consulting services. Startup with $50k monthly revenue. Scheduled consultation.',
        sentiment: 'positive',
        sentimentScore: 0.85,
        intent: 'sales_inquiry',
        leadScore: 92,
        isQualified: true,
        qualificationData: { budget: '50000', timeline: '1-3 months', decisionMaker: true },
        appointmentBooked: true,
        startedAt: dayjs().subtract(5, 'hour').toDate(),
        endedAt: dayjs().subtract(4, 'hour').toDate()
      },
      {
        agentId: agents[1].id,
        userId: user.id,
        direction: 'outbound',
        status: 'completed',
        callerNumber: '+15551112222',
        callerName: 'Robert Chen',
        duration: 180,
        cost: 0.27,
        transcript: "Assistant: Hi Robert, this is Alex from Demo Company...",
        summary: 'Outbound sales call. Prospect interested but needs to discuss with team. Follow-up scheduled.',
        sentiment: 'positive',
        sentimentScore: 0.7,
        intent: 'sales_inquiry',
        leadScore: 65,
        isQualified: true,
        startedAt: dayjs().subtract(8, 'hour').toDate(),
        endedAt: dayjs().subtract(7, 'hour').toDate()
      },
      {
        agentId: agents[2].id,
        userId: user.id,
        direction: 'inbound',
        status: 'handoff',
        callerNumber: '+15553334444',
        callerName: 'Maria Garcia',
        duration: 120,
        cost: 0.18,
        transcript: 'User: I need to speak to a manager right now!\\nAssistant: I understand your frustration...',
        summary: 'Escalated call - customer demanded to speak with manager regarding billing dispute.',
        sentiment: 'negative',
        sentimentScore: 0.2,
        intent: 'complaint',
        leadScore: 10,
        isQualified: false,
        handoffReason: 'Customer explicitly requested manager',
        startedAt: dayjs().subtract(1, 'hour').toDate(),
        endedAt: dayjs().subtract(50, 'minute').toDate()
      }
    ]);

    // Create appointments
    await Appointment.create({
      callId: calls[0].id,
      agentId: agents[0].id,
      userId: user.id,
      contactName: 'Emily Johnson',
      contactPhone: '+15559876543',
      contactEmail: 'emily@example.com',
      title: 'Sales Consultation - Emily Johnson',
      description: 'Consulting services discussion for startup scaling',
      scheduledDate: dayjs().add(2, 'day').toDate(),
      duration: 60,
      status: 'scheduled'
    });

    await Appointment.create({
      agentId: agents[1].id,
      userId: user.id,
      contactName: 'Robert Chen',
      contactPhone: '+15551112222',
      title: 'Follow-up Call - Robert Chen',
      description: 'Follow-up on sales proposal discussion',
      scheduledDate: dayjs().add(3, 'day').toDate(),
      duration: 30,
      status: 'scheduled'
    });

    // Create appointments
    await Appointment.create({
      callId: calls[1].id,
      agentId: agents[0].id,
      userId: user.id,
      contactName: 'Emily Johnson',
      contactPhone: '+15559876543',
      contactEmail: 'emily@example.com',
      title: 'Sales Consultation - Emily Johnson',
      description: 'Consulting services discussion for startup scaling',
      scheduledDate: dayjs().add(2, 'day').toDate(),
      duration: 60,
      status: 'scheduled'
    });

    await Appointment.create({
      agentId: agents[1].id,
      userId: user.id,
      contactName: 'Robert Chen',
      contactPhone: '+15551112222',
      title: 'Follow-up Call - Robert Chen',
      description: 'Follow-up on sales proposal discussion',
      scheduledDate: dayjs().add(3, 'day').toDate(),
      duration: 30,
      status: 'scheduled'
    });

    // Create leads
    await Lead.bulkCreate([
      {
        userId: user.id,
        agentId: agents[0].id,
        callId: calls[1].id,
        firstName: 'Emily',
        lastName: 'Johnson',
        email: 'emily@example.com',
        phone: '+15559876543',
        company: 'TechStart Inc',
        source: 'inbound_call',
        status: 'qualified',
        score: 92,
        priority: 'high',
        estimatedValue: 15000.00,
        notes: 'Startup with $50k MRR. Interested in consulting package.',
        tags: ['hot', 'startup', 'consulting']
      },
      {
        userId: user.id,
        agentId: agents[1].id,
        callId: calls[2].id,
        firstName: 'Robert',
        lastName: 'Chen',
        email: 'robert@example.com',
        phone: '+15551112222',
        company: 'Chen Enterprises',
        source: 'outbound_call',
        status: 'contacted',
        score: 65,
        priority: 'medium',
        estimatedValue: 8000.00,
        notes: 'Interested but needs team approval. Follow-up scheduled.',
        tags: ['warm', 'enterprise']
      },
      {
        userId: user.id,
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david@example.com',
        phone: '+15557778888',
        company: 'Wilson Corp',
        source: 'web_form',
        status: 'new',
        score: 40,
        priority: 'low',
        estimatedValue: 3000.00,
        notes: 'Downloaded whitepaper. Needs nurturing.',
        tags: ['cold', 'nurture']
      }
    ]);

    // Create metrics
    await Metric.bulkCreate([
      {
        userId: user.id,
        date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        totalCalls: 45,
        inboundCalls: 30,
        outboundCalls: 15,
        totalMinutes: 180.5,
        avgCallDuration: 240,
        totalCost: 16.245,
        qualifiedLeads: 12,
        appointmentsBooked: 8,
        handoffs: 3,
        positiveSentiment: 28,
        negativeSentiment: 5,
        neutralSentiment: 12,
        successRate: 0.84
      },
      {
        userId: user.id,
        date: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
        totalCalls: 52,
        inboundCalls: 35,
        outboundCalls: 17,
        totalMinutes: 210.3,
        avgCallDuration: 242,
        totalCost: 18.927,
        qualifiedLeads: 15,
        appointmentsBooked: 10,
        handoffs: 4,
        positiveSentiment: 32,
        negativeSentiment: 7,
        neutralSentiment: 13,
        successRate: 0.81
      }
    ]);

    // Create notifications
    await Notification.bulkCreate([
      {
        userId: user.id,
        type: 'lead_alert',
        title: 'Hot Lead Alert',
        message: 'New qualified lead: Emily Johnson (Score: 92)',
        data: { leadId: 'demo-lead-1', score: 92 },
        priority: 'high',
        channel: 'in_app'
      },
      {
        userId: user.id,
        type: 'call_alert',
        title: 'New Call Completed',
        message: 'Call from Emily Johnson completed. Duration: 380s. Intent: sales_inquiry',
        data: { callId: 'demo-call-2', duration: 380 },
        priority: 'medium',
        channel: 'in_app'
      },
      {
        userId: user.id,
        type: 'handoff',
        title: 'Human Handoff Required',
        message: 'Call handoff required: Maria Garcia - Customer explicitly requested manager',
        data: { callId: 'demo-call-4' },
        priority: 'urgent',
        channel: 'in_app'
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\\nDemo credentials:');
    console.log('  Email: demo@krid-replica.com');
    console.log('  Password: DemoPass123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
