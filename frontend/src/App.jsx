import { Routes, Route, Link } from 'react-router-dom';
import Floorplan from './components/Floorplan';
import BulletinBoard from './components/BulletinBoard';

function App() {
  return (
    <div>
      <div>
        <Link style={{ marginRight: 10 }} to="/">
          Floorplan
        </Link>
        <Link to="/board">Bulletin Board</Link>
      </div>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <div style={{ marginTop: 40 }}>
                <Floorplan />
              </div>
            }
          />
          <Route path="/board" element={<BulletinBoard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
