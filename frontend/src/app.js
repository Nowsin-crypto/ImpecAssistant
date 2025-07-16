import React, { useState, useRef } from 'react';
import './app.css';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const audioRef = useRef(null);

  const handleChat = async () => {
    if (!input) return;
    setLoading(true);
    setResponse('');
    try {
      const res = await fetch('http://localhost:5001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      if (data.error) {
        setResponse(`Error: ${data.error}`);
        setLoading(false);
        return;
      }
      setResponse(data.response);

      setMessages(prev => [
        ...prev,
        { role: 'user', text: input },
        { role: 'assistant', text: data.response }
      ]);
    } catch (err) {
      setResponse('Network error or server not responding.');
    }
    setLoading(false);
    setInput('');
  };

  const handleSubmitToSupport = async () => {
    try {
      await addDoc(collection(db, "supportChats"), {
        messages: messages,
        timestamp: serverTimestamp(),
        needsHumanSupport: true
      });
      alert("Conversation submitted to support!");
    } catch (error) {
      console.error("Error submitting chat: ", error);
      alert("Failed to submit conversation.");
    }
  };

  const handlePlayVoice = async () => {
    const lastAssistantMessage = [...messages].reverse().find(msg => msg.role === 'assistant');
    if (!lastAssistantMessage) {
      alert("No assistant reply to speak.");
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: lastAssistantMessage.text })
      });

      if (!res.ok) {
        throw new Error("Server failed to generate voice. Check logs.");
      }

      const audioBlob = await res.blob();
      const audioURL = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioURL;
        await audioRef.current.play();
      }
    } catch (err) {
      console.error("Voice playback failed:", err);
      alert("Failed to play voice.");
    }
  };

  return (
    <div className="App">
      <h1>im.pek.assistant</h1>

      <div className="chat-history" style={{ marginBottom: 16 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ color: msg.role === 'user' ? '#f4d06f' : '#fff', margin: '6px 0' }}>
            <b>{msg.role === 'user' ? 'You' : 'ImpekAssistant'}:</b> {msg.text}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        placeholder="Ask me anything ..."
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
      />

      <button onClick={handleChat} disabled={loading || !input.trim()}>
        {loading ? 'Thinking...' : 'Ask'}
      </button>

      {messages.length > 0 && (
        <>
          <button
            style={{
              marginTop: 18,
              background: "#f4d06f",
              color: "#181818",
              border: "none",
              borderRadius: 8,
              padding: "12px 22px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer"
            }}
            onClick={handleSubmitToSupport}
          >
            Submit Conversation to support for a follow up from us!
          </button>

          <button
            onClick={handlePlayVoice}
            style={{
              marginTop: 12,
              marginLeft: 12,
              background: "#181818",
              color: "#f4d06f",
              border: "1px solid #f4d06f",
              borderRadius: 8,
              padding: "10px 20px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >
            🔊 Play Response
          </button>

          {/* This hidden audio player triggers voice output */}
          <audio ref={audioRef} hidden />
        </>
      )}
    </div>
  );
}

export default App;
