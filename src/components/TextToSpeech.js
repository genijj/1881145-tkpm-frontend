import React, { useState, useRef } from 'react';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/tts', { text });
      setAudioUrl(response.data.audioUrl);
    } catch (error) {
      console.error('Failed to convert text to speech:', error);
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
    <div>
      <h2>Text to Speech</h2>
      <form onSubmit={handleSubmit}>
        <textarea value={text} onChange={handleChange} required></textarea>
        <button type="submit">Convert</button>
      </form>
      {audioUrl && (
        <div onClick={toggleAudio} style={{ cursor: 'pointer', fontSize: '2rem', marginTop: '1rem' }}>
          <FontAwesomeIcon icon={isPlaying ? faVolumeUp : faVolumeMute} />
        </div>
      )}
      <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnded}></audio>
    </div>
  );
};

export default TextToSpeech;
