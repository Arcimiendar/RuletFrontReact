import React from "react"

function Footer() {
    return <footer className="page-footer" style={{backgroundColor: "#0066ff"}}>
        <div className="container">
            <div className="row">
                <div className="col l6 s12">
                    <h5 className="white-text">Information</h5>
                    <p className="grey-text text-lighten-4">You can use this application to distribute your workers
                        between departments</p>
                </div>
            </div>
        </div>
        <div className="footer-copyright" color={"#0066ff"}>
            <div className="container">
                The Rulet Application 2019
            </div>
        </div>
    </footer>
}

export default Footer;