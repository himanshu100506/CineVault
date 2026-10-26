import { useEffect } from 'react';
import { useAsync } from '../hooks/useAsync.js';
import { getDetails } from '../api/tmdb.js';
import { useLibrary } from '../context/LibraryContext.jsx';
import Stars, { RatingInput } from './Stars.jsx';
import ErrorState from './ErrorState.jsx';

function runtime(mins) {
    if (!mins) return null;
    const h = Math.floor(mins / 60);
    return h ? `${h}h ${mins % 60}m` : `${mins}m`;
}

function Body({ selected }) {
    const { data: film, loading, error, retry } = useAsync(
        () => getDetails(selected.mediaType, selected.id),
        [selected.mediaType, selected.id]
    );
    const { get, toggle, rate } = useLibrary();

    if (loading) return <div className="modal-loading"><div className="loader-spinner"></div></div>;
    if (error) return <ErrorState error={error} onRetry={retry} />;

    const mine = get(film.key);
    const duration = film.mediaType === 'movie' ? runtime(film.runtime) : `${film.seasons} Seasons • ${film.episodes} Episodes`;

    return (
        <>
            {film.poster ? <img src={film.poster} alt={film.title} className="modal-poster" /> : <div className="modal-poster poster-fallback">{film.title}</div>}
            <div className="modal-info">
                <h2 className="modal-title">{film.title}</h2>
                <div className="modal-meta">
                    {film.year && <span className="modal-meta-item"><i className="fas fa-calendar"></i> {film.year}</span>}
                    {duration && <span className="modal-meta-item"><i className="fas fa-clock"></i> {duration}</span>}
                    {film.genres.length > 0 && <span className="modal-meta-item"><i className="fas fa-film"></i> {film.genres.slice(0, 3).join(', ')}</span>}
                </div>
                <div className="modal-rating">
                    <span className="modal-rating-number">{film.rating ? film.rating.toFixed(1) : 'NR'}</span>
                    <div className="modal-rating-stars">
                        <Stars value={film.rating / 2} />
                        <small className="votes">{film.votes ? `${film.votes.toLocaleString()} ratings on TMDB` : 'No ratings yet'}</small>
                    </div>
                </div>
                {film.directors.length > 0 && (
                    <p className="modal-director">{film.mediaType === 'movie' ? 'Directed by' : 'Created by'} <strong>{film.directors.join(', ')}</strong></p>
                )}
                {film.overview && <p className="modal-description">{film.overview}</p>}
                {film.cast.length > 0 && (
                    <div className="modal-cast">
                        <h4>Cast</h4>
                        <div className="modal-cast-list">{film.cast.map((a) => <span key={a} className="cast-tag">{a}</span>)}</div>
                    </div>
                )}
                {film.platforms.length > 0 && (
                    <div className="modal-platforms">
                        <h4>Available On</h4>
                        <div className="platform-tags">{film.platforms.map((p) => <span key={p} className="platform-tag">{p}</span>)}</div>
                    </div>
                )}
                <div className="my-rating">
                    <h4>{mine.rating ? 'Your rating' : 'Rate it'}</h4>
                    <RatingInput value={mine.rating || 0} onChange={(v) => rate(film, v)} />
                </div>
                <div className="modal-actions">
                    <button className={`btn btn-primary toggle-watchlist${mine.watchlist ? ' on' : ''}`} onClick={() => toggle(film, 'watchlist')}>
                        <i className={`fas fa-${mine.watchlist ? 'check' : 'plus'}`}></i> {mine.watchlist ? 'In Watchlist' : 'Add to Watchlist'}
                    </button>
                    <button className={`btn btn-secondary btn-toggle${mine.watched ? ' on' : ''}`} onClick={() => toggle(film, 'watched')}>
                        <i className="fas fa-eye"></i> {mine.watched ? 'Watched' : 'Mark Watched'}
                    </button>
                    <button className={`btn btn-secondary btn-toggle${mine.liked ? ' on' : ''}`} onClick={() => toggle(film, 'liked')}>
                        <i className="fas fa-thumbs-up"></i> {mine.liked ? 'Liked' : 'Like'}
                    </button>
                    {film.trailerUrl && (
                        <a className="btn btn-secondary" href={film.trailerUrl} target="_blank" rel="noreferrer"><i className="fab fa-youtube"></i> Trailer</a>
                    )}
                </div>
            </div>
        </>
    );
}

export default function DetailModal({ selected, onClose }) {
    useEffect(() => {
        if (!selected) return;
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [selected, onClose]);

    return (
        <div className={`modal${selected ? ' active' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}><i className="fas fa-times"></i></button>
                <div className="modal-body">{selected && <Body key={selected.key} selected={selected} />}</div>
            </div>
        </div>
    );
}
