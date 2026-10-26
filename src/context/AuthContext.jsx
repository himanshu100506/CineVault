import { createContext, useCallback, useContext, useState } from 'react';

/*
 * Frontend-only mock authentication (same behaviour as the original script.js).
 * Accounts + session live in localStorage. Passwords are NOT securely hashed -
 * fine for a demo/portfolio project, never for real user data.
 */
const USERS_KEY = 'cinevault_users';
const USER_KEY = 'cinevault_current_user';

const AuthContext = createContext(null);

function read(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
        return fallback;
    }
}

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString(36);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => read(USER_KEY, null));
    const [authModal, setAuthModal] = useState({ open: false, tab: 'login' });

    const openAuth = useCallback((tab = 'login') => setAuthModal({ open: true, tab }), []);
    const closeAuth = useCallback(() => setAuthModal((m) => ({ ...m, open: false })), []);

    const startSession = (current) => {
        localStorage.setItem(USER_KEY, JSON.stringify(current));
        setUser(current);
    };

    // each returns an error message string, or null on success
    const signup = ({ name, email, password }) => {
        if (password.length < 6) return 'Password must be at least 6 characters.';
        const users = read(USERS_KEY, []);
        if (users.some((u) => u.email === email)) return 'An account with that email already exists.';
        users.push({ name, email, passwordHash: simpleHash(password) });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        startSession({ name, email });
        return null;
    };

    const login = ({ email, password }) => {
        const found = read(USERS_KEY, []).find((u) => u.email === email);
        if (!found || found.passwordHash !== simpleHash(password)) return 'Incorrect email or password.';
        startSession({ name: found.name, email: found.email });
        return null;
    };

    const logout = () => {
        localStorage.removeItem(USER_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, authModal, openAuth, closeAuth, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
