import MovieCard from './MovieCard.jsx';
import ErrorState from './ErrorState.jsx';

export function CardSkeletons({ count = 6 }) {
    return Array.from({ length: count }, (_, i) => (
        <div key={i} className="movie-card skeleton-card">
            <div className="card-poster skeleton"></div>
            <div className="card-info"><span className="skeleton skeleton-line"></span></div>
        </div>
    ));
}

// renders the cards (or skeleton / error) for a useAsync() state inside any wrapper
export default function CardRow({ state, limit, onOpen, skeletons = 6 }) {
    if (state.loading) return <CardSkeletons count={skeletons} />;
    if (state.error) return <ErrorState error={state.error} onRetry={state.retry} />;
    const items = limit ? state.data.slice(0, limit) : state.data;
    return items.map((item) => <MovieCard key={item.key} item={item} onOpen={onOpen} />);
}
