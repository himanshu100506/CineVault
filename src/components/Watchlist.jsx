import { useAuth } from '../context/AuthContext.jsx';
import { useLibrary } from '../context/LibraryContext.jsx';
import MovieCard from './MovieCard.jsx';
import SectionHeader from './SectionHeader.jsx';

export default function Watchlist({ onOpen }) {
    const { user, openAuth } = useAuth();
    const { all } = useLibrary();
    const items = all.filter((e) => e.watchlist).map((e) => e.item);

    return (
        <section className="watchlist-section" id="watchlist">
            <div className="container">
                <SectionHeader>
                    <h2 className="section-title"><i className="fas fa-heart"></i> My Watchlist</h2>
                </SectionHeader>

                {!user && (
                    <div className="watchlist-empty" style={{ display: 'block' }}>
                        <i className="fas fa-lock"></i>
                        <h3>Log in to see your watchlist</h3>
                        <p>Create a free account to save movies and series you want to watch!</p>
                        <button className="btn btn-primary" onClick={() => openAuth('login')}>Log In / Sign Up</button>
                    </div>
                )}
                {user && items.length === 0 && (
                    <div className="watchlist-empty" style={{ display: 'block' }}>
                        <i className="fas fa-film"></i>
                        <h3>Your watchlist is empty</h3>
                        <p>Start adding movies and series you want to watch!</p>
                    </div>
                )}
                <div className="cards-grid">
                    {user && items.map((item) => <MovieCard key={item.key} item={item} onOpen={onOpen} />)}
                </div>
            </div>
        </section>
    );
}
