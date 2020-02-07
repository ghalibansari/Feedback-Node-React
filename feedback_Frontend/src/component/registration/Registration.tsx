import React, {Component} from 'react'
import 'date-fns';
import {Paper, TextField} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import axios from 'axios'


const customStyle = {
    mainDiv: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    div: {
        // height: 750,
        width: 450,
        marginTop: 100,
        paddingTop: 90,
        paddingBottom: 50,
        marginBottom: 50,
        borderColor: 'black',
    },
    input: {width: '70%'}
};

class registration extends Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        dob: '',
        gender: 1,
        profilImage: '',
        errors: {
            firstNameErr: '',
            lastNameErr: '',
            emailErr: '',
            dobErr: '',
            genderErr: '',
            profilImageErr: '',
        }
    };

    inputChange = (event: any, type: any) => {
        this.setState({
            [type]: event.target.value,
        }, () => {
            console.log(this.state)
        })
    };

    registerapi = () => {
        const {firstName, lastName, email, dob, gender, profilImage} = this.state;
        const firstNameReg: any = /^[A-Za-z]+$/;
        const lastNameReg: any = /^[A-Za-z]+$/;
        // eslint-disable-next-line no-useless-escape
        const emailReg: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const dobReg: any = '';
        const genderReg: any = '';
        const profilImageReg: any = '';
        if (firstNameReg.test(firstName) && lastNameReg.test(lastName) && emailReg.test(email) && dobReg !== dob && genderReg !== gender && profilImageReg !== profilImage) {
            axios.post('http://localhost:3000/user', {
                firstName,
                lastName,
                email,
                dob,
                gender,
                profilImage,
            }).then((res) => {
                console.log(res.data)
            })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            this.setState((prevState: any) => {
                var errors = {...prevState.errors};
                if (!firstNameReg.test(firstName)) {
                    errors.firstNameErr = 'Only Aphabet is allowed.'
                } else {
                    errors.firstNameErr = ''
                }
                if (!lastNameReg.test(lastName)) {
                    errors.lastNameErr = 'Only Aphabet is allowed.'
                } else {
                    errors.lastNameErr = ''
                }
                if (!emailReg.test(email)) {
                    errors.emailErr = 'Invalid Email.'
                } else {
                    errors.emailErr = ''
                }
                if (!(dobReg !== dob)) {
                    errors.dobErr = 'Please Provide dob.'
                } else {
                    errors.dobErr = ''
                }
                if (!(genderReg !== gender)) {
                    errors.genderErr = 'Please select one.'
                } else {
                    errors.genderErr = ''
                }
                if (!(profilImageReg !== profilImage)) {
                    errors.profilImageErr = 'Please upload image.'
                } else {
                    errors.profilImageErr = ''
                }
                return {errors}
            })
        }
    };

    render() {
        return (
            <div style={customStyle.mainDiv}>
                <Paper style={customStyle.div} variant='elevation'>
                    <h1>Registration...</h1>
                    <TextField
                        required
                        id=""
                        helperText={this.state.errors.firstNameErr}
                        label="First Name"
                        type="firstName"
                        autoComplete="firstName"
                        style={customStyle.input}
                        onChange={event => this.inputChange(event, 'firstName')}
                    />
                    <br/><br/>
                    <TextField
                        required
                        id=""
                        label="Last Name"
                        type="lastName"
                        helperText={this.state.errors.lastNameErr}
                        autoComplete=""
                        style={customStyle.input}
                        onChange={event => this.inputChange(event, 'lastName')}
                    />
                    <br/><br/>
                    <TextField
                        required
                        id="Email"
                        label="email"
                        type="email"
                        helperText={this.state.errors.emailErr}
                        autoComplete=""
                        style={customStyle.input}
                        onChange={event => this.inputChange(event, 'email')}
                    />
                    <br/><br/>
                    <FormLabel component="legend"
                               color="secondary"
                    >Date of Birth *</FormLabel>
                    <TextField
                        required
                        id=""
                        type="Date"
                        autoComplete=""
                        helperText={this.state.errors.dobErr}
                        style={customStyle.input}
                        onChange={event => this.inputChange(event, 'dob')}
                    />
                    <br/><br/>
                    <div style={customStyle.input}>
                        <FormLabel component="legend">Gender *</FormLabel>
                        <RadioGroup style={{alignItems: 'center'}} aria-label="gender" name="gender1"
                                    value={this.state.gender} onChange={event => this.inputChange(event, 'gender')}>
                            <FormControlLabel value="1" control={<Radio/>} label="Male"/>
                            <FormControlLabel value="0" control={<Radio/>} label="Female"/>
                        </RadioGroup>
                    </div>
                    <br/><br/>
                    <FormLabel component="legend"
                               color="secondary"
                    >Profile Image *</FormLabel>
                    <input
                        accept="image/*"
                        style={{display: 'none'}}
                        id="contained-button-file"
                        onChange={event => this.inputChange(event, 'profilImage')}
                        type="file"
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" color="primary" component="span">
                            Upload
                        </Button>
                    </label>
                    <span style={{color: 'red'}}>{this.state.errors.profilImageErr}</span>
                    <br/><br/>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{display: 'flex', width: '70%', justifyContent: 'space-around'}}>
                            <Button onClick={this.registerapi} variant="contained" color="primary">Registration</Button>
                        </div>
                    </div>
                </Paper>
            </div>
        )
    }
}


export default registration
