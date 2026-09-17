import { motion } from 'framer-motion';

export default function Suporte() {
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

      <form
        id="supportForm"
        action="https://formspree.io/f/xkjgnbly"
        method="POST"
        className="support-form"
      >
        <div className="support-field">
          <label htmlFor="supportEmail">Seu e-mail para retorno</label>
          <input id="supportEmail" type="email" name="email" required placeholder="seuemail@exemplo.com" />
        </div>

        <div className="support-field">
          <label htmlFor="supportCategory">Assunto / Categoria</label>
          <select id="supportCategory" name="category" defaultValue="Dúvida">
            <option value="Dúvida">Dúvida sobre o uso</option>
            <option value="Reportar Bug">Reportar Erro / Bug no App</option>
            <option value="Sugestão">Sugestão de funcionalidade</option>
            <option value="Conta">Problema com Login / Conta</option>
          </select>
        </div>

        <div className="support-field">
          <label htmlFor="supportDevice">Dispositivo e navegador</label>
          <input id="supportDevice" type="text" name="device" required placeholder="Ex: Safari no iPhone 13 / Chrome no Windows" />
        </div>

        <div className="support-field">
          <label htmlFor="supportMessage">Descrição da solicitação</label>
          <textarea id="supportMessage" name="message" rows={5} required placeholder="Descreva o que aconteceu ou sua dúvida..." />
        </div>

        <button type="submit" className="support-submit">Enviar chamado</button>
      </form>
    </motion.section>
  );
}
