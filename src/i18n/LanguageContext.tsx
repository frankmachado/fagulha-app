import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Locale = 'pt-BR' | 'en' | 'es';

type TranslationKey =
  | 'language.label'
  | 'language.ptBR'
  | 'language.en'
  | 'language.es'
  | 'brand.tagline'
  | 'navigation.label'
  | 'navigation.home'
  | 'navigation.generator'
  | 'navigation.library'
  | 'navigation.presets'
  | 'navigation.chords'
  | 'navigation.faq'
  | 'navigation.support'
  | 'navigation.profile'
  | 'page.home.eyebrow'
  | 'page.home.title'
  | 'page.home.description'
  | 'page.generator.eyebrow'
  | 'page.generator.title'
  | 'page.generator.description'
  | 'page.library.eyebrow'
  | 'page.library.title'
  | 'page.library.description'
  | 'page.presets.eyebrow'
  | 'page.presets.title'
  | 'page.presets.description'
  | 'page.chords.eyebrow'
  | 'page.chords.title'
  | 'page.chords.description'
  | 'page.profile.eyebrow'
  | 'page.profile.title'
  | 'page.profile.description'
  | 'page.faq.eyebrow'
  | 'page.faq.title'
  | 'page.faq.description'
  | 'page.support.eyebrow'
  | 'page.support.title'
  | 'page.support.description'
  | 'page.placeholder.home'
  | 'page.placeholder.module'
  | 'page.placeholder.routes'
  | 'dashboard.auth'
  | 'dashboard.greeting'
  | 'dashboard.visitor'
  | 'dashboard.authenticated'
  | 'dashboard.unauthenticated'
  | 'dashboard.firestore'
  | 'dashboard.loading'
  | 'dashboard.records'
  | 'dashboard.query'
  | 'dashboard.error'
  | 'dashboard.unavailable'
  | 'dashboard.player'
  | 'support.emailLabel'
  | 'support.emailPlaceholder'
  | 'support.messageLabel'
  | 'support.messagePlaceholder'
  | 'support.submit'
  | 'support.successTitle'
  | 'support.successDescription'
  | 'support.sendAnother'
  | 'support.error'
  | 'audio.mute'
  | 'audio.unmute'
  | 'audio.progress'
  | 'audio.restart'
  | 'audio.play'
  | 'audio.pause';

