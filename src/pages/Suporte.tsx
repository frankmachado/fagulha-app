import { useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function Suporte() {
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
      <p className="eyebrow">Studio Support</p>
      <h1>Vamos resolver juntos.</h1>
      <p className="page-description">Envie uma solicitação para a equipe do Fagulha.</p>

      {status === 'success' ? (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="support-success">
          <CheckCircle2 size={46} />
          <h2>Solicitação enviada com sucesso!</h2>
          <p>Nossa equipe retornará o contato em breve.</p>
          <button type="button" className="support-reset" onClick={() => setStatus('idle')}>Enviar outro chamado</button>
        </motion.div>
      ) : (
        <form id="supportForm" onSubmit={handleSubmit} className="support-form">
          <div className="support-field">
            <label htmlFor="supportEmail">Seu e-mail para retorno</label>
            <input id="supportEmail" type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="nome@fagulha.com" />
          </div>

          <div className="support-field">
            <label htmlFor="supportMessage">Descrição do problema ou dúvida</label>
            <textarea id="supportMessage" rows={5} required value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder="Descreva o que está acontecendo..." />
          </div>

          {status === 'error' && <div className="support-error"><AlertCircle size={16} /> <span>Ocorreu um erro ao enviar. Tente novamente.</span></div>}

          <button type="submit" className="support-submit" disabled={status === 'loading'}>
            {status === 'loading' ? <Loader2 size={18} className="spin" /> : <><Send size={16} /> <span>Enviar chamado</span></>}
          </button>
        </form>
      )}
    </motion.section>
  );
}
