import qrcode from '../assets/form.svg';
import '../styles/components/Button.css';
import '../styles/components/BulletinBoard.css';
import { Document, Page, pdfjs } from 'react-pdf';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useEffect } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const baseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  'https://infopiste-backend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi';

const BulletinBoard = () => {
  const { t } = useTranslation();
  const [qrState, setQrState] = useState(false);
  const [forms, setForms] = useState([]);
  const [index, setIndex] = useState(0);

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
        return null;
      }
    };
    fetchForms();
  }, []);

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
      document.getElementById('qrButton').innerHTML = t(
        'bulletinboard.qr-close'
      );
    } else {
      document.getElementById('popup').classList.remove('open-popup');
      document.getElementById('qrButton').innerHTML = t(
        'bulletinboard.qr-add-file'
      );
    }
    setQrState(newState);
  };

  if (forms.length === 0) {
    return (
      <div>
        <p>Loading PDFs...</p>
      </div>
    );
  }

  const currentForm = forms[index];

  return (
    <div>
      <button
        type="submit"
        id="qrButton"
        className="button qr-button"
        onClick={toggleQr}
      >
        {t('bulletinboard.qr-add-file')}
      </button>
      <div className="popup" id="popup">
        <p>{t('bulletinboard.qr-description')}</p>
        <img src={qrcode} className="bottomright" />
      </div>

      <br />
      <div className="pdf-container">
        <h3>{currentForm.title}</h3>
        <p>
          {new Date(currentForm.startDate).toLocaleDateString()} –{' '}
          {new Date(currentForm.endDate).toLocaleDateString()}
        </p>
        <div className="pdf-wrapper">
          <button className="pdf-button left" onClick={nextForm}>
            ← Previous
          </button>
          <Document
            file={currentForm.fileUrl}
            key={currentForm._id}
            onLoadError={console.error}
          >
            <Page
              pageNumber={1}
              width={700}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
          <button className="pdf-button right" onClick={prevForm}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulletinBoard;
