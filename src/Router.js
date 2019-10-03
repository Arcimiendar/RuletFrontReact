import React from 'react'
import DepartmentSelect from "./components/pages/DepartmentSelect";
import {Route, Switch} from "react-router-dom";

function Router(props) {
    return(
        <Switch>
            <Route path={"/"} component={DepartmentSelect}/>
        </Switch>
    );
}


export default Router;