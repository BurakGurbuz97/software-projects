import {Component} from "inferno";
import {withRouter} from "inferno-router";
import {connect} from "inferno-redux";
import {check} from "./actions";
import Login from "./Out/login";

import Admin from "./In/admin";
import Client from "./In/client";

class App extends Component {
    componentWillMount(){
        this.props.check();

    }
    render(){
        if (this.props.fetching) return "";
        if (this.props.user_id === "590c38672d67f4c45ae98280127bdc8e602f519ba669e219ae07bc3cac0ae873") {
            return <Admin />
        }
        if (this.props.user_id) return <Client />;
        return(
            <Login />
        )
    }
}

const mapStateToProps = state => {
    return {
        user_id: state.user_id,
        fetching: state.fetching
    }
}

const mapDispatchToProps = dispatch => {
    return {
        check: () => {
            dispatch(check());
        }
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(App));