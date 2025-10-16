import qrcode from '../assets/form.svg';
import '../styles/components/Button.css';
import '../styles/components/BulletinBoard.css';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useEffect } from 'react';

const baseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  'https://infopiste-backend-ohtuprojekti-staging.ext.ocp-test-0.k8s.it.helsinki.fi';

const BulletinBoard = () => {
  const { t } = useTranslation();
  const [qrState, setQrState] = useState(false);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/forms`)
        if (!res.ok) throw new Error(`Error fetching room data: ${res.status}`)

        const data = await res.json();
        if (data.error) throw new Error(data.error);
  
        setForms(data);
        return;

      } catch (err) {
        console.error(err);
        return null;
      }
    }
    fetchForms()
  }, []);

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
      <h1>Files</h1>
      <ul>
        {forms.map(form => (
          <li key={form._id}>
            <h3>{form.title}</h3>
            <p>
              {new Date(form.startDate).toLocaleDateString()} -{' '}
              {new Date(form.endDate).toLocaleDateString()}
            </p>
            <iframe
              src={form.fileUrl}
              width="50%"
              height="700px"
              title={form.title}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BulletinBoard;
