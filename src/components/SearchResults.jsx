import { forwardRef } from 'react';
import MovieCard from './MovieCard.jsx';
import SectionHeader from './SectionHeader.jsx';
import ErrorState from './ErrorState.jsx';
import { CardSkeletons } from './CardRow.jsx';

// view: { kind: 'search' | 'filter' } | null ; results: usePaged() state
const SearchResults = forwardRef(function SearchResults({ view, results, onClear, onOpen }, ref) {
    const empty = !results.loading && !results.error && results.items.length === 0;
    return (
        <section className="search-results" ref={ref} style={{ display: view ? 'block' : 'none' }}>
            <div className="container">
                <SectionHeader>
                    <h2 className="section-title">Search Results</h2>
                    <button className="btn btn-secondary" onClick={onClear}>Clear Search</button>
                </SectionHeader>
                {results.error && <ErrorState error={results.error} onRetry={results.retry} />}
                <div className="cards-grid">
                    {results.items.map((item) => <MovieCard key={item.key} item={item} onOpen={onOpen} />)}
                    {results.loading && <CardSkeletons count={results.items.length ? 4 : 8} />}
                </div>
                {empty && (
                    <p className="no-results">{view?.kind === 'filter' ? 'No results match your filters' : 'No results found'}</p>
                )}
                {!results.loading && results.hasMore && (
                    <div className="load-more"><button className="btn btn-secondary" onClick={results.loadMore}>Load more</button></div>
                )}
            </div>
        </section>
    );
});

export default SearchResults;
