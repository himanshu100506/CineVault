import { createContext, useContext, useEffect, useState } from 'react';
import { getGenres, hasApiKey } from '../api/tmdb.js';

// id -> name for movie + TV genres, so cards can show a genre label.
const GenresContext = createContext({});

export function GenresProvider({ children }) {
    const [map, setMap] = useState({});
    useEffect(() => {
        if (!hasApiKey) return;
        Promise.all([getGenres('movie'), getGenres('tv')])
            .then(([m, t]) => {
                const out = {};
                [...m, ...t].forEach((g) => { out[g.id] = g.name; });
                setMap(out);
            })
            .catch(() => {});
    }, []);
    return <GenresContext.Provider value={map}>{children}</GenresContext.Provider>;
}

export const useGenres = () => useContext(GenresContext);
