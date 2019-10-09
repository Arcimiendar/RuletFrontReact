import React, {Component} from "react"
import gql from 'graphql-tag'
import {useQuery} from "@apollo/react-hooks";
import {Collapsible, CollapsibleItem, Icon, Collection, CollectionItem, Button} from "react-materialize";
import HeaderFooterWrapper from "../layouts/HeaderFooterWrapper";
import {Redirect} from "react-router-dom";
import {Mutation} from "react-apollo";
import {DEVELOP} from "../../index";


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

const CLEAR_DEPARTMENT_MUTATION = gql`
    mutation ($id: Int!){
        clearDepartment(id: $id){
            department{
                id
            }
        }
    }
`;

function DepartmentProfilePageChild({onChange, departmentId, onClear, isEmpty}) {

    const { loading, error, data, refetch } = useQuery(GET_DEPARTMENT_DATA_QUERY, {
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
    let empty_department =
        <CollapsibleItem header={"Employees"} icon={<Icon>face</Icon>}>
            <Collection>
                <CollectionItem href={"#"} onClick={() => {}}>
                    There is no employees in this department.
                </CollectionItem>
            </Collection>
        </CollapsibleItem>;
    if (data.department.employees.length > 0)
        collapsible_items.push(
            <CollapsibleItem header={"Employees"} icon={<Icon>face</Icon>}>
                <Collection>
                    {data.department.employees.map(e =>
                    <CollectionItem href={"#"} onClick={() => onChange("/employee/" + e.id)}>
                        <img src={(DEVELOP ? "http://127.0.0.1:8000" : "") + e.image} alt={""}
                             className={"circle"} width={"4%"} height={"4%"}/>
                        {e.firstName} {e.lastName}
                    </CollectionItem>
                    )}
                </Collection>
            </CollapsibleItem>
        );
    else
        collapsible_items.push(empty_department);

    return <HeaderFooterWrapper Department={data.department.name} DepartmentId={data.department.id}>
        <div className={"container"}>
            <h1>{data.department.name}</h1>
            <Collapsible>
                {isEmpty ? empty_department : collapsible_items}
            </Collapsible>
            <p id={"message"}>You can begin the rulet session.</p>
            <Mutation mutation={CLEAR_DEPARTMENT_MUTATION}>
                {(handleMutation, {data}) => <Button waves={"light"} onClick={() => {
                    handleMutation({variables: {id: departmentId}});
                    onClear();
                }}>
                    clear department
                </Button>}
            </Mutation> <span></span>
            <Button waves={"light"} onClick={() => onChange("/rulet/" + departmentId)}>Participate in the rulet</Button>
            <span> </span>
            <a id={"not_participate"}></a>
            <p></p><br/>
        </div>
    </HeaderFooterWrapper>;

}

class DepartmentProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            url: null,
            empty: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClear = this.handleClear.bind(this);
    }

    handleChange(url) {
        this.setState({
            redirect: true,
            url: url
        });
        this.forceUpdate()
    }

    handleClear() {
        this.setState({empty: true})
    }

    render() {
        if (this.state.redirect)
        {
            this.state.redirect = false;
            return <Redirect to={this.state.url}/>;
        }

        return <DepartmentProfilePageChild onChange={this.handleChange}
                                           departmentId={this.props.match.params.department_id}
                                           isEmpty={this.state.empty}
                                           onClear={this.handleClear}/>
    }
}

export default DepartmentProfilePage;