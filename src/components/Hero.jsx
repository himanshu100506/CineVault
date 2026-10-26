import { useEffect, useState } from 'react';
import { useAsync } from '../hooks/useAsync.js';
import { getStats, getTrending } from '../api/tmdb.js';

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const fmt = (n) => (n ? `${compact.format(n)}+` : '—');

export default function Hero() {
    const trending = useAsync(getTrending, []);
    const stats = useAsync(getStats, []);
    const [current, setCurrent] = useState(0);

    // real backdrops of this week's trending titles
    const slides = (trending.data || []).filter((i) => i.backdrop).slice(0, 5).map((i) => i.backdrop);

    useEffect(() => {
        if (slides.length < 2) return;
        const id = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
        return () => clearInterval(id);
    }, [slides.length]);

    const s = stats.data;
    return (
        <section className="hero" id="home">
            <div className="hero-slider">
                {slides.map((src, i) => (
                    <div key={src} className={`hero-slide${i === current ? ' active' : ''}`} style={{ backgroundImage: `url(${src})` }} />
                ))}
            </div>
            <div className="hero-content">
                <h1 className="hero-title">Discover Your Next <span>Favorite</span></h1>
                <p className="hero-subtitle">Explore movies and web series from Hollywood, Bollywood and beyond — with real ratings</p>
                <div className="hero-buttons">
                    <a href="#trending" className="btn btn-primary"><i className="fas fa-fire"></i> Explore Trending</a>
                    <a href="#watchlist" className="btn btn-secondary"><i className="fas fa-play"></i> My Watchlist</a>
                </div>
                <div className="hero-stats">
                    <div className="stat"><span className="stat-number">{fmt(s?.movies)}</span><span className="stat-label">Movies</span></div>
                    <div className="stat"><span className="stat-number">{fmt(s?.series)}</span><span className="stat-label">Web Series</span></div>
                    <div className="stat"><span className="stat-number">{fmt(s?.bollywood)}</span><span className="stat-label">Bollywood Films</span></div>
                </div>
            </div>
            <div className="hero-overlay"></div>
        </section>
    );
}
