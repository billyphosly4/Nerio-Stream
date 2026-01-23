import './App.css';
import Favourites from './Pages/Favourites'
import NavBar from './Components/NavBar'; 
import Home from './Pages/Home'
import {Routes, Route} from 'react-router-dom'
function App() {
  return (
    <div>
      <NavBar />
   <main className="main-content">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/favourites' element={<Favourites />} />
      </Routes>
   </main>
   </div>
  )
}


export default App;
