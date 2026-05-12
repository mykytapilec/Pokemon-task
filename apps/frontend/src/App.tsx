import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './shared/lib/query-client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { HomePage } from './pages/home';
import { CreateCollectionPage } from './pages/create-collection';
import { CollectionPage } from './pages/collection-details';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateCollectionPage />} />
          <Route path="/collections/:id" element={<CollectionPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};