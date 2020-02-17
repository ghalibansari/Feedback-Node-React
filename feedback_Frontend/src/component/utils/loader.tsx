import React from "react";
import {css} from "@emotion/core";
// First way to import
import {ClipLoader} from "react-spinners";
// Another way to import. This is recommended to reduce bundle size
// import ClipLoader from "react-spinners/ClipLoader";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    position: fixed;
    top: calc(50% - 75px);
    left: calc(50% - 75px);
    z-index: 2;
`;

class Loader extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {
            //@ts-ignore
            loading: this.props.loading
        };
    }

    render() {
        return (
            <div className="sweet-loading">
                {/* <div className="animate" style={{position: 'fixed', background: 'black', opacity: '0.7', zIndex: '1', top: '0', right: '0', left: '0', bottom: '0'}}> */}
                <ClipLoader
                    css={override}
                    size={150}
                    //size={"150px"} this also works
                    color={"#123abc"}
                    // @ts-ignore
                    loading={this.props.loading}
                />
                {/* </div> */}
            </div>
        );
    }
}

export {Loader}