import React, { Component } from 'react';
// import { withFirebase } from '../../Firebase';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {

        };
    }
    render() {
        return(
            <div className={"contents"}>
                
            </div>
        )
    }
}

// const mapStateToProps = (state) => {
//     return {
//         projects: state.project.projects
//     }
// }

// export default connect(mapStateToProps)(withRouter(Dashboard))
export default (withRouter(Dashboard))