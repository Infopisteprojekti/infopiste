import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';

import '@/styles/components/RoomPopup.css';

const RoomPopup = ({ room, position, onClose }) => {
  const { t } = useTranslation();
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="room-popup"
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
    >
      <div className="popup-header">
        <h3 className="popup-title">{room.displayName ?? t('unknown')}</h3>
        <button className="popup-button" onClick={onClose}>
          x
        </button>
      </div>

      <div className="popup-content">
        <p data-testid="room-status">
          {t('status')}: {t(`room-status.${room.status}`) ?? t('unknown')}
        </p>
        <p data-testid="room-reservation">
          {t('reservation')}:{' '}
          {room.currentReservation.start
            ? `${new Date(room.currentReservation.start).toLocaleTimeString(
                'en-GB',
                {
                  timeZone: 'Europe/Helsinki',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )} - ${new Date(room.currentReservation.end).toLocaleTimeString(
                'en-GB',
                {
                  timeZone: 'Europe/Helsinki',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )}`
            : '-'}
        </p>
        <p data-testid="room-capacity">
          {t('capacity')}: {room.capacity ?? t('unknown')}
        </p>
        <p data-testid="room-floor">
          {t('floor')}: {room.floorNumber ?? t('unknown')}
        </p>
        <p data-testid="room-accesible">
          {t('accessible')}:{' '}
          {room.isWheelChairAccessible === true
            ? t('yes')
            : room.isWheelChairAccessible === false
              ? t('no')
              : t('unknown')}
        </p>
      </div>
    </div>
  );
};

export default RoomPopup;
