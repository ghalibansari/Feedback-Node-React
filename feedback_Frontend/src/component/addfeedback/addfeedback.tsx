import React, {Component} from 'react'
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {toastError, toastSuccess} from '../utils/toast'
import {withTokenGet, withTokenPost} from "../../helper/AxiosGlobal";
import {Loader} from '../utils/loader'


class dashboard extends Component {
    state = {
        user_id: '',
        feedBack: '',
        errors: {
            feedBackErr: '',
        },
        data: [],
        checkDiable: [],
        loading: true,
    };

    /**
     * Onchange event listner for all input's
     * @param {event,   type: which button.}
     */
    inputChange = (user_id: any, data: any) => {
        this.setState({user_id, feedBack: data.target.value})
    };

    async componentDidMount() {
        this.setState({loading: true});
        const token: any = localStorage.getItem('token');
        if (!token) {
            //@ts-ignore
            this.props.history.push('/login')
        } else {
            try {
                let res = await withTokenGet('cron/addfeedback');
                if (res.data.success) {
                    let temp = new Array(res.data.data.length).fill(false);
                    this.setState({data: res.data.data, checkDiable: temp});
                    this.setState({loading: false})
                } else if (!(res.data.success)) {
                    toastError("No feedbacks Available.")
                }
            } catch (err) {
                toastError(`${err.response.data.message}.`)
            }
        }
        this.setState({loading: false})
    }

    /**
     * Submit feedback.
     * @param {user_id,  feedBack}
     */
    postfeedbackapi = async (index: any) => {
        this.setState({loading: true});
        const {user_id, feedBack} = this.state;
        if (feedBack.length) {
            try {
                let res = await withTokenPost('feedback', {user_id, feedback: feedBack});
                console.log(res.data, "datattattatat");
                if (res.data.success) {
                    toastSuccess(res.data.message);
                    this.setState({loading: false});
                    const arr = [...this.state.checkDiable];
                    //@ts-ignore
                    arr[index] = true;
                    this.setState({ checkDiable: arr })
                }
                this.setState({loading: false})
            } catch (err) {
                toastError(`${err.response.data.message}.`)
            }
        } else {
            this.setState((prevState: any) => {
                let errors = {...prevState.errors};
                if (feedBack.length) {
                    errors.feedBackErr = 'feedback cannot be blank.'
                } else {
                    errors.feedBackErr = ''
                }
                return {errors}
            })
        }
        this.setState({loading:false})
    };

    //show all feedbacks to be given.
    feedbacks = () => {
        const {data} = this.state;
        return (
            <Grid container spacing={3}>
                <Grid item sm={4}/>
                <Grid item sm={4}><h1>Add Feedback.</h1></Grid>
                <Grid item sm={4}/>
                {data?.map((value: any, index: any) => (
                    <Grid item key={value.receiver} sm={4}>
                        <Card>
                            <img src={value.receiverImage} alt={"Profile picture"} style={{position: 'relative', width: '100%', height: '170px'}}/>
                            <CardContent>
                                <Typography variant="h5" component="h2">{value.receiverName}</Typography>
                            </CardContent>
                            <TextField
                                id="outlined-textarea"
                                disabled={this.state.checkDiable[index]}
                                label="Feedback."
                                multiline
                                variant="outlined"
                                onChange={event => this.inputChange(value.receiver, event)}
                            />
                            <br/><br/>
                            <Button variant="contained" color="primary" disabled={this.state.checkDiable[index]} onClick={() => this.postfeedbackapi(index)}>Submit</Button>
                            <br/><br/>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        )
    };

    //show this when no feedback is available to submit.
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
                        {data.length ? this.feedbacks() : this.nofeedback()}
                    </Grid>
                </Grid>
            </div>
        )
    }
}


export default dashboard