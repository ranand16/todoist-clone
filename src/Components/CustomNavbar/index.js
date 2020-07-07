import React, { useState } from 'react';
import { Form, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withRouter } from 'react-router-dom';

const CustomNavbar = (props) => {
  const [settingToggle, setSettingToggle] = useState(false)
  const onSearch = (e) => {
    console.log("On search submit.")
  }

  const onLogout = (e) => {
    console.log(props.firebase)
    props.firebase.logout().then(()=>{
      props.history.push({ pathname: '/' })
    });
  }

  const onSettingGear = () => {
    console.log(props.firebase)
    // props.toggleSettingsGear();
    settingToggle?setSettingToggle(false):setSettingToggle(true)
  }

  const toggleProfileModal = () => {
    console.log("Toggle profile modal")
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
        <Button id="settingsGear" color="link" onClick={onSettingGear} style={{ color: "white" }}>
          
        </Button>
         
        <ButtonDropdown className={"dropDwonMwnu"} isOpen={true} toggle={onSettingGear}>
            <DropdownToggle style={{ color: "grey" }} color="link">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-gear-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 0 0-5.86 2.929 2.929 0 0 0 0 5.858z"/>
              </svg>
            </DropdownToggle>
            <DropdownMenu right>
                <DropdownItem><span onClick={toggleProfileModal.bind(this, "")}>Profile</span></DropdownItem>
            </DropdownMenu>
        </ButtonDropdown>
      </nav>
  );
}

export default withRouter(CustomNavbar);