// import React, { useState, useEffect, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import SongSearch from './SongSearch';
// import VoteWinnerModal from './WinnerModal';
// import './SongCard.css';

// const initialNowPlaying = {
//     title: "Waiting for next song...",
//     artist: "BeatVote",
//     thumbnail: "https://placehold.co/120x120/0d0d0d/ffffff?text=?"
// };

// const Toast = ({ message, type, onClose }) => {
//     useEffect(() => {
//         const timer = setTimeout(onClose, 3000);
//         return () => clearTimeout(timer);
//     }, [onClose]);

//     return (
//         <motion.div
//             className={`toast ${type}`}
//             initial={{ y: -100, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -100, opacity: 0 }}
//             layout
//         >
//             {message}
//         </motion.div>
//     );
// };

// const RoomHeader = ({ roomCode, userCount }) => (
//     <motion.header
//         className="room-header"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//     >
//         <div className="room-info">
//             <h1 className="room-code-label">ROOM CODE:</h1>
//             <h2 className="room-code">{roomCode}</h2>
//         </div>
//         <div className="user-count">
//             <span className="user-icon">👤</span>
//             <span className="count">{userCount}</span>
//         </div>
//     </motion.header>
// );

// const NowPlaying = ({ song }) => {
//     if (!song || !song.thumbnail) return <div className="now-playing-empty">Queue is empty. Add a song!</div>;
//     return (
//         <motion.section
//             className="now-playing-section"
//             key={song._id || song.title}
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.7 }}
//         >
//             <div className="now-playing-bg-pulse" />
//             <div className="now-playing-content">
//                 <img src={song.thumbnail} alt={song.title} className="now-playing-thumbnail" />
//                 <div className="now-playing-details">
//                     <span className="now-playing-label">NOW PLAYING</span>
//                     <h3 className="now-playing-title">{song.title}</h3>
//                     <p className="now-playing-artist">{song.artist}</p>
//                 </div>
//             </div>
//         </motion.section>
//     );
// };

// const SongCard = ({ song, onVote }) => (
//     <motion.div
//         className="song-card"
//         layout
//         initial={{ opacity: 0, y: 50, scale: 0.8 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         exit={{ opacity: 0, x: -50, scale: 0.8 }}
//         transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//     >
//         <img src={song.thumbnail} alt={song.title} className="song-thumbnail" />
//         <div className="song-details">
//             <p className="song-title">{song.title}</p>
//             <p className="song-artist">{song.artist}</p>
//         </div>
//         <div className="vote-actions">
//             <motion.button whileTap={{ scale: 0.9 }} className="vote-btn" onClick={() => onVote(song._id, 1)}>👍</motion.button>
//             <span className="vote-count">{song.voteCount || 0}</span>
//         </div>
//     </motion.div>
// );

// const VoteQueue = ({ songs, onVote }) => (
//     <section className="vote-queue-section">
//         <h3 className="section-title">Voting Queue</h3>
//         <AnimatePresence>
//             {songs.length > 0 ? (
//                 songs.map(song => <SongCard key={song._id} song={song} onVote={onVote} />)
//             ) : (
//                 <motion.div className="empty-queue-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                     Nothing in the queue.
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     </section>
// );

// function RoomPage() {
//     const { roomCode } = useParams();
//     const [nowPlaying, setNowPlaying] = useState(initialNowPlaying);
//     const [queue, setQueue] = useState([]);
//     const [userCount, setUserCount] = useState(1);
//     const [toast, setToast] = useState(null);
//     const [winner, setWinner] = useState(null);
//     const [isFinalizing, setIsFinalizing] = useState(false);

//     const showToast = (message, type = 'info') => {
//         setToast({ id: Date.now(), message, type });
//     };

//     const finalizeWinner = async () => {
//         if (isFinalizing) return;
//         setIsFinalizing(true);
//         try {
//             const res = await axios.post('${BASE_URL}/api/songs/finalize', { roomCode });
//             if (res.data && res.data.song) {
//                 setWinner(res.data.song);
//             } else {
//                 showToast("No winner could be determined", "error");
//             }
//         } catch (err) {
//             console.error("Error finalizing winner:", err.message);
//             showToast("Error finalizing vote.", "error");
//         } finally {
//             setIsFinalizing(false);
//         }
//     };

