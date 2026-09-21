import { useEffect, useState } from 'react';
import { LogIn, LogOut, UserRound } from 'lucide-react';
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider, type User } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function AuthControls() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  const handleSignIn = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      await signOut(auth);
    } finally {
      setLoading(false);
    }
  };

  if (!auth) return <span className="auth-status"><UserRound size={14} /> Visitante</span>;
  if (user) return <button type="button" className="auth-control" onClick={handleSignOut} disabled={loading}><LogOut size={14} /> {loading ? 'Saindo...' : 'Sair da conta'}</button>;
  return <button type="button" className="auth-control" onClick={handleSignIn} disabled={loading}><LogIn size={14} /> {loading ? 'Entrando...' : 'Entrar com Google'}</button>;
}
