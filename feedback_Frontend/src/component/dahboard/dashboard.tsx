import React, {Component} from 'react'
import 'date-fns';
import moment from 'moment'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {withTokenGet} from '../../helper/AxiosGlobal'
import Box from '@material-ui/core/Box';
import {toastError, toastInfo} from "../utils/toast";
import {Loader} from '../utils/loader'


class dashboard extends Component {
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
        },
        data: [],
        loading: false,
    };


    componentDidMount() {
        this.setState({loading: true});
        const token: any = localStorage.getItem('token');
        if (!token) {
            //@ts-ignore
            this.props.history.push('/login')
        } else {
            withTokenGet('feedback/dashboard')
                .then((res) => {
                    if (res.data.success) { this.setState({data: res.data.data}) }
                    if (!(res.data.data.length)) { toastInfo("No feedbacks.") }
                    this.setState({loading: false})
                }).catch(function (err) {
                toastError(`${err.response.data.message}.`);
                //@ts-ignore
                this.setState({loading: false})
            })
        }
    }

    //show all feedbacks.
    feedbacks = () => {
        const {data} = this.state;
        return (
            <Grid container spacing={3}>
                {data.map((value: any) => (
                    <Grid item key={value._id} sm={4}>
                        <Card>
                            <CardContent>
                                variant="outlined"
                                <Typography variant="h5" component="h2">
                                    <Box textAlign="justify" m={1}>{value.feedback}</Box>
                                </Typography>
                            </CardContent>
                            <CardActions>{moment(value.date).fromNow()}</CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        )
    };

//show this when no feedback is available.
    nofeedback = () => {
        return (
            <Grid container>
                <Grid item sm={4}/>
                <Grid item sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h2">{'No feedback available.'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item sm={4}/>
            </Grid>
        )
    };

    render() {
        const {data} = this.state;
        return (
            <div>
                {/*
                //@ts-ignore */}
                <Loader loading={this.state.loading}/>
                <Grid container spacing={6} style={{marginTop: 50, marginBottom: 50}}>
                    <Grid container item sm={12} spacing={4} style={{background: 'rgba(225, 225, 225, 1)'}}>
                    <Grid item sm={12}><h1>Dashboard</h1></Grid>{data.length ? this.feedbacks() : this.nofeedback()}</Grid>
                </Grid>
            </div>
        )
    }
}


export default dashboard