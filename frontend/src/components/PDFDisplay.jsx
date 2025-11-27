import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/components/PDFDisplay.css';
import PDFImage from './PDFImage';

const PDFDisplay = ({ currentIndex, forms, backCallBack }) => {
  const [automaticRotation, setAutomaticRotation] = useState(true);
  const [index, setIndex] = useState(currentIndex);

  const { t } = useTranslation();

  const currentForm = forms[index];

  useEffect(() => {
    if (!automaticRotation || forms.length === 0) return;

    const timeout = setTimeout(() => {
      setIndex(prev => (prev + 1) % forms.length);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [automaticRotation, index, forms.length]);

  const nextForm = () => {
    setIndex(prev => (prev + 1) % forms.length);
  };

  const prevForm = () => {
    setIndex(prev => (prev - 1 + forms.length) % forms.length);
  };

  const rotatePdfs = () => {
    setAutomaticRotation(prev => !prev);
  };

  if (!currentForm) return null;

  const uploaderKey =
    currentForm.uploaderId ||
    currentForm.uploader ||
    currentForm.uploadedBy ||
    null;

  const groupedForms = uploaderKey
    ? forms.filter(
        f => (f.uploaderId || f.uploader || f.uploadedBy) === uploaderKey
      )
    : [currentForm];

  const toTop = () => {
    const main = document.getElementsByClassName('main-content')[0];

    main.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`pdf-container`}>
      <div className="pdf-header">
        <button onClick={backCallBack} className="button">
          {t('bulletinboard.back')}
        </button>
        <h2>{currentForm.title}</h2>
        <button onClick={rotatePdfs} className="button">
          {automaticRotation
            ? t('bulletinboard.stop-rotation')
            : t('bulletinboard.continue-rotation')}
        </button>
      </div>
      <p>
        {new Date(currentForm.startDate).toLocaleDateString()} –{' '}
        {new Date(currentForm.endDate).toLocaleDateString()}
      </p>

      <div className="pdf-wrapper-with-buttons">
        <button className="button pdf-nav-button" onClick={prevForm}>
          ← {t('pdfdisplay.previous')}
        </button>
        <div className="pdf-wrapper">
          {groupedForms.map(f => (
            <div key={f._id || f.fileUrl} style={{ marginBottom: 24 }}>
              <PDFImage form={f} preview={false} />
            </div>
          ))}
        </div>
        <button className="button pdf-nav-button" onClick={nextForm}>
          {t('pdfdisplay.next')} →
        </button>
      </div>
      <div>
        <button className="button" onClick={toTop}>
          ⬆️
        </button>
      </div>
    </div>
  );
};

export default PDFDisplay;
