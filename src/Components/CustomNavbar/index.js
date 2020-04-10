import React , { useState } from 'react';
// import { Nav, NavItem, NavLink, Navbar, NavbarBrand, NavbarToggler, Collapse, Form, FormGroup, NavbarText, Button, Input } 
import { Form } from 'reactstrap';
// import {material, octicons} from 'styled-icons'

const CustomNavbar = (props) => {
  // const [isOpen, setIsOpen] = useState(false);

  // const toggle = () => setIsOpen(!isOpen);
  const onSearch = (e) => {
    console.log("On search submit.")
  }
  return (
      <nav className={"navBar"}>
        <a id="dashboardNav" href="/dashboard">Todoist</a>
        <a id="aboutNav" href="/about">About</a>
        <a id="gitNav" href="https://github.com/ranand16">Github</a>
        <Form id="searchNav" onSubmit={onSearch} inline>
          <input id="searchNavValue" />
        </Form>
        <a id="logoutNav" href="/dashboard">Logout</a>
      </nav>
  );
}

export default CustomNavbar;