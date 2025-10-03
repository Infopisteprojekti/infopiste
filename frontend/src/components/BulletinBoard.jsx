import qrcode from '../assets/QRCode-for-Example-form.png';
import '../css/BulletinBoard.css';

const BulletinBoard = () => {
  return (
    <div>
      <br />
      <h1>Files</h1>
      <img src={qrcode} class='bottomright' width="300" height="300"/>
    </div>
  );
};

export default BulletinBoard;
