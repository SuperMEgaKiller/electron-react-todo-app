import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from "./src/App";
import { BrowserRouter } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import './styles.css';

ReactDOM.render(
    <App />,
    document.getElementById('app')
);