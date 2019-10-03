import React from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import {Route, Switch} from "react-router-dom";
import DepartmentSelect from "./pages/DepartmentSelect";

function App() {
  return (
    <Switch>
      <Route path={"/"} component={DepartmentSelect}/>
    </Switch>
  );
}

export default App;
