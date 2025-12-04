import '../styles/components/Button.css';
import '../styles/components/BulletinBoard.css';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import PDFDisplay from './PDFDisplay';
import QRCode from './QRCode';
import formService from '@/services/forms.js';
import PDFImage from './PDFImage';

const BulletinBoard = () => {
  const { t } = useTranslation();
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [loadCount, setLoadCount] = useState(0);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const json = await formService.getForms();
        setForms(json.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  useEffect(() => {
    if (!selectedForm) {
      setPreviewLoading(true);
      setLoadCount(0);
    }
  }, [selectedForm]);

  const handleImageLoad = () => {
    setLoadCount(prev => {
      const newCount = prev + 1;
      if (newCount >= forms.length) {
        setPreviewLoading(false);
      }
      return newCount;
    });
  };

  if (!loading && forms.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          gap: '1rem',
        }}
      >
        <p>
          {t('bulletinboard.no-notices')}
        </p>
        {!loading && <QRCode />}
      </div>
    );
  }

  if (!selectedForm) {
    return (
      <div>
        <QRCode />
        <p
          style={{
            textAlign: 'center',
            margin: '1rem 0',
            fontWeight: 'bold',
          }}
        >
          {t('bulletinboard.available-notices')}
        </p>
        {previewLoading && (
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '77vh',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              gap: '1rem',
            }}
          >
            <span className="loader"></span>
            <p>{t('bulletinboard.loading-notices')}</p>
          </div>
        )}
        <div
          className="pdf-grid"
          style={{
            opacity: previewLoading ? 0 : 1,
            pointerEvents: previewLoading ? 'none' : 'auto',
          }}
        >
          {forms.map((form, index) => (
            <div
              key={form._id}
              className="pdf-card"
              onClick={() => {
                setSelectedForm(form);
                setIndex(index);
              }}
            >
              <PDFImage form={form} preview={true} onLoaded={handleImageLoad} />
              <h4 title={form.title}>
                {form.title.length > 12
                  ? form.title.slice(0, 12) + '...'
                  : form.title}
              </h4>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentIndex = index;
  return (
    <div>
      <QRCode />
      <PDFDisplay
        currentIndex={currentIndex}
        forms={forms}
        backCallBack={() => setSelectedForm(null)}
      />
    </div>
  );
};

export default BulletinBoard;
