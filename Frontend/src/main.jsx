import React from 'react'
import ReactDOM from 'react-dom/client'
import {  QueryClient, QueryClientProvider } from "@tanstack/react-query"
import App from './App.jsx'
import './index.css'

// Create a client for React Query
const queryclient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryclient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
