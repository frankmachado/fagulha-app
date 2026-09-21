import { Languages } from 'lucide-react';
import { useLanguage, type Locale } from '../i18n/LanguageContext';

const localeOptions: { value: Locale; labelKey: 'language.ptBR' | 'language.en' | 'language.es' }[] = [
  { value: 'pt-BR', labelKey: 'language.ptBR' },
  { value: 'en', labelKey: 'language.en' },
  { value: 'es', labelKey: 'language.es' },
];

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <label className="language-switcher">
      <Languages size={15} aria-hidden="true" />
      <span className="sr-only">{t('language.label')}</span>
      <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)} aria-label={t('language.label')}>
        {localeOptions.map(({ value, labelKey }) => <option key={value} value={value}>{t(labelKey)}</option>)}
      </select>
    </label>
  );
}
