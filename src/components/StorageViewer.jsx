import { useEffect, useState } from 'react';

const PREFIX = 'cinevault_';

function readAll() {
    const out = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key.startsWith(PREFIX)) continue;
        try {
            out[key] = JSON.parse(localStorage.getItem(key));
        } catch {
            out[key] = localStorage.getItem(key);
        }
    }
    return out;
}

// Class-demo helper: shows what the app has saved in the browser's localStorage
// (our "database"). Remove <StorageViewer /> from App.jsx to hide it.
export default function StorageViewer() {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        if (!open) return;
        setData(readAll());
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open]);

    const users = Array.isArray(data.cinevault_users) ? data.cinevault_users : [];
    const session = data.cinevault_current_user;
    const libraries = Object.entries(data)
        .filter(([k]) => k.startsWith('cinevault_library_'))
        .map(([k, v]) => {
            const entries = Object.values(v || {});
            return {
                email: k.replace('cinevault_library_', ''),
                watchlist: entries.filter((e) => e.watchlist).length,
                watched: entries.filter((e) => e.watched).length,
                liked: entries.filter((e) => e.liked).length,
                rated: entries.filter((e) => e.rating > 0).length,
            };
        });

    const clearAll = () => {
        if (!window.confirm('Delete all CineVault accounts and data stored in this browser?')) return;
        Object.keys(readAll()).forEach((k) => localStorage.removeItem(k));
        window.location.reload();
    };

    return (
        <>
            <button className="storage-fab" onClick={() => setOpen(true)} title="View localStorage data">
                <i className="fas fa-database"></i> Storage
            </button>

            <div className={`modal${open ? ' active' : ''}`} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
                <div className="modal-content storage-panel">
                    <button className="modal-close" onClick={() => setOpen(false)}><i className="fas fa-times"></i></button>
                    <h2 className="storage-title"><i className="fas fa-database"></i> Browser Storage (our database)</h2>
                    <p className="storage-note">
                        No backend is used. Everything below is saved in this browser's <strong>localStorage</strong> and
                        stays after a refresh. Passwords are stored as a hash, never as plain text.
                    </p>

                    <h4>Registered accounts ({users.length})</h4>
                    {users.length ? (
                        <table className="storage-table">
                            <thead><tr><th>Name</th><th>Email</th><th>Password (hash)</th></tr></thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.email}><td>{u.name}</td><td>{u.email}</td><td><code>{u.passwordHash}</code></td></tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="storage-empty">No accounts yet — sign up first.</p>
                    )}

                    <h4>Logged-in session</h4>
                    <p className="storage-row">
                        {session ? <><strong>{session.name}</strong> ({session.email})</> : <span className="storage-empty">Nobody is logged in</span>}
                    </p>

                    <h4>Saved libraries</h4>
                    {libraries.length ? (
                        <table className="storage-table">
                            <thead><tr><th>User</th><th>Watchlist</th><th>Watched</th><th>Liked</th><th>Rated</th></tr></thead>
                            <tbody>
                                {libraries.map((l) => (
                                    <tr key={l.email}><td>{l.email}</td><td>{l.watchlist}</td><td>{l.watched}</td><td>{l.liked}</td><td>{l.rated}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="storage-empty">Nothing saved yet — add a title to your watchlist.</p>
                    )}

                    <details className="storage-raw">
                        <summary>Raw localStorage JSON</summary>
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    </details>

                    <div className="storage-actions">
                        <button className="btn btn-secondary" onClick={() => setData(readAll())}><i className="fas fa-rotate"></i> Refresh</button>
                        <button className="btn btn-primary" onClick={clearAll}><i className="fas fa-trash"></i> Clear all data</button>
                    </div>
                </div>
            </div>
        </>
    );
}
