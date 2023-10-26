import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.scss'
import { BrowserRouter} from 'react-router-dom'
import StoreProvide from './redux/store';

import RenderGetSizeWindow from './components/ComponentWindow/RenderGetSizeWindow.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <RenderGetSizeWindow>
      <BrowserRouter>
        <StoreProvide>
            <App />
        </StoreProvide>
      </BrowserRouter>
    </RenderGetSizeWindow>
)
