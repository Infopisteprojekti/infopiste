import Select from 'react-select';
import LANGUAGE_OPTIONS from '@/constants/languageOptions';
import { useAppSettings } from '@/hooks/useAppSettings.js';

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
      menuPortalTarget={document.body}
      components={{
        IndicatorSeparator: () => null,
      }}
      className="nav-button button language-select"
      classNamePrefix="lang"
      styles={{
        menuPortal: base => ({
          ...base,
          zIndex: 999999,
        }),
        menu: base => ({
          ...base,
          borderRadius: '0.5rem',
          boxShadow: 'none',
          border: '1px solid #dddddd',
          padding: '0.5rem',
          width: 'auto',
          left: 'auto',
          right: '0',
        }),
        option: (base, state) => ({
          ...base,
          padding: '0.5rem',
          fontSize: '0.8rem',
          cursor: 'pointer',
          border: '1px solid #dddddd',
          borderRadius: '8px',
          display: 'flex',
          paddingRight: '1rem',
        }),
      }}
      formatOptionLabel={(option, { context }) => (
        <div>
          <div className="lang__option-content-inner">
            <img
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
