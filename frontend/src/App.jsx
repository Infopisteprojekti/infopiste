import { Routes, Route, Link } from 'react-router-dom';
import Floorplan from './components/Floorplan';
import BulletinBoard from './components/BulletinBoard';

function App() {

  return (
    <div>
      <div className='navbar'>
          <Link className='navbar-button' to='/'>Floorplan</Link>
          <Link className='navbar-button' to='/board'>Bulletin Board</Link>
      </div>
      <div>
        <Routes>
          <Route
            path='/'
            element={
              <div>
                <Floorplan />
              </div>
            }
          />
          <Route path='/board' element={<BulletinBoard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
