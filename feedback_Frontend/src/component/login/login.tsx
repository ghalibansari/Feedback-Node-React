import React, {Component} from 'react'
import {Paper, TextField} from '@material-ui/core';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import axios from 'axios'

const customStyle = {
    mainDiv: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    div: {
        height: 350,
        width: 450,
        marginTop: 100,
        marginBottom: 50,
        paddingTop: 70,
        paddingBottom: 100,
        borderColor: 'black',
    },
    input: {width: '70%'}
};

class login extends Component {
    state = {
        email: '',
        password: '',
        errors: {
            emailErr: '',
            passwordErr: '',
        },
        redirectto: ``
    };

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props: any) {
        super(props)
    };

    inputChange = (event: any, type: any) => {
        this.setState({
            [type]: event.target.value,
        })
    };

    componentDidMount() {
        let token = localStorage.getItem('token');
        if (token) {
            //@ts-ignore
            this.props.history.push('/dashboard')
            // this.props.history.push('/reset')
        } else {
            //@ts-ignore
            this.props.history.push('/login')
        }
    }

    loginapi = () => {
        const {email, password} = this.state;
        // eslint-disable-next-line no-useless-escape
        const mailReg: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const passwordReg: any = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z-\d]{8,}$/;
        if (mailReg.test(email) && passwordReg.test(password)) {
            axios.post('http://localhost:3000/user/login', {
                email,
                password,
            }).then((res) => {
                if (res.data.success) {
                    localStorage.setItem('token', res.data.data.jwt_token);
                    localStorage.setItem('user', JSON.stringify(res.data.data.user));
                    if (res.data.data.user.first_login) {
                        //@ts-ignore
                        this.props.history.push('/reset')
                    } else {
                        //@ts-ignore
                        this.props.history.push('/dashboard')
                    }
                }
            })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            this.setState((prevState: any) => {
                var errors = {...prevState.errors};
                if (!mailReg.test(email)) {
                    errors.emailErr = 'Invalid email'
                } else {
                    errors.emailErr = ''
                }
                if (!passwordReg.test(password)) {
                    errors.passwordErr = 'Invalid password'
                } else {
                    errors.passwordErr = ''
                }
                return {errors}
            })
        }
    };

    render() {
        return (
            <div style={customStyle.mainDiv}>
                {this.state.redirectto}
                <Paper style={customStyle.div} variant='elevation'>
                    <h1>Login...</h1>
                    <TextField
                        required
                        id=""
                        helperText={this.state.errors.emailErr}
                        label="Email"
                        type="email"
                        autoComplete="current-password"
                        style={customStyle.input}
                        onChange={event => this.inputChange(event, 'email')}
                    />
                    <br/><br/>
                    <TextField
                        required
                        id="standard-password-input"
                        label="Password"
                        type="password"
                        helperText={this.state.errors.passwordErr}
                        autoComplete="current-password"
                        style={customStyle.input}
                        onChange={event => this.inputChange(event, 'password')}
                    />
                    <br/><br/>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{display: 'flex', width: '70%', justifyContent: 'space-around'}}>
                            <Button onClick={this.loginapi} variant="contained" color="primary">Login</Button>
                            <Link to="/dashboard"><Button variant="contained">Dash</Button></Link>
                            <Link to="/addfeedback"><Button variant="contained">FeedBack</Button></Link>
                        </div>
                    </div>
                </Paper>
            </div>
        )
    }
}


export default login
