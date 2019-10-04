import React from 'react'
import DepartmentSelect from "./components/pages/DepartmentSelect";
import {Route, Switch} from "react-router-dom";
import DepartmentProfilePage from "./components/pages/DepartmentProfilePage";

function Router(props) {
    return(
        <Switch>
            <Route exact path={"/"} component={DepartmentSelect}/>
            <Route exact path={"/department/:department_id"} component={DepartmentProfilePage}/>
        </Switch>
    );
}


export default Router;