import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Floorplan from './components/Floorplan';
import BulletinBoard from './components/BulletinBoard';
import { AppSettingsProvider } from './context/AppSettingsContext.jsx';

function App() {
  return (
    <AppSettingsProvider>
      <div className="app-container">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Floorplan />} />
            <Route path="/board" element={<BulletinBoard />} />
          </Routes>
        </div>
        <Navbar />
      </div>
    </AppSettingsProvider>
  );
}

export default App;
