import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api/client.js';

function getLocalCivicResponse(message) {
  const q = (message || '').toLowerCase().trim();

  // 1. Where / How to file complaint or report issue (Direct answer to user question)
  if (
    q.includes('where') ||
    q.includes('complaint') ||
    q.includes('how to report') ||
    q.includes('file') ||
    q.includes('fill') ||
    q.includes('submit') ||
    q.includes('lodge') ||
    q.includes('register a issue')
  ) {
    return (
      "You can file your complaint directly on CivicFix in 3 simple steps:\n\n" +
      "1. Click on **'Report issue'** in the left sidebar menu (or visit `/report`).\n" +
      "2. Fill in the **Title**, **Description**, and select a **Category** (e.g., Pothole, Broken Streetlight, Garbage, Water Leakage).\n" +
      "3. Attach a **Photo** of the problem and verify your location on the interactive **Map**.\n\n" +
      "Once submitted, your ticket is immediately dispatched to the city maintenance queue!"
    );
  }

  // 2. Tracking & Status
  if (q.includes('track') || q.includes('status') || q.includes('my issues') || q.includes('progress') || q.includes('check')) {
    return (
      "You can track the live status of all your submitted complaints under the **'My issues'** tab in the sidebar (`/my-issues`).\n\n" +
      "Every report displays real-time progress: Pending 🟡 → In Progress 🔵 → Resolved 🟢."
    );
  }

  // 3. Potholes & Roads
  if (q.includes('pothole') || q.includes('road') || q.includes('asphalt') || q.includes('pavement')) {
    return (
      "For road potholes and cracks:\n" +
      "1. Open **'Report issue'** in the navigation (`/report`).\n" +
      "2. Select **'Pothole / Road Damage'** as the category.\n" +
      "3. Upload a photo showing the road damage.\n" +
      "4. The system will auto-detect your GPS coordinates, or you can drag the map pin to the exact location."
    );
  }

  // 4. Street light
  if (q.includes('light') || q.includes('streetlight') || q.includes('lamp') || q.includes('dark street')) {
    return (
      "To report a broken streetlight:\n" +
      "1. Head to **'Report issue'** (`/report`).\n" +
      "2. Select **'Broken Streetlight'** as the category.\n" +
      "3. Note the nearest lamp pole number or landmark in the description.\n" +
      "4. Pinpoint the street location on the map for utility crews."
    );
  }

  // 5. Garbage / Waste
  if (q.includes('garbage') || q.includes('trash') || q.includes('waste') || q.includes('dump') || q.includes('sanitation')) {
    return (
      "To report overflowing waste bins or illegal dumps:\n" +
      "1. Navigate to **'Report issue'** (`/report`).\n" +
      "2. Select **'Garbage / Sanitation'**.\n" +
      "3. Attach a photo showing the volume and area of the waste.\n" +
      "4. Submit the report to dispatch sanitation collection trucks."
    );
  }

  // 6. Water / Leakage
  if (q.includes('water') || q.includes('leak') || q.includes('pipe') || q.includes('drain')) {
    return (
      "For water pipe bursts or blocked drains, head to **'Report issue'** (`/report`), select **'Water Supply / Drainage'**, take a photo, and set the map pin location."
    );
  }

  // 7. Categories
  if (q.includes('categor') || q.includes('what can i report')) {
    return (
      "CivicFix supports reporting for:\n" +
      "• 🛣️ Potholes & Road Damage\n" +
      "• 💡 Broken Streetlights & Electrical Outages\n" +
      "• 🗑️ Garbage Accumulation & Waste\n" +
      "• 💧 Water Pipe Leaks & Drainage Blockages\n" +
      "• ⚠️ General Public Infrastructure Hazards"
    );
  }

  // 8. Contact & Support
  if (q.includes('contact') || q.includes('support') || q.includes('phone') || q.includes('email') || q.includes('helpline')) {
    return (
      "You can contact the CivicFix support desk:\n" +
      "• Email: support@civicfix.org\n" +
      "• Helpline: 1800-CIVIC-FIX (1800-248-4234)\n\n" +
      "For life-threatening emergencies (live fallen power cables, gas leaks), please call emergency services (911 / 112) immediately."
    );
  }

  // 9. Greetings
  if (q === 'hi' || q === 'hello' || q === 'hey' || q.startsWith('hi ') || q.startsWith('hello ') || q.includes('who are you')) {
    return (
      "Hello! I am your CivicFix AI Assistant. I can help you report issues like potholes or broken streetlights, check status progress, or navigate the platform. How can I help you today?"
    );
  }

  // 10. Gratitude
  if (q.includes('thank') || q.includes('thanks')) {
    return "You're very welcome! Thank you for helping keep our city clean and safe. Let me know if you need anything else!";
  }

  return (
    "I'm here to help! In CivicFix, you can submit public infrastructure issues by clicking **'Report issue'** in the sidebar, or track your existing tickets on the **'My issues'** page.\n\n" +
    "Feel free to ask questions like: *'Where can I fill my complaint?'* or *'How do I track my reported issue?'*"
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([
    { role: 'model', text: 'Hi! I am the CivicFix AI assistant. How can I help you today?' }
  ]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, history]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = message.trim();
    setMessage('');
    
    // Add user message to history
    const newHistory = [...history, { role: 'user', text: userMsg }];
    setHistory(newHistory);
    setLoading(true);

    try {
      const response = await sendChatMessage(history, userMsg);
      if (response && response.text) {
        setHistory([...newHistory, { role: 'model', text: response.text }]);
      } else {
        const fallbackText = getLocalCivicResponse(userMsg);
        setHistory([...newHistory, { role: 'model', text: fallbackText }]);
      }
    } catch (err) {
      console.warn("API chat network error, using built-in assistant:", err);
      const fallbackText = getLocalCivicResponse(userMsg);
      setHistory([...newHistory, { role: 'model', text: fallbackText }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        type="button"
        className="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat bot"
        title="CivicFix AI Assistant"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="chatbot-window card">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <span className="chatbot-status-dot" />
              <strong>CivicFix AI Assistant</strong>
            </div>
            <button
              type="button"
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              &times;
            </button>
          </div>
          
          <div className="chatbot-messages">
            {history.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-model'}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="chat-message chat-message-model chat-typing">
                <span>.</span><span>.</span><span>.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ask about reporting, tracking, status..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !message.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
