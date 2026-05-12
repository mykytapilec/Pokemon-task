import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { router } from './app/router';

const style = document.createElement('style');

style.innerHTML = `
  body {
    font-family: 'Comic Sans MS', 'Arial', sans-serif;
  }
`;

document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);