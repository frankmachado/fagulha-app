import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Loader2, Grid2X2, Library, FolderOpen, Music2, CircleHelp, CircleAlert, House, UserRound } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Suporte from './pages/Suporte';
import './styles.css';

type NavItem = { to: string; label: string; icon: typeof Grid2X2 };

const navItems: NavItem[] = [
  { to: '/generator', label: 'Scale Engine', icon: Grid2X2 },
  { to: '/library', label: 'Minhas Fagulhas', icon: Library },
  { to: '/presets', label: 'Presets', icon: FolderOpen },
  { to: '/chords', label: 'Harmonizador', icon: Music2 },
  { to: '/faq', label: 'Dúvidas Frequentes', icon: CircleHelp },
  { to: '/report', label: 'Reportar Problema', icon: CircleAlert },
];

const pageCopy: Record<string, { eyebrow: string; title: string; description: string }> = {
  '/': { eyebrow: 'Studio Hub', title: 'Crie algo que tenha faísca.', description: 'Um espaço para transformar escalas, harmonias e ideias em loops musicais.' },
  '/generator': { eyebrow: 'Scale Engine', title: 'Comece pela tonalidade.', description: 'Monte a base do seu próximo loop com escolhas rápidas e precisas.' },
  '/library': { eyebrow: 'Cloud Library', title: 'Suas fagulhas, reunidas.', description: 'Acesse loops salvos e retome uma ideia quando ela pedir passagem.' },
  '/presets': { eyebrow: 'Curated Packs', title: 'Atalhos com personalidade.', description: 'Escolha um ponto de partida e leve a ideia para o seu território.' },
  '/chords': { eyebrow: 'Harmonizer', title: 'Encontre o acorde certo.', description: 'Explore o campo harmônico da escala ativa sem sair do fluxo.' },
  '/profile': { eyebrow: 'Producer Profile', title: 'Seu espaço de produtor.', description: 'Ajuste sua identidade e preferências do Studio Hub.' },
  '/faq': { eyebrow: 'Quick Guide', title: 'Dúvidas fora do caminho.', description: 'Respostas curtas para manter sua sessão em movimento.' },
  '/report': { eyebrow: 'Studio Support', title: 'Vamos resolver juntos.', description: 'Envie uma solicitação para a equipe do Fagulha.' },
};

function AnimatedRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 240);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return (
    <main className="spa-content">
      {loading ? (
        <div className="route-loader" aria-label="Carregando tela">
          <Loader2 size={28} className="spin" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="route-page"
          >
            <Routes location={location}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/report" element={<Suporte />} />
              <Route path="*" element={<Page />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      )}
    </main>
  );
}

function Page() {
  const location = useLocation();
  const content = pageCopy[location.pathname] ?? pageCopy['/'];

  return (
    <section className="page-card">
      <p className="eyebrow">{content.eyebrow}</p>
      <h1>{content.title}</h1>
      <p className="page-description">{content.description}</p>
      <div className="page-placeholder">
        <span className="placeholder-dot" />
        <strong>{location.pathname === '/' ? 'Seu próximo loop começa aqui.' : 'Módulo pronto para receber o fluxo do Studio.'}</strong>
        <span>Rotas sem recarregar a página.</span>
      </div>
    </section>
  );
}

function Sidebar() {
  const location = useLocation();
  return (
    <aside className="spa-sidebar">
      <Link to="/" className="spa-brand">
        <span className="brand-mark">F</span>
        <span><strong>Fagulha</strong><small>Pro Studio Hub</small></span>
      </Link>
      <nav aria-label="Navegação principal">
        <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}><House size={15} /> Início</Link>
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className={location.pathname === to ? 'nav-link active' : 'nav-link'}><Icon size={15} /> {label}</Link>
        ))}
      </nav>
      <Link to="/profile" className={location.pathname === '/profile' ? 'profile-link active' : 'profile-link'}><UserRound size={15} /> Perfil</Link>
    </aside>
  );
}

export default function App() {
  return (
    <div className="spa-app">
      <Sidebar />
      <AnimatedRoutes />
    </div>
  );
}
