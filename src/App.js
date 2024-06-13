import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import NavBar from './components/NavBarBootstrap';
import TextToSpeech from './components/TextToSpeech';
import TextToSpeechAndTranslate from './components/TextToSpeechAndTranslate';
import SpeechToText from './components/SpeechToText';
import Translate from './components/Translate';
import UpdateUserInfo from './components/UpdateUserInfo';
import ChangePassword from './components/ChangePassword';
import Voice from './components/Voice';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div>
      {isAuthenticated && <NavBar />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/text-to-speech" element={isAuthenticated ? <TextToSpeech /> : <Navigate to="/login" />} />
        <Route path="/text-to-speech-translate" element={isAuthenticated ? <TextToSpeechAndTranslate /> : <Navigate to="/login" />} />
        <Route path="/speech-to-text" element={isAuthenticated ? <SpeechToText /> : <Navigate to="/login" />} />
        <Route path="/voice" element={isAuthenticated ? <Voice /> : <Navigate to="/login" />} />
        <Route path="/translate" element={isAuthenticated ? <Translate /> : <Navigate to="/login" />} />
        <Route path="/update-user-info" element={isAuthenticated ? <UpdateUserInfo /> : <Navigate to="/login" />} />
        <Route path="/change-password" element={isAuthenticated ? <ChangePassword /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
