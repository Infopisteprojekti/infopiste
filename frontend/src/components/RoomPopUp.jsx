import { useTranslation } from 'react-i18next';
import '../styles/components/RoomPopUp.css';

const RoomPopUp = ({ roomId, status, onClose }) => {
  const { t } = useTranslation();

  if (!roomId || !status) return null;

  return (
    <div className="room-pop-up">
      <div>
        {t('room-status-message', {
          roomId,
          status: t(`room-status.${status}`),
        })}
      </div>
      <button onClick={onClose}>{t('close')}</button>
    </div>
  );
};

export default RoomPopUp;
