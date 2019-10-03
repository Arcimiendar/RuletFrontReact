import gql from 'graphql-tag'
import React from "react";
import {Select, Button, Icon} from "react-materialize"
import M from 'materialize-css'
import {useQuery} from "@apollo/react-hooks";

const GET_DEPARTMENTS_QUERY = gql`
    query getRuletSessions{
        departments{
            id
            name
        }
    }
`;

function DepartmentSelect() {

    M.AutoInit();
    const { loading, error, data } = useQuery(GET_DEPARTMENTS_QUERY);
    if (loading)
        return <div>Loading...</div>;
    if (error)
        return <div>Error: {error}</div>;
    return <div className={"section container"}>
        <Select>
            {data.departments.map(department => <option value={department.id}>{department.name}</option>)}
        </Select>
        <Button type="submit" waves="light">
            Submit
            <Icon right>
                send
            </Icon>
        </Button>
    </div>
}

export default DepartmentSelect;