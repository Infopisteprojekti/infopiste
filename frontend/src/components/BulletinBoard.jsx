import qrcode from '../assets/QRCode-for-Example-form.png';
import '../css/BulletinBoard.css';

const BulletinBoard = () => {
  return (
    <div>
      <button
        type="submit"
        id="openbutton"
        className="openbutton"
        onClick={() => {
          document.getElementById('popup').classList.add('open-popup');
          document.getElementById('openbutton').style.visibility = 'hidden';
        }}
      >
        Add file
      </button>
      <div className="popup" id="popup">
        <img src={qrcode} className="bottomright" />
        <button
          type="button"
          className="closebutton"
          onClick={() => {
            document.getElementById('popup').classList.remove('open-popup');
            document.getElementById('openbutton').style.visibility = 'visible';
          }}
        >
          Close
        </button>
      </div>

      <br />
      <h1>Files</h1>
    </div>
  );
};

export default BulletinBoard;
