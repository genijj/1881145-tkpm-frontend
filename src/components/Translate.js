import React, { useState } from 'react';
import api from '../services/api';

const Translate = () => {
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/translate', { text });
      setTranslation(response.data.translation);
    } catch (error) {
      console.error('Failed to translate text:', error);
    }
  };

  return (
    <div>
      <h2>Translate</h2>
      <form onSubmit={handleSubmit}>
        <textarea value={text} onChange={handleChange} required></textarea>
        <button type="submit">Translate</button>
      </form>
      {translation && <div><b>Translation:</b> {translation}</div>}
    </div>
  );
};

export default Translate;
