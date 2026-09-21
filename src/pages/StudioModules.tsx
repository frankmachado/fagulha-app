import { useEffect, useState } from 'react';
import { Check, ChevronDown, Download, Play, Save, Square } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { playChord, playNotes, setMasterVolume, stopAudio } from '../services/musicAudio';
import { downloadMidi } from '../services/musicMidi';
import { auth } from '../services/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

const scaleOptions = ['Lídio Dominante (Sertão / Neo-Soul)', 'Mixolídio / Aboia (Reza Psicodélico)', 'Escala Praiana (Afrobeat / Maré)', 'Menor Natural / Eólio (Melancolia / R&B)', 'Menor Harmônica (Dramático / Baião)', 'Dório Mouro (Baião Menor / MPB Jazz)', 'Frígio (Transe / Reza Mística)', 'Pentatônica Gnawa (Transe / Trap)'];
const grooves = ['Dedilhado de Serra', 'Galope Mourisco', 'Melodia Ondulante', 'Fraseado de Solitude', 'Transe de Pífano', 'Cascata de Cordas', 'Pontilhado Seco', 'Balanço de Maré', 'Rezo Mourisco', 'Cortejo Evolutivo'];
const atmospheres = ['Atmosfera Aveludada (Sustentação)', 'Sincopado Cadenciado', 'Bloco Estelar (Acordes Abertos)', 'Staccato Espaçado', 'Modulação Móvel', 'Arpejo Sustentado', 'Camada Densa', 'Respiro Noturno', 'Síncopa de Maré', 'Resolução Ascendente'];
const rhythms = ['Balanço Sincopado Urbano', 'Pressão Acelerada (Rolls 1/16)', 'Espaça & Ataca (Staccato)', 'Pulso Galopado', 'Saltos Oitavados', 'Ostinato de Transe', 'Síncopa Quebrada', 'Caminhada Contínua', 'Ataque Duplo (Contratempo)', 'Virada Trípletada'];
const scaleNotes: Record<string, number[]> = { 'Lídio Dominante (Sertão / Neo-Soul)': [69, 71, 73, 75, 76, 78, 80], 'Mixolídio / Aboia (Reza Psicodélico)': [69, 71, 73, 75, 76, 78, 80], 'Escala Praiana (Afrobeat / Maré)': [69, 71, 73, 76, 78], 'Menor Natural / Eólio (Melancolia / R&B)': [69, 71, 72, 74, 76, 77, 79], 'Menor Harmônica (Dramático / Baião)': [69, 71, 72, 74, 76, 77, 80] };

function buildPattern(notes: number[], groove: string, rhythm: string) {
  const direction = groove.includes('Galope') || rhythm.includes('Acelerada') ? [...notes].reverse() : notes;
  const repeats = groove.includes('Dedilhado') || rhythm.includes('Ostinato') ? 2 : 1;
  return Array.from({ length: repeats }, () => direction).flat();
}

