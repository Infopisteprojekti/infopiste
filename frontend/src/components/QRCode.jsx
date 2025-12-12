import '@/styles/components/RoomPopup.css';
import '@/styles/components/Button.css';

const QRCode = ({
  id,
  svg,
  openText,
  closeText,
  descText,
  openQr,
  setOpenQr,
}) => {
  const popupId = `popup-${id}`;
  const buttonId = `qrButton-${id}`;

  const isOpen = openQr === id;
  const toggleQr = () => {
    if (isOpen) {
      setOpenQr(null);
    } else {
      setOpenQr(id);
    }
  };

  return (
    <div>
      <button
        type="submit"
        id={buttonId}
        className="button qr-button"
        data-testid={`qr-button-${id}`}
        onClick={toggleQr}
      >
        {isOpen ? closeText : openText}
      </button>

      <div
        id={popupId}
        className={`room-popup ${isOpen ? '' : 'hidden'}`}
        style={{
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
        }}
      >
        <div className="popup-header">
          <h3 className="popup-title">{descText}</h3>
          <button className="button" onClick={toggleQr}>
            {closeText}
          </button>
        </div>

        <div className="popup-content">
          <img src={svg} className="qr" />
        </div>
      </div>
    </div>
  );
};

export default QRCode;
