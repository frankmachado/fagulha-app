import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = document.getElementById('root');

if (!root) {
  throw new Error('O elemento #root não foi encontrado.');
}

root.classList.add('react-root-mounted');

document.body.classList.add('react-spa');

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
