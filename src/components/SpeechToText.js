import React, { useState } from 'react';
import api from '../services/api';

const SpeechToText = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState('');

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      const response = await api.post('/stt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setTranscript(response.data.transcript);
    } catch (error) {
      console.error('Failed to convert speech to text:', error);
    }
  };

  return (
    <div>
      <h2>Speech to Text</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} required />
        <button type="submit">Convert</button>
      </form>
      {transcript && <div><b>Transcript:</b> {transcript}</div>}
    </div>
  );
};

export default SpeechToText;
