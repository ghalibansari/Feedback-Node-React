import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

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

    lougout = () => {
        localStorage.clear();
        // this.setState(this.getInitialState())
        // this.setState({
        //   authenticated: '',
        //   user: {},
        // })
        //@ts-ignore
        console.log(this.props.history.push, "=========>>>>>>>>>>>>>>>>>>>");
        //@ts-ignore
        this.props.history.push('/login')
    };

    render() {
        const {user} = this.state;
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
                                    <Link to="/dashboard" style={{color: 'white'}}><Button
                                        color="inherit">DashBoard</Button></Link>
                                    <Link to="/addfeedback" style={{color: 'white'}}><Button color="inherit">Add
                                        FeedBack</Button></Link>
                                    <Link to="" style={{color: 'white'}}><Button color="inherit"
                                                                                 onClick={this.lougout}>Logout</Button></Link>
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
                                    <Link style={{color: 'white'}} to="/login"><Button
                                        color="inherit">Login</Button></Link>
                                    <Link to="/register" style={{color: 'white'}}><Button
                                        color="inherit">Registration</Button></Link>
                                    <Link to="/reset" style={{color: 'white'}}><Button
                                        color="inherit">Reset</Button></Link>
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