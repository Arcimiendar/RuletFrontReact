import React, {Component} from "react";
import {Carousel, Modal, Button, Icon} from "react-materialize"
import HeaderFooterWrapper from "../layouts/HeaderFooterWrapper";
import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {Redirect} from "react-router-dom";
import M from "materialize-css"
import {DEVELOP} from "../../index";


const GET_EMPLOYEES_WITHOUT_DEPARTMETNS = gql`
    query {
        employeesWithoutDepartment {
            id
            lastName
            firstName
            dateOfBirth
            description
            image
        }
    }
`;

function RuletEmployeesRequest({onChange}) {

    let {error, loading, data} = useQuery(GET_EMPLOYEES_WITHOUT_DEPARTMETNS);

    if (loading) return <HeaderFooterWrapper avoidNotification={true}>Loading ... </HeaderFooterWrapper>;
    if (error) return <HeaderFooterWrapper>ERROR: {error.message}</HeaderFooterWrapper>;

    onChange(data);

    return <div>Loading ...</div>
}

class Rulet extends Component {

    socket = null;
    socket_is_open = false;

    modal_message = null;

    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            url: null,
            employees_data: null,
            employees_ready: false,
        };
        this.socket = new WebSocket(
            (DEVELOP ? "ws://127.0.0.1:8000" : "ws://" + window.location.host)
                    + "/ws/rulet/" + this.props.match.params.department_id
        );
        this.socket.onopen = ev => {
            this.socket_is_open = true;
        };
        this.socket.onmessage = ev => {

            if (this.modal_message === null)
            {
                let elem = document.querySelector("#modal_message");
                this.modal_message = M.Modal.init(elem);
            }

            let data = JSON.parse(ev.data);
            if(data['state'] === 'info') {
                console.log(data['exit']);
                if (data['exit']) {
                    this.socket.close();
                    this.socket_is_open = false;
                    this.setState({redirect: true, url: "/department/" + this.props.match.params.department_id})
                }
                else {
                    let elem = document.querySelector("#modal_message_inner");
                    if (! elem)
                        return;
                    elem.innerHTML = data['info'];
                    this.modal_message.open();
                }
            } else if (data['state'] === 'chosen') {
                let employees_data = this.state.employees_data;
                let new_data = {employeesWithoutDepartment: []};
                for (let i = 0; i < employees_data.employeesWithoutDepartment.length; i++)
                    if (employees_data.employeesWithoutDepartment[i].id != data['employee_id'])
                        new_data.employeesWithoutDepartment.push(employees_data.employeesWithoutDepartment[i]);
                this.setState({employees_data: new_data});
                let elem = document.querySelector(".carousel");
                try {
                    M.Carousel.init(elem);
                } catch (e) {

                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(data) {
        this.setState({employees_data: data, employees_ready: true});
    }

    handleChose(employee_id) {
        if (this.socket_is_open)
            this.socket.send(JSON.stringify({state: "chosen", employee_id: employee_id}))
    }

    handleProfilePageRedirect(employee_id) {
        this.socket.close();
        this.socket_is_open = false;
        this.setState({redirect: true, url: "/employee/" + employee_id})
    }
    handleExit() {
        if (this.socket_is_open) {
            this.socket_is_open = false;
            this.socket.send(JSON.stringify({state: "exit"}));
            this.socket.close();
        }

        this.setState({redirect: true, url: "/department/" + this.props.match.params.department_id})
    }

    render() {

        if (!this.state.employees_ready)
            return <HeaderFooterWrapper avoidNotification={true}>
                <RuletEmployeesRequest onChange={this.handleChange}/>
            </HeaderFooterWrapper>;

        if (this.state.redirect)
            return <Redirect to={this.state.url}/>;

        return <HeaderFooterWrapper avoidNotification={true}>
            <div className={"section container"}>
                <h2>Available employees:</h2>
                <Carousel>
                    {this.state.employees_data.employeesWithoutDepartment.map(e =>
                    <div align={"center"}>
                        <p></p>
                        <img src={(DEVELOP ? "http://127.0.0.1:8000" : "") + e.image} alt={""} className={"circle"}/>
                        <b>{e.firstName} {e.lastName}</b> <br/><br/>
                        <Button waves={"light"} onClick={ev => this.handleProfilePageRedirect(e.id)}>
                            show profile</Button> <br/><br/>
                        <Button waves={"light"} onClick={ev => this.handleChose(e.id)}>select</Button>
                    </div>)}
                </Carousel>
                <Button waves={"light"} floating large onClick={ev =>
                {if (this.modal_message) this.modal_message.open()}} icon={<Icon>message</Icon>}/> <span></span>
                <Button waves={"light"} floating large onClick={ev =>
                    this.handleExit()} icon={<Icon>exit_to_app</Icon>}/>
            </div>
            <Modal header={"You received message from server"} actions={[
                <Button waves={"green"} modal={"close"} flat>Ok</Button>
            ]} id={"modal_message"}>
                <p id={"modal_message_inner"}>
                    {this.state.modal_message}
                </p>
            </Modal>
        </HeaderFooterWrapper>
    }
}

export default Rulet;