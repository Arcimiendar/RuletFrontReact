import React, {Component} from "react"
import gql from 'graphql-tag'
import {useQuery} from "@apollo/react-hooks";
import {Collapsible, CollapsibleItem, Icon, Collection, CollectionItem} from "react-materialize"
import HeaderFooterWrapper from "../layouts/HeaderFooterWrapper";
import {Redirect} from "react-router-dom";


const GET_DEPARTMENT_DATA_QUERY = gql`
    query ($department_id: Int!){
        department(id: $department_id){
            id
            name
            description
            address
            employees {
                id
                firstName
                lastName
                image
            }
        }
    }
`;


function DepartmentProfilePageChild({onChange, departmentId}) {

    const { loading, error, data } = useQuery(GET_DEPARTMENT_DATA_QUERY, {
            variables: { department_id: departmentId },
        });

    if (loading)
        return <HeaderFooterWrapper>Loading ...</HeaderFooterWrapper>;
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
                    <CollectionItem href={"#"} onClick={() => onChange("/employee/" + e.id)}>
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
                    <CollectionItem href={"#"} onClick={() => {}}>
                        There is no employees in this department.
                    </CollectionItem>
                </Collection>
            </CollapsibleItem>
        );

    return <HeaderFooterWrapper Department={data.department.name} DepartmentId={data.department.id}>
        <div className={"container"}>
            <h1>{data.department.name}</h1>
            <Collapsible>
                {collapsible_items}
            </Collapsible>
        </div>
    </HeaderFooterWrapper>

}

class DepartmentProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            url: null
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(url) {
        this.setState({
            redirect: true,
            url: url
        });
    }
    render() {
        if (this.state.redirect)
            return <Redirect to={this.state.url}/>;

        return <DepartmentProfilePageChild onChange={this.handleChange}
                                           departmentId={this.props.match.params.department_id}/>
    }
}

export default DepartmentProfilePage;