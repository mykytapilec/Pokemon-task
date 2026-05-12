import { createBrowserRouter } from 'react-router-dom';

import { HomePage } from '../../pages/home';
import { CreateCollectionPage } from '../../pages/create-collection';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/create',
    element: <CreateCollectionPage />,
  },
]);