import React from "react";
import {Collection, CollectionItem} from "react-materialize"
import HeaderFooterWrapper from "../layouts/HeaderFooterWrapper";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";

const GET_EMPLOYEES_QUERY = gql`
    query {
        employees {
            id
            firstName
            lastName
            image
        }
    }

`

function EmployeeList() {

    let { loading, error, data } = useQuery(GET_EMPLOYEES_QUERY);
    if (loading)
        return <HeaderFooterWrapper>Loading ... </HeaderFooterWrapper>;
    if (error)
        return <HeaderFooterWrapper> Error: {error.message}</HeaderFooterWrapper>;

    let collection_items = <CollectionItem>
        there is no employees yet. Go home.
    </CollectionItem>;
    if (data.employees.length > 0)
        collection_items = data.employees.map(e =>  <CollectionItem href={"#"}>
            <img src={"http://127.0.0.1:8000" + e.image} alt={""}
                 className={"circle"} width={"4%"} height={"4%"}/>
            {e.firstName} {e.lastName}
        </CollectionItem>);

    return <HeaderFooterWrapper>
        <Collection>
            {collection_items}
        </Collection>
    </HeaderFooterWrapper>
}

export default EmployeeList;