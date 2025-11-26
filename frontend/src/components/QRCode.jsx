import qrcode from '../assets/form.svg';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '@/styles/components/RoomPopup.css';
import '@/styles/components/Button.css';

const QRCode = () => {
  const { t } = useTranslation();
  const [qrState, setQrState] = useState(false);

  const toggleQr = () => {
    const newState = !qrState;
    if (newState) {
      document.getElementById('popup').classList.remove('hidden');
    } else {
      document.getElementById('popup').classList.add('hidden');
    }
    setQrState(newState);
  };

  return (
    <div>
      <button
        type="submit"
        id="qrButton"
        className="button qr-button"
        data-testid="qr-button"
        onClick={toggleQr}
      >
        {qrState ? t('bulletinboard.qr-close') : t('bulletinboard.qr-add-file')}
      </button>

      <div
        id="popup"
        className="room-popup hidden"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
        }}
      >
        <div className="popup-header">
          <h3 className="popup-title">{t('bulletinboard.qr-description')}</h3>
          <button className="button" onClick={toggleQr}>
            {t('bulletinboard.qr-close')}
          </button>
        </div>

        <div className="popup-content">
          <img src={qrcode} className="qr" />
        </div>
      </div>
    </div>
  );
};

export default QRCode;
