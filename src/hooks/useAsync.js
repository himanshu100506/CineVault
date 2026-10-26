import { useCallback, useEffect, useRef, useState } from 'react';

// Runs an async function whenever `deps` change; ignores stale responses.
export function useAsync(fn, deps) {
    const [state, setState] = useState({ data: null, error: null, loading: true });
    const [tick, setTick] = useState(0);
    const latest = useRef(0);

    useEffect(() => {
        const id = ++latest.current;
        setState((s) => ({ ...s, loading: true, error: null }));
        fn()
            .then((data) => id === latest.current && setState({ data, error: null, loading: false }))
            .catch((error) => id === latest.current && setState({ data: null, error, loading: false }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, tick]);

    const retry = useCallback(() => setTick((t) => t + 1), []);
    return { ...state, retry };
}
