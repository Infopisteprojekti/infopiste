import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Floorplan from './components/Floorplan';
import BulletinBoard from './components/BulletinBoard';
import UnicafeMenu from './components/UnicafeMenu';

function App() {
  return (
    <div className="app-container">
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Floorplan />} />
          <Route path="/board" element={<BulletinBoard />} />
          <Route path="/unicafe" element={<UnicafeMenu />} />
        </Routes>
      </div>
      <Navbar />
    </div>
  );
}

export default App;
