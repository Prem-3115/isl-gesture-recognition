import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner@2.0.3';
import { router } from './routes';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}
