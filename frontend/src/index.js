import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import App from './App';

function showFatalError(err) {
  const message =
    (err && (err.stack || err.message)) ||
    (typeof err === 'string' ? err : null) ||
    'Unknown error';

  let el = document.getElementById('__fatal_error__');
  if (!el) {
    el = document.createElement('div');
    el.id = '__fatal_error__';
    el.style.position = 'fixed';
    el.style.inset = '12px';
    el.style.zIndex = '999999';
    el.style.padding = '12px 14px';
    el.style.borderRadius = '12px';
    el.style.border = '1px solid rgba(0,0,0,0.2)';
    el.style.background = 'rgba(255,255,255,0.95)';
    el.style.color = '#111827';
    el.style.fontFamily =
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
    el.style.fontSize = '12px';
    el.style.whiteSpace = 'pre-wrap';
    el.style.overflow = 'auto';
    document.body.appendChild(el);
  }

  el.textContent = `App crashed before rendering.\n\n${message}`;
}

window.addEventListener('error', (e) => showFatalError(e.error || e.message));
window.addEventListener('unhandledrejection', (e) => showFatalError(e.reason));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
