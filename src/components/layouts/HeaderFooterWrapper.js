import React from "react"
import Header from "./Header";
import Footer from "./Footer";
import Cookies from "universal-cookie"

function HeaderFooterWrapper(props) {
    const cookies = new Cookies();
    if (props.Department)
        cookies.set("department_name", props.Department);
    return [
        <Header department={cookies.get("department_name")}/>,
        <main>{props.children}</main>,
        <Footer/>
    ]
}

export default HeaderFooterWrapper;