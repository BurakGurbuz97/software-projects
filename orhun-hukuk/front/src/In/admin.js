import {Component} from "inferno"
import {withRouter} from "inferno-router";
import {connect} from "inferno-redux";
import {Switch, Route} from "inferno-router";
import status from "../status";

import Navbar from "./navbar";
import Admin_Main from "./admin_main";
import Add_Client from "./add_client";
import Delete_Client from "./delete_client";

class Admin extends Component {
    render(){
        return(
            <div>
                <Navbar />
                <Switch>
                    <Route exact path="/add-client" component={Add_Client} />
                    <Route exact path="/admin-main" component={Admin_Main} />
                    <Route exact path="/delete-client" component={Delete_Client} />
                    <Route  path="/" component={Admin_Main} />
                </Switch>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = dispatch => {
    return {}
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Admin));