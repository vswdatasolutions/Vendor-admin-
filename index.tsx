import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // Explicit .tsx extension

// Get the root element from the HTML.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount the React application.");
}

// Create a React root and render the App component in Strict Mode.
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);