import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';

export default function Navbar({ query, onQueryChange }) {
    const { user, openAuth, logout } = useAuth();
    const { all } = useLibrary();
    const watchlistCount = all.filter((e) => e.watchlist).length;

    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const searchRef = useRef(null);
    const userMenuRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 100);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const onClick = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
        };
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, []);

    const toggleSearch = () => {
        const next = !searchOpen;
        setSearchOpen(next);
        if (next) searchRef.current?.focus();
    };
    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
            <div className="nav-container">
                <a href="#" className="logo"><i className="fas fa-film"></i> CineVault</a>

                <div className={`nav-links${menuOpen ? ' active' : ''}`}>
                    <a href="#home" className="nav-link active" onClick={closeMenu}>Home</a>
                    <a href="#trending" className="nav-link" onClick={closeMenu}>Trending</a>
                    <a href="#hollywood" className="nav-link" onClick={closeMenu}>Hollywood</a>
                    <a href="#bollywood" className="nav-link" onClick={closeMenu}>Bollywood</a>
                    <a href="#webseries" className="nav-link" onClick={closeMenu}>Web Series</a>
                    <a href="#watchlist" className="nav-link" onClick={closeMenu}>
                        <i className="fas fa-heart"></i> Watchlist
                        <span className="watchlist-count">{watchlistCount}</span>
                    </a>
                </div>

                <div className="nav-right">
                    <div className={`search-container${searchOpen ? ' active' : ''}`}>
                        <input
                            ref={searchRef} type="text" className="search-input"
                            placeholder="Search movies, series..."
                            value={query} onChange={(e) => onQueryChange(e.target.value)}
                        />
                        <button className="search-btn" onClick={toggleSearch}><i className="fas fa-search"></i></button>
                    </div>

                    <div className="auth-area">
                        {user ? (
                            <div ref={userMenuRef} className={`user-menu${userMenuOpen ? ' active' : ''}`} style={{ display: 'block' }}>
                                <button className="user-menu-toggle" onClick={() => setUserMenuOpen((o) => !o)}>
                                    <span className="user-avatar">{user.name.charAt(0)}</span>
                                    <span className="user-name">{user.name}</span>
                                    <i className="fas fa-chevron-down"></i>
                                </button>
                                <div className="user-menu-dropdown">
                                    <a href="#watchlist" className="user-menu-item"><i className="fas fa-heart"></i> My Watchlist</a>
                                    <button className="user-menu-item" onClick={() => { setUserMenuOpen(false); logout(); }}>
                                        <i className="fas fa-sign-out-alt"></i> Log Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <button className="btn btn-secondary auth-btn" style={{ display: 'inline-flex' }} onClick={() => openAuth('login')}>Log In</button>
                                <button className="btn btn-primary auth-btn" style={{ display: 'inline-flex' }} onClick={() => openAuth('signup')}>Sign Up</button>
                            </>
                        )}
                    </div>

                    <button className={`hamburger${menuOpen ? ' active' : ''}`} onClick={() => setMenuOpen((o) => !o)}>
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
