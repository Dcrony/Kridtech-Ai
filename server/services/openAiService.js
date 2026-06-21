
const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.model = process.env.OPENAI_MODEL || 'gpt-4';
  }

  /**
   * Generate AI response for phone conversation
   */
  async generateResponse(conversationHistory, agentConfig, callerInfo) {
    try {
      const systemPrompt = this.buildSystemPrompt(agentConfig, callerInfo);
      
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 300,
        presence_penalty: 0.3,
        frequency_penalty: 0.3
      });

      return {
        text: completion.choices[0].message.content,
        usage: completion.usage,
        finishReason: completion.choices[0].finish_reason
      };
    } catch (error) {
      console.error('OpenAI response generation error:', error);
      throw error;
    }
  }

  /**
   * Analyze sentiment of conversation
   */
  async analyzeSentiment(text) {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Analyze the sentiment of the following text. Respond with ONLY a JSON object: {"sentiment": "positive|neutral|negative", "score": number_between_0_and_1, "confidence": number_between_0_and_1}'
          },
          { role: 'user', content: text }
        ],
        temperature: 0.1,
        max_tokens: 100
      });

      const result = JSON.parse(completion.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return { sentiment: 'neutral', score: 0.5, confidence: 0.5 };
    }
  }

  /**
   * Generate conversation summary
   */
  async generateSummary(transcript) {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Summarize this phone conversation in 2-3 sentences. Focus on: 1) Caller intent, 2) Key information gathered, 3) Outcome or next steps. Be concise and professional.'
          },
          { role: 'user', content: transcript }
        ],
        temperature: 0.5,
        max_tokens: 200
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Summary generation error:', error);
      return 'Summary unavailable';
    }
  }

  /**
   * Extract lead qualification data
   */
  async extractQualificationData(transcript, qualificationRules) {
    try {
      const rulesText = JSON.stringify(qualificationRules);
      
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `Extract lead qualification data from this conversation. Rules: ${rulesText}. Respond with ONLY a JSON object containing extracted fields and a "score" (0-100) and "isQualified" (boolean).`
          },
          { role: 'user', content: transcript }
        ],
        temperature: 0.2,
        max_tokens: 300
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Qualification extraction error:', error);
      return { score: 0, isQualified: false };
    }
  }

  /**
   * Detect intent
   */
  async detectIntent(text) {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Classify the caller intent. Respond with ONLY the intent label: appointment_booking, pricing_inquiry, general_inquiry, complaint, sales_inquiry, support_request, callback_request, other'
          },
          { role: 'user', content: text }
        ],
        temperature: 0.1,
        max_tokens: 50
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('Intent detection error:', error);
      return 'other';
    }
  }

  /**
   * Check if handoff is needed
   */
  async shouldHandoff(conversationHistory, triggers) {
    try {
      const conversation = conversationHistory.map(m => `${m.role}: ${m.content}`).join('\\n');
      const triggersText = triggers.map(t => `${t.condition}: ${t.action}`).join('\\n');
      
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `Based on these handoff triggers: ${triggersText}, should this conversation be transferred to a human? Respond with ONLY: true or false`
          },
          { role: 'user', content: conversation }
        ],
        temperature: 0.1,
        max_tokens: 10
      });

      return completion.choices[0].message.content.trim().toLowerCase() === 'true';
    } catch (error) {
      console.error('Handoff detection error:', error);
      return false;
    }
  }

  /**
   * Build system prompt for agent
   */
  buildSystemPrompt(agentConfig, callerInfo) {
    const { name, type, greeting, farewell, knowledgeBase, faqs, customScripts } = agentConfig;
    
    let prompt = `You are ${name}, an AI phone assistant for a business. `;
    prompt += `You are a ${type} agent. `;
    prompt += `Be professional, helpful, and conversational. `;
    prompt += `Keep responses concise (2-3 sentences max) as this is a phone call. `;
    
    if (greeting) {
      prompt += `\\n\\nGreeting: ${greeting}`;
    }
    if (farewell) {
      prompt += `\\n\\nFarewell: ${farewell}`;
    }
    
    if (knowledgeBase && Object.keys(knowledgeBase).length > 0) {
      prompt += `\\n\\nBusiness Knowledge: ${JSON.stringify(knowledgeBase)}`;
    }
    
    if (faqs && faqs.length > 0) {
      prompt += `\\n\\nFAQs: ${JSON.stringify(faqs)}`;
    }
    
    if (customScripts && customScripts.length > 0) {
      prompt += `\\n\\nScripts: ${JSON.stringify(customScripts)}`;
    }
    
    if (callerInfo) {
      prompt += `\\n\\nCaller Info: ${JSON.stringify(callerInfo)}`;
    }
    
    prompt += `\\n\\nGuidelines:`;
    prompt += `\\n- Always be polite and professional`;
    prompt += `\\n- If you don't know something, offer to take a message`;
    prompt += `\\n- For complex issues, suggest transferring to a human`;
    prompt += `\\n- Confirm important details before ending the call`;
    prompt += `\\n- Use the caller's name if known`;
    
    return prompt;
  }
}

module.exports = new OpenAIService();


