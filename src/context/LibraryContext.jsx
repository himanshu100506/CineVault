import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext.jsx';

/*
 * Per-user "film diary": watched / liked / watchlist flags plus the user's own
 * star rating (0.5 - 5). Stored in localStorage under the user's email, so each
 * account has its own library. Each entry keeps a small snapshot of the title so
 * the profile page can render without calling the API again.
 */
const storageKey = (email) => `cinevault_library_${email}`;
const LibraryContext = createContext(null);

function load(email) {
    if (!email) return {};
    try {
        return JSON.parse(localStorage.getItem(storageKey(email))) || {};
    } catch {
        return {};
    }
}

const snapshot = (i) => ({
    key: i.key, id: i.id, mediaType: i.mediaType, title: i.title, year: i.year,
    releaseDate: i.releaseDate, poster: i.poster, rating: i.rating, votes: i.votes,
    genreIds: i.genreIds || [],
});

export function LibraryProvider({ children }) {
    const { user, openAuth } = useAuth();
    const email = user?.email;
    const [entries, setEntries] = useState(() => load(email));
    const ref = useRef(entries);

    useEffect(() => {
        const next = load(email);
        ref.current = next;
        setEntries(next);
    }, [email]);

    const commit = useCallback(
        (next) => {
            ref.current = next;
            setEntries(next);
            if (email) localStorage.setItem(storageKey(email), JSON.stringify(next));
        },
        [email]
    );

    // run `change(entry)` on the item's entry; requires a logged-in user
    const update = useCallback(
        (item, change) => {
            if (!email) {
                openAuth('login');
                return;
            }
            const prev = ref.current[item.key] || { item: snapshot(item) };
            const entry = change({ ...prev, item: snapshot(item) });
            const next = { ...ref.current };
            if (entry.watchlist || entry.watched || entry.liked || entry.rating) next[item.key] = entry;
            else delete next[item.key];
            commit(next);
        },
        [email, openAuth, commit]
    );

    const toggle = (item, flag) =>
        update(item, (e) => {
            const on = !e[flag];
            const out = { ...e, [flag]: on };
            // logging a film as watched takes it off the watchlist (like Letterboxd)
            if (flag === 'watched' && on) out.watchlist = false;
            // un-watching also clears your rating
            if (flag === 'watched' && !on) out.rating = 0;
            return out;
        });

    const rate = (item, value) =>
        update(item, (e) => ({
            ...e,
            rating: value,
            watched: value > 0 ? true : e.watched,
            watchlist: value > 0 ? false : e.watchlist,
        }));

    const get = (key) => entries[key] || {};
    const all = Object.values(entries);

    return (
        <LibraryContext.Provider value={{ entries, all, get, toggle, rate }}>{children}</LibraryContext.Provider>
    );
}

export const useLibrary = () => useContext(LibraryContext);
