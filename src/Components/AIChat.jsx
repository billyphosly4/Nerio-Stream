import { useState } from 'react';

function AIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi! I am Nerio AI. What kind of movie or show are you in the mood for today?' }
    ]);
    const [input, setInput] = useState("");

    const handleSend = async (e) => {
        e.preventDefault();
        const userText = input.trim();
        if (!userText) return;

        setMessages(prev => [...prev, { type: 'user', text: userText }]);
        setInput("");

        const lowerText = userText.toLowerCase();

        try {
            if (lowerText.startsWith("define ")) {
                const word = lowerText.split(" ")[1];
                const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
                if (!res.ok) throw new Error("Word not found");
                const data = await res.json();
                const text = data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition || "Word not found.";
                setMessages(prev => [...prev, { type: 'bot', text: `📖 ${word}: ${text}` }]);
            } else if (lowerText.includes("joke")) {
                const res = await fetch("https://v2.jokeapi.dev/joke/Any?safe-mode");
                const data = await res.json();
                const text = data.type === 'single' ? data.joke : `${data.setup} - ${data.delivery}`;
                setMessages(prev => [...prev, { type: 'bot', text: `😂 ${text}` }]);
            } else if (lowerText.includes("fact")) {
                const res = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random");
                const data = await res.json();
                setMessages(prev => [...prev, { type: 'bot', text: `🧠 Did you know? ${data.text}` }]);
            } else {
                setMessages(prev => [...prev, { type: 'bot', text: "I'm Nerio AI! Try typing: 'define <word>', 'joke', or 'fact'!" }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { type: 'bot', text: "Oops, couldn't fetch that information right now." }]);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            {isOpen && (
                <div style={{ width: '300px', height: '400px', background: '#1e1e2f', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', marginBottom: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <div style={{ padding: '15px', background: '#6366f1', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>✨ AI Assistant</span>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                    </div>
                    
                    <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start', background: msg.type === 'user' ? '#4f46e5' : 'rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '8px', maxWidth: '80%', fontSize: '0.85rem', lineHeight: '1.4' }}>
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSend} style={{ display: 'flex', padding: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <input 
                            type="text" 
                            placeholder="Ask me anything..." 
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            style={{ flex: 1, padding: '8px 12px', borderRadius: '20px', border: 'none', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '0.85rem' }}
                        />
                        <button type="submit" style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '50%', width: '35px', height: '35px', marginLeft: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➤</button>
                    </form>
                </div>
            )}
            
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    ✨
                </button>
            )}
        </div>
    );
}

export default AIChat;
