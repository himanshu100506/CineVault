import { useGenres } from '../context/GenresContext.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';

const YEAR_MS = 365 * 24 * 3600 * 1000;

export default function MovieCard({ item, onOpen }) {
    const genres = useGenres();
    const { get, toggle } = useLibrary();
    const inList = Boolean(get(item.key).watchlist);

    const genre = genres[item.genreIds?.[0]] || '';
    const isTop = item.rating >= 8 && item.votes >= 1500;
    const isNew = item.releaseDate && Date.now() - new Date(item.releaseDate).getTime() < YEAR_MS &&
        new Date(item.releaseDate).getTime() <= Date.now();

    return (
        <div className="movie-card" onClick={() => onOpen(item)}>
            <div className="card-poster">
                {item.poster ? (
                    <img src={item.poster} alt={item.title} loading="lazy" />
                ) : (
                    <div className="poster-fallback">{item.title}</div>
                )}
                <div className="card-badges">
                    {isTop && <span className="badge badge-top">Top Rated</span>}
                    {isNew && <span className="badge badge-new">New</span>}
                </div>
                <div className="card-overlay">
                    <div className="card-actions">
                        <button className="card-btn primary view-details" onClick={(e) => { e.stopPropagation(); onOpen(item); }}>
                            <i className="fas fa-info-circle"></i> Details
                        </button>
                        <button
                            className={`card-btn secondary toggle-watchlist${inList ? ' favorited' : ''}`}
                            onClick={(e) => { e.stopPropagation(); toggle(item, 'watchlist'); }}
                        >
                            <i className={`fas fa-${inList ? 'check' : 'plus'}`}></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-info">
                <h3 className="card-title" title={item.title}>{item.title}</h3>
                <div className="card-meta">
                    <span
                        className="card-rating"
                        data-tooltip={item.votes ? `TMDB rating · ${item.votes.toLocaleString()} votes` : 'No ratings yet'}
                    >
                        <i className="fas fa-star"></i> {item.rating ? item.rating.toFixed(1) : 'NR'}
                    </span>
                    <span>{item.year || '—'}</span>
                    <span>{item.mediaType === 'tv' ? 'Series' : 'Movie'}</span>
                </div>
                <p className="card-genre">{genre}</p>
                <div className="rating-bar">
                    <div className="rating-fill" style={{ width: `${item.rating * 10}%` }}></div>
                </div>
            </div>
        </div>
    );
}