export function GeneratorPage() {
  const { t } = useLanguage();
  const [scale, setScale] = useState(scaleOptions[0]);
  const [groove, setGroove] = useState(grooves[0]);
  const [atmosphere, setAtmosphere] = useState(atmospheres[0]);
  const [rhythm, setRhythm] = useState(rhythms[0]);
  const [bpm, setBpm] = useState(113);
  const notes = scaleNotes[scale] ?? scaleNotes[scaleOptions[0]];
  const pattern = buildPattern(notes, groove, rhythm);

  useEffect(() => {
    const keyboardNotes: Record<string, number> = { a: notes[0], s: notes[1], d: notes[2], f: notes[3], g: notes[4], h: notes[5], j: notes[6] };
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
      const note = keyboardNotes[event.key.toLowerCase()];
      if (note) void playNotes([note], bpm);
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [bpm, notes]);
  const saveSpark = () => {
    const savedSparks = JSON.parse(window.localStorage.getItem('fagulha-sparks') || '[]') as Array<{ title: string; meta: string }>;
    savedSparks.unshift({ title: scale.split(' (')[0], meta: `${scale} · ${bpm} BPM` });
    window.localStorage.setItem('fagulha-sparks', JSON.stringify(savedSparks.slice(0, 20)));
  };

  return <section className="page-card studio-card"><p className="eyebrow">{t('page.generator.eyebrow')}</p><h1>{t('page.generator.title')}</h1><p className="page-description">{t('page.generator.description')}</p><div className="studio-controls studio-controls-wide"><label>Escala & Vibe Harmônica<select value={scale} onChange={(event) => setScale(event.target.value)}>{scaleOptions.map((option) => <option key={option}>{option}</option>)}</select></label><label>Groove (8 Compassos)<select value={groove} onChange={(event) => setGroove(event.target.value)}>{grooves.map((option) => <option key={option}>{option}</option>)}</select></label><label>Atmosfera / Sustentação<select value={atmosphere} onChange={(event) => setAtmosphere(event.target.value)}>{atmospheres.map((option) => <option key={option}>{option}</option>)}</select></label><label>Groove / Contratempos<select value={rhythm} onChange={(event) => setRhythm(event.target.value)}>{rhythms.map((option) => <option key={option}>{option}</option>)}</select></label><label>Andamento (BPM)<input type="number" min="60" max="180" value={bpm} onChange={(event) => setBpm(Number(event.target.value))} /></label></div><div className="scale-preview"><div><span className="dashboard-label">Escala ativa</span><strong>{scale}</strong></div><div className="note-chips">{notes.map((note) => <span key={note}>{note - 60}</span>)}</div></div><div className="keyboard-guide"><span className="dashboard-label">Teclado ao vivo</span><span> A · S · D · F · G · H · J </span></div><div className="piano-preview" aria-label="Grid piano roll da escala"><div className="piano-grid">{Array.from({ length: 32 }, (_, index) => <span key={index} style={{ height: `${32 + (index % 5) * 13}%` }}>{index % 4 === 0 ? '●' : '·'}</span>)}</div></div><div className="studio-toolbar"><label>Volume <input type="range" min="0" max="100" defaultValue="80" onChange={(event) => setMasterVolume(Number(event.target.value) / 100)} /></label><button className="action-button" type="button" onClick={stopAudio}><Square size={15} /> Stop</button></div><div className="studio-actions"><button className="action-button primary" type="button" onClick={() => playNotes(pattern, bpm)}><Play size={16} /> Escutar Loop</button><button className="action-button" type="button" onClick={saveSpark}><Save size={16} /> Salvar Fagulha</button><button className="action-button" type="button" onClick={() => downloadMidi(pattern, bpm)}><Download size={16} /> Exportar MIDI (.mid)</button></div></section>;
}

export function LibraryPage() {
  const { t } = useLanguage();
  const [savedSparks, setSavedSparks] = useState<Array<{ title: string; meta: string }>>([]);
  const defaultSparks = [{ title: 'Sertão Neo-Soul', meta: 'Lídio Dominante · 113 BPM' }, { title: 'Transe Gnawa 808', meta: 'Pentatônica Gnawa · 140 BPM' }, { title: 'Abóbora Melancólica Menor', meta: 'Menor Natural · 120 BPM' }, { title: 'Maracatu Amarelo', meta: 'Escala Praiana · 112 BPM' }];

  useEffect(() => {
    const storedSparks = JSON.parse(window.localStorage.getItem('fagulha-sparks') || '[]') as Array<{ title: string; meta: string }>;
    setSavedSparks(storedSparks.length ? storedSparks : defaultSparks);
  }, []);

  const sparks = savedSparks.length ? savedSparks : defaultSparks;
  return <section className="page-card"><p className="eyebrow">{t('page.library.eyebrow')}</p><h1>{t('page.library.title')}</h1><p className="page-description">{t('page.library.description')}</p><div className="module-list">{sparks.map((spark, index) => <article className="module-row" key={spark.title}><div><strong>{spark.title}</strong><span>{spark.meta}</span></div><button className="icon-action" type="button" onClick={() => playNotes([69, 73, 76, 80], 110)} aria-label={`Reproduzir ${spark.title}`}><Play size={15} /></button></article>)}</div></section>;
}

export function PresetsPage() {
  const { t } = useLanguage();
  const presets = [{ title: 'Sertão Neo-Soul Pack', description: 'Acordes aveludados em Lá Lídio Dominante com Rhodes expansivo em 113 BPM.', tag: 'Rhodes · 113 BPM' }, { title: 'Transe Gnawa 808', description: 'Viradas aceleradas de Logdrum em Ré Pentatônica Gnawa focado em Trap de 140 BPM.', tag: 'Logdrum · 140 BPM' }, { title: 'Abóbora Melancólica Menor', description: 'Dedilhado rápido de Viola em Mi Menor Natural focado em clima denso em 120 BPM.', tag: 'Viola · 120 BPM' }, { title: 'Maracatu Amarelo', description: 'Sincopado cadenciado com Escala Praiana em 112 BPM.', tag: 'Maracatu · 112 BPM' }];
  return <section className="page-card"><p className="eyebrow">{t('page.presets.eyebrow')}</p><h1>{t('page.presets.title')}</h1><p className="page-description">{t('page.presets.description')}</p><div className="preset-grid">{presets.map((preset) => <button className="preset-tile" type="button" key={preset.title} onClick={() => playNotes([69, 73, 76, 80], 113)}><span className="preset-tag">{preset.tag}</span><strong>{preset.title}</strong><span>{preset.description}</span></button>)}</div></section>;
}

export function ChordsPage() {
  const { t } = useLanguage();
  const chords = [{ name: 'A', notes: [69, 73, 76] }, { name: 'B', notes: [71, 75, 78] }, { name: 'C#dim', notes: [73, 76, 79] }, { name: 'D#dim', notes: [75, 78, 81] }, { name: 'Em', notes: [76, 79, 83] }, { name: 'F#m', notes: [78, 81, 85] }, { name: 'Gaug', notes: [79, 83, 87] }];
  return <section className="page-card"><p className="eyebrow">{t('page.chords.eyebrow')}</p><h1>{t('page.chords.title')}</h1><p className="page-description">{t('page.chords.description')}</p><div className="chord-grid">{chords.map((chord, index) => <button type="button" className="chord-tile" key={chord.name} onClick={() => playChord(chord.notes)}><span>Grau {index + 1}</span><strong>{chord.name}</strong><small>{chord.notes.map((note) => note - 60).join(' · ')}</small><em>▶ Clique para ouvir</em></button>)}</div><div className="progression-card"><span className="dashboard-label">💡 Progressões recomendadas:</span><p>Sertão Neo-Soul: <strong>A → B → A</strong></p><p>Tensão Lídia Ancestral: <strong>A → Gaug → F#m → A</strong></p></div></section>;
}

export function FaqPage() { const { t } = useLanguage(); const questions = ['Como começo uma nova fagulha?', 'Como salvo uma ideia na biblioteca?', 'Como exporto um arquivo MIDI?', 'Como altero o idioma?']; return <section className="page-card"><p className="eyebrow">{t('page.faq.eyebrow')}</p><h1>{t('page.faq.title')}</h1><p className="page-description">{t('page.faq.description')}</p><div className="faq-list">{questions.map((question) => <details className="faq-item" key={question}><summary>{question}<ChevronDown size={16} /></summary><p>Configure sua escala, groove e andamento no Scale Engine. Os controles da sessão permanecem disponíveis sem recarregar a página.</p></details>)}</div></section>; }

export function ProfilePage() {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  return <section className="page-card profile-card"><p className="eyebrow">{t('page.profile.eyebrow')}</p><h1>{t('page.profile.title')}</h1><p className="page-description">{t('page.profile.description')}</p><div className="profile-panel"><div className="profile-avatar">{user?.photoURL ? <img src={user.photoURL} alt="" /> : 'F'}</div><div><strong>{user?.displayName || 'Produtor Fagulha'}</strong><span>{user?.email || 'Perfil local · sessão visitante'}</span></div><Check size={18} /></div></section>;
}
