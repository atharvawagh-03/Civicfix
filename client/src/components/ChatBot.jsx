import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api/client.js';

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
      setHistory([...newHistory, { role: 'model', text: response.text }]);
    } catch (err) {
      setHistory([...newHistory, { role: 'model', text: 'Sorry, I am having trouble connecting right now.' }]);
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