//     useEffect(() => {
//         if (winner) {
//             setNowPlaying(winner);
//             const timer = setTimeout(() => {
//                 setWinner(null);
//                 setQueue(q => q.filter(s => s._id !== winner._id));
//             }, 8000);
//             return () => clearTimeout(timer);
//         }
//     }, [winner]);

//     const handleVote = useCallback(async (songId) => {
//         try {
//             const res = await axios.post('${BASE_URL}/api/songs/vote', { songId });
//             if (res.data && res.data.song) {
//                 setQueue(q => q.map(song =>
//                     song._id === songId ? { ...song, voteCount: res.data.song.voteCount } : song
//                 ));
//                 showToast("Vote counted!", "success");
//             }
//         } catch (err) {
//             console.error("Vote error:", err.message);
//             showToast("Failed to register vote.", "error");
//         }
//     }, []);

//   const handleAddSong = useCallback(async (songData) => {
//     try {
//         const platform = songData.platform || "Spotify";
//         let platformLink = songData.platformLink;

//         // ✅ Construct platformLink if missing
//         if (!platformLink && platform.toLowerCase() === "spotify" && songData.id) {
//             platformLink = `https://open.spotify.com/track/${songData.id}`;
//         }

//         const payload = {
//             title: songData.title,
//             artist: songData.artist || "Unknown Artist",
//             thumbnail: songData.thumbnail,
//             platform,
//             platformLink,
//             roomCode,
//             submittedBy: "Anonymous"
//         };

//         console.log("Submitting song payload:", payload);

//         const res = await axios.post('${BASE_URL}/api/songs/submit', payload);
//         if (res.data && res.data.song) {
//             setQueue(q => [...q, res.data.song]);
//             showToast(`${res.data.song.title} added!`, "success");
//         }
//     } catch (err) {
//         console.error("Submit error:", err.message);
//         showToast("Failed to add song.", "error");
//     }
// }, [roomCode]);

//     const sortedQueue = [...queue].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setUserCount(c => c + (Math.random() > 0.5 ? 1 : -1) || 1);
//         }, 5000);
//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <>
//             <VoteWinnerModal winner={winner} onClose={() => setWinner(null)} />
//             <div className="room-page-container">
//                 <AnimatePresence>
//                     {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//                 </AnimatePresence>
//                 <RoomHeader roomCode={roomCode} userCount={userCount} />
//                 <main className="room-content">
//                     <div className="main-panel">
//                         <NowPlaying song={nowPlaying} />
//                         <SongSearch onAddSong={handleAddSong} />
//                         <div className="finalize-section">
//                             <button
//                                 className="finalize-button"
//                                 onClick={finalizeWinner}
//                                 disabled={isFinalizing || queue.length === 0}
//                             >
//                                 {isFinalizing ? 'Finalizing...' : '👑 Finalize Vote'}
//                             </button>
//                         </div>
//                     </div>
//                     <aside className="side-panel">
//                         <VoteQueue songs={sortedQueue} onVote={handleVote} />
//                     </aside>
//                 </main>
//             </div>
//         </>
//     );
// }

// export default RoomPage;








// import React, { useState, useEffect, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import io from 'socket.io-client';
// import SongSearch from './SongSearch';
// import VoteWinnerModal from './WinnerModal';
// import RoomHeader from './RoomHeader';
// import './SongCard.css';
// const BASE_URL = process.env.REACT_APP_BACKEND_URL;


// const socket = io(`${BASE_URL}`); // Adjust URL as needed

// const initialNowPlaying = {
//     title: "Waiting for next song...",
//     artist: "BeatVote",
//     thumbnail: "https://placehold.co/120x120/0d0d0d/ffffff?text=?"
// };

// const Toast = ({ message, type, onClose }) => {
//     useEffect(() => {
//         const timer = setTimeout(onClose, 3000);
//         return () => clearTimeout(timer);
//     }, [onClose]);

