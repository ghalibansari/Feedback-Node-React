import React, {Component} from 'react';
import './App.css';
import {Container} from '@material-ui/core';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import Navigation from './component/navigation'
import Footer from './component/footer/footer'
import Registration from './component/registration/Registration'
import Login from './component/login/login'
import Reset from './component/reset/reset'
import Dashboard from './component/dahboard/dashboard'
import Addfeedback from './component/addfeedback/addfeedback'

class App extends Component {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props: any) {
        super(props)
    };

    render() {
        return (
            <Router>
                <div className="App" style={{backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 48px)'}}>
                    <Navigation {...this.props}/>
                    <Switch>
                        <Container fixed>
                            <Redirect exact from="/" to="/login"/>
                            <Route path="/login" exact component={Login}/>
                            <Route path="/register" exact component={Registration}/>
                            <Route path="/reset" exact component={Reset}/>
                            <Route path="/dashboard" exact component={Dashboard}/>
                            <Route path="/addfeedback" exact component={Addfeedback}/>
                        </Container>
                    </Switch>
                </div>
                <Footer/>
            </Router>
        );
    }
}

export default App;
