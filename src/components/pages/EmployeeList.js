import React, {Component} from "react";
import {Collection, CollectionItem} from "react-materialize"
import HeaderFooterWrapper from "../layouts/HeaderFooterWrapper";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import {Redirect} from "react-router-dom";

const GET_EMPLOYEES_QUERY = gql`
    query {
        employees {
            id
            firstName
            lastName
            image
            department {
                name
            }
        }
    }

`;


function PrintDepartment({department}) {
    if (department)
        return ". Is in the " + department.name;
    else
        return "";
}

function EmployeeListChild({ onChange }) {

    let { loading, error, data } = useQuery(GET_EMPLOYEES_QUERY);
    if (loading)
        return <HeaderFooterWrapper>Loading ... </HeaderFooterWrapper>;
    if (error)
        return <HeaderFooterWrapper> Error: {error.message}</HeaderFooterWrapper>;

    let collection_items = <CollectionItem href={"#"} onClick={() => onChange(-1)}>
        there is no employees yet. Go home.
    </CollectionItem>;
    if (data.employees.length > 0)
        collection_items = data.employees.map(e =>  <CollectionItem href={"#"}  onClick={() => onChange(e.id)} >
            <img src={"http://127.0.0.1:8000" + e.image} alt={""}
                 className={"circle"} width={"4%"} height={"4%"}/> {e.firstName} {e.lastName}
                 <PrintDepartment department={e.department}/>
        </CollectionItem>);

    return <HeaderFooterWrapper>
        <div className={"section"}>
            <Collection>
                {collection_items}
            </Collection>
        </div>
    </HeaderFooterWrapper>
}

class EmployeeList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            employee_id: 0
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(employee_id) {
        this.setState({
            redirect: true,
            employee_id: employee_id
        });
    }
    render() {
        if (this.state.redirect) {
            if (this.state.employee_id < 0)
                return <Redirect to={"/"}/>;
            return <Redirect to={"/employee/" + this.state.employee_id}/>;
        }
        return <EmployeeListChild onChange={this.handleChange}/>
    }
}


export default EmployeeList;