export default function ErrorState({ error, onRetry }) {
    const code = error?.message;
    let title = "Couldn't load this right now";
    let body = 'Check your internet connection and try again.';
    const keyProblem = code === 'MISSING_KEY' || code === 'INVALID_KEY';
    if (code === 'MISSING_KEY') {
        title = 'TMDB API key missing';
        body = 'Create a free key at themoviedb.org/settings/api, put it in a .env file as VITE_TMDB_API_KEY=your_key, then restart npm run dev.';
    } else if (code === 'INVALID_KEY') {
        title = 'TMDB rejected the API key';
        body = 'Double-check VITE_TMDB_API_KEY in your .env file and restart npm run dev.';
    }
    return (
        <div className="state-box">
            <i className="fas fa-triangle-exclamation"></i>
            <h3>{title}</h3>
            <p>{body}</p>
            {!keyProblem && onRetry && <button className="btn btn-secondary" onClick={onRetry}>Try again</button>}
        </div>
    );
}
