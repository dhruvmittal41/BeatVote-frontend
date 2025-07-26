import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCopy } from 'react-icons/fa';
import './RoomHeader.css';

const RoomHeader = ({ roomCode, userCount, onStartVoting, isVotingActive, countdown }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.header
            className="room-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="room-info">
                <h1 className="room-code-label">ROOM CODE:</h1>
                <div className="room-code-copy">
                    <h2 className="room-code">{roomCode}</h2>
                    <FaCopy
                        className="copy-icon"
                        onClick={handleCopy}
                        title="Copy Room Code"
                    />
                    {copied && <span className="copied-text">Copied!</span>}
                </div>
            </div>

            <div className="header-controls">
                <div className="user-count">
                    <span className="user-icon">👤</span>
                    <span className="count">{userCount}</span>
                </div>

                {!isVotingActive ? (
                    <button className="start-voting-btn" onClick={onStartVoting}>
                        🎵 Start Voting
                    </button>
                ) : (
                    <div className="countdown-timer">
                        ⏳ {countdown}s
                    </div>
                )}
            </div>
        </motion.header>
    );
};

export default RoomHeader;
