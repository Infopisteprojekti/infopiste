import Select from 'react-select';
import { Globe } from 'lucide-react';
import LANGUAGE_OPTIONS from '../constants/languageOptions';

const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: '#eeeeee',
    border: 'none',
    boxShadow: 'none',
    minHeight: '64px', // Match the navbar height
    height: '64px',
    paddingLeft: '28px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#cccccc',
    },
  }),
  singleValue: base => ({
    ...base,
    color: 'black',
    fontSize: '18px',
  }),
  dropdownIndicator: base => ({
    ...base,
    color: 'black',
    transform: 'rotate(180deg)',
  }),
  menu: base => ({
    ...base,
    width: '150px',
    right: 0,
    backgroundColor: '#eeeeee',
    borderRadius: '6px',
    marginBottom: 2,
  }),
  option: (base, state) => ({
    ...base,
    fontSize: '18px',
    color: 'black',
    backgroundColor: state.isFocused ? '#cccccc' : '#eeeeee',
    cursor: 'pointer',
  }),
};

// react-select component for consistency between browsers and better styling options

const LanguageSwitcher = ({ i18n, changeLanguage }) => {
  return (
    <div className="navbar-language-switcher">
      <Globe size={18} className="globe-icon" />
      <Select
        value={LANGUAGE_OPTIONS.find(
          opt => opt.value === i18n.resolvedLanguage
        )}
        onChange={opt => changeLanguage(opt.value)}
        options={LANGUAGE_OPTIONS}
        isSearchable={false}
        menuPlacement="top"
        components={{
          IndicatorSeparator: () => null,
        }}
        styles={customStyles}
        formatOptionLabel={(option, { context }) => {
          if (context === 'menu') {
            return option.fullName;
          }
          return option.label;
        }}
      />
    </div>
  );
};

export default LanguageSwitcher;
