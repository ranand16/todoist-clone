import React from 'react';
import { Form, Button } from 'reactstrap';
import { withRouter } from 'react-router-dom';

const CustomNavbar = (props) => {
  const onSearch = (e) => {
    console.log("On search submit.")
  }

  const onLogout = (e) => {
    console.log(props.firebase)
    props.firebase.logout().then(()=>{
      props.history.push({ pathname: '/' })
    });
  }

  return (
      <nav className={"navBar"}>
        <a id="dashboardNav" href="/dashboard">Todoist</a>
        <a id="aboutNav" href="/about">About</a>
        <a id="gitNav" href="https://github.com/ranand16">Github</a>
        <Form id="searchNav" onSubmit={onSearch} inline>
          <input id="searchNavValue" />
        </Form>
        <Button id="logoutNav" color="link" onClick={onLogout} style={{ color: "white" }}>Logout</Button>
      </nav>
  );
}

export default withRouter(CustomNavbar);