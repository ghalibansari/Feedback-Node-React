import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//Main App imported and then rendered in html.
ReactDOM.render(<div><App/><ToastContainer/></div>, document.getElementById('root'));
