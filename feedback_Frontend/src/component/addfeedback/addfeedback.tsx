import React, {Component} from 'react'
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios'
import {toastError, toastSuccess} from '../utils/toast'
import {withTokenGet, withTokenPost} from "../../helper/AxiosGlobal";

class dashboard extends Component {
    state = {
        user_id: '',
        feedBack: '',
        errors: {
            feedBackErr: '',
        },
        data: [],
        checkDiable: [],
    };

    inputChange = (user_id: any, data: any) => { this.setState({user_id, feedBack: data.target.value}) };

    async componentDidMount() {
        const token: any = localStorage.getItem('token');
        if (!token) {
            //@ts-ignore
            this.props.history.push('/login')
        } else {
            try {
                let res = await withTokenGet('cron/addfeedback')
                if (res.data.success) {
                    let temp = new Array(res.data.data.length).fill(false)
                    this.setState({data: res.data.data, checkDiable: temp});
                } else if (!(res.data.success)) { toastError("No feedbacks Available.") }
            } catch(err) { toastError(`${err.response.data.message}.`) }
        }
    }

    postfeedbackapi = async(index: any) => {
        const token: any = localStorage.getItem('token');
        const {user_id, feedBack} = this.state;
        const feedBackReg: any = '';
        if (feedBack.length) {
            try{
                let res = await withTokenPost('feedback', {user_id, feedback: feedBack})
                console.log(res.data,"datattattatat")
                if(res.data.success) {
                    //@ts-ignore
                    toastSuccess(res.data.message)
                    const arr=[...this.state.checkDiable]
                    //@ts-ignore
                    arr[index]=true
                    this.setState({
                        //@ts-ignore
                        checkDiable: arr
                        // checkDiable: !this.state.checkDiable[index]
                    })
                }
            } catch(err) { toastError(`${err.response.data.message}.`) }
        } else {
            this.setState((prevState: any) => {
                let errors = {...prevState.errors};
                // if (!feedBackReg.test(feedBack)) {
                    if (feedBack.length) {
                    errors.feedBackErr = 'Only Alphabet is allowed.'
                } else {
                    errors.feedBackErr = ''
                }
                return {errors}
            })
        }
    };

    feedbacks = () => {
        const {data} = this.state;
        return(
            <Grid container spacing={3}>
            {data?.map((value: any, index: any) => (
                <Grid item key={value.receiver} sm={4}>
                    <Card>
                        {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                        <img src={value.receiverImage} alt={"Profile picture"}/>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {value.receiverName}
                            </Typography>
                        </CardContent>
                        <input disabled={this.state.checkDiable[index]}  onChange={event => this.inputChange(value.receiver, event)} />
                        <CardActions>
                            <button disabled={this.state.checkDiable[index]} onClick={()=>this.postfeedbackapi(index)}>Submit</button>
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
                <Grid item sm={4}><h1>No feedbacks available.</h1></Grid>
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
                    <Grid item sm={4}><h1>Add Feedback</h1></Grid>
                    <Grid item sm={4}/>
                    {data.length ? this.feedbacks() : this.nofeedback()}
                </Grid>
            </Grid>
        )
    }
}


export default dashboard