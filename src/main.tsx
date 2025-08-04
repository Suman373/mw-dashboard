import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast';
import { GlobalProvider } from './context/GlobalContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalProvider>
      <Toaster position="top-right"
        reverseOrder={false} />
      <App />
    </GlobalProvider>
  </StrictMode>,
)
