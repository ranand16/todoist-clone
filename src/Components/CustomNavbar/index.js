import React from 'react';
import { Form } from 'reactstrap';

const CustomNavbar = (props) => {
  const onSearch = (e) => {
    console.log("On search submit.")
  }

  const onLogout = (e) => {
    console.log(props.firebase)
    props.firebase.doSignOut();
  }

  return (
      <nav className={"navBar"}>
        <a id="dashboardNav" href="/dashboard">Todoist</a>
        <a id="aboutNav" href="/about">About</a>
        <a id="gitNav" href="https://github.com/ranand16">Github</a>
        <Form id="searchNav" onSubmit={onSearch} inline>
          <input id="searchNavValue" />
        </Form>
        <a id="logoutNav" href="/" onClick={onLogout}>Logout</a>
      </nav>
  );
}

export default CustomNavbar;