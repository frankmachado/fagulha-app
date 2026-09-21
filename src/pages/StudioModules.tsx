import { useState } from 'react';
import { Check, ChevronDown, Play, Save } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const notesByScale: Record<string, string[]> = {
  'Maior': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'Menor natural': ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
  'Pentatônica maior': ['C', 'D', 'E', 'G', 'A'],
};

export function GeneratorPage() {
  const { t } = useLanguage();
  const [root, setRoot] = useState('C');
  const [scale, setScale] = useState('Maior');
  const [bpm, setBpm] = useState(120);
  const notes = notesByScale[scale];

  return (
    <section className="page-card studio-card">
      <p className="eyebrow">{t('page.generator.eyebrow')}</p>
      <h1>{t('page.generator.title')}</h1>
      <p className="page-description">{t('page.generator.description')}</p>
      <div className="studio-controls">
        <label>Nota raiz<select value={root} onChange={(event) => setRoot(event.target.value)}>{['C', 'C#', 'D', 'Eb', 'E', 'F', 'G', 'A', 'Bb', 'B'].map((note) => <option key={note}>{note}</option>)}</select></label>
        <label>Escala<select value={scale} onChange={(event) => setScale(event.target.value)}>{Object.keys(notesByScale).map((scaleName) => <option key={scaleName}>{scaleName}</option>)}</select></label>
        <label>BPM<input type="number" min="40" max="240" value={bpm} onChange={(event) => setBpm(Number(event.target.value))} /></label>
      </div>
      <div className="scale-preview">
        <div><span className="dashboard-label">Escala ativa</span><strong>{root} {scale}</strong></div>
        <div className="note-chips">{notes.map((note) => <span key={note}>{note}</span>)}</div>
      </div>
      <div className="piano-preview" aria-label="Piano roll da escala"><div className="piano-grid">{notes.map((note, index) => <span key={`${note}-${index}`} style={{ height: `${42 + (index % 3) * 18}%` }}>{note}</span>)}</div></div>
      <div className="studio-actions"><button className="action-button primary" type="button"><Play size={16} /> Ouvir escala</button><button className="action-button" type="button"><Save size={16} /> Salvar fagulha</button></div>
    </section>
  );
}

export function LibraryPage() {
  const { t } = useLanguage();
  const sparks = [{ title: 'Morning Ember', meta: 'C maior · 112 BPM' }, { title: 'Nocturne Sketch', meta: 'A menor · 94 BPM' }, { title: 'Golden Hour', meta: 'G maior · 128 BPM' }];
  return <section className="page-card"><p className="eyebrow">{t('page.library.eyebrow')}</p><h1>{t('page.library.title')}</h1><p className="page-description">{t('page.library.description')}</p><div className="module-list">{sparks.map((spark) => <article className="module-row" key={spark.title}><div><strong>{spark.title}</strong><span>{spark.meta}</span></div><button className="icon-action" type="button" aria-label={`Reproduzir ${spark.title}`}><Play size={15} /></button></article>)}</div></section>;
}

export function PresetsPage() {
  const { t } = useLanguage();
  const presets = [{ title: 'Warm Focus', description: 'Uma base quente para ideias que pedem espaço.', tag: 'Ambient' }, { title: 'Late Night', description: 'Tons menores e movimento para sessões noturnas.', tag: 'Cinematic' }, { title: 'First Light', description: 'Um ponto de partida claro e melódico.', tag: 'Indie' }, { title: 'Deep Pocket', description: 'Groove contido para construir sem pressa.', tag: 'Soul' }];
  return <section className="page-card"><p className="eyebrow">{t('page.presets.eyebrow')}</p><h1>{t('page.presets.title')}</h1><p className="page-description">{t('page.presets.description')}</p><div className="preset-grid">{presets.map((preset) => <button className="preset-tile" type="button" key={preset.title}><span className="preset-tag">{preset.tag}</span><strong>{preset.title}</strong><span>{preset.description}</span></button>)}</div></section>;
}

export function ChordsPage() {
  const { t } = useLanguage();
  const chords = ['Cmaj7', 'Dm7', 'Em7', 'Fmaj7', 'G7', 'Am7', 'Bm7b5'];
  return <section className="page-card"><p className="eyebrow">{t('page.chords.eyebrow')}</p><h1>{t('page.chords.title')}</h1><p className="page-description">{t('page.chords.description')}</p><div className="chord-grid">{chords.map((chord, index) => <button type="button" className="chord-tile" key={chord}><span>Grau {index + 1}</span><strong>{chord}</strong><small>{index % 2 === 0 ? 'C · E · G' : 'D · F · A'}</small></button>)}</div></section>;
}

export function FaqPage() {
  const { t } = useLanguage();
  const questions = ['Como começo uma nova fagulha?', 'Como salvo uma ideia na biblioteca?', 'Posso exportar meus loops?', 'Como altero o idioma?'];
  return <section className="page-card"><p className="eyebrow">{t('page.faq.eyebrow')}</p><h1>{t('page.faq.title')}</h1><p className="page-description">{t('page.faq.description')}</p><div className="faq-list">{questions.map((question) => <details className="faq-item" key={question}><summary>{question}<ChevronDown size={16} /></summary><p>Este módulo está conectado ao Studio Hub e pode ser usado sem recarregar a página.</p></details>)}</div></section>;
}

export function ProfilePage() {
  const { t } = useLanguage();
  return <section className="page-card profile-card"><p className="eyebrow">{t('page.profile.eyebrow')}</p><h1>{t('page.profile.title')}</h1><p className="page-description">{t('page.profile.description')}</p><div className="profile-panel"><div className="profile-avatar">F</div><div><strong>Produtor Fagulha</strong><span>Perfil local · sessão visitante</span></div><Check size={18} /></div></section>;
}
