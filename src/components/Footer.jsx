// Footer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const SpotifyLogo = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.43 17.51c-.22.35-.66.46-.99.24-2.85-1.74-6.35-2.12-10.61-1.16-.42.1-.85-.13-.95-.55-.1-.42.13-.85.55-.95C11.12 14.1 14.99 14.5 18.17 16.4c.33.2.44.64.24.99v.02zm1.12-2.31c-.27.43-.8.56-1.23.28-3.2-1.95-7.97-2.54-11.75-1.39-.5.15-1.02-.19-1.17-.68-.15-.5.19-1.02.68-1.17 4.26-1.28 9.48-.63 13.12 1.52.43.27.56.8.28 1.23v.01zM19.9 12.6c-.32.51-.96.67-1.47.35-3.67-2.22-9.9-2.42-13.82-1.33-.59.16-1.2-.2-1.36-.79-.16-.59.2-1.2.79-1.36C8.84 8.4 15.63 8.61 19.8 11.1c.51.32.67.96.35 1.47v.03z" />
    </svg>
);

const YouTubeLogo = () => (
    <svg width="80" height="24" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M27.373 3.016a3.511 3.511 0 00-2.47-2.47C22.69 0 14 0 14 0S5.31 0 3.103.546A3.511 3.511 0 00.633 3.016C0 5.17 0 10 0 10s0 4.83.633 6.984a3.511 3.511 0 002.47 2.47C5.31 20 14 20 14 20s8.69 0 10.897-.546a3.511 3.511 0 002.47-2.47C28 14.83 28 10 28 10s0-4.83-.627-6.984z" fill="#FF0000"/>
        <path d="M11.197 14.286V5.714L18.49 10l-7.293 4.286z" fill="#FFFFFF"/>
    </svg>
);

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section powered-by">
                    <p>Powered by</p>
                    <div className="logos">
                        <SpotifyLogo />
                        <YouTubeLogo />
                    </div>
                </div>

                <div className="footer-section developed-by">
                    <p>
                        Developed by 
                        <a 
                            href="https://www.linkedin.com/in/dhruv-mittal-a701b1330/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="footer-link"
                        > Dhruv Mittal</a>
                    </p>
                </div>

                <div className="footer-section github-link">
                    <motion.a 
                        href="https://github.com/dhruvmittal41" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        whileHover={{ color: '#00ffff' }}
                    >
                        GitHub
                    </motion.a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
