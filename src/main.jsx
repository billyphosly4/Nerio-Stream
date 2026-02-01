import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'  
import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './App.jsx'
import { MovieProvider } from './Contexts/MovieContexts'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MovieProvider>
        <App />
      </MovieProvider>
    </BrowserRouter>
  </StrictMode>
);
