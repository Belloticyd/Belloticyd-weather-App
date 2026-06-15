import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// FIXED: Corrected folder path spelling from 'contest' to 'context' and normalized spacing
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'  // Add this line

import { initGA, trackEvent } from './utils/analytics'

const queryClient = new QueryClient()

// Initialize analytics in production
if (import.meta.env.PROD) {
    initGA()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)