import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import '@/styles/components/RoomPopUp.css'

const RoomPopUp = ({ room, position, onClose }) => {
  const { t } = useTranslation();
  const popUpRef = useRef(null);

  if (!room) return;

  return (
    <div
      ref={popUpRef}
      className="room-pop-up"
      style={{ top: position.y, left: position.x }}
    >
      <div>
        <p>{t('room')}: {room.displayName ?? t('unknown')}</p>
        <p>{t('status')}: {t(`room-status.${room.status}`) ?? t('unknown')}</p>
        <p>{t('capacity')}: {room.capacity ?? t('unknown')}</p>
        <p>{t('floor')}: {room.floorNumber ?? t('unknown')}</p>
        <p>
          {t('accessible')}:{' '}
          {room.isWheelChairAccessible === true
            ? t('yes')
            : room.isWheelChairAccessible === false
              ? t('no')
              : t('unknown')
          }  
        </p>
      </div>
      <button onClick={onClose}>close</button>
    </div>
  );
};

export default RoomPopUp;