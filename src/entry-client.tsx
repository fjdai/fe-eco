import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { createRouter } from './router';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { AppProviders } from './AppProviders.client';

const router = createRouter();

ReactDOM.hydrateRoot(
  document.getElementById('root')!,
  <AppProviders>
    <HelmetProvider>
      <CssBaseline />
      <RouterProvider router={router} />
      <ToastContainer autoClose={2500} />
    </HelmetProvider>
  </ AppProviders>
); 