import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import { AuthProvider } from './context/auth';
import 'antd/dist/reset.css'
import './styles/AuthStyles.css'
import './styles/CartStyles.css'
import './styles/CategoryProductStyles.css'

import './styles/ProductDetailsStyles.css'
import { SearchProvider } from './context/search';
import { CartProvider } from './context/cart';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<AuthProvider> 
  
  <SearchProvider>
    <CartProvider>
<BrowserRouter>
  

  {/* <React.StrictMode> */}
    <App />
  {/* </React.StrictMode> */}

  </BrowserRouter>
  </CartProvider>
  </SearchProvider>

    </AuthProvider>
  
  
);


reportWebVitals();
