import { useEffect, useState } from 'react';

export default function Loader() {
    const [hidden, setHidden] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setHidden(true), 2000);
        return () => clearTimeout(t);
    }, []);
    return (
        <div className={`loader${hidden ? ' hidden' : ''}`}>
            <div className="loader-content">
                <div className="loader-logo">CineVault</div>
                <div className="loader-spinner"></div>
                <p>Loading your entertainment...</p>
            </div>
        </div>
    );
}
