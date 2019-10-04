import React from 'react'
import {Route, Switch} from "react-router-dom";
import DepartmentSelect from "./components/pages/DepartmentSelect";
import DepartmentProfilePage from "./components/pages/DepartmentProfilePage";
import EmployeeList from "./components/pages/EmployeeList";

function Router(props) {
    return(
        <Switch>
            <Route exact path={"/"} component={DepartmentSelect}/>
            <Route exact path={"/department/:department_id"} component={DepartmentProfilePage}/>
            <Route exact path={"/employees_list/"} component={EmployeeList}/>
        </Switch>
    );
}


export default Router;