import React from "react"
import Header from "./Header";
import Footer from "./Footer";
import Cookies from "universal-cookie"

function HeaderFooterWrapper(props) {
    console.log(props);
    const cookies = new Cookies();
    if (props.Department)
        cookies.set("department", props.Department);
    return [
        <Header department={cookies.get("department")}/>,
        <main>{props.children}</main>,
        <Footer/>
    ]
}

export default HeaderFooterWrapper;