import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

window.addEventListener('error', (event) => {
  document.body.innerHTML = `<div style="color: red; padding: 20px;">
    <h1>Runtime Error</h1>
    <pre>${event.error?.message || event.message}</pre>
    <pre>${event.error?.stack}</pre>
  </div>`;
});

const root = ReactDOM.createRoot(document.getElementById('root'));

try {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );

} catch (error) {
  console.error('Render failed:', error);
  root.render(<h1>Something went wrong: {error.message}</h1>);
}
