import { useEffect, useRef, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { LibraryProvider } from './context/LibraryContext.jsx';
import { GenresProvider } from './context/GenresContext.jsx';
import { usePaged } from './hooks/usePaged.js';
import { browseFilters, getBollywood, getHollywood, getSeries, search } from './api/tmdb.js';
import Loader from './components/Loader.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Filters from './components/Filters.jsx';
import SearchResults from './components/SearchResults.jsx';
import Trending from './components/Trending.jsx';
import ScrollRow from './components/ScrollRow.jsx';
import TopRated from './components/TopRated.jsx';
import Watchlist from './components/Watchlist.jsx';
import DetailModal from './components/DetailModal.jsx';
import AuthModal from './components/AuthModal.jsx';
import BackToTop from './components/BackToTop.jsx';
import Footer from './components/Footer.jsx';
import StorageViewer from './components/StorageViewer.jsx';

const EMPTY = { items: [], page: 1, totalPages: 1 };

function Page() {
    const { authModal } = useAuth();
    const [query, setQuery] = useState('');
    const [view, setView] = useState(null); // { kind: 'search', q } | { kind: 'filter', filters } | null
    const [selected, setSelected] = useState(null);
    const resultsRef = useRef(null);
    const scrollOnLoad = useRef(false);

    const results = usePaged(
        (page) => {
            if (!view) return Promise.resolve(EMPTY);
            return view.kind === 'search' ? search(view.q, page) : browseFilters({ ...view.filters, page });
        },
        [view]
    );

    // live search, debounced so we don't call the API on every keystroke
    useEffect(() => {
        const q = query.trim();
        const t = setTimeout(() => {
            if (q.length >= 2) setView({ kind: 'search', q });
            else setView((v) => (v?.kind === 'search' ? null : v));
        }, 400);
        return () => clearTimeout(t);
    }, [query]);

    useEffect(() => {
        if (view?.kind === 'filter' && scrollOnLoad.current) {
            scrollOnLoad.current = false;
            resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [view]);

    useEffect(() => {
        document.body.style.overflow = selected || authModal.open ? 'hidden' : '';
    }, [selected, authModal.open]);

    const applyFilters = (filters) => {
        scrollOnLoad.current = true;
        setView({ kind: 'filter', filters });
    };
    const clear = () => { setQuery(''); setView(null); };
    const closeDetail = () => setSelected(null);
    const open = (item) => setSelected({ key: item.key, id: item.id, mediaType: item.mediaType });

    return (
        <>
            <Loader />
            <Navbar query={query} onQueryChange={setQuery} />
            <Hero />
            <Filters onApply={applyFilters} />
            <SearchResults ref={resultsRef} view={view} results={results} onClear={clear} onOpen={open} />
            <Trending onOpen={open} />
            <ScrollRow id="hollywood" title="Hollywood Movies" icon="star" fetcher={getHollywood} onOpen={open} />
            <ScrollRow id="bollywood" title="Bollywood Movies" icon="star" fetcher={getBollywood} onOpen={open} />
            <ScrollRow id="webseries" title="Popular Web Series" icon="tv" fetcher={getSeries} onOpen={open} />
            <TopRated onOpen={open} />
            <Watchlist onOpen={open} />
            <DetailModal selected={selected} onClose={closeDetail} />
            <AuthModal />
            <BackToTop />
            <StorageViewer />
            <Footer />
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <LibraryProvider>
                <GenresProvider>
                    <Page />
                </GenresProvider>
            </LibraryProvider>
        </AuthProvider>
    );
}
