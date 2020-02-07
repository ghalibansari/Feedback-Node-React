import React, {Component} from 'react'
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios'

class dashboard extends Component {
    state = {
        user_id: '',
        feedBack: '',
        errors: {
            feedBackErr: '',
        },
        data: [],
    };

    inputChange = (user_id: any, data: any) => {
        console.log(user_id, "=====", data);
        this.setState({
            user_id,
            feedBack: data.target.value
        })
    };

    componentDidMount() {
        const token: any = localStorage.getItem('token');
        if (!token) {
            //@ts-ignore
            this.props.history.push('/login')
        }
        axios.get('http://localhost:3000/cron/addfeedback', {headers: {Authorization: `${token}`}})
            .then((res) => {
                console.log(res.data.data);
                // eslint-disable-next-line eqeqeq
                if (res.status == 200) {
                    this.setState({
                        data: res.data.data
                    })
                }
                console.log(this.state.data)
            })
    }

    postfeedbackapi = () => {
        const token: any = localStorage.getItem('token');
        const {user_id, feedBack} = this.state;
        const feedBackReg: any = /^[A-Za-z]+$/;
        if (feedBackReg.test(feedBack)) {
            axios.post('http://localhost:3000/feedback', {
                user_id,
                feedback: feedBack,
            }, {headers: {Authorization: `${token}`}}).then((res) => {
                console.log(res.data)
            })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            this.setState((prevState: any) => {
                var errors = {...prevState.errors};
                if (!feedBackReg.test(feedBack)) {
                    errors.feedBackErr = 'Only Alphabet is allowed.'
                } else {
                    errors.feedBackErr = ''
                }
                return {errors}
            })
        }
    };

    render() {
        const {data} = this.state;
        return (
            <Grid container spacing={1} style={{marginTop: 50, marginBottom: 50}}>
                <Grid container item sm={12} spacing={4} style={{background: 'rgba(225, 225, 225, 1)'}}>
                    <Grid item sm={4}/>
                    <Grid item sm={4}><h1>Add Feedback</h1></Grid>
                    <Grid item sm={4}/>


                    {data?.map((value: any) => (
                        <Grid item key={value.receiver} sm={4}>
                            <Card>
                                {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                                <img src={value.receiverImage} alt={"Profile picture"}/>
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {value.receiverName}
                                    </Typography>
                                </CardContent>
                                <input
                                    onChange={event => this.inputChange(value.receiver, event)}
                                />
                                <CardActions>
                                    <button onClick={this.postfeedbackapi}>Submit</button>
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