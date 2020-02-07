import React, {Component} from 'react';

class footer extends Component {

    render() {
        return (
            <div className="card-footer"
                 style={{backgroundColor: '#3f51b5', bottom: '0', width: '100%', textAlign: 'center'}}>
                <span className="" style={{color: 'white'}}>FeedBack Application copy rights.</span>
            </div>
        );
    }
}

export default footer