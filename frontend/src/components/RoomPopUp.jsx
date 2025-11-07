import { useTranslation } from 'react-i18next';

import '@/styles/components/RoomPopUp.css'

const RoomPopUp = ({ room, onClose }) => {
  const { t } = useTranslation();

  if (!room) return null;

  return (
    <div className="room-pop-up">
      <div>
        <p>{room.displayName}</p>
        <p>{room.status}</p>
      </div>
      <button onClick={onClose}>{t('close')}</button>
    </div>
  );
};

export default RoomPopUp;