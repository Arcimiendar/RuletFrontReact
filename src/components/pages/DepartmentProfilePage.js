import React from "react"
import gql from 'graphql-tag'
import {useQuery} from "@apollo/react-hooks";
import {Collapsible, CollapsibleItem, Icon, Collection, CollectionItem} from "react-materialize"
import HeaderFooterWrapper from "../layouts/HeaderFooterWrapper";


const GET_DEPARTMENT_DATA_QUERY = gql`
    query ($department_id: Int!){
        department(id: $department_id){
            id
            name
            description
            address
            employees {
                firstName
                lastName
                image
            }
        }
    }
`;


function DepartmentProfilePage(props) {
    console.log(props);
    let department_id = props.match.params.department_id;
    console.log(department_id);
    const { loading, error, data } = useQuery(GET_DEPARTMENT_DATA_QUERY, {
            variables: { department_id },
        });

    if (loading)
        return <HeaderFooterWrapper>"Loading ...";</HeaderFooterWrapper>;
    if (error)
        return <HeaderFooterWrapper>Error: {error.message}</HeaderFooterWrapper>;
    let collapsible_items = [];
    if (data.department.address)
        collapsible_items.push(
            <CollapsibleItem header={"Address"} icon={<Icon>place</Icon>}>
                {data.department.address}
            </CollapsibleItem>
        );
    if (data.department.description.length > 0)
        collapsible_items.push(
            <CollapsibleItem header={"Description"} icon={<Icon>description</Icon>}>
              {data.department.description}
          </CollapsibleItem>
        );
    if (data.department.employees.length > 0)
        collapsible_items.push(
            <CollapsibleItem header={"Employees"} icon={<Icon>face</Icon>}>
                <Collection>
                    {data.department.employees.map(e =>
                    <CollectionItem href={"#"}>
                        <img src={"http://127.0.0.1:8000" + e.image} alt={""}
                             className={"circle"} width={"4%"} height={"4%"}/>
                        {e.firstName} {e.lastName}
                    </CollectionItem>
                    )}
                </Collection>
            </CollapsibleItem>
        );
    else
        collapsible_items.push(
            <CollapsibleItem header={"Employees"} icon={<Icon>face</Icon>}>
                <Collection>
                    <CollectionItem href={""}>
                        There is no employees in this department.
                    </CollectionItem>
                </Collection>
            </CollapsibleItem>
        );

    return <HeaderFooterWrapper Department={data.department.name}>
        <div className={"container"}>
            <h1>{data.department.name}</h1>
            <Collapsible>
                {collapsible_items}
            </Collapsible>
        </div>
    </HeaderFooterWrapper>

}

export default DepartmentProfilePage;