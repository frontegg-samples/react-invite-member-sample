import React from 'react';
import ReactDOM from 'react-dom'; // For react 17
// For react 18: import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { FronteggProvider } from '@frontegg/react';

const contextOptions = {
    baseUrl: 'https://app-na8f2nf315s2.stg.frontegg.com',
    clientId: 'f2d98a73-6925-4e17-8e4c-1f579811d2a8'
};

// For react 18:
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
ReactDOM.render(
    <FronteggProvider contextOptions={contextOptions}>
        <App />
    </FronteggProvider>,
    document.getElementById('root')
);