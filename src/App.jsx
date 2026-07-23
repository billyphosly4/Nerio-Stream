import './css/App.css';
import Favourites from './Pages/Favourites';
import NavBar from './Components/NavBar';
import Home from './Pages/Home';
import Trending from './Pages/Trending';
import MovieDetail from './Pages/MovieDetail';
import TVShows from './Pages/TVShows';
import TVDetail from './Pages/TVDetail';
import LiveTV from './Pages/LiveTV';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path='/'               element={<Home />} />
          <Route path='/trending'       element={<Trending />} />
          <Route path='/tv'             element={<TVShows />} />
          <Route path='/favourites'     element={<Favourites />} />
          <Route path='/movie/:id'      element={<MovieDetail />} />
          <Route path='/tv/:id'         element={<TVDetail />} />
          <Route path='/live'           element={<LiveTV />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
