import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

import '@/styles/components/RoomPopup.css';

dayjs.extend(utc);
dayjs.extend(timezone);

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

  const formatTime = dateString => {
    return dayjs.utc(dateString).tz('Europe/Helsinki').format('HH:mm');
  };

  const now = dayjs().utc();
  const upcomingReservations = (room.roomReservations || [])
    .filter(r => dayjs.utc(r.start).isAfter(now))
    .sort(
      (a, b) => dayjs.utc(a.start).valueOf() - dayjs.utc(b.start).valueOf()
    );

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
          {t('current-reservation')}:{' '}
          {room.currentReservation?.start
            ? `${formatTime(room.currentReservation.start)} - ${formatTime(room.currentReservation.end)}`
            : '-'}
        </p>

        <div data-testid="room-upcoming-reservations">
          {t('upcoming-reservations')}:{' '}
          {upcomingReservations.length > 0 ? (
            <ul>
              {upcomingReservations.map(r => (
                <li key={r.id}>
                  {formatTime(r.start)} - {formatTime(r.end)}
                </li>
              ))}
            </ul>
          ) : (
            <span>-</span>
          )}
        </div>

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
