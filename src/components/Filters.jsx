import { useState } from 'react';
import { GENRE_OPTIONS } from '../api/tmdb.js';

export default function Filters({ onApply }) {
    const [genre, setGenre] = useState('all');
    const [type, setType] = useState('all');
    const [rating, setRating] = useState('all');

    return (
        <section className="filters-section">
            <div className="container">
                <div className="filters-wrapper">
                    <div className="filter-group">
                        <label>Genre</label>
                        <select className="filter-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
                            <option value="all">All Genres</option>
                            {GENRE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Type</label>
                        <select className="filter-select" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="all">All Types</option>
                            <option value="movie">Movies</option>
                            <option value="tv">Web Series</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Rating</label>
                        <select className="filter-select" value={rating} onChange={(e) => setRating(e.target.value)}>
                            <option value="all">All Ratings</option>
                            <option value="8">8+ Rating</option>
                            <option value="7">7+ Rating</option>
                            <option value="6">6+ Rating</option>
                        </select>
                    </div>
                    <button className="btn btn-primary filter-btn" onClick={() => onApply({ genre, type, rating })}>
                        <i className="fas fa-filter"></i> Apply
                    </button>
                </div>
            </div>
        </section>
    );
}
