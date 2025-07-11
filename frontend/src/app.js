import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

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

      // Try to get audio, but only if ElevenLabs key is set
      try {
        const audioRes = await fetch('http://localhost:5001/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: data.response })
        });
        if (audioRes.headers.get('content-type').includes('audio')) {
          const audioBlob = await audioRes.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();
        }
      } catch (audioErr) {
        // Ignore audio errors for now
      }
    } catch (err) {
      setResponse('Network error or server not responding.');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>🧠 ImpekAgent</h1>
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
      {response && (
        <div className="response">
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;
