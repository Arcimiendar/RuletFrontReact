import React from 'react'
import {Route, Switch} from "react-router-dom";
import DepartmentSelect from "./components/pages/DepartmentSelect";
import DepartmentProfilePage from "./components/pages/DepartmentProfilePage";
import EmployeeList from "./components/pages/EmployeeList";
import EmployeeDetail from "./components/pages/EmployeeDetail";
import RuletList from "./components/pages/RuletList";
import RuletSessionResult from "./components/pages/RuletSessionResult";

function Router(props) {
    return(
        <Switch>
            <Route exact path={"/"} component={DepartmentSelect}/>
            <Route exact path={"/department/:department_id"} component={DepartmentProfilePage}/>
            <Route exact path={"/employees_list/"} component={EmployeeList}/>
            <Route exact path={"/employee/:employee_id"} component={EmployeeDetail}/>
            <Route exact path={"/rulet/list/"} component={RuletList}/>
            <Route exact path={"/rulet/list/:rulet_id"} component={RuletSessionResult}/>
        </Switch>
    );
}


export default Router;