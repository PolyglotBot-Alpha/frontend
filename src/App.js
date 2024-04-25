import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState(() => {
    // Try to retrieve the chat history from localStorage
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    // Listen for changes in messages and update localStorage
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSend = async () => {
    const userMessage = { text: input, id: Date.now(), sender: 'user' };
    setMessages(messages => [...messages, userMessage]);

    try {
      const response = await axios.post(process.env.REACT_APP_API_URL, { user_input: input });
      const { essay, audio_url } = response.data;
      const botMessage = { text: essay, audioUrl: audio_url, id: Date.now() + 1, sender: 'bot' };
      setMessages(messages => [...messages, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      const errorMessage = { text: 'Failed to fetch response from the server.', id: Date.now() + 1, sender: 'bot' };
      setMessages(messages => [...messages, errorMessage]);
    }

    setInput('');
  };

  const handleBotResponse = (inputText) => {
    const botMessageText = `Echo: ${inputText}`; // Simulate a bot's response
    const botMessage = { text: botMessageText, id: Date.now() + 1, sender: 'bot' };
    setTimeout(() => {
      setMessages(messages => [...messages, botMessage]);
    }, 500); // Simulate network delay
  };

  const playText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  return (
    <div>
      <input value={input} onChange={handleInputChange} />
      <button onClick={handleSend}>Send</button>
      <div>
        {messages.map(message => (
          <div key={message.id} style={{ textAlign: message.sender === 'bot' ? 'left' : 'right' }}>
            {message.text}
            {message.sender === 'bot' && (
              <button onClick={() => playText(message.text)}>Play</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
