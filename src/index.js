import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import WhatDoIOwe from './app';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<WhatDoIOwe />, document.getElementById('root'));
registerServiceWorker();
