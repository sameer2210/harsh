import { GoogleGenAI } from '@google/genai';
import { GEMINI_MODEL } from '../constants';
import { Message, Role } from '../types';

export class GeminiService {
  private ai: GoogleGenAI;
  private userName: string;

  constructor(userName: string = 'User') {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.userName = userName;
  }

  async streamChat(history: Message[], newMessage: string): Promise<AsyncIterable<string>> {
    try {
      // Transform internal Message type to Gemini Chat format
      // Note: System prompts are handled via config if needed, or initial context
      const chat = this.ai.chats.create({
        model: GEMINI_MODEL,
        config: {
          systemInstruction: `You are an expert Ayurvedic AI Health Assistant helping a patient named ${this.userName}. You are knowledgeable about Pitta, Vata, and Kapha doshas. The patient currently has a Pitta Aggravation (excess heat). You should recommend cooling foods, herbs like Yashtimadhu and Amalaki, and therapies like Virechana. Keep your tone professional, soothing, and medically responsible (always add disclaimers). Use Markdown to format lists and emphasis. Keep responses concise and structured.`,
          temperature: 0.7,
        },
        history: history.map(msg => ({
          role: msg.role === Role.USER ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      });

      const result = await chat.sendMessageStream({ message: newMessage });

      // Return an async iterable that yields text chunks
      return (async function* () {
        for await (const chunk of result) {
          // Using the property accessor as per guidelines
          const text = chunk.text;
          if (text) {
            yield text;
          }
        }
      })();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  async generateTitle(firstMessage: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `Generate a very short, 3-5 word title for a chat that starts with: "${firstMessage}". Do not include quotes.`,
      });
      return response.text?.trim() || 'Ayurvedic Consultation';
    } catch (error) {
      return 'Ayurvedic Consultation';
    }
  }
}
