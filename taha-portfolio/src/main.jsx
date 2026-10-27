import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import { SiteProvider } from './context/SiteContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <SiteProvider>
        <App />
      </SiteProvider>
    </ErrorBoundary>
    <Analytics />
  </StrictMode>,
)
