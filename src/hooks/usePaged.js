import { useCallback, useEffect, useRef, useState } from 'react';

// Paged list with "load more". Restarts from page 1 whenever `deps` change.
export function usePaged(fetchPage, deps) {
    const [state, setState] = useState({ items: [], page: 0, totalPages: 1, loading: true, error: null });
    const latest = useRef(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const run = useCallback((page, reset) => {
        const id = ++latest.current;
        setState((s) => ({ ...s, loading: true, error: null, ...(reset ? { items: [], page: 0 } : {}) }));
        fetchPage(page)
            .then((r) => {
                if (id !== latest.current) return;
                setState((s) => {
                    const merged = reset ? r.items : [...s.items, ...r.items];
                    const seen = new Set();
                    const items = merged.filter((i) => !seen.has(i.key) && seen.add(i.key));
                    return { items, page: r.page, totalPages: r.totalPages, loading: false, error: null };
                });
            })
            .catch((error) => id === latest.current && setState((s) => ({ ...s, loading: false, error })));
    }, deps);

    useEffect(() => {
        run(1, true);
    }, [run]);

    return {
        ...state,
        hasMore: state.page < state.totalPages,
        loadMore: () => run(state.page + 1, false),
        retry: () => run(Math.max(state.page, 1), state.page === 0),
    };
}
