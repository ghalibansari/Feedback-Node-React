import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ButtonComponent from './ButtonComponent'


//Style's.
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


//Navigation.
class navigation extends Component {
    state = {
        authenticated: false,
        user: {},
    };

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props: any) {
        super(props)
    };

    static getDerivedStateFromProps(props: any, state: any) {
        let token = localStorage.getItem('token');
        let userlocal: any = localStorage.getItem('user');
        let user = JSON.parse(userlocal);
        if (token !== null && token !== undefined) { return { authenticated: true, user } }
        else {
            if (props.isloggined !== state.authenticated) { return { authenticated: props.isloggined } }
            return null;
        }
    }

    componentDidMount() {
        let token: any = localStorage.getItem('token');
        let userlocal: any = localStorage.getItem('user');
        let user = JSON.parse(userlocal);
        if (token !== null && token !== undefined) { this.setState({ authenticated: true, user }) }
        //@ts-ignore
        else { this.setState({ authenticated: this.props.isloggined }) }
    };

    //Logout function. clears all state and localStrorage.
    logout = () => {
        localStorage.clear();
        this.setState({ authenticated: false, user: {} })
        //@ts-ignore
        this.props.history.push('/login')
    };

    /**
     * Show Login and Registration button when user in Authenticated.
     * @param {text: text is visible on button,    loaction: next page loaction.}
     */
    noUser = (text: string, location: string) => {
        return (
            <div style={customStyles.maindiv}>
                <div style={customStyles.subdiv}>
                    <Typography variant="h6" style={{alignSelf: 'center',}}>FeedBack Application</Typography>
                </div>
                <div style={{alignSelf: 'center',}}>
                    {/*
                    // @ts-ignore */}
                    <ButtonComponent text={text} location={location} history={this.props.history}/>
                </div>
            </div>
        )
    };

    /**
     * Show User profile, name , Dashbiard and Addfeedback button when user is Authenticated.
     * @param {text: text is visible on button,    loaction: next page loaction.}
     */
    yesUser = (text: string, location: string) => {
        const {user} = this.state;
        return (
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
                    {/*
                    // @ts-ignore */}
                    <ButtonComponent text={text} location={location} history={this.props.history}/>
                    <Link to="" style={{color: 'white'}}><Button color="inherit" onClick={this.logout}>Logout</Button></Link>
                </div>
            </div>
        )
    };

    render() {
        let text = '';
        let location = '';
        //@ts-ignore
        if (this.props.location.pathname === '/login') { text = 'register';  location = '/register' }   //Condition when on Login Page.
        //@ts-ignore
        else if (this.props.location.pathname === '/register') { text = 'login';  location = '/login' }    //Condition when on Registration Page.
        //@ts-ignore
        else if (this.props.location.pathname === '/dashboard') { text = 'addfeedback';  location = '/addfeedback' }    //Condition when on AddFeedBack Page.
        //@ts-ignore
        else if (this.props.location.pathname === '/addfeedback') { text = 'dashboard';  location = '/dashboard' }    //Condition when on Dashboard Page.
        return (
            <AppBar position="static">
                <Toolbar>{ this.state.authenticated ? this.yesUser(text, location) : this.noUser(text, location) }</Toolbar>
            </AppBar>
        );
    }
}


//@ts-ignore
export default (withRouter(navigation))