import ReactDOMServer from 'react-dom/server';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { createServerRouter } from './router';
import { store } from './redux/store';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';

export function render(url: string) {
  const helmetContext = {};
  const router = createServerRouter(url);
  
  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <HelmetProvider context={helmetContext}>
        <CssBaseline />
        <RouterProvider router={router} />
         <ToastContainer autoClose={2500} />
      </HelmetProvider>
    </Provider>
  );

  return { html, helmetContext };
} 