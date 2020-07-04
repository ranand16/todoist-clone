import React from 'react';
import { Route, Redirect}  from 'react-router-dom';
export const ProtectedRoute = ({component:Component,...rest}) =>{
    return (
        <Route {...rest} render={(props)=>{
            const auth = rest["auth"];
            const loggedData = JSON.parse(window.localStorage.getItem('loggedUserData'))
            console.log(auth, loggedData)
            if(!auth.isEmpty){
                console.log(props.location.pathname)
                if(props.location.pathname === "/" || props.location.pathname === "/signin" ){
                    this.props.history.push('/dashboard')
                }
                return <Component {...props}/>
            }else{
                return (<Redirect to={{
                    pathname:"/",
                    state:{ from:props.location }
                }}/>);
            }
        }}/>
    )
}
export default ProtectedRoute
    