//     return (
//         <motion.div
//             className={`toast ${type}`}
//             initial={{ y: -100, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -100, opacity: 0 }}
//             layout
//         >
//             {message}
//         </motion.div>
//     );
// };


// const NowPlaying = ({ song }) => {
//     if (!song || !song.thumbnail) return <div className="now-playing-empty">Queue is empty. Add a song!</div>;
//     return (
//         <motion.section
//             className="now-playing-section"
//             key={song._id || song.title}
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.7 }}
//         >
//             <div className="now-playing-bg-pulse" />
//             <div className="now-playing-content">
//                 <img src={song.thumbnail} alt={song.title} className="now-playing-thumbnail" />
//                 <div className="now-playing-details">
//                     <span className="now-playing-label">NOW PLAYING</span>
//                     <h3 className="now-playing-title">{song.title}</h3>
//                     <p className="now-playing-artist">{song.artist}</p>
//                 </div>
//             </div>
//         </motion.section>
//     );
// };

// const SongCard = ({ song, onVote }) => (
//     <motion.div
//         className="song-card"
//         layout
//         initial={{ opacity: 0, y: 50, scale: 0.8 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         exit={{ opacity: 0, x: -50, scale: 0.8 }}
//         transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//     >
//         <img src={song.thumbnail} alt={song.title} className="song-thumbnail" />
//         <div className="song-details">
//             <p className="song-title">{song.title}</p>
//             <p className="song-artist">{song.artist}</p>
//         </div>
//         <div className="vote-actions">
//             <motion.button whileTap={{ scale: 0.9 }} className="vote-btn" onClick={() => onVote(song._id, 1)}>👍</motion.button>
//             <span className="vote-count">{song.voteCount || 0}</span>
//         </div>
//     </motion.div>
// );

// const VoteQueue = ({ songs, onVote }) => (
//     <section className="vote-queue-section">
//         <h3 className="section-title">Voting Queue</h3>
//         <AnimatePresence>
//             {songs.length > 0 ? (
//                 songs.map(song => <SongCard key={song._id} song={song} onVote={onVote} />)
//             ) : (
//                 <motion.div className="empty-queue-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                     Nothing in the queue.
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     </section>
// );

// function RoomPage() {
//     const { roomCode } = useParams();
//     const [nowPlaying, setNowPlaying] = useState(initialNowPlaying);
//     const [queue, setQueue] = useState([]);
//     const [userCount, setUserCount] = useState(1);
//     const [toast, setToast] = useState(null);
//     const [winner, setWinner] = useState(null);
//     const [isFinalizing, setIsFinalizing] = useState(false);
//     const [isVotingActive, setIsVotingActive] = useState(false);


//     const showToast = useCallback((message, type = 'info') => {
//         setToast({ id: Date.now(), message, type });
//     }, []);

//     const finalizeWinner = useCallback(async () => {
//         if (isFinalizing) return;
//         setIsFinalizing(true);
//         try {
//             const res = await axios.post(`${BASE_URL}/api/songs/finalize`, { roomCode });
//             if (res.data && res.data.song) {
//                 setWinner(res.data.song);
//                 socket.emit("winnerFinalized", { roomCode, song: res.data.song });
//             } else {
//                 showToast("No winner could be determined", "error");
//             }
//         } catch (err) {
//             console.error("Error finalizing winner:", err.message);
//             showToast("Error finalizing vote.", "error");
//         } finally {
//             setIsFinalizing(false);
//         }
//     }, [isFinalizing, roomCode, showToast]);

//    useEffect(() => {
//     if (winner) {
//         setNowPlaying(winner);
//         const timer = setTimeout(() => {
//             setWinner(null);
//             setQueue(q => q.filter(s => s._id !== winner._id));
//             setIsVotingActive(false); // ✅ Stop voting loop
//         }, 8000);
//         return () => clearTimeout(timer);
//     }
// }, [winner]);


//     const handleVote = useCallback(async (songId) => {
//         try {
//             const res = await axios.post(`${BASE_URL}/api/songs/vote`, { songId });
//             if (res.data && res.data.song) {
//                 setQueue(q => q.map(song =>
//                     song._id === songId ? { ...song, voteCount: res.data.song.voteCount } : song
//                 ));
//                 showToast("Vote counted!", "success");
//                 socket.emit("voteUpdated", { roomCode, song: res.data.song });

