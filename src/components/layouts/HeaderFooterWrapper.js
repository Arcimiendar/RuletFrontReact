import React from "react"
import Header from "./Header";
import Footer from "./Footer";
import Cookies from "universal-cookie"
import NotificationSystem from "./NotificationSystem";

function HeaderFooterWrapper(props) {
    const cookies = new Cookies();
    if (props.Department)
        cookies.set("department_name", props.Department);
    if (props.DepartmentId)
        cookies.set("department", props.DepartmentId);

    let result = [
        <Header department={cookies.get("department_name")}/>,
        <main>{props.children}</main>,
        <Footer/>,
    ];

    if (!props.avoidNotification)
        result.push(<NotificationSystem/>);

    return result;
}

export default HeaderFooterWrapper;