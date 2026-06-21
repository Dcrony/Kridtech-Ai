const twilio = require('twilio');

class TwilioService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    this.webhookUrl = process.env.TWILIO_WEBHOOK_URL;
  }

  /**
   * Make an outbound call
   */
  async makeCall(to, agentId, customParams = {}) {
    try {
      const call = await this.client.calls.create({
        to,
        from: this.phoneNumber,
        url: `${this.webhookUrl}/voice?agentId=${agentId}`,
        statusCallback: `${this.webhookUrl}/status`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST',
        ...customParams
      });

      return {
        success: true,
        callSid: call.sid,
        status: call.status,
        direction: 'outbound'
      };
    } catch (error) {
      console.error('Twilio makeCall error:', error);
      throw error;
    }
  }

  /**
   * Generate TwiML for incoming call
   */
  generateVoiceResponse(agentConfig, conversationState) {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();

    // Greeting
    if (conversationState.isFirstMessage && agentConfig.greeting) {
      twiml.say(
        { voice: 'Polly.Joanna', language: agentConfig.language || 'en-US' },
        agentConfig.greeting
      );
    }

    // Gather speech input
    const gather = twiml.gather({
      input: 'speech',
      language: agentConfig.language || 'en-US',
      speechTimeout: 'auto',
      speechModel: 'phone_call',
      enhanced: true,
      action: `${this.webhookUrl}/process-speech?agentId=${conversationState.agentId}&callSid=${conversationState.callSid}`,
      method: 'POST'
    });

    // Fallback message
    gather.say(
      { voice: 'Polly.Joanna', language: agentConfig.language || 'en-US' },
      "I'm listening. How can I help you today?"
    );

    // If no input, redirect
    twiml.redirect(`${this.webhookUrl}/voice?agentId=${conversationState.agentId}&callSid=${conversationState.callSid}`);

    return twiml.toString();
  }

  /**
   * Send AI response as voice
   */
  generateAIResponseTwiML(text, agentConfig, nextAction) {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();

    twiml.say(
      { voice: 'Polly.Joanna', language: agentConfig.language || 'en-US' },
      text
    );

    if (nextAction === 'hangup') {
      if (agentConfig.farewell) {
        twiml.say(
          { voice: 'Polly.Joanna', language: agentConfig.language || 'en-US' },
          agentConfig.farewell
        );
      }
      twiml.hangup();
    } else if (nextAction === 'handoff') {
      twiml.say(
        { voice: 'Polly.Joanna', language: agentConfig.language || 'en-US' },
        "Please hold while I transfer you to a team member."
      );
      twiml.dial(this.phoneNumber); // Dial to human number
    } else {
      // Continue conversation
      const gather = twiml.gather({
        input: 'speech',
        language: agentConfig.language || 'en-US',
        speechTimeout: 'auto',
        speechModel: 'phone_call',
        enhanced: true,
        action: `${this.webhookUrl}/process-speech?agentId=${agentConfig.id}`,
        method: 'POST'
      });
    }

    return twiml.toString();
  }

  /**
   * Send SMS notification
   */
  async sendSMS(to, message) {
    try {
      const result = await this.client.messages.create({
        body: message,
        from: this.phoneNumber,
        to
      });
      return { success: true, messageSid: result.sid };
    } catch (error) {
      console.error('Twilio SMS error:', error);
      throw error;
    }
  }

  /**
   * Get call recording
   */
  async getRecording(callSid) {
    try {
      const recordings = await this.client.recordings.list({ callSid });
      return recordings.map(r => ({
        sid: r.sid,
        duration: r.duration,
        url: `https://api.twilio.com${r.uri.replace('.json', '')}`
      }));
    } catch (error) {
      console.error('Twilio getRecording error:', error);
      return [];
    }
  }

  /**
   * End call
   */
  async endCall(callSid) {
    try {
      await this.client.calls(callSid).update({ status: 'completed' });
      return { success: true };
    } catch (error) {
      console.error('Twilio endCall error:', error);
      throw error;
    }
  }
}

module.exports = new TwilioService();