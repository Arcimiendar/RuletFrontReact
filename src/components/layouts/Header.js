import React, {Component} from "react"
import {Navbar, NavItem, Switch} from "react-materialize";
import {Redirect} from "react-router-dom";
import {Mutation} from "react-apollo";
import gql from "graphql-tag";

const CLEAR_ALL_DEPARTMENTS_MUTATION = gql`
    mutation {
        clearAllDepartment {
            departments{
                id
            }
        }
    }
`;

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
            <NavItem>
                <div className="switch"><label style={{color: "white"}}>
                    template<input type="checkbox" checked={true}
                                   onClick={() => window.location.host = '127.0.0.1:8000'}/>
                    <span className="lever"></span>react</label></div>
            </NavItem>
            <NavItem onClick={this.handleEmployeesLink}>
                Employees list
            </NavItem>
            <NavItem onClick={this.handleRuletsLink}>
                Rulet list
            </NavItem>
            <Mutation mutation={CLEAR_ALL_DEPARTMENTS_MUTATION}>
                { (handleMutation, {data}) => <NavItem onClick={() => handleMutation()}>
                    Clear all departments
                </NavItem>}
            </Mutation>
            <NavItem onClick={this.handleHomeLink}>
                Home
            </NavItem>
        </Navbar>
    }
}

export default Header;
