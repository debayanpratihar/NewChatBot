import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: "Hi, I'm Debayan. How can I help you?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkTheme]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://chatgpt-42.p.rapidapi.com/gpt4',
        {
          messages: [...messages, userMessage],
          web_access: false,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
            'x-rapidapi-key': 'fdf387e42bmshdefd3c2d385eda9p1c0bdbjsnfe986ff6aef0',
          },
        }
      );

      setLoading(false);
      console.log(response); // Log the response to inspect its structure

      // Check if result exists in the response
      if (response.data && response.data.result) {
        const botMessage = { role: 'system', content: response.data.result };
        setMessages([...messages, userMessage, botMessage]);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching response:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <div className={`chatbot-container ${darkTheme ? 'dark' : ''}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkTheme ? 'Light Theme' : 'Dark Theme'}
      </button>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chatbot-message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="chatbot-message system loading">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </div>
        )}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask Debayan..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
