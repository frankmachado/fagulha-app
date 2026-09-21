import { useLanguage } from '../i18n/LanguageContext';

export default function Dashboard() {
  const { t } = useLanguage();

  return (
    <section className="page-card dashboard-card">
      <p className="eyebrow">{t('page.home.eyebrow')}</p>
      <h1>{t('page.home.title')}</h1>
      <p className="page-description">{t('page.home.description')}</p>

      <div className="privacy-terms-container">
        <h2>Termos de Uso e Privacidade</h2>
        <p><strong>1. Coleta de Dados:</strong> O Fagulha Studio Hub coleta apenas as informações necessárias para autenticação e personalização da sua experiência.</p>
        <p><strong>2. Armazenamento e Segurança:</strong> Dados de perfil e projetos salvos são armazenados com regras de segurança do Firebase.</p>
        <p><strong>3. Seus Direitos (LGPD):</strong> Você pode editar suas informações ou solicitar a exclusão dos seus registros.</p>
        <p><strong>4. Uso da Plataforma:</strong> O Fagulha Studio Hub apoia produtores musicais. Respeite direitos autorais e a comunidade ao compartilhar criações.</p>
      </div>
    </section>
  );
}
