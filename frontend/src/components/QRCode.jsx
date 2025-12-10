import { useState } from 'react';
import '@/styles/components/RoomPopup.css';
import '@/styles/components/Button.css';

const QRCode = ({ svg, openText, closeText, descText }) => {
  const [qrState, setQrState] = useState(false);

  const toggleQr = () => {
    const newState = !qrState;
    if (newState) {
      document.getElementById('popup').classList.remove('hidden');
    } else {
      document.getElementById('popup').classList.add('hidden');
    }
    setQrState(newState);
  };

  return (
    <div>
      <button
        type="submit"
        id="qrButton"
        className="button qr-button"
        data-testid="qr-button"
        onClick={toggleQr}
      >
        {qrState ? closeText : openText}
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
