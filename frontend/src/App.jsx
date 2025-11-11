import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Floorplan from './components/Floorplan';
import BulletinBoard from './components/BulletinBoard';
import { AppSettingsProvider } from './context/AppSettingsContext.jsx';
import LoadingContext from './context/LoadingContext';
import { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <AppSettingsProvider>
      <LoadingContext value={{ loading, setLoading }}>
        <div className="app-container">
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Floorplan />} />
              <Route path="/board" element={<BulletinBoard />} />
            </Routes>
          </div>
          <Navbar />
        </div>
      </LoadingContext>
    </AppSettingsProvider>
  );
}

export default App;
