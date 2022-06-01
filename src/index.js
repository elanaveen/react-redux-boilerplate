import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './routes/App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import configureStore from './store';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={configureStore()}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate: (e) => {
    const { waiting: { postMessage = null } = {}, update } = e || {};
    if (postMessage) {
      postMessage({ type: 'SKIP_WAITING' });
    }
    update().then(() => {
      window.location.reload();
    });
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
