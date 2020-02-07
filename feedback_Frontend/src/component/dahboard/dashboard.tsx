import React, {Component} from 'react'
import 'date-fns';
import moment from 'moment'
import {CardHeader} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios'

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
        }
        axios.get('http://localhost:3000/feedback/dashboard', {headers: {Authorization: `${token}`}})
            .then((res) => {
                console.table(res.data.data);
                // eslint-disable-next-line eqeqeq
                if (res.status == 200) {
                    console.log('inside if');
                    this.setState({
                        data: res.data.data
                    })
                }
            })
    }

    render() {
        const {data} = this.state;
        return (
            <Grid container spacing={1} style={{marginTop: 50, marginBottom: 50}}>
                <Grid container item sm={12} spacing={4} style={{background: 'rgba(225, 225, 225, 1)'}}>
                    <Grid item sm={4}/>
                    <Grid item sm={4}><h1>Dashboard</h1></Grid>
                    <Grid item sm={4}/>

                    {data.map((value: any) => (
                        <Grid item key={value._id} sm={4}>
                            <Card>
                                <CardHeader title="Your Feedback"/>
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
            </Grid>
        )
    }
}


export default dashboard