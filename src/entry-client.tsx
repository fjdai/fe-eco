import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from './router';
import { AppProviders } from './AppProviders.client';

const router = createRouter();

// Check if the root element exists and handle hydration safely
const rootElement = document.getElementById('root');
if (rootElement) {
  // Use hydrateRoot for SSR hydration to avoid mismatches
  if (rootElement.innerHTML.trim()) {
    // If there's already content, we're hydrating from SSR
    ReactDOM.hydrateRoot(
      rootElement,
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );
  } else {
    // If no content, we're client-side rendering
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );
  }
} 