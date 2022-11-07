import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { FronteggProvider } from '@frontegg/react';

const contextOptions = {
    baseUrl: 'https://app-na8f2nf315s2.stg.frontegg.com',
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <FronteggProvider contextOptions={contextOptions} hostedLoginBox={false}>
        <App />
    </FronteggProvider>,
);