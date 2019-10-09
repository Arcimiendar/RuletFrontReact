import React, {Component} from "react"
import HeaderFooterWrapper from "../layouts/HeaderFooterWrapper";
import {Redirect} from "react-router-dom";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import {DEVELOP} from "../../index";

const GET_RULET_SESSION_INFORMATION = gql`
    query ($rulet_session_id: Int!){
        ruletSession(id: $rulet_session_id) {
            active
            ruletChoices {
                employee {
                    id
                    firstName
                    lastName
                    image
                }
                department {
                    name
                }
            }
        }
    }
`;

function RuletSessionResultChild({onChange, ruletId}) {
    let { loading, error, data } = useQuery(GET_RULET_SESSION_INFORMATION, {
        variables: {rulet_session_id: ruletId}
    });
    if (loading)
        return <HeaderFooterWrapper>
            Loading ...
        </HeaderFooterWrapper>;

    if (error)
       return  <HeaderFooterWrapper>
           Error: {error.message}
       </HeaderFooterWrapper>;

    let rows = [];
    let departments = [];
    let employees = [];
    let ruletChoices = data.ruletSession.ruletChoices;
    for (let i = 0; i < ruletChoices.length; i++)
    {
        if (!departments.includes(ruletChoices[i].department.name))
        {
            if (rows.length === 0)
                rows.push([]);
            rows[0].push(<th>{ruletChoices[i].department.name}</th>);
            departments.push(ruletChoices[i].department.name);
            employees[ruletChoices[i].department.name] = [];
        }
        employees[ruletChoices[i].department.name].push(ruletChoices[i].employee);
    }

    for (let i = 0; i < departments.length; i++)
        employees[departments[i]].reverse();

    let break_cycle = true;
    while (break_cycle)
    {
        let is_empty = true;
        rows.push([]);
        for (let i = 0; i < departments.length; i++)
        {
            if (employees[departments[i]].length !== 0 && is_empty)
                is_empty = false;

            if (employees[departments[i]].length === 0)
                rows[rows.length - 1].push(<td> </td>);
            else
            {
                let employee = employees[departments[i]].pop();

                rows[rows.length - 1].push(<td align={"center"}>
                    <a onClick={() => onChange(employee.id)} href={"#"}>
                        <img src={(DEVELOP ? "http://127.0.0.1:8000" : "") + employee.image} alt={""}
                        className={"circle"} height={"4%"}/>{" "}
                        {employee.firstName} {employee.lastName}
                    </a>
                </td>)
            }
        }
        if (is_empty)
        {
            break_cycle = false;
            rows.pop();
        }
        else
            is_empty = true;

    }

    let is_active_label = "";
    if (data.ruletSession.active)
        is_active_label = <h1>This rulet in session. Results are for now.</h1>;

    return <HeaderFooterWrapper>
        <div className={"container section"}>
            {is_active_label}
            <table className={"striped"}>
                {rows.map(r => <tr>{r}</tr>)}
            </table>
        </div>
    </HeaderFooterWrapper>
}

class RuletSessionResult extends Component {
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
        if (this.state.redirect)
            return <Redirect to={"/employee/" + this.state.employee_id}/>;
        return <RuletSessionResultChild onChange={this.handleChange} ruletId={this.props.match.params.rulet_id}/>;
    }
}

export default RuletSessionResult;