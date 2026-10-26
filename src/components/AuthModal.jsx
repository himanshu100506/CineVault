import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthModal() {
    const { authModal, closeAuth, login, signup } = useAuth();
    const { open, tab: initialTab } = authModal;
    const [tab, setTab] = useState('login');
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    useEffect(() => {
        if (open) {
            setTab(initialTab);
            setError('');
            setForm({ name: '', email: '', password: '' });
        }
    }, [open, initialTab]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && closeAuth();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, closeAuth]);

    const isLogin = tab === 'login';
    const switchTab = (next) => { setError(''); setTab(next); };
    const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const submit = (e) => {
        e.preventDefault();
        const payload = { name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password };
        const err = isLogin ? login(payload) : signup(payload);
        if (err) setError(err);
        else closeAuth();
    };

    return (
        <div className={`modal${open ? ' active' : ''}`} onClick={(e) => e.target === e.currentTarget && closeAuth()}>
            <div className="modal-content auth-modal-content">
                <button className="modal-close" onClick={closeAuth}><i className="fas fa-times"></i></button>
                <div className="auth-body">
                    <div className="auth-tabs">
                        <button className={`auth-tab${isLogin ? ' active' : ''}`} onClick={() => switchTab('login')}>Log In</button>
                        <button className={`auth-tab${!isLogin ? ' active' : ''}`} onClick={() => switchTab('signup')}>Sign Up</button>
                    </div>

                    <p className="auth-error" style={{ display: error ? 'block' : 'none' }}>{error}</p>

                    <form className="auth-form" onSubmit={submit} style={{ display: 'block' }}>
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="signupName">Name</label>
                                <input id="signupName" type="text" placeholder="Your name" required value={form.name} onChange={set('name')} />
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="authEmail">Email</label>
                            <input id="authEmail" type="email" placeholder="you@example.com" required value={form.email} onChange={set('email')} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="authPassword">Password</label>
                            <input id="authPassword" type="password" required value={form.password} onChange={set('password')}
                                placeholder={isLogin ? '••••••••' : 'At least 6 characters'} />
                        </div>
                        <button type="submit" className="btn btn-primary auth-submit">{isLogin ? 'Log In' : 'Create Account'}</button>
                        <p className="auth-switch">
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <a href="#" onClick={(e) => { e.preventDefault(); switchTab(isLogin ? 'signup' : 'login'); }}>
                                {isLogin ? 'Sign up' : 'Log in'}
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
