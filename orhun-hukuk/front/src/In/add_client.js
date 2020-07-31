import {Component} from "inferno";
import {withRouter} from "inferno-router";
import {connect} from "inferno-redux"
import {login, signup} from "../actions";
import status from "../status";

class Add_Client extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            password2: "",
            password_match: true,
            err_code: null,
            success: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        if(this.state.password === this.state.password2){
            this.setState({password_match: true,success: false, err_code: null});
            this.context.store.dispatch(signup(
                this.state.username,
                this.state.password,
                (stat) => {
                    switch(stat) {
                        case status.SUCCESS:
                            this.setState({
                                password: "",
                                password2: "",
                                username: "",
                                success: true,
                            })
                            break;
                        default:
                            this.setState({err_code: stat});
                    }
                }
                ));
        } else {
            this.setState({password_match: false,success: false, err_code: null});
        }
    }
    render() {
        return (
            <div className="container">
            <div className="columns">
            <div className="col-4 col-lg-3 col-md-2 col-sm-1 col-xs-0"></div>
            <div className="col-4 col-lg-6  col-md-8 col-sm-10 col-xs-12">
                    <br/>
                        <figure class="figure text-center">
                            <img src="/static/logo.png" style={{marginLeft: "auto", marginRight: "auto"}} class="img-responsive "/>
                        </figure >
                        {!this.state.success ? <h3 className="text-gray text-center" >Müvekkil Ekle</h3> : 
                        <h3 className="text-success text-center">Müvekkil Başarıyla Ekledi</h3> }
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <input
                                    className={"form-input input-lg" +
                                                (this.state.wrong_credentials? " is-error" : "")}
                                    type="username"
                                    onInput={this.handleChange}
                                    value={this.state.username}
                                    placeholder="Kullanıcı Adı"
                                    name="username"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    className={"form-input input-lg" +
                                                (!this.state.password_match ? " is-error" : "")}
                                    type="password"
                                    onInput={this.handleChange}
                                    value={this.state.password}
                                    placeholder="Şifre"
                                    name="password"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    className={"form-input input-lg" +
                                                (!this.state.password_match ? " is-error" : "")}
                                    type="password"
                                    onInput={this.handleChange}
                                    value={this.state.password2}
                                    placeholder="Şifre"
                                    name="password2"
                                    required
                                />
                            </div>
                            {!this.state.password_match ? <p className="text-error">Şifreler Uyumsuz</p>: ""}
                            {this.state.err_code === 4 ? <p className="text-error">Müvekkil ismi kayıtlı</p>: ""}
                            <div className="form-group">
                                <div className="btn-group btn-group-block">
                                    <button className="btn btn-success btn-lg" type="submit">Ekle</button>
                                </div>
                            </div>
                        </form>
            </div>
            <div className="col-4 col-lg-3 col-md-2 col-sm-1 col-xs-0"></div>
            </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = dispatch => {
    return {
        signup: (username, password) => {
            dispatch(signup(username,password))
        }
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Add_Client));