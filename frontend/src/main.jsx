import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; 
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import store from './store/store.js'

createRoot(document.getElementById('root')).render(
   <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter> {/* ⚠️ Important */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
