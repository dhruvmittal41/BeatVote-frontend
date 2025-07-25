import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './SongSearch.css';
const BASE_URL = process.env.REACT_APP_BACKEND_URL;


const SpotifyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.43 17.51c-.22.35-.66.46-.99.24-2.85-1.74-6.35-2.12-10.61-1.16-.42.1-.85-.13-.95-.55-.1-.42.13-.85.55-.95C11.12 14.1 14.99 14.5 18.17 16.4c.33.2.44.64.24.99v.02zm1.12-2.31c-.27.43-.8.56-1.23.28-3.2-1.95-7.97-2.54-11.75-1.39-.5.15-1.02-.19-1.17-.68-.15-.5.19-1.02.68-1.17 4.26-1.28 9.48-.63 13.12 1.52.43.27.56.8.28 1.23v.01zM19.9 12.6c-.32.51-.96.67-1.47.35-3.67-2.22-9.9-2.42-13.82-1.33-.59.16-1.2-.2-1.36-.79-.16-.59.2-1.2.79-1.36C8.84 8.4 15.63 8.61 19.8 11.1c.51.32.67.96.35 1.47v.03z"/>
    </svg>
);

const YouTubeIcon = () => (
    <svg width="24" height="20" viewBox="0 0 28 20" fill="#FF0000" xmlns="http://www.w3.org/2000/svg">
        <path d="M27.373 3.016a3.511 3.511 0 00-2.47-2.47C22.69 0 14 0 14 0S5.31 0 3.103.546A3.511 3.511 0 00.633 3.016C0 5.17 0 10 0 10s0 4.83.633 6.984a3.511 3.511 0 002.47 2.47C5.31 20 14 20 14 20s8.69 0 10.897-.546a3.511 3.511 0 002.47-2.47C28 14.83 28 10 28 10s0-4.83-.627-6.984z"/>
        <path d="M11.197 14.286V5.714L18.49 10l-7.293 4.286z" fill="#FFFFFF"/>
    </svg>
);

// Result Card
const ResultCard = ({ song, onSelect, isSelected }) => (
    <motion.li
        className={`search-result-item ${isSelected ? 'selected' : ''}`}
        onClick={() => onSelect(song)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
    >
        <img src={song.thumbnail} alt={song.title} className="result-thumbnail"/>
        <div className="result-details">
            <p className="result-title">{song.title}</p>
            <p className="result-artist">{song.artist}</p>
        </div>
        <div className="result-source-icon">
            {song.source === 'spotify' ? <SpotifyIcon /> : <YouTubeIcon />}
        </div>
    </motion.li>
);




// Main Component
const SongSearch = ({ onAddSong }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [status, setStatus] = useState('idle');
    const [activeIndex, setActiveIndex] = useState(-1);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        if (query.trim().length < 2) {
            console.log("Query too short:", query);
            setResults([]);
            setStatus('idle');
            return;
        }

        setStatus('loading');
        const debounceTimer = setTimeout(() => {
            const API_ENDPOINT = `${BASE_URL}/api/search/spotify?q=${encodeURIComponent(query)}`;

            axios.get(API_ENDPOINT)
                .then(response => {
                    console.log("Raw API response:", response.data);
                    const apiResults = response.data.results || [];

                    const formattedResults = apiResults.map(track => ({
                        id: track.id,
                        title: track.title,
                        artist: track.artist,
                        thumbnail: track.thumbnail || 'https://placehold.co/80x80/181818/ffffff?text=?',
                        source: track.platform.toLowerCase(),
                    }));

                    console.log("Formatted Results:", formattedResults);
                    setResults(formattedResults);
                    setStatus(formattedResults.length > 0 ? 'success' : 'idle');
                    console.log("Status after setting results:", formattedResults.length > 0 ? 'success' : 'idle');
                })
                .catch(error => {
                    console.error("Spotify search API error:", error);
                    setStatus('error');
                    setResults([]);
                });
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleSelectSong = useCallback((song) => {
        onAddSong(song);
        setQuery("");
        setResults([]);
        setStatus('idle');
        setActiveIndex(-1);
    }, [onAddSong]);

    const handleKeyDown = useCallback((e) => {
        if (status !== 'success' || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && activeIndex < results.length) {
                    handleSelectSong(results[activeIndex]);
                }
                break;
            case 'Escape':
                setQuery('');
                setResults([]);
                break;
            default:
                break;
        }
    }, [activeIndex, results, status, handleSelectSong]);

    const renderStatus = () => {
        console.log("RenderStatus() called. Current status:", status);
        switch (status) {
            case 'loading':
                return <div className="status-message">Searching...</div>;
            case 'error':
                return <div className="status-message error">⚠️ Something went wrong.</div>;
            case 'success':
                console.log("Rendering", results.length, "results");
                return (
                    <motion.ul className="search-results-list">
                        {results.map((song, index) => (
                            <ResultCard
                                key={song.id}
                                song={song}
                                onSelect={handleSelectSong}
                                isSelected={index === activeIndex}
                            />
                        ))}
                    </motion.ul>
                );
            case 'idle':
            default:
                if (query.length > 1 && results.length === 0) {
                    return <div className="status-message">No results found for "{query}".</div>
                }
                return null;
        }
    };

    return (
   <section className="song-search-section upgraded" ref={searchContainerRef} onKeyDown={handleKeyDown}>
  <div className="search-bar-wrapper">
    <input
      type="text"
      className="search-input"
      placeholder="Search for a song or video..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      aria-label="Search for music"
      autoComplete="off"
    />
    {status === 'loading' && <div className="loader"></div>}

    {/* 🔥 Moved inside search-bar-wrapper */}
    <AnimatePresence>
      {(status === 'success' || status === 'error' || (status === 'idle' && query.length > 1 && results.length === 0)) && (
        <motion.div
          className="search-results-dropdown"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderStatus()}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</section>

    );
};

export default SongSearch;
