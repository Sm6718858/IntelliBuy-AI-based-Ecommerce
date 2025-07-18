import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css'
import App from './App.jsx'
import { Auth } from './Context/Auth.jsx'
import { Search } from './Context/Search.jsx';
import { Cart } from './Context/Cart.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'antd/dist/reset.css';

createRoot(document.getElementById('root')).render(
  <Auth>
    <Search>
      <BrowserRouter>
        <Cart>
          <StrictMode>
            <App />
          </StrictMode>
        </Cart>
      </BrowserRouter>
    </Search>
  </Auth>
)
