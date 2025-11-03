import '../styles/components/Button.css';
import '../styles/components/BulletinBoard.css';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import PDFDisplay from './PDFDisplay';
import QRCode from './QRCode';
import formService from '@/services/forms.js';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const BulletinBoard = () => {
  const { t } = useTranslation();
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [automaticRotation, setAutomaticRotation] = useState(true);

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

  const RotatePdfs = () => {
    setAutomaticRotation(prev => !prev);
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}
      >
        <p>{t('bulletinboard.loading-notices')}</p>
      </div>
    );
  }

  //const currentForm = forms[index] || {};

  if (forms.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p>{t('bulletinboard.no-notices')}</p>
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
        <div className="pdf-grid">
          {forms.map((form, index) => (
            <div
              key={form._id}
              className="pdf-card"
              onClick={() => {
                setSelectedForm(form);
                setIndex(index);
              }}
            >
              <PDFDisplay
                currentForm={form}
                nextForm={() => {}}
                prevForm={() => {}}
                preview
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentForm = forms[index];
  return (
    <div>
      <button className="button" onClick={() => setSelectedForm(null)}>
        ← {t('bulletinboard.back') || 'View all PDFs'}
      </button>
      <QRCode />
      <PDFDisplay
        currentForm={currentForm}
        nextForm={nextForm}
        prevForm={prevForm}
        rotateCallBack={RotatePdfs}
        automaticRotation={automaticRotation}
      />
    </div>
  );
};

export default BulletinBoard;
