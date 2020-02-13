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
					<Container fixed>
						<Switch>
							<Redirect exact from="/" to="/login"/>
							<Route exact path="/login" component={Login}/>
							<Route exact path="/register"  component={Registration}/>
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
