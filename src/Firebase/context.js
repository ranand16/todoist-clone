import React from 'react';

export const withFirebase = (Component) => {
 return React.forwardRef((props, ref) => (
 <FirebaseContext.Consumer>
   {firebase => <Component ref={ref} {...props} firebase={firebase} />}
 </FirebaseContext.Consumer>
))};

const FirebaseContext = React.createContext(null);

export default FirebaseContext;
