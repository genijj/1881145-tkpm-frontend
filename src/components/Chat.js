import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import '../styles/Chat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faInfoCircle, faVolumeUp, faTrash } from '@fortawesome/free-solid-svg-icons';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [audio, setAudio] = useState(null);
  const recognition = useRef(null);
  const chatHistoryRef = useRef(null);

  const fetchChatHistory = async () => {
    try {
      const response = await api.get('/chat/get-history');
      setChatHistory(response.data.chatHistory);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  const clearChatHistory = async () => {
    try {
      await api.delete('/chat/clear-history');
      setChatHistory([]);
      // window.location.href = '/chat';
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  };

  useEffect(() => {
    fetchChatHistory();

    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        setMessage(event.results[0][0].transcript);
        setIsRecording(false);
      };

      recognition.current.onend = () => {
        setIsRecording(false);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error', event);
        setIsRecording(false);
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === '') return;
    const newMessage = { role: 'user', content: message };
    setChatHistory([...chatHistory, newMessage]);
    setMessage('');
    setIsWaitingForResponse(true);
    try {
      const response = await api.post('/chat', { message });
      setChatHistory(prevChatHistory => [
        ...prevChatHistory,
        { role: 'assistant', content: response.data.message }
      ]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  const handleSpeechInput = () => {
    if (recognition.current && !isWaitingForResponse) {
      if (isRecording) {
        recognition.current.stop();
        setIsRecording(false);
      } else {
        recognition.current.start();
        setIsRecording(true);
      }
    }
  };

  const handleWordDoubleClick = async (text) => {
    try {
      const translateResponse = await api.post('/translate', { text });
      const ttsResponse = await api.post('/tts', { text });
      setPopupData({
        text,
        translation: translateResponse.data.translation,
        audioUrl: ttsResponse.data.audioUrl
      });
      setSelectedWord(text);
    } catch (error) {
      console.error('Failed to fetch translation or pronunciation:', error);
    }
  };

  const handleClosePopup = () => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    setSelectedWord(null);
    setPopupData(null);
  };

  const handlePlayPronunciation = (audioUrl) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    const newAudio = new Audio(audioUrl);
    newAudio.play();
    setAudio(newAudio);
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      <button className="clear-history-button" onClick={clearChatHistory}>
        <FontAwesomeIcon icon={faTrash} /> Clear History
      </button>
      <div className="chat-history" ref={chatHistoryRef}>
        {chatHistory.map((chat, index) => (
          <div key={index} className={`chat-message-wrapper ${chat.role}`}>
            <div className={`chat-message ${chat.role}`}>
              {chat.content.split(' ').map((word, i) => (
                <span key={i} onDoubleClick={() => handleWordDoubleClick(word)}>
                  {word}{' '}
                </span>
              ))}
              <FontAwesomeIcon icon={faInfoCircle} onClick={() => handleWordDoubleClick(chat.content)} style={{ marginLeft: '10px', cursor: 'pointer' }} />
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder={isWaitingForResponse ? "Assistant is replying..." : "Type a message or use the mic"}
          className="chat-input"
          disabled={isWaitingForResponse}
        />
        <button type="button" onClick={handleSpeechInput} className={`chat-mic-button ${isRecording ? 'recording' : ''}`} disabled={isWaitingForResponse}>
          <FontAwesomeIcon icon={isRecording ? faMicrophoneSlash : faMicrophone} />
        </button>
        <button type="submit" className="chat-submit-button" disabled={isWaitingForResponse}>Send</button>
      </form>
      {selectedWord && popupData && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={handleClosePopup}>&times;</span>
            <h3>{popupData.text}</h3>
            <button onClick={() => handlePlayPronunciation(popupData.audioUrl)}>
              <FontAwesomeIcon icon={faVolumeUp} /> Listen
            </button>
            <p><b>Translation:</b> {popupData.translation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