//                 socket.emit("voteStarted", { roomCode });
//             }
//         } catch (err) {
//             console.error("Vote error:", err.message);
//             showToast("Failed to register vote.", "error");
//         }
//     }, [roomCode, showToast]);
//     const username = localStorage.getItem('username') || 'Anonymous';


//     const handleAddSong = useCallback(async (songData) => {
//         try {
//             const platform = songData.platform || "Spotify";
//             let platformLink = songData.platformLink;

//             if (!platformLink && platform.toLowerCase() === "spotify" && songData.id) {
//                 platformLink = `https://open.spotify.com/track/${songData.id}`;
//             }

//             const payload = {
//                 title: songData.title,
//                 artist: songData.artist || "Unknown Artist",
//                 thumbnail: songData.thumbnail,
//                 platform,
//                 platformLink,
//                 roomCode,
//                 submittedBy: "Anonymous"
//             };

//             console.log("Submitting song payload:", payload);

//             const res = await axios.post(`${BASE_URL}/api/songs/submit`, payload);
//             if (res.data && res.data.song) {
//                 setQueue(q => [...q, res.data.song]);
//                 showToast(`${res.data.song.title} added!`, "success");
//                 socket.emit("songAdded", { roomCode, song: res.data.song });
//             }
//         } catch (err) {
//             console.error("Submit error:", err.message);
//             showToast("Failed to add song.", "error");
//         }
//     }, [roomCode, showToast]);

//     const sortedQueue = [...queue].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));

//     // SOCKET.IO SETUP
//     useEffect(() => {
//         socket.emit("joinRoom", roomCode);
//         socket.emit("userJoined", { roomCode, username });
// socket.on("userJoined", ({ username }) => {
//     showToast(`${username} joined the room 🎉`, "info");
// });


//         socket.on("songAdded", ({ song }) => {
//             setQueue(q => [...q, song]);
//             showToast(`${song.title} added (live)!`, "info");
//         });

//         socket.on("voteUpdated", ({ song }) => {
//             setQueue(q =>
//                 q.map(s => (s._id === song._id ? { ...s, voteCount: song.voteCount } : s))
//             );
//         });

//         socket.on("winnerFinalized", ({ song }) => {
//             setWinner(song);
//         });

//         socket.on("userCountUpdate", count => {
//             setUserCount(count);
//         });

//         socket.on("voteStarted", () => {
//   setIsVotingActive(true);
//   setCountdown(VOTE_DURATION);
//   showToast("Voting started (live)!", "info");
// });


//         return () => {
//             socket.emit("leaveRoom", roomCode);
//             socket.off("songAdded");
//             socket.off("voteUpdated");
//             socket.off("winnerFinalized");
//             socket.off("userCountUpdate");
//             socket.off("userJoined");
//         };
//     }, [roomCode, showToast, username]);

//     const VOTE_DURATION = 30; // seconds

// const [countdown, setCountdown] = useState(VOTE_DURATION);

// useEffect(() => {
//     if (!isVotingActive || queue.length === 0 || winner) {
//         setCountdown(VOTE_DURATION); // reset or pause
//         return;
//     }

//     const interval = setInterval(() => {
//         setCountdown(prev => {
//             if (prev <= 1) {
//                 clearInterval(interval);
//                 finalizeWinner();
//                 return VOTE_DURATION;
//             }
//             return prev - 1;
//         });
//     }, 1000);

//     return () => clearInterval(interval);
// }, [finalizeWinner, queue, winner, isVotingActive]);

//     return (
//         <>
//             <VoteWinnerModal winner={winner} onClose={() => setWinner(null)} />
//             <div className="room-page-container">
//                 <AnimatePresence>
//                     {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//                 </AnimatePresence>
//                 <RoomHeader roomCode={roomCode} userCount={userCount} />
//                 <main className="room-content">
//                     <div className="main-panel">
//                         <NowPlaying song={nowPlaying} />
//                         <SongSearch onAddSong={handleAddSong} />
//                       <div className="finalize-section">
//                         {!isVotingActive ? (
//                       <button className="start-btn" onClick={() => {
//                         setIsVotingActive(true);
//                         setCountdown(VOTE_DURATION);
//                         showToast("Voting started!", "info");
//                      }}>
//       🎵                 Start Voting
//                      </button>
//                      ) : (
//                      <div className="timer-box">
//                      ⏳ Voting ends in: <strong>{countdown}s</strong>
//                     </div>
//                      )}
//                      </div>


