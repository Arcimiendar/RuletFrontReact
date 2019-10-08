import React, {Component} from "react";
import Cookies from "universal-cookie";
import {Modal, Button} from "react-materialize"
import M from "materialize-css"
import {Redirect} from "react-router-dom";
import {useMutation} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {Mutation} from "react-apollo";

const NOT_PAPRTICIPATE_MUTATION = gql`
    mutation ($id: ID!){
        departmentNotParticipate(id: $id) {
            department{
                ruletState
            }
        }
    }

`;


class NotificationSystem extends Component {

    socket = null;

    requestModal = null;
    participatingModal = null;

    request = null;
    participating = null;

    department_id = null;

    constructor(props) {
        super(props);
        let cookies = new Cookies();
        this.department_id = cookies.get("department");
        this.socket = new WebSocket(
            'ws://127.0.0.1:8000/ws/notification/' + cookies.get("department")
        );

        this.state = {
            redirect: false,
            url: null,
            not_participate_mutate: false
        };

        this.requestModal = <Modal header={"You are requested to participate in the rulet"}
                                   actions={[
                <Button waves="green" modal="close" flat onClick={ev =>
                    this.handleAgreeAndParticipate(cookies.get("department"))}>Agree and participate</Button>,
                <Mutation mutation={NOT_PAPRTICIPATE_MUTATION}>
                    {   (handleMutation, {data}) =>
                        <Button waves="green" modal="close" flat onClick={ev => handleMutation(
                            {variables: {id: +this.department_id}})}>Agree and do not participate</Button>
                    }
                </Mutation>,
                <Button waves="green" modal="close" flat>Disagree, you can agree later</Button>
            ]} id={"request"}>
            <p>
                You can participate. In that case you will be redirected to the rulet page. <br/>
                Also you can allow rulet and do not participate on it.
            </p>
        </Modal>;

        this.participatingModal = <Modal header={"You are participating in the rulet"}
                                         actions={[
                    <Button waves="green" modal="close" flat>Ok</Button>,
                    <Button waves="green" modal="close" flat onClick={ev =>
                        this.handleBackToSession(cookies.get("department"))}>Back to session</Button>
                ]} id={"participating"}>
             <p>
                 You can go to the rulet session or do it later
             </p>
        </Modal>;

        this.socket.onmessage = ev => {

            if (this.request === null) {
                let elem = document.querySelector('#request');
                this.request = M.Modal.init(elem);
            }
            if (this.participating === null) {
                let elem = document.querySelector("#participating");
                this.participating = M.Modal.init(elem);
            }

            let data = JSON.parse(ev.data);
            if(data.state === 'notification')
            {
                this.request.open();
            }
            else if (data['state'] === 'participating')
            {
                this.participating.open();
            }
        };
    }

    handleAgreeAndParticipate(department_id) {
        this.handleBackToSession(department_id);
    }

    handleBackToSession(department_id) {
        this.setState({redirect: true, url: "/rulet/" + department_id})
    }

    render() {

        if (this.state.redirect)
            return <Redirect to={this.state.url}/>;

        return [
            this.requestModal,
            this.participatingModal
        ]
    }

    componentWillUnmount() {
        this.socket.close();
    }
}

export default NotificationSystem;