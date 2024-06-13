import React, { useState, useRef } from 'react';
import api from '../services/api';

const Voice = () => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = event => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioBlob);

      try {
        const response = await api.post('/stt', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setTranscript(response.data.transcript);
      } catch (error) {
        console.error('Failed to convert speech to text:', error);
      }
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div>
      <h2>Speech to Text</h2>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {transcript && <div><b>Transcript:</b> {transcript}</div>}
    </div>
  );
};

export default Voice;
