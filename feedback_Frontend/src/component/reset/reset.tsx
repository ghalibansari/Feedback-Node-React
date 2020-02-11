import React, {Component} from 'react'
import {Paper, TextField} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import {toastError, toastSuccess} from '../utils/toast'
import {withTokenPost} from "../../helper/AxiosGlobal";

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
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props: any) {
        super(props)
    };

    state = {
        password: '',
        newpassword: '',
        errors: {
            passwordErr: '',
            newpasswordErr: '',
        }
    };

    componentDidMount() {
        let token = localStorage.getItem('token');
        let userlocal: any = localStorage.getItem('user');
        let user = JSON.parse(userlocal);
        if (!(user?.first_login) && token) {
            //@ts-ignore
            this.props.history.push('/dashboard')
        } else if (!token) {
            //@ts-ignore
            this.props.history.push('/login')
        }
    }

    inputChange = (event: any, type: any) => {
        this.setState({
            [type]: event.target.value,
        }, () => console.log(this.state))
    };

    resetapi = async() => {
        const token: any = localStorage.getItem('token');
        const {password, newpassword} = this.state;
        const passwordReg: any = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z-\d]{8,}$/;
        this.setState((prevState: any) => {
            let errors = {...prevState.errors};
            if (!passwordReg.test(password)) {
                errors.passwordErr = 'password should have min 8 character, 1 number and 1 alphabet.'
            } else {
                errors.passwordErr = ''
            }
            if (!passwordReg.test(newpassword)) {
                errors.newpasswordErr = 'password should have min 8 character, 1 number and 1 alphabet.'
            } else {
                errors.newpasswordErr = ''
            }
            return {errors}
        })
        if (passwordReg.test(password) && passwordReg.test(newpassword)) {
            try{
                let res = await withTokenPost('user/reset', {password, newpassword})
                if(res.data.success){
                    localStorage.clear()
                    // toastSuccess("Password updated successfully please login.")
                    toastSuccess(res.data.message)
                    console.log("sucessssssss========")
                    toastSuccess("res.data.message")
                    //@ts-ignore
                    this.props.history.push('/login')
                }
            } catch (err) { toastError(`Your old ${err.response.data.message}.`) }
        }
    };

    render() {
        return (
            <div style={customStyle.mainDiv}>
                <Paper style={customStyle.div} variant='elevation'>
                    <h1>Reset...</h1>
                    <TextField
                        required
                        id=""
                        helperText={this.state.errors.passwordErr}
                        label="Old Password"
                        type="password"
                        autoComplete="current-password"
                        style={customStyle.input}
                        onChange={event => this.inputChange(event, 'password')}
                    />
                    <br/><br/>
                    <TextField
                        required
                        id="standard-password-input"
                        label="New Password"
                        type="password"
                        helperText={this.state.errors.newpasswordErr}
                        autoComplete="current-password"
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
