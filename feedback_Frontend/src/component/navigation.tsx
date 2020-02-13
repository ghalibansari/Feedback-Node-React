import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ButtonComponent from './ButtonComponent'

const customStyles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    maindiv: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between'
    },
    subdiv: {display: 'flex'}
};

class navigation extends Component {
    state = {
        authenticated: '',
        user: {},
        currentRoute: true
    };

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props: any) {
        super(props)
    };

    componentDidMount() {
        let userlocal: any = localStorage.getItem('user');
        let user = JSON.parse(userlocal);
        this.setState({
            authenticated: localStorage.getItem('token'),
            user,
        })
    };

    hideRoute = async () => {
        //@ts-ignore
        // console.log(this.props.history.location.pathname)
        // setTimeout(this.setState({
        //     //@ts-ignore
        //     currentRoute: this.props.location.pathname,
        // }), 1000)
        await this.setState({
            //@ts-ignore
            currentRoute: !this.state.currentRoute,
        })
        console.log(this.state.currentRoute)
    }

    logout = () => {
        localStorage.clear();
        this.setState({
          authenticated: '',
          user: {},
        })
        //@ts-ignore
        this.props.history.push('/login')
    };

    render() {
        const {user} = this.state;
        let text = ''
        let location = ''
        //@ts-ignore
        if(this.props.location.pathname === '/login'){
            text = 'register'
            location = '/register'
            //@ts-ignore
        } else if(this.props.location.pathname === '/register') {
            text = 'login'
            location = '/login'
            //@ts-ignore
        } else if(this.props.location.pathname === '/dashboard') {
            text = 'addfeedback'
            location = '/addfeedback'
            //@ts-ignore
        } else if(this.props.location.pathname === '/addfeedback') {
            text = 'dashboard'
            location = '/dashboard'
        }
        return (
            <AppBar position="static">
                <Toolbar>
                    {
                        this.state.authenticated
                            ?
                            <div style={customStyles.maindiv}>
                                <div style={customStyles.subdiv}>
                                    <IconButton edge="start" color="inherit" aria-label="menu">
                                        {/*
                                        // @ts-ignore */}
                                        <Avatar alt="Remy Sharp" src={user.profile_img}/>
                                    </IconButton>
                                    <Typography variant="h6" style={{alignSelf: 'center',}}>
                                        {/*
                                        // @ts-ignore */}
                                        {user.firstName} {user.lastName}
                                    </Typography>
                                </div>
                                <div style={{alignSelf: 'center',}}>
                                    {/* <Link to="/dashboard" style={{color: 'white'}}><Button
                                        color="inherit">DashBoard</Button></Link>
                                    <Link to="/addfeedback" style={{color: 'white'}}><Button color="inherit">Add
                                        FeedBack</Button></Link> */}
                                    {/*
                                    // @ts-ignore */}
                                    <ButtonComponent text={text} location={location} history={this.props.history}/>
                                    <Link to="" style={{color: 'white'}}><Button color="inherit" onClick={this.logout}>Logout</Button></Link>
                                </div>
                            </div>
                            :
                            <div style={customStyles.maindiv}>
                                <div style={customStyles.subdiv}>
                                    <Typography variant="h6" style={{alignSelf: 'center',}}>
                                        FeedBack Application
                                    </Typography>
                                </div>
                                <div style={{alignSelf: 'center',}}>
                                    {/*<Link to="/login" hidden={!this.state.currentRoute} style={{color: 'white'}}><Button color="inherit" onClick={this.hideRoute}>Login</Button></Link>*/}
                                    {/*<Link to="/register" hidden={this.state.currentRoute} style={{color: 'white'}}><Button color="inherit" onClick={this.hideRoute}>Registration</Button></Link>*/}
                                    {/* <Link to="/login" hidden={!this.state.currentRoute} style={{color: 'white'}}><Button color="inherit" onClick={this.hideRoute}>Login</Button></Link>
                                    <Link to="/register" hidden={this.state.currentRoute} style={{color: 'white'}}><Button color="inherit" onClick={this.hideRoute}>Registration</Button></Link> */}
                                    {/*
                                    // @ts-ignore */}
                                    <ButtonComponent text={text} location={location} history={this.props.history}/>
                                </div>
                            </div>
                    }
                </Toolbar>
            </AppBar>
        );
    }
}


//@ts-ignore
export default (withRouter(navigation))