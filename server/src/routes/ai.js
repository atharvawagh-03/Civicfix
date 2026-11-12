import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') return null;
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_PROMPT = `
You are the CivicFix AI Assistant. CivicFix is an application where citizens report and track civic issues (e.g. potholes, broken streetlights, garbage accumulation, water leakages).
Your goal is to help users use the application, understand how to report issues, track their ticket progress, and provide helpful guidance about civic engagement.
Be polite, concise, and helpful. If they ask things outside of civic issues, politely steer them back.
`;

function generateCivicResponse(message) {
  const q = (message || '').toLowerCase().trim();

  // 1. Where / How to file complaint or report issue (Exact match for user prompt)
  if (
    (q.includes('where') && (q.includes('complaint') || q.includes('report') || q.includes('fill') || q.includes('file') || q.includes('submit'))) ||
    q.includes('how to report') ||
    q.includes('how do i report') ||
    q.includes('file a complaint') ||
    q.includes('new issue') ||
    q.includes('report issue') ||
    q.includes('submit issue') ||
    q.includes('fill my complaint') ||
    q.includes('lodge a complaint') ||
    q.includes('register a complaint')
  ) {
    return (
      "You can file your complaint right here on CivicFix in 3 easy steps:\n\n" +
      "1. Click on **'Report issue'** in the left sidebar menu (or go to `/report`).\n" +
      "2. Provide a **Title**, **Description**, and select a **Category** (e.g., Pothole, Broken Streetlight, Garbage, Water Leakage).\n" +
      "3. Attach a **Photo** of the problem and verify your location on the interactive **Map**.\n\n" +
      "Once you click **'Submit report'**, your issue will be immediately sent to the municipal dispatch team!"
    );
  }

  // 2. How to track issues or check status
  if (
    q.includes('track') ||
    q.includes('status') ||
    q.includes('my issues') ||
    q.includes('check my') ||
    q.includes('where is my') ||
    q.includes('progress') ||
    q.includes('resolved')
  ) {
    return (
      "You can track the progress of all your submitted complaints under the **'My issues'** tab in the sidebar (or visit `/my-issues`).\n\n" +
      "Every report moves through 3 clear status milestones:\n" +
      "• 🟡 **Pending**: Ticket received and queued for review.\n" +
      "• 🔵 **In Progress**: Municipal crew or contractor dispatched to the site.\n" +
      "• 🟢 **Resolved**: Repair completed and verified on-site."
    );
  }

  // 3. Potholes / Road surface issues
  if (q.includes('pothole') || q.includes('road') || q.includes('asphalt') || q.includes('pavement') || q.includes('street repair')) {
    return (
      "For road damage and potholes:\n" +
      "1. Open **'Report issue'** (`/report`).\n" +
      "2. Choose the **'Pothole / Road Damage'** category.\n" +
      "3. Take a photo showing the depth and surrounding road area.\n" +
      "4. The system automatically detects your GPS coordinates, or you can drag the pin on the map to pinpoint it.\n\n" +
      "Road maintenance teams prioritize deep potholes to prevent vehicle damage and accidents."
    );
  }

  // 4. Street light / Electrical hazards
  if (q.includes('light') || q.includes('streetlight') || q.includes('lamp') || q.includes('dark street') || q.includes('electricity') || q.includes('wire')) {
    return (
      "To report broken street lights or electrical hazards:\n" +
      "1. Navigate to **'Report issue'** (`/report`).\n" +
      "2. Select **'Broken Streetlight'** as the category.\n" +
      "3. If visible, mention the lamp pole number or nearby house number in the description.\n" +
      "4. Mark the location on the map so utility bucket lift crews can find it quickly."
    );
  }

  // 5. Garbage / Sanitation / Waste
  if (q.includes('garbage') || q.includes('trash') || q.includes('waste') || q.includes('dump') || q.includes('clean') || q.includes('sanitation')) {
    return (
      "To report waste accumulation or overflowing bins:\n" +
      "1. Go to **'Report issue'** (`/report`).\n" +
      "2. Select **'Garbage / Sanitation'**.\n" +
      "3. Take a photo of the waste pile or bin location.\n" +
      "4. Submit the report to dispatch municipal sanitation collection trucks."
    );
  }

  // 6. Water / Leakage / Drainage
  if (q.includes('water') || q.includes('leak') || q.includes('pipe') || q.includes('drain') || q.includes('sewage') || q.includes('flood')) {
    return (
      "For water pipe bursts or blocked storm drains:\n" +
      "1. Open **'Report issue'** (`/report`).\n" +
      "2. Choose **'Water Supply / Drainage'**.\n" +
      "3. Note whether clean drinking water is being wasted or sewage is overflowing.\n" +
      "4. Pinpoint the street location on the map for urgent water board dispatch."
    );
  }

  // 7. Categories inquiry
  if (q.includes('categor') || q.includes('types of issues') || q.includes('what can i report')) {
    return (
      "CivicFix supports reporting across all major urban infrastructure categories:\n" +
      "• 🛣️ **Potholes & Road Surface Damage**\n" +
      "• 💡 **Broken Streetlights & Electrical Outages**\n" +
      "• 🗑️ **Garbage Accumulation & Overflowing Dumps**\n" +
      "• 💧 **Water Pipe Leaks & Drainage Blockages**\n" +
      "• ⚠️ **General Public Infrastructure & Sidewalk Hazards**"
    );
  }

  // 8. Admin & Operations
  if (q.includes('admin') || q.includes('manage') || q.includes('authority') || q.includes('dispatch') || q.includes('supervisor')) {
    return (
      "For city supervisors and municipal administrators:\n" +
      "• **Admin Dashboard** (`/admin`): View total reports, active resolution metrics, and ward analytics.\n" +
      "• **Manage Issues** (`/manage`): Review incoming tickets, update statuses, assign field teams, and post verification notes."
    );
  }

  // 9. Contact / Support / Emergency
  if (q.includes('contact') || q.includes('support') || q.includes('helpdesk') || q.includes('phone') || q.includes('email') || q.includes('call') || q.includes('helpline')) {
    return (
      "You can reach the CivicFix support desk directly:\n" +
      "• **Email**: support@civicfix.org\n" +
      "• **Authority Desk**: admin@civicfix.gov\n" +
      "• **Toll-Free Helpline**: 1800-CIVIC-FIX (1800-248-4234)\n\n" +
      "🚨 *For active life-threatening emergencies (live fallen high-voltage cables, gas leaks), please contact emergency services (911 / 112) immediately.*"
    );
  }

  // 10. Greetings
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q.startsWith('hi ') ||
    q.startsWith('hello ') ||
    q.includes('who are you') ||
    q.includes('what do you do') ||
    q.includes('help')
  ) {
    return (
      "Hello! I am your CivicFix AI Assistant. I can help you with:\n" +
      "• How to report local issues like potholes or broken streetlights\n" +
      "• Checking the status of your complaints\n" +
      "• Navigating your Citizen or Admin dashboard\n" +
      "• Municipal support contact information\n\n" +
      "How can I help you today?"
    );
  }

  // 11. Gratitude
  if (q.includes('thank') || q.includes('thanks') || q.includes('appreciate')) {
    return "You're very welcome! Thank you for participating in keeping our community clean, safe, and well-maintained. Let me know if you need anything else!";
  }

  // Fallback general guidance
  return (
    "I'm here to help you navigate CivicFix!\n\n" +
    "• To report a new issue (pothole, streetlight, garbage, water leak), go to **'Report issue'** in the sidebar (`/report`).\n" +
    "• To check your reported complaints and see live progress, go to **'My issues'** (`/my-issues`).\n\n" +
    "Feel free to ask me questions like *'Where can I fill my complaint?'* or *'How do I track my issue?'*!"
  );
}

router.post('/chat', async (req, res) => {
  try {
    const { history, message } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ message: 'Message is required' });
    }

    const ai = getAIClient();
    
    // If Gemini client is configured, attempt model generation
    if (ai) {
      try {
        const chatHistory = Array.isArray(history) ? history : [];
        const formattedHistory = chatHistory
          .filter(msg => msg && msg.text)
          .map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: String(msg.text) }]
          }));

        // Try gemini-1.5-flash which is widely supported
        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
            { role: 'model', parts: [{ text: 'Understood. I am the CivicFix AI Assistant.' }] },
            ...formattedHistory,
            { role: 'user', parts: [{ text: message }] }
          ]
        });

        if (response && response.text) {
          return res.json({ text: response.text });
        }
      } catch (geminiError) {
        console.warn("Gemini API generation error (using fallback):", geminiError.message);
      }
    }

    // Always provide an intelligent, accurate response via the CivicFix Response Engine
    const replyText = generateCivicResponse(message);
    return res.json({ text: replyText });

  } catch (error) {
    console.error("AI Chat Route Error:", error);
    // Never crash the chat with a 500
    const fallback = generateCivicResponse(req.body?.message || '');
    return res.json({ text: fallback });
  }
});

export default router;
