import {Component} from "inferno";
import {withRouter} from "inferno-router";
import Footer from "../footer";
import {login} from "../actions";
import status from "../status";

class Inner_Login extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            wrong_credentials: false,
            err_code: null,
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
        this.setState({wrong_credentials: false, err_code: null});
        e.preventDefault();
        this.context.store.dispatch(login(
            this.state.username,
            this.state.password,
            (stat) => {
                switch(stat) {
                    case status.SUCCESS:
                        this.props.history.push("/");
                        break;
                    case status.WRONG_CREDENTIALS:
                        this.setState({wrong_credentials: true});
                        break;
                    default:
                        this.setState({err_code: stat});
                }
            }
        ));
    }
    render() {
        return (
            <div className="container">
            <div className="columns">
            <div className="col-4 col-lg-3 col-md-2 col-sm-1 col-xs-0"></div>
            <div className="col-4 col-lg-6  col-md-8 col-sm-10 col-xs-12 text-center">
                    <br/>
                        <figure class="figure text-center">
                            <img src="/static/logo.png" style={{marginLeft: "auto", marginRight: "auto"}} class="img-responsive "/>
                        </figure >
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
                                                (this.state.wrong_credentials ? " is-error" : "")}
                                    type="password"
                                    onInput={this.handleChange}
                                    value={this.state.password}
                                    placeholder="Şifre"
                                    name="password"
                                    required
                                />
                                {this.state.wrong_credentials ? <p className="form-input-hint">kimlil bilgileri hatalı</p> : ""}
                            </div>
                            <div className="form-group">
                                <div className="btn-group btn-group-block">
                                    <button className="btn btn-primary btn-lg" type="submit">Giriş Yap</button>
                                </div>
                            </div>
                        </form>
                        <Footer/>
            </div>
            <div className="col-4 col-lg-3 col-md-2 col-sm-1 col-xs-0"></div>
            </div>
            </div>
        );
    }
}

export default withRouter(Inner_Login);
