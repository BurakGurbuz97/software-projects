import {Component} from "inferno";
import {connect} from "inferno-redux";
import Footer from "../footer";
import {withRouter} from "inferno-router";
import {get, logout} from "../actions"

class Client extends Component {
    constructor(){
        super();
        this.logout = this.logout.bind(this);
    }
    componentWillMount(){
        this.props.get("client", stat => {})
    }
    logout(){
        this.props.out();
        this.props.history.push("/");
    }
    render(){
        return(
         <div className="container">
            <div className="columns">
            <div className="col-1 col-md-0 "></div>
            <div className="col-10  col-md-12 ">
            <table class="table table-striped table-hover">
            <thead>
                <tr>
                <th>Borçlu</th>
                <th>İcra Dairesi</th>
                <th>Esas Numarası</th>
                <th>Takip Tarihi</th>
                <th>Asıl Alacak</th>
                <th>Takip Alacağı</th>
                <th>Tebligat Durumu</th>
                <th>Yapılan Hacizler</th>
                <th>Notlar</th>
                </tr>
            </thead>
            <tbody>
                {this.props.list.map(data => {
                    return(
                        <tr>
                            <th>{data.col1}</th>
                            <th>{data.col2}</th>
                            <th>{data.col3}</th>
                            <th>{data.col4}</th>
                            <th>{data.col5}</th>
                            <th>{data.col6}</th>
                            <th>{data.col7}</th>
                            <th>
                                <div className="popover popover-bottom">
                                <button class="btn btn-long">detaylı bilgi</button>
                                <div class="popover-container">
                                <div class="card">
                                    <div class="card-body">
                                        {data.col8}
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </th>
                            <th>
                                <div className="popover popover-bottom">
                                <button class="btn btn-long">detaylı bilgi</button>
                                <div class="popover-container">
                                <div class="card">
                                    <div class="card-body">
                                        {data.col9}
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </th>
                        </tr>
                    );
                })}
            </tbody>
            </table>
            <Footer />
            </div>
            <div className="col-1 col-md-0 "><button onClick={this.logout} className="btn btn-error btn-lng">Çıkış</button></div>
            </div>
            </div>
        )
    }

}
const mapStateToProps = state => {
    return {
        list: state.info_list
    }
}

const mapDispatchToProps = dispatch => {
    return {
        get: (user_id, callback) => {
            dispatch(get(user_id, callback))
        },
        out: () => {
            dispatch(logout());
        }
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Client));