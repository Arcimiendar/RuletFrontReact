import React, {Component} from "react";
import Cookies from "universal-cookie";
import {Modal, Button} from "react-materialize"
import M from "materialize-css"
import {Redirect} from "react-router-dom";
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import ReactDOM from "react-dom"
import {ApolloProvider} from "react-apollo";
import client from "../../index";
import {DEVELOP} from "../../index";

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
            (DEVELOP ? "ws://127.0.0.1:8000" : "") + "/ws/notification/" + cookies.get("department")
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
            if(data.state === 'notification') {
                let message_inner = document.querySelector("#message");
                if (message_inner)
                    message_inner.innerHTML = "You need to allow or/and join to the rulet.";

                let not_participate = document.querySelector("#not_participate");
                if (not_participate)
                    ReactDOM.render(<ApolloProvider client={client}><Mutation mutation={NOT_PAPRTICIPATE_MUTATION}>
                        {
                            (handleMutation, {data}) =>
                            <Button waves={"light"} onClick={() => {
                                handleMutation({variables: {id: +this.department_id}});
                                not_participate.innerHTML = "";
                                if (message_inner)
                                    message_inner.innerHTML =
                                        "You are not participating in the rulet, but you still can.";
                            }}>
                                Do not participate in the rulet</Button>
                        }
                    </Mutation></ApolloProvider>, not_participate);

                this.request.open();
            }
            else if (data['state'] === 'participating') {
                let message_inner = document.querySelector("#message");
                if (message_inner)
                    message_inner.innerHTML = "You are participating in the rulet.";

                let not_participate = document.querySelector("#not_participate");
                if (not_participate)
                    not_participate.innerHTML = "";

                this.participating.open();
            }
            else {
                let message_inner = document.querySelector("#message");
                if (message_inner)
                    message_inner.innerHTML = "You can begin the rulet session.";

                let not_participate = document.querySelector("#not_participate");
                if (not_participate)
                    not_participate.innerHTML = "";
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