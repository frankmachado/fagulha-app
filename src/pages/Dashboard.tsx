import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, getDocs, type DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import AudioPlayer from '../components/AudioPlayer';

interface FirestoreItem extends DocumentData {
  id: string;
}

export default function Dashboard() {
  const [data, setData] = useState<FirestoreItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
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
      <p className="eyebrow">Studio Hub</p>
      <h1>Crie algo que tenha faísca.</h1>
      <p className="page-description">Firebase e o player React estão conectados à primeira tela da aplicação.</p>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <span className="dashboard-label">Autenticação</span>
          <strong>{user ? `Olá, ${user.displayName || user.email || 'produtor'}.` : 'Sessão visitante'}</strong>
          <span>{user ? 'Firebase Auth detectou uma sessão ativa.' : 'Nenhum usuário autenticado no momento.'}</span>
        </div>

        <div className="dashboard-panel">
          <span className="dashboard-label">Firestore / chamados</span>
          <strong>{loading ? 'Carregando...' : `${data.length} registro(s)`}</strong>
          <span>{error || 'Consulta concluída na coleção chamados.'}</span>
        </div>
      </div>

      <div className="dashboard-section">
        <p className="dashboard-label">Player de teste</p>
        <AudioPlayer
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          title="Demo Master #1"
          artist="Fagulha Session"
        />
      </div>
    </section>
  );
}
