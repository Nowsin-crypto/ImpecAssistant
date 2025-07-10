import React, { useState } from 'react';
//import './App.css'; - will do styling later i guess?


function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChat = async () => {
    setLoading(true);
    //for now running it on localhost, will deploy later
    const res = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });
    const data = await res.json();
    setResponse(data.response);

    // Fetching audio for text to speech feature, just cool to hear it then looking at the screen?
    const audioRes = await fetch('http://localhost:5000/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: data.response })
    });
    const audioBlob = await audioRes.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();

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
      />
      <button onClick={handleChat} disabled={loading}>
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
