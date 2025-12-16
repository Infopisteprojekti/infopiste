import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

import '@/styles/components/RoomPopup.css';
import '@/styles/components/FeedbackPopup.css';


const Feedback = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [isOpen]);

  const changeVisibility = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        ref={buttonRef}
        type="button"
        className="button nav-button"
        onClick={changeVisibility}
      >
        {t('feedback.open')}
      </button>

      {isOpen && (
        <div
          ref={popupRef}
          id="feedback-popup"
          className="room-popup feedback-popup"
        >
          <div className="popup-header">
            <h3 className="popup-title">{t('feedback.description')}</h3>
            <button className="popup-button" onClick={changeVisibility}>
              <X size={25} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
