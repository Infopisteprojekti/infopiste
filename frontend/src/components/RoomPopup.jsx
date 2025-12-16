import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  X,
  Clock,
  User,
  CalendarCheck,
  Accessibility,
  MapPin,
} from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

import '@/styles/components/RoomPopup.css';

dayjs.extend(utc);
dayjs.extend(timezone);

const RoomPopup = ({ room, position, onClose }) => {
  const { t } = useTranslation();
  const popupRef = useRef(null);

  // hidden state to prevent flickering
  const [style, setStyle] = useState({
    top: position.y,
    left: position.x,
    opacity: 0,
    visibility: 'hidden',
  });

  const upcomingReservations = useMemo(() => {
    if (!room.roomReservations) return [];

    const now = dayjs().utc();
    const currentId = room.currentReservation?.id;

    return room.roomReservations
      .filter(r => r.id !== currentId && dayjs.utc(r.start).isAfter(now))
      .sort(
        (a, b) => dayjs.utc(a.start).valueOf() - dayjs.utc(b.start).valueOf()
      )
      .slice(0, 3); // limit to 3 reservations
  }, [room]);

  // handle clicking outside the popup
  useEffect(() => {
    const handleClickOutside = event => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [onClose]);

  // handle popup position not going outside the screen
  useEffect(() => {
    if (!popupRef.current) return;

    const { innerWidth, innerHeight } = window;
    const { offsetWidth, offsetHeight } = popupRef.current;
    const PADDING = 30;
    const BOTTOM_PADDING = 80; // to not render on top of navbar

    const left = Math.min(
      Math.max(position.x, PADDING),
      innerWidth - offsetWidth - PADDING
    );

    const top = Math.min(
      Math.max(position.y, PADDING),
      innerHeight - offsetHeight - BOTTOM_PADDING
    );

    setStyle({
      top,
      left,
      opacity: 1,
      visibility: 'visible',
    });
  }, [position]);

  const formatTime = dateString => {
    return dayjs.utc(dateString).tz('Europe/Helsinki').format('HH:mm');
  };

  return (
    <div ref={popupRef} className="room-popup" style={style}>
      <div className="popup-header">
        <h3 className="popup-title">{room.displayName ?? t('unknown')}</h3>
        <button className="popup-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="popup-content">
        <div
          className={`status-badge ${room.status?.toLowerCase() || 'unknown'}`}
        >
          {t(`room-status.${room.status}`) ?? room.status}
        </div>

        <div>
          <div className="section-label">
            <Clock size={20} /> {t('current-reservation')}
          </div>
          <div className="reservation-card">
            {room.currentReservation?.start ? (
              <span className="time-display">
                {formatTime(room.currentReservation.start)} -{' '}
                {formatTime(room.currentReservation.end)}
              </span>
            ) : (
              <span className="time-display" style={{ color: '#999' }}>
                {t('free-until-next-booking')}
              </span>
            )}
          </div>
        </div>

        {upcomingReservations.length > 0 && (
          <div>
            <div className="section-label">
              <CalendarCheck size={20} /> {t('upcoming-reservations')}
            </div>
            <ul className="upcoming-list">
              {upcomingReservations.map(r => (
                <li key={r.id} className="upcoming-item">
                  <span className="time-display">
                    {formatTime(r.start)} - {formatTime(r.end)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="meta-grid">
          <div className="meta-item" title={t('capacity')}>
            <User size={20} />
            <span>
              {room.capacity ? `${room.capacity} ${t('persons')}` : '-'}
            </span>
          </div>

          <div className="meta-item" title={t('floor')}>
            <MapPin size={20} />
            <span>
              {t('floor')} {room.floorNumber ?? '-'}
            </span>
          </div>

          <div className="meta-item" title={t('accessible')}>
            <Accessibility size={20} />
            <span>{room.isWheelChairAccessible ? t('yes') : t('no')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPopup;
