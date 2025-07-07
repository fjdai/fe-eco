import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from './router';
import { AppProviders } from './AppProviders.client';

const router = createRouter();

// Suppress hydration warnings in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Warning: Text content did not match')) {
      return;
    }
    if (typeof args[0] === 'string' && args[0].includes('Warning: Expected server HTML')) {
      return;
    }
    originalError.call(console, ...args);
  };
}

// Check if the root element exists and handle hydration safely
const rootElement = document.getElementById('root');
if (rootElement) {
  // Always use hydrateRoot for consistency with SSR
  try {
    React.startTransition(() => {
      ReactDOM.hydrateRoot(
        rootElement,
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      );
    });
  } catch (error) {
    console.warn('Hydration failed, falling back to client-side render:', error);
    // Fallback to client-side rendering if hydration fails
    rootElement.innerHTML = '';
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    );
  }
} 