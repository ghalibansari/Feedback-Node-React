import React, {Component} from 'react'
import {InputAdornment, Paper, TextField} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {toastError, toastSuccess} from '../utils/toast'
import {withTokenPost} from "../../helper/AxiosGlobal";
import {RemoveRedEye} from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import {Loader} from '../utils/loader'

//Style
const customStyle = {
    mainDiv: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    div: {
        width: 450,
        marginTop: 50,
        marginBottom: 50,
        paddingTop: 70,
        paddingBottom: 50,
        borderColor: 'black',
    },
    input: {width: '70%'}
};


class login extends Component {
    state = {
        password: '',
        newpassword: '',
        errors: {
            passwordErr: '',
            newpasswordErr: '',
        },
        passwordIsMasked: true,
        oldpasswordIsMasked: true,
        loading: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props: any) {
        super(props)
    };

    componentDidMount() {
        let token = localStorage.getItem('token');
        let userlocal: any = localStorage.getItem('user');
        let user = JSON.parse(userlocal);
        //@ts-ignore
        if (!(user?.first_login) && token) { this.props.history.push('/dashboard') }
        //@ts-ignore
        else if (!token) { this.props.history.push('/login') }
    }

    /**
     * Onchange event listner for all input's
     * @param {event,   type: which button.}
     */
    inputChange = async (event: any, type: any) => {
        await this.setState({[type]: event.target.value});
        const {password, newpassword} = this.state;
        const passwordReg: any = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z-\d]{8,}$/;
        await this.setState((prevState: any) => {
            let errors = {...prevState.errors};
            if (!passwordReg.test(password)) {
                errors.passwordErr = 'password should have min 8 character, atleast 1 number and 1 alphabet.'
            } else {
                errors.passwordErr = ''
            }
            if (!passwordReg.test(newpassword)) {
                errors.newpasswordErr = 'password should have min 8 character, atleast 1 number and 1 alphabet.'
            } else {
                errors.newpasswordErr = ''
            }
            return {errors}
        })
    };

    //password mask for newpassword.
    togglePasswordMask = () => {
        this.setState({
            passwordIsMasked: !this.state.passwordIsMasked,
        });
    };

    //password mask for newpassword.
    toggleOldPasswordMask = () => {
        this.setState({
            oldpasswordIsMasked: !this.state.oldpasswordIsMasked,
        });
    };

    //reset password api.
    resetapi = async () => {
        await this.setState({loading: true});
        const {password, newpassword} = this.state;
        const passwordReg: any = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z-\d]{8,}$/;
        await this.setState((prevState: any) => {
            let errors = {...prevState.errors};
            if (!passwordReg.test(password)) {
                errors.passwordErr = 'password should have min 8 character, atleast 1 number and 1 alphabet.'
            } else {
                errors.passwordErr = ''
            }
            if (!passwordReg.test(newpassword)) {
                errors.newpasswordErr = 'password should have min 8 character, atleast 1 number and 1 alphabet.'
            } else {
                errors.newpasswordErr = ''
            }
            return {errors}
        });
        if (passwordReg.test(password) && passwordReg.test(newpassword)) {
            try {
                let res = await withTokenPost('user/reset', {password, newpassword});
                if (res.data.success) {
                    await this.setState({loading: false});
                    localStorage.clear();
                    toastSuccess(res.data.message);
                    //@ts-ignore
                    this.props.history.push('/login')
                }
            } catch (err) {
                toastError(err.response?.data?.message);
                await this.setState({loading: false})
            }
        }
        await this.setState({loading: false})
    };

    render() {
        const {oldpasswordIsMasked, passwordIsMasked} = this.state;
        return (
            <div style={customStyle.mainDiv}>
                {/*
                //@ts-ignore */}
                <Loader loading={this.state.loading}/>
                <Paper style={customStyle.div} variant='elevation'>
                    <h1>Reset.</h1>
                    <TextField
                        required
                        //@ts-ignore
                        error={this.state.errors.passwordErr}
                        helperText={this.state.errors.passwordErr}
                        label="Old Password"
                        type={oldpasswordIsMasked ? 'password' : 'text'}
                        autoComplete="current-password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={this.toggleOldPasswordMask}
                                    >
                                        <RemoveRedEye/>
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        style={customStyle.input}
                        onChange={event => this.inputChange(event, 'password')}
                    />
                    <br/><br/>
                    <TextField
                        required
                        id="standard-password-input"
                        label="New Password"
                        type={passwordIsMasked ? 'password' : 'text'}
                        //@ts-ignore
                        error={this.state.errors.newpasswordErr}
                        helperText={this.state.errors.newpasswordErr}
                        autoComplete="current-password"
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
                        style={customStyle.input}
                        onChange={event => this.inputChange(event, 'newpassword')}
                    />
                    <br/><br/>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{display: 'flex', width: '70%', justifyContent: 'space-around'}}>
                            <Button onClick={this.resetapi} variant="contained" color="primary">Reset</Button>
                        </div>
                    </div>
                </Paper>
            </div>
        )
    }
}


export default login
