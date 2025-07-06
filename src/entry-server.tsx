import ReactDOMServer from 'react-dom/server';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { createServerRouter } from './router';
import { CssBaseline } from '@mui/material';
import { AppProviders } from './AppServerProvider';

export function render(url: string) {
  const helmetContext = {};
  const router = createServerRouter(url);
  
  const html = ReactDOMServer.renderToString(
    <AppProviders >
      <HelmetProvider context={helmetContext}>
        <CssBaseline />
        <RouterProvider router={router} />
      </HelmetProvider>
      </AppProviders >
  );

  return { html, helmetContext };
} 