import React from "react"
import {Navbar, NavItem} from "react-materialize";

function Header(props) {
    return <Navbar brand={<a>The Rulet Application {props.department}</a>} alignLinks="right">
        <NavItem>
            Employees list
        </NavItem>
        <NavItem>
            Rulet list
        </NavItem>
        <NavItem>
            Clear all departments
        </NavItem>
        <NavItem>
            Home
        </NavItem>
    </Navbar>
}

export default Header;
