import React, { Component } from 'react'
import Button from '@material-ui/core/Button';

class ButtonComponent extends Component {
    constructor(props: any){
        super(props)
    }

    test = () => {
        //@ts-ignore
        this.props.history.push(`${this.props.location}`)
    }

    render() {
        return (
                <Button onClick={this.test} style={{color: 'white'}}>
                    {/*
                    // @ts-ignore */}
                    {this.props.text}
                </Button>
        )
    }
}

export default ButtonComponent
