import { useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function Suporte() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('https://formspree.io/f/xkjgnbly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setStatus('error');
        return;
      }

      setFormData({ email: '', message: '' });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="page-card support-card"
    >
      <p className="eyebrow">{t('page.support.eyebrow')}</p>
      <h1>{t('page.support.title')}</h1>
      <p className="page-description">{t('page.support.description')}</p>

      {status === 'success' ? (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="support-success">
          <CheckCircle2 size={46} />
          <h2>{t('support.successTitle')}</h2>
          <p>{t('support.successDescription')}</p>
          <button type="button" className="support-reset" onClick={() => setStatus('idle')}>{t('support.sendAnother')}</button>
        </motion.div>
      ) : (
        <form id="supportForm" onSubmit={handleSubmit} className="support-form">
          <div className="support-field">
            <label htmlFor="supportEmail">{t('support.emailLabel')}</label>
            <input id="supportEmail" type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder={t('support.emailPlaceholder')} />
          </div>

          <div className="support-field">
            <label htmlFor="supportMessage">{t('support.messageLabel')}</label>
            <textarea id="supportMessage" rows={5} required value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder={t('support.messagePlaceholder')} />
          </div>

          {status === 'error' && <div className="support-error"><AlertCircle size={16} /> <span>{t('support.error')}</span></div>}

          <button type="submit" className="support-submit" disabled={status === 'loading'}>
            {status === 'loading' ? <Loader2 size={18} className="spin" /> : <><Send size={16} /> <span>{t('support.submit')}</span></>}
          </button>
        </form>
      )}
    </motion.section>
  );
}
