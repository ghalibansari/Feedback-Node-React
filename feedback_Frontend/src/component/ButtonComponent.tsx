import React, {Component} from 'react'
import Button from '@material-ui/core/Button';

class ButtonComponent extends Component {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props: any) {
        super(props)
    }

    //Button click action.
    click = () => {
        //@ts-ignore
        this.props.history.push(`${this.props.location}`)
    };

    render() {
        return (
            <Button onClick={this.click} style={{color: 'white'}}>
                {/*
                // @ts-ignore */}
                {this.props.text}
            </Button>
        )
    }
}


export default ButtonComponent