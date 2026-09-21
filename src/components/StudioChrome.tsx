import { useState } from 'react';
import { Clock3, HelpCircle, Menu, Save, Square, Volume2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { setMasterVolume, stopAudio } from '../services/musicAudio';
import AuthControls from './AuthControls';
import LanguageSwitcher from './LanguageSwitcher';

export function StudioTopBar({ onMenu }: { onMenu: () => void }) {
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [bpm, setBpm] = useState(113);
  const tapTempo = () => {
    const now = Date.now();
    const recent = [...tapTimes.filter((time) => now - time < 2200), now];
    setTapTimes(recent);
    if (recent.length > 1) setBpm(Math.round(60000 / ((recent[recent.length - 1] - recent[0]) / (recent.length - 1))));
  };

  return <header className="studio-topbar"><div className="topbar-group"><button className="topbar-button" type="button" onClick={onMenu}><Menu size={15} /> Menu</button><Link className="topbar-button topbar-save" to="/generator"><Save size={14} /> Salvar Fagulha</Link><button className="topbar-button" type="button" onClick={tapTempo}><Clock3 size={14} /> Tap Tempo{tapTimes.length > 1 ? ` · ${bpm}` : ''}</button><button className="topbar-button topbar-stop" type="button" onClick={stopAudio}><Square size={13} /> Stop</button></div><div className="topbar-group topbar-right"><label className="topbar-volume"><Volume2 size={14} /><input type="range" min="0" max="100" defaultValue="80" onChange={(event) => setMasterVolume(Number(event.target.value) / 100)} /><span>80%</span></label><LanguageSwitcher /><Link className="topbar-help" to="/faq" aria-label="Dúvidas Frequentes"><HelpCircle size={15} /></Link><AuthControls /></div></header>;
}

export function SidebarControls() {
  const [humanizer, setHumanizer] = useState(15);
  const [swing, setSwing] = useState(0);
  const [tuning, setTuning] = useState('440 Hz (Padrão)');
  return <div className="sidebar-controls"><p className="sidebar-section-title">GROOVE & HUMANIZER</p><label className="slider-control">Humanizer <output>{humanizer}%</output><input type="range" min="0" max="100" value={humanizer} onChange={(event) => setHumanizer(Number(event.target.value))} /></label><label className="slider-control">Swing <output>{swing}%</output><input type="range" min="0" max="100" value={swing} onChange={(event) => setSwing(Number(event.target.value))} /></label><p className="sidebar-section-title">CONFIGURAÇÕES</p><label className="sidebar-select">Afinação Master<select value={tuning} onChange={(event) => setTuning(event.target.value)}><option>440 Hz (Padrão)</option><option>432 Hz (Natural)</option><option>444 Hz (Brilhante)</option></select></label></div>;
}

export function MobileClose({ onClose }: { onClose: () => void }) { return <button className="mobile-close" type="button" onClick={onClose} aria-label="Fechar menu"><X size={16} /></button>; }
