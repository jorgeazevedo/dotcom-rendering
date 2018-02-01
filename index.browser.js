// @flow

import { hydrate } from 'react-dom';
import Styletron from 'styletron-client';
import { StyletronProvider } from 'styletron-react';

import App from './app';

__webpack_public_path__ = '/assets/javascript/';

const styleElements = document.getElementsByClassName('_styletron_hydrate_');

hydrate(
    <StyletronProvider styletron={new Styletron(styleElements)}>
        <App />
    </StyletronProvider>,
    document.getElementById('app'),
);
