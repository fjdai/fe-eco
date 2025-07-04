import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { createRouter } from './router';
import { store } from './redux/store';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';

const router = createRouter();

ReactDOM.hydrateRoot(
  document.getElementById('root')!,
  <Provider store={store}>
    <HelmetProvider>
      <CssBaseline />
      <RouterProvider router={router} />
       <ToastContainer autoClose={2500} />
    </HelmetProvider>
  </Provider>
); 