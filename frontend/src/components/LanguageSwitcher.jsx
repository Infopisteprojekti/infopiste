import Select from 'react-select';
import LANGUAGE_OPTIONS from '@/constants/languageOptions';
import { useAppSettings } from '@/hooks/useAppSettings.js';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { settings, setSettings } = useAppSettings();

  const handleChange = opt => {
    const newLang = opt.value;
    setSettings(prev => ({ ...prev, lang: newLang }));
  };

  return (
    <Select
      value={LANGUAGE_OPTIONS.find(opt => opt.value === settings.lang)}
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
          <div className="lang__option-content-inner">
            <img
              className="lang__flag"
              src={
                new URL(`../assets/flags/${option.flag}.png`, import.meta.url)
                  .href
              }
              width="24"
              height="18"
            ></img>
            <span className={context === 'menu' ? '' : 'label'}>
              {context === 'menu' ? option.fullName : option.label}
            </span>
          </div>
        </div>
      )}
    />
  );
};

export default LanguageSwitcher;
