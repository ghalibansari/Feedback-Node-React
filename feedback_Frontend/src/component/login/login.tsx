import React, {Component} from 'react'
import {InputAdornment, Paper, TextField} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {toastError, toastSuccess, toastWarning} from '../utils/toast'
import {withOutTokenPost} from '../../helper/AxiosGlobal'
import IconButton from '@material-ui/core/IconButton';
import {Loader} from '../utils/loader'
import {RemoveRedEye} from '@material-ui/icons';
import {Constants} from '../../helper/constant'

//style
const customStyle = {
    mainDiv: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    div: {
        // height: 350,
        width: 450,
        marginTop: 100,
        marginBottom: 50,
        paddingTop: 70,
        paddingBottom: 50,
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
        passwordIsMasked: true,
        loading: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props: any) {
        super(props)
    };

    //toggle password visibility on login page.
    togglePasswordMask = () => { this.setState({ passwordIsMasked: !this.state.passwordIsMasked }) };

    inputChange = async (event: any, inputType: any) => {
        await this.setState({[inputType]: event.target.value});
        const {email, password} = this.state;
        const mailReg: any = Constants.emailReg
        const passwordReg: any = Constants.passwordReg
        await this.setState((prevState: any) => {
            let errors = {...prevState.errors};
            if (inputType === 'email') {
                //@ts-ignore
                if (email === '' ) { errors.emailErr = Constants.required }
                else if (!mailReg.test(email)) { errors.emailErr = Constants.emailErr }
                else { errors.emailErr = '' }
            }
            if (inputType === 'password') {
                if (password === '' ) { errors.passwordErr = Constants.required }
                else if (!passwordReg.test(password)) { errors.passwordErr = Constants.passwordErr }
                else { errors.passwordErr = '' }
            }
            return {errors}
        })
    };

    componentDidMount() {
        const token: any = localStorage.getItem('token');
        //@ts-ignore
        if (token !== null && token !== undefined) { this.props.isAuth(true) }
        //@ts-ignore
        else { this.props.isAuth(false) }
        if (token !== null) {
            //@ts-ignore
            this.props.history.push('/dashboard')
        } else {
            //@ts-ignore
            this.props.history.push('/login')
        }
    }

    /**
     * Login api.
     * @param {email,   password}
     */
    loginapi = async () => {
        const {email, password} = this.state;
        // eslint-disable-next-line no-useless-escape
        const mailReg: any = Constants.emailReg
        const passwordReg: any = Constants.passwordReg;
        await this.setState((prevState: any) => {
            let errors = {...prevState.errors};
            if (!mailReg.test(email)) { errors.emailErr = Constants.emailErr }
            else { errors.emailErr = Constants.blank }
            if (!passwordReg.test(password)) { errors.passwordErr = Constants.passwordErr }
            else { errors.passwordErr = Constants.blank }
            return {errors}
        });
        if (mailReg.test(email) && passwordReg.test(password)) {
            this.setState({loading: true});
            try {
                let res = await withOutTokenPost('user/login', {email, password});
                if (res.data.success) {
                    this.setState({loading: false});
                    localStorage.setItem('token', res.data.data.jwt_token);
                    localStorage.setItem('user', JSON.stringify(res.data.data.user));
                    if (res.data.data.user.first_login) {
                        toastWarning("Please Change your password.");
                        //@ts-ignore
                        this.props.history.push('/reset')
                    } else {
                        toastSuccess("Login Successfully.");
                        //@ts-ignore
                        this.props.history.push('/dashboard')
                    }
                }
            } catch (err) {
                this.setState({loading: false});
                toastError(`${err.response?.data?.message}.`)
            }
        }
    };

    render() {
        const {passwordIsMasked} = this.state;
        return (
            <div style={customStyle.mainDiv}>
                {/*
                //@ts-ignore */}
                <Loader loading={this.state.loading}/>
                <Paper style={customStyle.div} variant='elevation'>
                    <h1>Login.</h1>
                    <TextField
                        required
                        //@ts-ignore
                        error={this.state.errors.emailErr ? true : false}
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
                        // type="password"
                        type={passwordIsMasked ? 'password' : 'text'}
                        //@ts-ignore
                        error={this.state.errors.passwordErr ? true : false}
                        helperText={this.state.errors.passwordErr}
                        autoComplete="current-password"
                        style={customStyle.input}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={this.togglePasswordMask}
                                    >
                                        <RemoveRedEye/>
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
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