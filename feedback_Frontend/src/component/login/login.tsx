import React, {Component} from 'react'
import {Paper, TextField} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {toastError, toastSuccess, toastWarning} from '../utils/toast'
import {withOutTokenPost} from '../../helper/AxiosGlobal'
import crypto from 'crypto'

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
        }
        // else {
            //@ts-ignore
            // this.props.history.push('/login')
        // }
    }

    loginapi = async () => {
        const {email, password} = this.state
        // eslint-disable-next-line no-useless-escape
        const mailReg: any = /^[a-zA-Z]{1,}([.])?[a-zA-Z0-9]{1,}([!@#$%&_-]{1})?[a-zA-Z0-9]{1,}[@]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,3}([.]{1}[a-zA-Z]{2})?$/;
        const passwordReg: any = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z-\d]{8,}$/;
        this.setState((prevState: any) => {
            let errors = {...prevState.errors};
            if (!mailReg.test(email)) {
                errors.emailErr = 'Invalid email'
            } else {
                errors.emailErr = ''
            }
            if (!passwordReg.test(password)) {
                errors.passwordErr = 'Inavlid password'
            } else {
                errors.passwordErr = ''
            }
            return {errors}
        })
        if (mailReg.test(email) && passwordReg.test(password)) {
            try{
                let res = await withOutTokenPost('user/login', {email, password})
                if (res.data.success) {
                    localStorage.setItem('token', res.data.data.jwt_token);
                    localStorage.setItem('user', JSON.stringify(res.data.data.user));
                    if (res.data.data.user.first_login) {
                        // toastSuccess("Please Change your password.")
                        toastWarning("Please Change your password.")
                        //@ts-ignore
                        this.props.history.push('/reset')
                    } else {
                        toastSuccess("Login Successfully.")
                        //@ts-ignore
                        this.props.history.push('/dashboard')
                    }
                }
            } catch (err) {
                toastError(`${err.response.data.message}.`)
            }
        }
    };

    render() {
        return (
            <div style={customStyle.mainDiv}>
                {this.state.redirectto}
                <Paper style={customStyle.div} variant='elevation'>
                    <h1>Login.</h1>
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
                        </div>
                    </div>
                </Paper>
            </div>
        )
    }
}


export default login
