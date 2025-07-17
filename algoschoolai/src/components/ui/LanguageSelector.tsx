import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select
      value={i18n.language}
      onChange={handleChange}
      className="bg-transparent text-sm text-gray-600 border-none focus:ring-0 focus:outline-none cursor-pointer"
      aria-label={t('language')}
    >
      <option value="es">ES</option>
      <option value="en">EN</option>
    </select>
  );
};

export default LanguageSelector; 