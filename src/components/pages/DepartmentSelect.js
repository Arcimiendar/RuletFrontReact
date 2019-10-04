import gql from 'graphql-tag'
import React, { Component } from "react";
import {Select, Button, Icon} from "react-materialize"
import {useQuery} from "@apollo/react-hooks";
import HeaderFooterWrapper from "../layouts/HeaderFooterWrapper";
import {Redirect} from "react-router-dom"
import M from "materialize-css"

const GET_DEPARTMENTS_QUERY = gql`
    query getRuletSessions{
        departments{
            id
            name
        }
    }
`;

function DepartmentSelectChild({ onChange }) {

    // M.AutoInit();
    const { loading, error, data } = useQuery(GET_DEPARTMENTS_QUERY);
    if (loading)
        return <HeaderFooterWrapper>Loading...</HeaderFooterWrapper>;
    if (error)
        return <HeaderFooterWrapper>Error: {error}</HeaderFooterWrapper>;
    return <HeaderFooterWrapper>
        <div className={"section container"}>
            <Select label={"chose department"} id={"selected"}>
                {data.departments.map(department => <option value={department.id}>{department.name}</option>)}
            </Select>
            <Button type="submit" waves="light" onClick={() => {
                let select = document.getElementById("selected");
                onChange(select.options[select.selectedIndex].value);
            }}>
                Submit
                <Icon right>
                    send
                </Icon>
            </Button>
        </div>
    </HeaderFooterWrapper>
}

class DepartmentSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            department_id: 0
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(department_id) {
        this.setState({
            redirect: true,
            department_id: department_id
        });
    }
    render() {
        if (this.state.redirect)
            return <Redirect to={"/department/" + this.state.department_id}/>;
        return <DepartmentSelectChild onChange={this.handleChange}/>
    }
}

export default DepartmentSelect;