import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { ErrorBoundary } from "react-error-boundary"
import './index.css'
import './i18n';
import App from './App.tsx'

// import MaintenanceError from './features/errors/maintenance-error.tsx'

createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
    {/* <ErrorBoundary
      FallbackComponent={MaintenanceError}
      onReset={() => window.location.replace("/")}
    > */}
      <App />
    {/* </ErrorBoundary> */}
  </StrictMode>,
)
