import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './JoinRoom.css'; // Link to the new CSS file
const BASE_URL = process.env.REACT_APP_BACKEND_URL;


const JoinRoom = () => {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();

    if (!name.trim() || !roomCode.trim()) {
      setError('Both name and room code are required.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/rooms/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, roomCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to join room');
        return;
      }

      localStorage.setItem('username', name);
      navigate(`/room/${roomCode.toUpperCase()}`);
    } catch (err) {
      console.error(err);
      setError('Server error while joining room.');
    }
  };

  return (
    <div className="join-room-container">
      <div className="form-wrapper">
        <h2 className="form-title">Join a BeatVote Room</h2>
        <form onSubmit={handleJoin} className="join-form">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="text"
            placeholder="Room Code (e.g. BVT-XYZ)"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            className="form-input"
            required
          />
          <motion.button
            type="submit"
            className="submit-btn"
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px #00ffff' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            Join Room
          </motion.button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;