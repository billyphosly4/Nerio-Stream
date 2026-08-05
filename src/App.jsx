import { useState } from 'react';
import './css/App.css';
import Favourites from './Pages/Favourites';
import TopNavbar from './Components/TopNavbar';
import Sidebar from './Components/Sidebar';
import BottomNav from './Components/BottomNav';
import MiniPlayer from './Components/MiniPlayer';
import Home from './Pages/Home';
import Trending from './Pages/Trending';
import MovieDetail from './Pages/MovieDetail';
import TVShows from './Pages/TVShows';
import TVDetail from './Pages/TVDetail';
import LiveTV from './Pages/LiveTV';
import Profile from './Pages/Profile';
import Downloads from './Pages/Downloads';
import Subscriptions from './Pages/Subscriptions';
import SearchResults from './Pages/SearchResults';
import { Routes, Route } from 'react-router-dom';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <TopNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden" style={{ paddingTop: '4rem' }}>
        <Sidebar isOpen={isSidebarOpen} />
        
        <div className="flex-1 flex flex-col relative min-w-0 w-full max-w-full overflow-x-hidden">
          <main className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll pb-28 w-full max-w-full break-words px-6 py-6 md:px-8 md:py-8" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            <Routes>
              <Route path='/'               element={<Home />} />
              <Route path='/trending'       element={<Trending />} />
              <Route path='/tv'             element={<TVShows />} />
              <Route path='/favourites'     element={<Favourites />} />
              <Route path='/movie/:id'      element={<MovieDetail />} />
              <Route path='/tv/:id'         element={<TVDetail />} />
              <Route path='/live'           element={<LiveTV />} />
              <Route path='/profile'        element={<Profile />} />
              <Route path='/downloads'      element={<Downloads />} />
              <Route path='/subscriptions'  element={<Subscriptions />} />
              <Route path='/search'         element={<SearchResults />} />
            </Routes>
          </main>
        </div>
      </div>

      <MiniPlayer />
      <BottomNav />
    </div>
  );
}

export default App;
