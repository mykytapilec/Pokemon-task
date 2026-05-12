import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './shared/lib/query-client';
import { App } from './App';

const style = document.createElement('style');

style.innerHTML = `
  body {
    font-family: 'Comic Sans MS', 'Arial', sans-serif;
  }
`;

document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);