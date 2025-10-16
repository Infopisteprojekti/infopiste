import { useEffect } from 'react';
import Select from 'react-select';
import { Globe } from 'lucide-react';
import LANGUAGE_OPTIONS from '../constants/languageOptions';
import { useAppSettings } from '../context/AppSettingsContext.jsx';

const LanguageSwitcher = ({ i18n, changeLanguage }) => {
  const { settings, setSettings } = useAppSettings();

  useEffect(() => {
    if (i18n.resolvedLanguage !== settings.lang) {
      changeLanguage(settings.lang);
    }
  }, [settings.lang, i18n, changeLanguage]);

  const handleChange = opt => {
    const newLang = opt.value;
    changeLanguage(newLang);
    setSettings(prev => ({ ...prev, lang: newLang }));
  };

  return (
    <Select
      value={LANGUAGE_OPTIONS.find(opt => opt.value === i18n.resolvedLanguage)}
      onChange={handleChange}
      options={LANGUAGE_OPTIONS}
      isSearchable={false}
      menuPlacement="top"
      components={{
        IndicatorSeparator: () => null,
      }}
      className="nav-button button language-select"
      classNamePrefix="lang"
      formatOptionLabel={(option, { context }) => (
        <div className="lang__option-content">
          {context === 'menu' ? (
            <span>{option.fullName}</span>
          ) : (
            <div className="lang__option-content-inner">
              <Globe size={18} className="globe-icon" />
              <span>{option.label}</span>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default LanguageSwitcher;
