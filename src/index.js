import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";




//  process.env.NODE_ENV === "production" &&
 Sentry.init({
    dsn: "https://c7efddbef4ad4ab387da22a9bf1b96dc@o1361472.ingest.sentry.io/6702279",
    integrations: [new BrowserTracing()],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.56,
  });
  

  function FallbackComponent() {
    return <div>An error has occurred</div>;
  }
  
  const myFallback = <FallbackComponent />;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Sentry.ErrorBoundary fallback={myFallback} showDialog>
        <BrowserRouter>
    <App />
    </BrowserRouter>
      </Sentry.ErrorBoundary>
    
 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
