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


//Main App Entry Point. It conatin all route's.
class App extends Component {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props: any) {
        super(props);
        this.state = {
            isloggined: false //Login status variable. updated by login component.
        }
    };

    render() {
        return (
            <Router>
                <div className="App" style={{backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 48px)'}}>
                    {/*
                    //@ts-ignore */}
                    <Navigation {...this.props} isloggined={this.state.isloggined}/>
                    <Container fixed>
                        <Switch>
                            <Redirect exact from="/" to="/login"/>
                            {/*
                            //@ts-ignore */}
                            <Route exact path="/login" render={(props) => <Login {...props} isAuth={(val) => this.setState({isloggined: val})}/>}/>
                            <Route exact path="/register" component={Registration}/>
                            <Route exact path="/reset" component={Reset}/>
                            <Route exact path="/dashboard" component={Dashboard}/>
                            <Route exact path="/addfeedback" component={Addfeedback}/>
                            <Redirect exact from="/*" to="/login"/>
                        </Switch>
                    </Container>
                </div>
                <Footer/>
            </Router>
        );
    }
}


export default App;