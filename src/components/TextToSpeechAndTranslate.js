import React, { useState, useRef } from 'react';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import '../styles/TextToSpeechAndTranslate.css'; 

const TextToSpeechAndTranslate = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [translation, setTranslation] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ttsResponse = await api.post('/tts', { text });
      setAudioUrl(ttsResponse.data.audioUrl);

      const translateResponse = await api.post('/translate', { text });
      setTranslation(translateResponse.data.translation);
    } catch (error) {
      console.error('Failed to process the text:', error);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="translate-container">
      <h2 className="translate-heading">Translator</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="translate-textarea"
          value={text}
          onChange={handleChange}
          required
        ></textarea>
        <button className="translate-button" type="submit">Translate</button>
      </form>
      {translation && <div className="translate-translation"><b>Translation:</b> {translation}</div>}
      {audioUrl && translation && (
        <div className="translate-audio-icon" onClick={toggleAudio}>
          <FontAwesomeIcon icon={isPlaying ? faVolumeUp : faVolumeMute} />
        </div>
      )}
      <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnded}></audio>
    </div>
  );
};

export default TextToSpeechAndTranslate;