const translations: Record<Locale, Record<TranslationKey, string>> = {
  'pt-BR': {
    'language.label': 'Idioma', 'language.ptBR': 'Português', 'language.en': 'English', 'language.es': 'Español',
    'brand.tagline': 'Pro Studio Hub', 'navigation.label': 'Navegação principal', 'navigation.home': 'Início',
    'navigation.generator': 'Scale Engine', 'navigation.library': 'Minhas Fagulhas', 'navigation.presets': 'Presets',
    'navigation.chords': 'Harmonizador', 'navigation.faq': 'Dúvidas Frequentes', 'navigation.support': 'Reportar Problema', 'navigation.profile': 'Perfil',
    'page.home.eyebrow': 'Studio Hub', 'page.home.title': 'Crie algo que tenha faísca.', 'page.home.description': 'Um espaço para transformar escalas, harmonias e ideias em loops musicais.',
    'page.generator.eyebrow': 'Fagulha Engine', 'page.generator.title': 'Comece pela tonalidade.', 'page.generator.description': 'Monte a base do seu próximo loop com escolhas rápidas e precisas.',
    'page.library.eyebrow': 'Biblioteca de Fagulhas', 'page.library.title': 'Suas fagulhas, reunidas.', 'page.library.description': 'Acesse loops salvos e retome uma ideia quando ela pedir passagem.',
    'page.presets.eyebrow': 'Packs Curados', 'page.presets.title': 'Atalhos com personalidade.', 'page.presets.description': 'Escolha um ponto de partida e leve a ideia para o seu território.',
    'page.chords.eyebrow': 'Harmonizador de Campo', 'page.chords.title': 'Encontre o acorde certo.', 'page.chords.description': 'Explore o campo harmônico da escala ativa sem sair do fluxo.',
    'page.profile.eyebrow': 'Perfil do Produtor', 'page.profile.title': 'Seu espaço de produtor.', 'page.profile.description': 'Ajuste sua identidade e preferências do Studio Hub.',
    'page.faq.eyebrow': 'Guia Rápido', 'page.faq.title': 'Dúvidas fora do caminho.', 'page.faq.description': 'Respostas curtas para manter sua sessão em movimento.',
    'page.support.eyebrow': 'Suporte do Studio', 'page.support.title': 'Vamos resolver juntos.', 'page.support.description': 'Envie uma solicitação para a equipe do Fagulha.',
    'page.placeholder.home': 'Seu próximo loop começa aqui.', 'page.placeholder.module': 'Módulo pronto para receber o fluxo do Studio.', 'page.placeholder.routes': 'Rotas sem recarregar a página.',
    'dashboard.auth': 'Autenticação', 'dashboard.greeting': 'Olá, {name}.', 'dashboard.visitor': 'Sessão visitante', 'dashboard.authenticated': 'Firebase Auth detectou uma sessão ativa.', 'dashboard.unauthenticated': 'Nenhum usuário autenticado no momento.',
    'dashboard.firestore': 'Firestore / chamados', 'dashboard.loading': 'Carregando...', 'dashboard.records': '{count} registro(s)', 'dashboard.query': 'Consulta concluída na coleção chamados.', 'dashboard.error': 'Não foi possível carregar os chamados agora.', 'dashboard.unavailable': 'Firebase não está configurado neste ambiente.', 'dashboard.player': 'Player de teste',
    'support.emailLabel': 'Seu e-mail para retorno', 'support.emailPlaceholder': 'nome@fagulha.com', 'support.messageLabel': 'Descrição do problema ou dúvida', 'support.messagePlaceholder': 'Descreva o que está acontecendo...', 'support.submit': 'Enviar chamado', 'support.successTitle': 'Solicitação enviada com sucesso!', 'support.successDescription': 'Nossa equipe retornará o contato em breve.', 'support.sendAnother': 'Enviar outro chamado', 'support.error': 'Ocorreu um erro ao enviar. Tente novamente.',
    'audio.mute': 'Silenciar áudio', 'audio.unmute': 'Ativar som', 'audio.progress': 'Progresso da faixa', 'audio.restart': 'Recomeçar faixa', 'audio.play': 'Reproduzir áudio', 'audio.pause': 'Pausar áudio',
  },
  en: {
    'language.label': 'Language', 'language.ptBR': 'Português', 'language.en': 'English', 'language.es': 'Español',
    'brand.tagline': 'Pro Studio Hub', 'navigation.label': 'Main navigation', 'navigation.home': 'Home',
    'navigation.generator': 'Scale Engine', 'navigation.library': 'My Sparks', 'navigation.presets': 'Presets',
    'navigation.chords': 'Harmonizer', 'navigation.faq': 'Frequently Asked Questions', 'navigation.support': 'Report a Problem', 'navigation.profile': 'Profile',
    'page.home.eyebrow': 'Studio Hub', 'page.home.title': 'Create something with a spark.', 'page.home.description': 'A space to turn scales, harmonies and ideas into musical loops.',
    'page.generator.eyebrow': 'Scale Engine', 'page.generator.title': 'Start with the key.', 'page.generator.description': 'Build the foundation for your next loop with quick, precise choices.',
    'page.library.eyebrow': 'Cloud Library', 'page.library.title': 'Your sparks, gathered.', 'page.library.description': 'Access saved loops and pick up an idea whenever it calls.',
    'page.presets.eyebrow': 'Curated Packs', 'page.presets.title': 'Shortcuts with personality.', 'page.presets.description': 'Choose a starting point and make the idea your own.',
    'page.chords.eyebrow': 'Harmonizer', 'page.chords.title': 'Find the right chord.', 'page.chords.description': 'Explore the active scale harmony without leaving your flow.',
    'page.profile.eyebrow': 'Producer Profile', 'page.profile.title': 'Your producer space.', 'page.profile.description': 'Adjust your identity and Studio Hub preferences.',
    'page.faq.eyebrow': 'Quick Guide', 'page.faq.title': 'Questions out of the way.', 'page.faq.description': 'Short answers to keep your session moving.',
    'page.support.eyebrow': 'Studio Support', 'page.support.title': "Let's solve it together.", 'page.support.description': 'Send a request to the Fagulha team.',
    'page.placeholder.home': 'Your next loop starts here.', 'page.placeholder.module': 'Module ready for the Studio flow.', 'page.placeholder.routes': 'Routes without reloading the page.',
    'dashboard.auth': 'Authentication', 'dashboard.greeting': 'Hello, {name}.', 'dashboard.visitor': 'Guest session', 'dashboard.authenticated': 'Firebase Auth detected an active session.', 'dashboard.unauthenticated': 'No authenticated user at the moment.',
    'dashboard.firestore': 'Firestore / tickets', 'dashboard.loading': 'Loading...', 'dashboard.records': '{count} record(s)', 'dashboard.query': 'Query completed in the tickets collection.', 'dashboard.error': 'Could not load tickets right now.', 'dashboard.unavailable': 'Firebase is not configured in this environment.', 'dashboard.player': 'Test player',
    'support.emailLabel': 'Your reply email', 'support.emailPlaceholder': 'name@fagulha.com', 'support.messageLabel': 'Problem or question description', 'support.messagePlaceholder': 'Describe what is happening...', 'support.submit': 'Send ticket', 'support.successTitle': 'Request sent successfully!', 'support.successDescription': 'Our team will get back to you soon.', 'support.sendAnother': 'Send another ticket', 'support.error': 'Something went wrong. Please try again.',
    'audio.mute': 'Mute audio', 'audio.unmute': 'Unmute audio', 'audio.progress': 'Track progress', 'audio.restart': 'Restart track', 'audio.play': 'Play audio', 'audio.pause': 'Pause audio',
  },
  es: {
    'language.label': 'Idioma', 'language.ptBR': 'Português', 'language.en': 'English', 'language.es': 'Español',
    'brand.tagline': 'Pro Studio Hub', 'navigation.label': 'Navegación principal', 'navigation.home': 'Inicio',
    'navigation.generator': 'Scale Engine', 'navigation.library': 'Mis Chispas', 'navigation.presets': 'Presets',
    'navigation.chords': 'Armonizador', 'navigation.faq': 'Preguntas Frecuentes', 'navigation.support': 'Reportar Problema', 'navigation.profile': 'Perfil',
    'page.home.eyebrow': 'Studio Hub', 'page.home.title': 'Crea algo con chispa.', 'page.home.description': 'Un espacio para transformar escalas, armonías e ideas en loops musicales.',
    'page.generator.eyebrow': 'Scale Engine', 'page.generator.title': 'Empieza por la tonalidad.', 'page.generator.description': 'Construye la base de tu próximo loop con elecciones rápidas y precisas.',
    'page.library.eyebrow': 'Cloud Library', 'page.library.title': 'Tus chispas, reunidas.', 'page.library.description': 'Accede a loops guardados y retoma una idea cuando te llame.',
    'page.presets.eyebrow': 'Curated Packs', 'page.presets.title': 'Atajos con personalidad.', 'page.presets.description': 'Elige un punto de partida y lleva la idea a tu terreno.',
    'page.chords.eyebrow': 'Harmonizer', 'page.chords.title': 'Encuentra el acorde correcto.', 'page.chords.description': 'Explora la armonía de la escala activa sin salir de tu flujo.',
    'page.profile.eyebrow': 'Producer Profile', 'page.profile.title': 'Tu espacio de productor.', 'page.profile.description': 'Ajusta tu identidad y preferencias del Studio Hub.',
    'page.faq.eyebrow': 'Quick Guide', 'page.faq.title': 'Dudas fuera del camino.', 'page.faq.description': 'Respuestas breves para mantener tu sesión en movimiento.',
    'page.support.eyebrow': 'Studio Support', 'page.support.title': 'Vamos a resolverlo juntos.', 'page.support.description': 'Envía una solicitud al equipo de Fagulha.',
    'page.placeholder.home': 'Tu próximo loop empieza aquí.', 'page.placeholder.module': 'Módulo listo para recibir el flujo del Studio.', 'page.placeholder.routes': 'Rutas sin recargar la página.',
    'dashboard.auth': 'Autenticación', 'dashboard.greeting': 'Hola, {name}.', 'dashboard.visitor': 'Sesión de invitado', 'dashboard.authenticated': 'Firebase Auth detectó una sesión activa.', 'dashboard.unauthenticated': 'No hay usuarios autenticados en este momento.',
    'dashboard.firestore': 'Firestore / tickets', 'dashboard.loading': 'Cargando...', 'dashboard.records': '{count} registro(s)', 'dashboard.query': 'Consulta completada en la colección de tickets.', 'dashboard.error': 'No se pudieron cargar los tickets ahora.', 'dashboard.unavailable': 'Firebase no está configurado en este entorno.', 'dashboard.player': 'Reproductor de prueba',
    'support.emailLabel': 'Tu correo para respuesta', 'support.emailPlaceholder': 'nombre@fagulha.com', 'support.messageLabel': 'Descripción del problema o duda', 'support.messagePlaceholder': 'Describe lo que está pasando...', 'support.submit': 'Enviar solicitud', 'support.successTitle': 'Solicitud enviada correctamente', 'support.successDescription': 'Nuestro equipo responderá pronto.', 'support.sendAnother': 'Enviar otra solicitud', 'support.error': 'Ocurrió un error. Inténtalo de nuevo.',
    'audio.mute': 'Silenciar audio', 'audio.unmute': 'Activar sonido', 'audio.progress': 'Progreso de la pista', 'audio.restart': 'Reiniciar pista', 'audio.play': 'Reproducir audio', 'audio.pause': 'Pausar audio',
  },
};

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const storageKey = 'fagulha-locale';

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'pt-BR';
  const savedLocale = window.localStorage.getItem(storageKey);
  if (savedLocale === 'pt-BR' || savedLocale === 'en' || savedLocale === 'es') return savedLocale;
  return window.navigator.language.toLowerCase().startsWith('en') ? 'en' : window.navigator.language.toLowerCase().startsWith('es') ? 'es' : 'pt-BR';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    window.localStorage.setItem(storageKey, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key: TranslationKey, variables?: Record<string, string | number>) => {
    let value = translations[locale][key];
    Object.entries(variables ?? {}).forEach(([name, replacement]) => {
      value = value.replace(`{${name}}`, String(replacement));
    });
    return value;
  };

  return <LanguageContext.Provider value={{ locale, setLocale, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage deve ser usado dentro de LanguageProvider.');
  return context;
}

export type { TranslationKey };
