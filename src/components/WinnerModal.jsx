import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import './WinnerModal.css'; // Assuming styles are in a shared CSS file

const SpotifyIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.43 17.51c-.22.35-.66.46-.99.24-2.85-1.74-6.35-2.12-10.61-1.16-.42.1-.85-.13-.95-.55-.1-.42.13-.85.55-.95C11.12 14.1 14.99 14.5 18.17 16.4c.33.2.44.64.24.99v.02zm1.12-2.31c-.27.43-.8.56-1.23.28-3.2-1.95-7.97-2.54-11.75-1.39-.5.15-1.02-.19-1.17-.68-.15-.5.19-1.02.68-1.17 4.26-1.28 9.48-.63 13.12 1.52.43.27.56.8.28 1.23v.01zM19.9 12.6c-.32.51-.96.67-1.47.35-3.67-2.22-9.9-2.42-13.82-1.33-.59.16-1.2-.2-1.36-.79-.16-.59.2-1.2.79-1.36C8.84 8.4 15.63 8.61 19.8 11.1c.51.32.67.96.35 1.47v.03z"/></svg>;

const modalDropIn = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: {
        y: "0",
        opacity: 1,
        transition: { type: "spring", damping: 25, stiffness: 500 },
    },
    exit: { y: "100vh", opacity: 0 },
};

const VoteWinnerModal = ({ winner, onClose }) => {
    if (!winner) return null;
    
    // Get viewport dimensions for confetti
    const width = window.innerWidth;
    const height = window.innerHeight;

    return (
        <AnimatePresence>
            <motion.div
                className="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                 <ReactConfetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={500}
                    gravity={0.1}
                 />
                <motion.div
                    className="winner-modal"
                    variants={modalDropIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <button className="close-modal-btn" onClick={onClose}>&times;</button>
                    <h2 className="winner-title">🎉 VOTE WINNER! 🎉</h2>
                    <img src={winner.thumbnail} alt={winner.title} className="winner-thumbnail" />
                    <h3 className="winner-song-title">{winner.title}</h3>
                    <p className="winner-artist">{winner.artist}</p>
                    
                    <a 
                        href={winner.platformLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="play-on-platform-btn"
                    >
                       <SpotifyIcon /> Play on Spotify
                    </a>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default VoteWinnerModal;