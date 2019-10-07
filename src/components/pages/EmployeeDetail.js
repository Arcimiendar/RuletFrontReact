import React from "react"
import HeaderFooterWrapper from "../layouts/HeaderFooterWrapper";
import {Card, Row, Col} from "react-materialize"
import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";


const GET_EMPLOYEE_DETAIL_QUERY = gql`
    query ($employee_id: Int!){
        employee(id: $employee_id) {
            firstName
            lastName
            description
            dateOfBirth
            image
            department {
                name
            }

        }
    }
`;

function EmployeeDetail(props) {
    let employee_id =  props.match.params.employee_id;
    let { error, loading, data } = useQuery(GET_EMPLOYEE_DETAIL_QUERY, {
        variables: { employee_id }
    });

    if (loading)
        return <HeaderFooterWrapper>
            Loading...
        </HeaderFooterWrapper>;
    if (error)
        return <HeaderFooterWrapper>
            ERROR: {error.message}
        </HeaderFooterWrapper>;

    let list_of_actions = [];
    if (data.employee.department)
        list_of_actions.push(<a>
            IS IN THE <b>{data.employee.department.name}</b>
        </a>);
    else
        list_of_actions.push(<a>
            <b>IS NOT IN ANY DEPARTMENT</b>
        </a>);

    list_of_actions.push(<a>
        WAS BORN IN {data.employee.dateOfBirth}
    </a>);

    return <HeaderFooterWrapper>
        <Row>
            <Col m={6} s={12}>
                <Card
                    className="blue-grey darken-1"
                    textClassName="white-text"
                    title={<span>
                        <img src={"http://127.0.0.1:8000" + data.employee.image}
                             width={"30%"} height={"30%"} className={"circle"} alt={""}/>
                        {data.employee.firstName} {data.employee.lastName}
                    </span>}
                    actions={list_of_actions}
                >

                    {data.employee.description}
                </Card>
            </Col>
        </Row>
    </HeaderFooterWrapper>
}

export default EmployeeDetail;