import './css/App.css';
import Favourites from './Pages/Favourites';
import NavBar from './Components/NavBar';
import Home from './Pages/Home';
import Trending from './Pages/Trending';
import MovieDetail from './Pages/MovieDetail';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/favourites' element={<Favourites />} />
          <Route path='/trending' element={<Trending />} />
          <Route path='/movie/:id' element={<MovieDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
