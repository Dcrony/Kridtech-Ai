
const { Call, AIAgent, Lead, Appointment } = require('../models/Index');
const { Op } = require('sequelize');
const openaiService = require('../services/openAiService');
const twilioService = require('../services/twilioService');
const notificationService = require('../services/notificationService');
const dayjs = require('dayjs');

exports.getCalls = async (req, res, next) => {
  try {
    const { status, agentId, direction, search, startDate, endDate, page = 1, limit = 20 } = req.query;
    const where = { userId: req.user.id };

    if (status) where.status = status;
    if (agentId) where.agentId = agentId;
    if (direction) where.direction = direction;
    if (startDate && endDate) {
      where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    if (search) {
      where[Op.or] = [
        { callerName: { [Op.iLike]: `%${search}%` } },
        { callerNumber: { [Op.iLike]: `%${search}%` } },
        { transcript: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: calls } = await Call.findAndCountAll({
      where,
      include: [
        { model: AIAgent, as: 'agent', attributes: ['id', 'name', 'type'] },
        { model: Lead, as: 'lead', required: false },
        { model: Appointment, as: 'appointment', required: false }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      success: true,
      data: calls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCall = async (req, res, next) => {
  try {
    const call = await Call.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        { model: AIAgent, as: 'agent' },
        { model: Lead, as: 'lead' },
        { model: Appointment, as: 'appointment' }
      ]
    });

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    res.json({
      success: true,
      data: call
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCall = async (req, res, next) => {
  try {
    const call = await Call.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    const allowedUpdates = [
      'status', 'transcript', 'summary', 'sentiment', 'sentimentScore',
      'leadScore', 'isQualified', 'qualificationData', 'appointmentBooked',
      'handoffReason', 'handoffTo', 'handoffNotes', 'notes', 'tags', 'followUpRequired', 'followUpDate'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        call[field] = req.body[field];
      }
    });

    await call.save();

    res.json({
      success: true,
      message: 'Call updated successfully',
      data: call
    });
  } catch (error) {
    next(error);
  }
};

exports.initiateOutboundCall = async (req, res, next) => {
  try {
    const { agentId, phoneNumber, callerName } = req.body;

    const agent = await AIAgent.findOne({
      where: { id: agentId, userId: req.user.id }
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    if (agent.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Agent is not active'
      });
    }

    // Create call record
    const call = await Call.create({
      agentId,
      userId: req.user.id,
      direction: 'outbound',
      status: 'queued',
      callerNumber: phoneNumber,
      callerName: callerName || null
    });

    // Initiate Twilio call
    const twilioResult = await twilioService.makeCall(phoneNumber, agentId);

    // Update call with Twilio SID
    call.callSid = twilioResult.callSid;
    call.status = twilioResult.status;
    await call.save();

    res.json({
      success: true,
      message: 'Outbound call initiated',
      data: call
    });
  } catch (error) {
    next(error);
  }
};

exports.getTranscript = async (req, res, next) => {
  try {
    const call = await Call.findOne({
      where: { id: req.params.id, userId: req.user.id },
      attributes: ['id', 'transcript', 'conversationLog', 'summary', 'recordingUrl']
    });

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    res.json({
      success: true,
      data: call
    });
  } catch (error) {
    next(error);
  }
};

exports.getCallAnalytics = async (req, res, next) => {
  try {
    const { period = '7d' } = req.query;
    const startDate = dayjs().subtract(parseInt(period), 'day').toDate();

    const stats = await Call.findAll({
      where: { userId: req.user.id, createdAt: { [Op.gte]: startDate } },
      attributes: [
        'direction',
        'status',
        'sentiment',
        [Call.sequelize.fn('COUNT', '*'), 'count'],
        [Call.sequelize.fn('SUM', Call.sequelize.col('duration')), 'totalDuration'],
        [Call.sequelize.fn('AVG', Call.sequelize.col('duration')), 'avgDuration'],
        [Call.sequelize.fn('SUM', Call.sequelize.col('cost')), 'totalCost']
      ],
      group: ['direction', 'status', 'sentiment']
    });

    const hourlyDistribution = await Call.findAll({
      where: { userId: req.user.id, createdAt: { [Op.gte]: startDate } },
      attributes: [
        [Call.sequelize.fn('EXTRACT', Call.sequelize.literal('HOUR FROM "created_at"')), 'hour'],
        [Call.sequelize.fn('COUNT', '*'), 'count']
      ],
      group: [Call.sequelize.fn('EXTRACT', Call.sequelize.literal('HOUR FROM "created_at"'))],
      order: [[Call.sequelize.fn('EXTRACT', Call.sequelize.literal('HOUR FROM "created_at"')), 'ASC']]
    });

    res.json({
      success: true,
      data: {
        stats,
        hourlyDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};

// Twilio Webhooks
exports.handleIncomingCall = async (req, res, next) => {
  try {
    const { agentId } = req.query;
    const { CallSid, From, CallerName } = req.body;

    const agent = await AIAgent.findByPk(agentId);
    if (!agent || !agent.isActive) {
      const VoiceResponse = require('twilio').twiml.VoiceResponse;
      const twiml = new VoiceResponse();
      twiml.say('Sorry, this line is currently unavailable. Please try again later.');
      twiml.hangup();
      return res.type('text/xml').send(twiml.toString());
    }

    // Create call record
    const call = await Call.create({
      agentId,
      userId: agent.userId,
      callSid: CallSid,
      direction: 'inbound',
      status: 'in_progress',
      callerNumber: From,
      callerName: CallerName || null,
      startedAt: new Date()
    });

    // Generate TwiML
    const twiml = twilioService.generateVoiceResponse(agent, {
      agentId,
      callSid: CallSid,
      isFirstMessage: true
    });

    res.type('text/xml').send(twiml);
  } catch (error) {
    next(error);
  }
};

exports.handleSpeech = async (req, res, next) => {
  try {
    const { agentId, callSid } = req.query;
    const { SpeechResult, Confidence } = req.body;

    const call = await Call.findOne({ where: { callSid } });
    const agent = await AIAgent.findByPk(agentId);

    if (!call || !agent) {
      const VoiceResponse = require('twilio').twiml.VoiceResponse;
      const twiml = new VoiceResponse();
      twiml.say('I apologize, but I am unable to continue this conversation. Goodbye.');
      twiml.hangup();
      return res.type('text/xml').send(twiml.toString());
    }

    // Update conversation log
    const conversationLog = call.conversationLog || [];
    conversationLog.push({
      role: 'user',
      content: SpeechResult,
      timestamp: new Date(),
      confidence: Confidence
    });

    // Generate AI response
    const aiResponse = await openaiService.generateResponse(
      conversationLog,
      agent,
      { name: call.callerName, number: call.callerNumber }
    );

    // Analyze sentiment
    const sentiment = await openaiService.analyzeSentiment(SpeechResult);

    // Check for handoff
    const shouldHandoff = await openaiService.shouldHandoff(
      conversationLog,
      agent.handoffTriggers || []
    );

    // Update call
    conversationLog.push({
      role: 'assistant',
      content: aiResponse.text,
      timestamp: new Date()
    });

    call.conversationLog = conversationLog;
    call.transcript = conversationLog.map(m => `${m.role}: ${m.content}`).join('\\n');
    
    if (sentiment) {
      call.sentiment = sentiment.sentiment;
      call.sentimentScore = sentiment.score;
    }

    await call.save();

    // Determine next action
    let nextAction = 'continue';
    if (shouldHandoff) {
      nextAction = 'handoff';
      call.status = 'handoff';
      call.handoffReason = 'AI detected need for human assistance';
      await call.save();

      // Send notification
      await notificationService.sendHandoffNotification(agent.userId, {
        callId: call.id,
        callerName: call.callerName,
        callerNumber: call.callerNumber,
        handoffReason: call.handoffReason
      });
    }

    // Generate TwiML response
    const twiml = twilioService.generateAIResponseTwiML(
      aiResponse.text,
      agent,
      nextAction
    );

    res.type('text/xml').send(twiml);
  } catch (error) {
    next(error);
  }
};

exports.handleCallStatus = async (req, res, next) => {
  try {
    const { CallSid, CallStatus, CallDuration, RecordingUrl } = req.body;

    const call = await Call.findOne({ where: { callSid: CallSid } });
    if (!call) return res.sendStatus(200);

    call.status = CallStatus;
    
    if (CallDuration) {
      call.duration = parseInt(CallDuration);
      call.cost = (parseInt(CallDuration) / 60) * 0.09; // $0.09/min
    }
    
    if (RecordingUrl) {
      call.recordingUrl = RecordingUrl;
    }

    if (['completed', 'failed', 'no_answer', 'busy', 'canceled'].includes(CallStatus)) {
      call.endedAt = new Date();
      
      // Generate summary if transcript exists
      if (call.transcript) {
        call.summary = await openaiService.generateSummary(call.transcript);
        
        // Extract qualification data
        const agent = await AIAgent.findByPk(call.agentId);
        if (agent && agent.qualificationRules) {
          const qualification = await openaiService.extractQualificationData(
            call.transcript,
            agent.qualificationRules
          );
          call.qualificationData = qualification;
          call.leadScore = qualification.score || 0;
          call.isQualified = qualification.isQualified || false;
        }

        // Detect intent
        call.intent = await openaiService.detectIntent(call.transcript);
      }

      // Update agent stats
      const agent = await AIAgent.findByPk(call.agentId);
      if (agent) {
        agent.totalCallsHandled += 1;
        agent.totalMinutesUsed += call.duration / 60;
        await agent.save();
      }

      // Send notification
      await notificationService.sendCallAlert(call.userId, {
        callId: call.id,
        callerName: call.callerName,
        callerNumber: call.callerNumber,
        duration: call.duration,
        intent: call.intent,
        isQualified: call.isQualified
      });
    }

    await call.save();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};