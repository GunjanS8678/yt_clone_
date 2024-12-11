import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import CreateChannelPage from './pages/CreateChannelPage';
import MyChannelPage from './pages/MyChannelPage';










const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/video/:id" element={<VideoPlayerPage />} />
        <Route path="/create-channel" element={<CreateChannelPage />} />
        <Route path="/my-channel" element={<MyChannelPage />} />
      </Routes>
    </Router>
  );
};

export default App;
