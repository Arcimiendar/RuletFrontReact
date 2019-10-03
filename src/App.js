import React from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import Router from "./Router";
import {Navbar, NavItem} from "react-materialize"

function App() {
  return [
      <Navbar brand={<a>The Rulet Application</a>} alignLinks="right">
          <NavItem>
              Employees list
          </NavItem>
          <NavItem>
              Rulet list
          </NavItem>
          <NavItem>
              Clear all departments
          </NavItem>
          <NavItem>
              Home
          </NavItem>
      </Navbar>,
      <main><Router/></main>,
        <footer className="page-footer" style={{backgroundColor: "#0066ff"}}>
            <div className="container">
                <div className="row">
                    <div className="col l6 s12">
                        <h5 className="white-text">Information</h5>
                        <p className="grey-text text-lighten-4">You can use this application to distribute your workers
                            between departments</p>
                    </div>
                </div>
            </div>
            <div className="footer-copyright" color={"darkBlue"}>
                <div className="container">
                    The Rulet Application 2019
                </div>
            </div>
        </footer>
  ];
}

export default App;
