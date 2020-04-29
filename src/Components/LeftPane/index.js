import React from 'react';
import { compose } from 'redux';
import { withFirestore } from 'react-redux-firebase';
import { withHandlers } from "recompose"

const LeftPane = (props) => {
    return (
        <div className={"dashboard_leftpane"}>
            <button onClick={props.addNewTask({ MyTask: "My new task for now." })}>Add</button>
        </div>
    );
}

const enhance = compose(
    withFirestore,
    withHandlers ({
        addNewTask: props => (MyTask) => {
        console.log(MyTask)
        return props.firestore.add({ collection: 'todos' }, MyTask)
      }
    })
  )

export default enhance(LeftPane)