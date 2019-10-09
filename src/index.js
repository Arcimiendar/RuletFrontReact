import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Route} from 'react-router-dom'
import {ApolloClient} from 'apollo-client'
import {createHttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {ApolloProvider} from 'react-apollo'

const client = new ApolloClient({
    link: createHttpLink({uri:'http://127.0.0.1:8000/graphql/'}),
    cache: new InMemoryCache(),
    fetchOptions: {
        mode: 'no-cors'
    }
});

let DEVELOP = true;

ReactDOM.render(
    <ApolloProvider client={client}>
        <BrowserRouter>
            <Route component={App}/>
        </BrowserRouter>
    </ApolloProvider>
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export default client;
export {DEVELOP};