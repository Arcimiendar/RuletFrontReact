import React, {Component} from "react";
import Cookies from "universal-cookie";
import {Modal, Button} from "react-materialize"
import M from "materialize-css"



class NotificationSystem extends Component {

    socket = null;

    requestModal = null;
    participatingModal = null;

    request = null;
    participating = null;

    constructor(props) {
        super(props);
        let cookies = new Cookies();
        this.socket = new WebSocket(
            'ws://127.0.0.1:8000/ws/notification/' + cookies.get("department")
        );

        this.requestModal = <Modal header={"You are requested to participate in the rulet"}
                                   actions={[
                <Button waves="green" modal="close" flat>Agree and participate</Button>,
                <Button waves="green" modal="close" flat>Agree and do not participate</Button>,
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
                    <Button waves="green" modal="close" flat>Back to session</Button>
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

    render() {
        return [
            this.requestModal,
            this.participatingModal
        ]
    }
}

export default NotificationSystem;