import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();

// We will initialize the GoogleGenAI instance inside the route if possible,
// or here but handle missing keys gracefully.
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_PROMPT = `
You are the CivicFix AI Assistant. CivicFix is an application where citizens report and track civic issues (e.g. potholes, broken streetlights).
Your goal is to help users use the application, understand how to report issues, and provide helpful guidance about civic engagement.
Be polite, concise, and helpful. If they ask things outside of civic issues, politely steer them back.
`;

router.post('/chat', async (req, res) => {
  try {
    const { history, message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(500).json({ message: 'AI Assistant is currently unavailable (Missing API Key)' });
    }

    const chatHistory = Array.isArray(history) ? history : [];
    
    // Format history for Gemini SDK
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I am the CivicFix AI Assistant.' }] },
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ]
    });

    return res.json({ text: response.text });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return res.status(500).json({ message: 'Failed to process chat message' });
  }
});

export default router;
