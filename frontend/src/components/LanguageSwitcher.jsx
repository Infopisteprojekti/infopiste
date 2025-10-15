import Select from 'react-select';
import { Globe } from 'lucide-react';
import LANGUAGE_OPTIONS from '../constants/languageOptions';

const LanguageSwitcher = ({ i18n, changeLanguage }) => {
  return (
    <Select
      value={LANGUAGE_OPTIONS.find(opt => opt.value === i18n.resolvedLanguage)}
      onChange={opt => changeLanguage(opt.value)}
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
