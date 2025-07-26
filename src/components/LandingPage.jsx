import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BACKEND_URL;





// --- Components ---

// 1. Background Animation Component
const AnimatedBackground = () => (
    <div className="background-animation">
        {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
                key={i}
                className="bg-shape"
                initial={{ opacity: 0, y: '100vh', scale: Math.random() * 1.5 }}
                animate={{
                    opacity: [0, 0.1, 0.2, 0.1, 0],
                    y: ['100vh', '0vh'],
                    x: `${Math.random() * 100 - 50}vw`,
                    rotate: Math.random() * 360,
                }}
                transition={{
                    duration: Math.random() * 20 + 20,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: 'linear'
                }}
                style={{
                    backgroundColor: i % 2 === 0 ? '#00ffff' : '#ff00ff',
                    width: `${Math.random() * 100 + 50}px`,
                    height: `${Math.random() * 100 + 50}px`,
                }}
            />
        ))}
    </div>
);

// 2. Hero Section

const HeroSection = () => {
    const navigate = useNavigate();

    const handleCreateRoom = async () => {
        const newRoomCode = `BVT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        console.log(`Creating and navigating to room: ${newRoomCode}`);

        try {
            const res = await axios.post(`${BASE_URL}/api/rooms/create`, {
                createdBy: "Anonymous", // or use actual user
                roomCode: newRoomCode,
            })

            if (res.data && res.data.room) {
                navigate(`/room/${newRoomCode}`);
            } else {
                console.error("Room creation failed");
            }
        } catch (err) {
            console.error("Error creating room:", err.message);
            alert("Failed to create room. Try again.");
        }
    };

    const handleJoinRoom = () => {
        navigate('/join'); // Navigate to the JoinRoom component
    };
    
  return (
        <section className="hero-section">
            <motion.h1
                className="app-title"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                BeatVote
            </motion.h1>
            <motion.p
                className="tagline"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            >
                Vote the Beat. Rule the Room.
            </motion.p>
            <div className="cta-buttons">
                {/* 6. Attach the onClick handlers to the buttons */}
                <motion.button
                    onClick={handleCreateRoom}
                    className="cta-button primary"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 25px #00ffff' }}
                    whileTap={{ scale: 0.95 }}
                >
                    Create Room
                </motion.button>
                <motion.button
                    onClick={handleJoinRoom}
                    className="cta-button secondary"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 25px #ff00ff' }}
                    whileTap={{ scale: 0.95 }}
                >
                    Join Room
                </motion.button>
            </div>
        </section>
    );
};


// 3. Demo Section
const DemoSection = () => {
    const mockSongs = [
        { id: 1, title: "Blinding Lights", artist: "The Weeknd", votes: 12, cover: "https://placehold.co/80x80/000000/ffffff?text=BL" },
        { id: 2, title: "Levitating", artist: "Dua Lipa", votes: 8, cover: "https://placehold.co/80x80/000000/ffffff?text=L" },
        { id: 3, title: "Stay", artist: "The Kid LAROI, Justin Bieber", votes: 5, cover: "https://placehold.co/80x80/000000/ffffff?text=S" }
    ];

    const [songs, setSongs] = useState(mockSongs);

    // Simulate a vote coming in
    useEffect(() => {
        const interval = setInterval(() => {
            setSongs(prevSongs => {
                const randomSongIndex = Math.floor(Math.random() * prevSongs.length);
                return prevSongs.map((song, index) =>
                    index === randomSongIndex ? { ...song, votes: song.votes + 1 } : song
                );
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const sortedSongs = [...songs].sort((a, b) => b.votes - a.votes);

    return (
        <section className="demo-section">
            <motion.div
                className="demo-window"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
                <div className="demo-header">
                    <div className="dots">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                    </div>
                    <span>Party Playlist</span>
                </div>
                <div className="demo-content">
                    <div className="now-playing">
                        <h4>Now Playing</h4>
                        <div className="song-card playing">
                            <img src="https://placehold.co/100x100/ff00ff/000000?text=BV" alt="Album Art" />
                            <div className="song-info">
                                <p className="song-title">Future Funk</p>
                                <p className="song-artist">BeatVote FM</p>
                                <div className="progress-bar">
                                    <motion.div
                                        className="progress"
                                        initial={{ width: '0%' }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                    ></motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="song-queue">
                        <h4>Vote for Next</h4>
                        <AnimatePresence>
                            {sortedSongs.map((song, index) => (
                                <motion.div
                                    key={song.id}
                                    layout
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 50 }}
                                    className="song-card"
                                >
                                    <span className="rank">#{index + 1}</span>
                                    <img src={song.cover} alt={song.title} />
                                    <div className="song-info">
                                        <p className="song-title">{song.title}</p>
                                        <p className="song-artist">{song.artist}</p>
                                    </div>
                                    <div className="vote-count">
                                        <motion.span key={song.votes} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.3 }}>
                                            {song.votes}
                                        </motion.span>
                                         <span className="vote-icon">▲</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

// 4. How It Works Section
const HowItWorksSection = () => {
    const steps = [
        {
            icon: "🔗",
            title: "Create or Join",
            description: "Start a new voting room or enter an existing one with a simple code."
        },
        {
            icon: "🎵",
            title: "Add Songs",
            description: "Search and add your favorite tracks from Spotify or YouTube."
        },
        {
            icon: "🗳️",
            title: "Vote Live",
            description: "Upvote songs you love. The most popular track plays next!"
        }
    ];

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    return (
        <section className="how-it-works-section">
            <h2 className="section-title">How It Works</h2>
            <motion.div
                className="steps-container"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                {steps.map((step, index) => (
                    <motion.div key={index} className="step-card" variants={itemVariants}>
                        <div className="step-icon">{step.icon}</div>
                        <h3 className="step-title">{step.title}</h3>
                        <p className="step-description">{step.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};




// --- Main App Component ---
function LandingPage() {
    return (
        <div className="app-container">
            <AnimatedBackground />
            <main className="content-wrapper">
                <HeroSection />
                <DemoSection />
                <HowItWorksSection />
        
            </main>
        </div>
    );
}

export default LandingPage;