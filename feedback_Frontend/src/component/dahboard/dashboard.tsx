import React, {Component} from 'react'
import 'date-fns';
import moment from 'moment'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {withTokenGet} from '../../helper/AxiosGlobal'
import {toastError} from "../utils/toast";

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
    };

    componentDidMount() {
        const token: any = localStorage.getItem('token');
        if (!token) {
            //@ts-ignore
            this.props.history.push('/login')
        } else {
            withTokenGet('feedback/dashboard')
                .then((res) => {
                    if(res.data.success) {this.setState({data: res.data.data})}
                    if(!(res.data.data.length)) {toastError("No feedbacks.")}
                }).catch(function(err) {
                toastError(`${err.response.data.message}.`)
            })
        }
    }

    feedbacks = () => {
        const {data} = this.state;
        return(
            <Grid container spacing={3}>
            {data.map((value: any) => (
                <Grid item key={value._id} sm={4}>
                    <Card>
                        <p title="Your Feedback">Your Feedback</p>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {value.feedback}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            {moment(value.date).fromNow()}
                        </CardActions>
                    </Card>
                </Grid>
            ))}
            </Grid>
        )
    }

    nofeedback = () => {
        return(
            <Grid container>
                <Grid item sm={4}/>
                <Grid item sm={4}><h1>No feedbacks</h1></Grid>
                <Grid item sm={4}/>
            </Grid>
        )
    }

    render() {
        const {data} = this.state;
        return (
            <Grid container spacing={6} style={{marginTop: 50, marginBottom: 50}}>
                <Grid container item sm={12} spacing={4} style={{background: 'rgba(225, 225, 225, 1)'}}>
                    <Grid item sm={4}/>
                    <Grid item sm={4}><h1>Dashboard</h1></Grid>
                    <Grid item sm={4}/>
                    {data.length ? this.feedbacks() : this.nofeedback()}
                </Grid>
            </Grid>
        )
    }
}


export default dashboard