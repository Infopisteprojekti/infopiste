import { useTranslation } from 'react-i18next';
import '@/styles/components/RoomPopup.css';
import '@/styles/components/RoomPopup.css';
import '@/styles/components/FeedbackPopup.css';
import { useState } from 'react';

const Feedback = () => {
  const { t } = useTranslation();
  const [visibility, setVisibility] = useState(false);

  const changeVisibility = () => {
    const newState = !visibility;
    if (newState) {
      document.getElementById('feedback-popup').classList.remove('hidden');
    } else {
      document.getElementById('feedback-popup').classList.add('hidden');
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
        {visibility ? t('feedback.close') : t('feedback.open')}
      </button>

      <div
        id="feedback-popup"
        className="
        room-popup 
        hidden 
        feedback-popup"
      >
        <div className="popup-header">
          <h3 className="popup-title">{t('feedback.description')}</h3>
          <button className="button" onClick={changeVisibility}>
            {t('feedback.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
