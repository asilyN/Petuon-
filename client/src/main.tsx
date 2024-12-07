import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import RoutesComponent from '../src/Routes';  
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoutesComponent /> 
  </StrictMode>
);