//                     </div>
//                     <aside className="side-panel">
//                         <VoteQueue songs={sortedQueue} onVote={handleVote} />
//                     </aside>
//                 </main>
//             </div>
//         </>
//     );
// }

// export default RoomPage;























import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import SongSearch from './SongSearch';
import VoteWinnerModal from './WinnerModal';
import RoomHeader from './RoomHeader';
import './SongCard.css';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const socket = io(BASE_URL);

const initialNowPlaying = {
  title: "Waiting for next song...",
  artist: "BeatVote",
  thumbnail: "https://placehold.co/120x120/0d0d0d/ffffff?text=?"
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className={`toast ${type}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      layout
    >
      {message}
    </motion.div>
  );
};

const NowPlaying = ({ song }) => {
  if (!song || !song.thumbnail) return <div className="now-playing-empty">Queue is empty. Add a song!</div>;
  return (
    <motion.section
      className="now-playing-section"
      key={song._id || song.title}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="now-playing-bg-pulse" />
      <div className="now-playing-content">
        <img src={song.thumbnail} alt={song.title} className="now-playing-thumbnail" />
        <div className="now-playing-details">
          <span className="now-playing-label">NOW PLAYING</span>
          <h3 className="now-playing-title">{song.title}</h3>
          <p className="now-playing-artist">{song.artist}</p>
        </div>
      </div>
    </motion.section>
  );
};

const SongCard = ({ song, onVote, disabled }) => (
  <motion.div
    className="song-card"
    layout
    initial={{ opacity: 0, y: 50, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, x: -50, scale: 0.8 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
  >
    <img src={song.thumbnail} alt={song.title} className="song-thumbnail" />
    <div className="song-details">
      <p className="song-title">{song.title}</p>
      <p className="song-artist">{song.artist}</p>
    </div>
    <div className="vote-actions">
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="vote-btn"
        disabled={disabled}
        onClick={() => onVote(song._id)}
      >
        👍
      </motion.button>
      <span className="vote-count">{song.voteCount || 0}</span>
    </div>
  </motion.div>
);

const VoteQueue = ({ songs, onVote, disabled }) => (
  <section className="vote-queue-section">
    <h3 className="section-title">Voting Queue</h3>
    <AnimatePresence>
      {songs.length > 0 ? (
        songs.map(song => <SongCard key={song._id} song={song} onVote={onVote} disabled={disabled} />)
      ) : (
        <motion.div className="empty-queue-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Nothing in the queue.
        </motion.div>
      )}
    </AnimatePresence>
  </section>
);

function RoomPage() {
  const { roomCode } = useParams();
  const [nowPlaying, setNowPlaying] = useState(initialNowPlaying);
  const [queue, setQueue] = useState([]);
  const [userCount, setUserCount] = useState(1);
  const [toast, setToast] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isVotingActive, setIsVotingActive] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const VOTE_DURATION = 30;
  const username = localStorage.getItem('username') || 'Anonymous';

  const showToast = useCallback((message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  const finalizeWinner = useCallback(async () => {
    if (isFinalizing) return;
    setIsFinalizing(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/songs/finalize`, { roomCode });
      if (res.data?.song) {
        setWinner(res.data.song);
        socket.emit("winnerFinalized", { roomCode, song: res.data.song });
      } else {
        showToast("No winner could be determined", "error");
      }
    } catch (err) {
      console.error("Error finalizing winner:", err.message);
      showToast("Error finalizing vote.", "error");
    } finally {
      setIsFinalizing(false);
    }
  }, [isFinalizing, roomCode, showToast]);

  useEffect(() => {
    if (winner) {
      setNowPlaying(winner);
      const timer = setTimeout(() => {
        setWinner(null);
        setQueue(q => q.filter(s => s._id !== winner._id));
        setIsVotingActive(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [winner]);

  const handleVote = useCallback(async (songId) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/songs/vote`, { songId });
      if (res.data?.song) {
        setQueue(q => q.map(song =>
          song._id === songId ? { ...song, voteCount: res.data.song.voteCount } : song
        ));
        showToast("Vote counted!", "success");
        socket.emit("voteUpdated", { roomCode, song: res.data.song });
      }
    } catch (err) {
      console.error("Vote error:", err.message);
      showToast("Failed to register vote.", "error");
    }
  }, [roomCode, showToast]);

  const handleAddSong = useCallback(async (songData) => {
    try {
      const platform = songData.platform || "Spotify";
      let platformLink = songData.platformLink;

      if (!platformLink && platform.toLowerCase() === "spotify" && songData.id) {
        platformLink = `https://open.spotify.com/track/${songData.id}`;
      }

      const payload = {
        title: songData.title,
        artist: songData.artist || "Unknown Artist",
        thumbnail: songData.thumbnail,
        platform,
        platformLink,
        roomCode,
        submittedBy: username
      };

      const res = await axios.post(`${BASE_URL}/api/songs/submit`, payload);
      if (res.data?.song) {
        setQueue(q => [...q, res.data.song]);
        showToast(`${res.data.song.title} added!`, "success");
        socket.emit("songAdded", { roomCode, song: res.data.song });
      }
    } catch (err) {
      console.error("Submit error:", err.message);
      showToast("Failed to add song.", "error");
    }
  }, [roomCode, showToast, username]);

  useEffect(() => {
    if (!isVotingActive || queue.length === 0 || winner) {
      setCountdown(VOTE_DURATION);
      return;
    }

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          finalizeWinner();
          return VOTE_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [finalizeWinner, queue, winner, isVotingActive]);

  useEffect(() => {
    socket.emit("joinRoom", roomCode);
    socket.emit("userJoined", { roomCode, username });

    socket.on("userJoined", ({ username }) => {
      showToast(`${username} joined the room 🎉`, "info");
    });

    socket.on("songAdded", ({ song }) => {
      setQueue(q => [...q, song]);
      showToast(`${song.title} added (live)!`, "info");
    });

    socket.on("voteUpdated", ({ song }) => {
      setQueue(q => q.map(s => (s._id === song._id ? { ...s, voteCount: song.voteCount } : s)));
    });

    socket.on("winnerFinalized", ({ song }) => {
      setWinner(song);
    });

    socket.on("userCountUpdate", count => {
      setUserCount(count);
    });

   socket.on("voteStarted", () => {
  setIsVotingActive(true);
  setCountdown(VOTE_DURATION);
  showToast("Voting started (live)!", "info");
});


    return () => {
      socket.emit("leaveRoom", roomCode);
      socket.off("songAdded");
      socket.off("voteUpdated");
      socket.off("winnerFinalized");
      socket.off("userCountUpdate");
      socket.off("userJoined");
      socket.off("voteStarted");
    };
  }, [roomCode, showToast, username]);

  return (
    <>
      <VoteWinnerModal winner={winner} onClose={() => setWinner(null)} />
      <div className="room-page-container">
        <AnimatePresence>
          {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AnimatePresence>
        <RoomHeader roomCode={roomCode} userCount={userCount} />
        <main className="room-content">
          <div className="main-panel">
            <NowPlaying song={nowPlaying} />
            <SongSearch onAddSong={handleAddSong} />
            <div className="finalize-section">
              {!isVotingActive ? (
               <button
  className="start-btn"
  onClick={() => {
    socket.emit("voteStarted", { roomCode });
  }}
>
  🎵 Start Voting
</button>

              ) : (
                <div className="timer-box">
                  ⏳ Voting ends in: <strong>{countdown}s</strong>
                </div>
              )}
            </div>
          </div>
          <aside className="side-panel">
            <VoteQueue songs={queue.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))} onVote={handleVote} disabled={!isVotingActive} />
          </aside>
        </main>
      </div>
    </>
  );
}

export default RoomPage;


