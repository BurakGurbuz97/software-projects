import {Component} from "inferno"
import {withRouter} from "inferno-router";
import {connect} from "inferno-redux";
import status from "../status";

import {logout, check} from "../actions";

class Navbar extends Component {
    constructor(){
        super();
        this.go = this.go.bind(this);
        this.logout = this.logout.bind(this);
    }
    logout(){
        this.props.out();
        this.props.history.push("/");
    }
    go(link){
        const fn = () =>{
            this.props.history.push(link);
        }
        return fn.bind(this);
    }
    render(){
        return(
            <ul class="tab tab-block">
                <li class="tab-item">
                    <a onClick={this.go("/admin-main")}><h6>Anasayfa</h6></a>
                </li>
                <li class="tab-item">
                    <a onClick={this.go("/add-client")}><h6>Müvekkil Ekle</h6></a>
                </li>
                <li class="tab-item">
                    <a onClick={this.go("/delete-client")}><h6>Müvekkil Sil</h6></a>
                </li>
                <li class="tab-item">
                    <a onClick={this.logout}><h6>Çıkış</h6></a>
                </li>
            </ul>
        )
    }
}

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = dispatch => {
    return {
        out: () => {
            dispatch(logout());
        },
        check: () => {
            dispatch(check());
        }
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Navbar));