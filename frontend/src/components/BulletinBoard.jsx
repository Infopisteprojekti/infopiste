import qrcode from '../assets/form.svg';
import '../styles/components/Button.css';
import '../styles/components/BulletinBoard.css';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const BulletinBoard = () => {
  const { t } = useTranslation();
  const [qrState, setQrState] = useState(false);

  const toggleQr = () => {
    const newState = !qrState;
    if (newState) {
      document.getElementById('popup').classList.add('open-popup');
    } else {
      document.getElementById('popup').classList.remove('open-popup');
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
        {qrState ? t('bulletinboard.qr-close') : t('bulletinboard.qr-add-file')}
      </button>
      <div className="popup" id="popup">
        <p>{t('bulletinboard.qr-description')}</p>
        <img src={qrcode} className="bottomright" />
      </div>

      <br />
      <h1>Files</h1>
    </div>
  );
};

export default BulletinBoard;
