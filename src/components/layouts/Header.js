import React, {Component} from "react"
import {Navbar, NavItem} from "react-materialize";
import {Redirect} from "react-router-dom";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            link: null
        };
        this.handleEmployeesLink = this.handleEmployeesLink.bind(this);
        this.handleHomeLink = this.handleHomeLink.bind(this);
        this.handleRuletsLink = this.handleRuletsLink.bind(this);
    }

    handleEmployeesLink(e) {
        if (window.location.pathname !== "/employees_list/")
            this.setState({redirect: true, link: "/employees_list/"});
    }

    handleHomeLink(e) {
        if (window.location.pathname !== "/")
            this.setState({redirect: true, link: "/"})
    }

    handleRuletsLink(e) {
        if (window.location.pathname !== "/rulet/list/")
            this.setState({redirect: true, link: "/rulet/list/"});
    }

    render() {

        if (this.state.redirect)
            return <Redirect to={this.state.link}/>;

        return <Navbar brand={<a>The Rulet Application {this.props.department}</a>} alignLinks="right">
            <NavItem onClick={this.handleEmployeesLink}>
                Employees list
            </NavItem>
            <NavItem onClick={this.handleRuletsLink}>
                Rulet list
            </NavItem>
            <NavItem>
                Clear all departments
            </NavItem>
            <NavItem onClick={this.handleHomeLink}>
                Home
            </NavItem>
        </Navbar>
    }
}

export default Header;
