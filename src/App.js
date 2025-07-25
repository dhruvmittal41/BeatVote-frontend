import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from "./components/LandingPage"; // Assuming this is the correct path
import RoomPage from "./components/SongCard"; 
import JoinRoom from './components/JoinRoom';   // Assuming this is the correct path

function App() {
  return (
    // The BrowserRouter component wraps your entire app, enabling routing
    <BrowserRouter>
      <Routes>
        {/* Route for the landing page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Route for the room page. ':roomCode' is a URL parameter */}
        <Route path="/room/:roomCode" element={<RoomPage />} />
        <Route path="/join" element={<JoinRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;