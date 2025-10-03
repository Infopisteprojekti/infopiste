import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import qrcode from '../../../backend/mockdata/QRCode-for-Example-form.png';
import '../css/BulletinBoard.css';

const BulletinBoard = () => {
  return (
    <TransformWrapper initialScale={1} minScale={1} maxScale={5}>
      <>
        <div className="bottomright">
          <img src={qrcode} width="300" height="300" />
        </div>

        <TransformComponent
          wrapperStyle={{ width: '100%', height: '100vh' }}
          contentStyle={{ width: '100%', height: '100%' }}
        >
          <br />
          <h1>Files</h1>
        </TransformComponent>
      </>
    </TransformWrapper>
  );
};

export default BulletinBoard;
