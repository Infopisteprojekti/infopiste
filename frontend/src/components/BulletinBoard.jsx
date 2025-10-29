import qrcode from '../assets/form.svg';
import '../styles/components/Button.css';
import '../styles/components/BulletinBoard.css';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import PDFDisplay from './PDFDisplay';

const baseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  'https://infopiste-backend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi';

const BulletinBoard = () => {
  const { t } = useTranslation();
  const [qrState, setQrState] = useState(false);
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [automaticRotation, setAutomaticRotation] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/forms`);
        if (!res.ok) throw new Error(`Error fetching room data: ${res.status}`);

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setForms(data);
        return;
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

  const toggleQr = () => {
    const newState = !qrState;
    if (newState) {
      document.getElementById('popup').classList.add('open-popup');
    } else {
      document.getElementById('popup').classList.remove('open-popup');
    }
    setQrState(newState);
  };

  const RotatePdfs = () => {
    setAutomaticRotation(prev => !prev);
  };

  if (loading) {
    return (
      <div>
        <p>Loading notices...</p>
      </div>
    );
  }

  if (forms.length === 0) {
    return (
      <div>
        <p>No notices were found</p>
      </div>
    );
  }

  if (!selectedForm) {
    return (
      <div>
        <button
          type="submit"
          id="qrButton"
          className="button qr-button"
          onClick={toggleQr}
        >
          {qrState ? t('bulletinboard.qr-close') : t('bulletinboard.qr-add-file')}
        </button>
        <div className="popup" id="popup">
          <p>{t('bulletinboard.qr-description')}</p>
          <img src={qrcode} className="bottomright" />
        </div>

        <p style={{
          textAlign: 'center',
          margin: '1rem 0',
          fontWeight: 'bold'
        }}>{t('bulletinboard.available-notices')}</p>
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
            <PDFDisplay currentForm={form} nextForm={() => {}} prevForm={() => {}} preview />
          </div>
        ))}
        </div>
      </div>
    );
  };

  const currentForm = forms[index];
  return (
    <div>
      <button className="button" onClick={() => setSelectedForm(null)}>
        ← {t('bulletinboard.back') || 'View all PDFs'}
      </button>
      <button
          type="submit"
          id="qrButton"
          className="button qr-button"
          onClick={toggleQr}
        >
          {qrState ? t('bulletinboard.qr-close') : t('bulletinboard.qr-add-file')}
        </button>
        <div className="popup" id="popup">
          <p>{t('bulletinboard.qr-description')}</p>
          <img src={qrcode} className="bottomright" />
        </div>

        <PDFDisplay 
          currentForm={currentForm}
          nextForm={nextForm}
          prevForm={prevForm}
          rotateCallBack={RotatePdfs}
          automaticRotation={automaticRotation}
        />
    </div>
  )
};

export default BulletinBoard;
