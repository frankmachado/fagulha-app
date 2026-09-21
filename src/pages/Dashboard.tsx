import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, getDocs, type DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import AudioPlayer from '../components/AudioPlayer';
import { useLanguage } from '../i18n/LanguageContext';

interface FirestoreItem extends DocumentData {
  id: string;
}

export default function Dashboard() {
  const { t } = useLanguage();
  const [data, setData] = useState<FirestoreItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!db) {
        setLoading(false);
        setError(t('dashboard.unavailable'));
        return;
      }

      setLoading(true);
      setError('');

      try {
        const querySnapshot = await getDocs(collection(db, 'chamados'));
        const items = querySnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        if (isMounted) setData(items);
      } catch (loadError) {
        console.error('Erro ao carregar chamados do Firebase:', loadError);
        if (isMounted) setError('Não foi possível carregar os chamados agora.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="page-card dashboard-card">
      <p className="eyebrow">{t('page.home.eyebrow')}</p>
      <h1>{t('page.home.title')}</h1>
      <p className="page-description">{t('page.home.description')}</p>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <span className="dashboard-label">{t('dashboard.auth')}</span>
          <strong>{user ? t('dashboard.greeting', { name: user.displayName || user.email || 'producer' }) : t('dashboard.visitor')}</strong>
          <span>{user ? t('dashboard.authenticated') : t('dashboard.unauthenticated')}</span>
        </div>

        <div className="dashboard-panel">
          <span className="dashboard-label">{t('dashboard.firestore')}</span>
          <strong>{loading ? t('dashboard.loading') : t('dashboard.records', { count: data.length })}</strong>
          <span>{error ? t('dashboard.error') : t('dashboard.query')}</span>
        </div>
      </div>

      <div className="dashboard-section">
        <p className="dashboard-label">{t('dashboard.player')}</p>
        <AudioPlayer
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          title="Demo Master #1"
          artist="Fagulha Session"
        />
      </div>
    </section>
  );
}
