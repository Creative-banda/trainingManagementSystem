import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ContextProvider from '../context/user_context.jsx'
import ModalContextProvider from '../context/modal_context.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ContextProvider>
      <ModalContextProvider>
        <App />
      </ModalContextProvider>
    </ContextProvider>
  </BrowserRouter>
)
