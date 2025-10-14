import qrcode from '../assets/form.svg';
import '../styles/components/BulletinBoard.css';
import { useTranslation } from 'react-i18next';

const BulletinBoard = () => {
  const { t } = useTranslation();

  return (
    <div>
      <button
        type="submit"
        id="openbutton"
        className="openbutton"
        onClick={() => {
          document.getElementById('popup').classList.add('open-popup');
          document.getElementById('openbutton').style.visibility = 'hidden';
        }}
      >
        {t('bulletinboard.qr-add-file')}
      </button>
      <div className="popup" id="popup">
        <p>{t('bulletinboard.qr-description')}</p>
        <img src={qrcode} className="bottomright" />
        <button
          type="button"
          className="closebutton"
          onClick={() => {
            document.getElementById('popup').classList.remove('open-popup');
            document.getElementById('openbutton').style.visibility = 'visible';
          }}
        >
          {t('bulletinboard.qr-close')}
        </button>
      </div>

      <br />
      <h1>Files</h1>
    </div>
  );
};

export default BulletinBoard;
