import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HashRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Loader2, Grid2X2, Library, FolderOpen, Music2, CircleHelp, CircleAlert, House, UserRound } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Suporte from './pages/Suporte';
import LanguageSwitcher from './components/LanguageSwitcher';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import './styles.css';

type NavItem = { to: string; labelKey: 'navigation.generator' | 'navigation.library' | 'navigation.presets' | 'navigation.chords' | 'navigation.faq' | 'navigation.support'; icon: typeof Grid2X2 };

const navItems: NavItem[] = [
  { to: '/generator', labelKey: 'navigation.generator', icon: Grid2X2 },
  { to: '/library', labelKey: 'navigation.library', icon: Library },
  { to: '/presets', labelKey: 'navigation.presets', icon: FolderOpen },
  { to: '/chords', labelKey: 'navigation.chords', icon: Music2 },
  { to: '/faq', labelKey: 'navigation.faq', icon: CircleHelp },
  { to: '/suporte', labelKey: 'navigation.support', icon: CircleAlert },
];

function normalizeLegacyHash() {
  if (typeof window === 'undefined') return;

  const legacyRoute = window.location.hash.replace(/^#\/?/, '');
  const knownRoutes = ['home', 'generator', 'library', 'presets', 'chords', 'profile', 'faq', 'report', 'suporte'];
  if (!legacyRoute || !knownRoutes.includes(legacyRoute) || window.location.hash.startsWith('#/')) return;

  const nextRoute = legacyRoute === 'home' ? '/' : legacyRoute === 'report' ? '/suporte' : `/${legacyRoute}`;
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${nextRoute}`);
}

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
              <Route path="/generator" element={<Dashboard />} />
              <Route path="/suporte" element={<Suporte />} />
              <Route path="/report" element={<Navigate to="/suporte" replace />} />
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
  const { t } = useLanguage();
  const pageKey = location.pathname === '/' ? 'home' : location.pathname.slice(1);
  const validPageKey = ['home', 'generator', 'library', 'presets', 'chords', 'profile', 'faq', 'support'].includes(pageKey) ? pageKey : 'home';
  const content = {
    eyebrow: t(`page.${validPageKey}.eyebrow` as Parameters<typeof t>[0]),
    title: t(`page.${validPageKey}.title` as Parameters<typeof t>[0]),
    description: t(`page.${validPageKey}.description` as Parameters<typeof t>[0]),
  };

  return (
    <section className="page-card">
      <p className="eyebrow">{content.eyebrow}</p>
      <h1>{content.title}</h1>
      <p className="page-description">{content.description}</p>
      <div className="page-placeholder">
        <span className="placeholder-dot" />
        <strong>{t(location.pathname === '/' ? 'page.placeholder.home' : 'page.placeholder.module')}</strong>
        <span>{t('page.placeholder.routes')}</span>
      </div>
    </section>
  );
}

function Sidebar() {
  const location = useLocation();
  const { t } = useLanguage();
  return (
    <aside className="spa-sidebar">
      <Link to="/" className="spa-brand">
        <span className="brand-mark">F</span>
        <span><strong>Fagulha</strong><small>{t('brand.tagline')}</small></span>
      </Link>
      <nav aria-label={t('navigation.label')}>
        <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}><House size={15} /> {t('navigation.home')}</Link>
        {navItems.map(({ to, labelKey, icon: Icon }) => (
          <Link key={to} to={to} className={location.pathname === to ? 'nav-link active' : 'nav-link'}><Icon size={15} /> {t(labelKey)}</Link>
        ))}
      </nav>
      <Link to="/profile" className={location.pathname === '/profile' ? 'profile-link active' : 'profile-link'}><UserRound size={15} /> {t('navigation.profile')}</Link>
      <LanguageSwitcher />
    </aside>
  );
}

export default function App() {
  normalizeLegacyHash();

  return (
    <LanguageProvider>
      <HashRouter>
        <div className="spa-app">
          <Sidebar />
          <AnimatedRoutes />
        </div>
      </HashRouter>
    </LanguageProvider>
  );
}
