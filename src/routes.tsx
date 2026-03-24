import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { PracticePage } from './components/pages/PracticePage';
import { AlphabetChart } from './components/pages/AlphabetChart';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
      children: [
      { index: true, Component: PracticePage },
      { path: 'chart', Component: AlphabetChart },
      { path: '*', Component: PracticePage },
    ],
  },
]);
