import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import { SiteProvider } from './context/SiteContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteProvider>
      <App />
    </SiteProvider>
    <Analytics />
  </StrictMode>,
)
