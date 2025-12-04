import { useTranslation } from 'react-i18next';
import '@/styles/components/RoomPopup.css';
import '@/styles/components/RoomPopup.css';
import { useState } from 'react';

const Feedback = () => {
  const { t } = useTranslation();
  const [visibility, setVisibility] = useState(false);

  const changeVisibility = () => {
    const newState = !visibility;
    if (newState) {
      document.getElementById('popup').classList.remove('hidden');
    } else {
      document.getElementById('popup').classList.add('hidden');
    }
    setVisibility(newState);
  };

  return (
    <div>
      <button
        type="submit"
        className="button nav-button"
        onClick={changeVisibility}
      >
        {visibility ? t('bulletinboard.qr-close') : t('feedback.open')}
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
          <h3 className="popup-title">{t('feedback.description')}</h3>
          <button className="button" onClick={changeVisibility}>
            {t('bulletinboard.qr-close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
