import React, {Component} from "react"
import HeaderFooterWrapper from "../layouts/HeaderFooterWrapper";
import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {Collection, CollectionItem} from "react-materialize";
import {Redirect} from "react-router-dom";

const GET_RULET_SESSIONS = gql`
    query {
        ruletSessions {
            id
            date
        }
    }
`;

function RuletListChild({onChange}) {
    let { loading, error, data } = useQuery(GET_RULET_SESSIONS);
    if (loading)
        return <HeaderFooterWrapper>
            Loading ...
        </HeaderFooterWrapper>;
    if (error)
        return <HeaderFooterWrapper>
            Error: {error.message}
        </HeaderFooterWrapper>;

    let collection_items = <CollectionItem href={"#"} onClick={() => onChange(-1)}>
        There were no rulet sessions yet. Go home page.
    </CollectionItem>;

    if (data.ruletSessions.length > 0)
        collection_items = data.ruletSessions.map(r => <CollectionItem href={"#"} onClick={() => onChange(r.id)}>
            rulet session on {r.date}
        </CollectionItem>);

    return <HeaderFooterWrapper>
        <div className={"section"}>
            <Collection>
                {collection_items}
            </Collection>
        </div>
    </HeaderFooterWrapper>
}

class RuletList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            rulet_id: 0
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(rulet_id) {
        this.setState({
            redirect: true,
            rulet_id: rulet_id
        });
    }

    render() {
        if (this.state.redirect)
        {
            if (this.state.rulet_id < 0)
                return <Redirect to={"/"}/>;
            return <Redirect to={"/rulet/list/" + this.state.rulet_id}/>;
        }
        return <RuletListChild onChange={this.handleChange}/>
    }
}

export default RuletList;