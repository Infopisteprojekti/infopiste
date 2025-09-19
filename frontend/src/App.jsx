import { useState } from 'react';
import Floorplan from './Floorplan';
import Pdfview from './Pdfview.jsx';
import './css/reset.css';

function App() {
  const [active, setactive] = useState(1);

  const handleClick = () => {
      setactive(!active);
  };

  return (
    <>
      <div>
        <button onClick={handleClick}>pdfs</button>
        {active ? <Floorplan /> : <Pdfview />}
      </div>
    </>
  );
}

export default App;
