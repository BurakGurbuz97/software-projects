import {Component} from "inferno";
import {withRouter} from "inferno-router";
import {connect} from "inferno-redux";
import status from "../status";
import { get_users, get, add, delete_info } from "../actions";



class Admin_Main extends Component {
    constructor(){
        super();
        this.state = {
            list: [],
            client_list: [],
            selected_user: "",
            status: 0,
            borçlu: "",
            icra: "",
            esas: "",
            takip: "",
            asıl: "",
            alacak: "",
            tebligat: "",
            haciz: "",
            notlar: "",
            flip: false,
            status: 0,
                }
        this.clientChoice = this.clientChoice.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleDelete(id){
        const func = () => {
            this.props.delete(id,stat => {
                this.setState({
                    flip: !this.state.flip
                })
                this.props.get(this.state.selected_user,res =>{})
            });
        }
        return func.bind(this);
    }
    handleSubmit(e){
        e.preventDefault();
        this.props.add({
            col1: this.state.borçlu,
            col2: this.state.icra,
            col3: this.state.esas,
            col4: this.state.takip,
            col5: this.state.asıl,
            col6: this.state.alacak,
            col7: this.state.tebligat,
            col8: this.state.haciz,
            col9: this.state.notlar,
            username: this.state.selected_user
        }, stat => {
            this.setState({
                status: stat,
                borçlu: "",
                icra: "",
                esas: "",
                takip: "",
                asıl: "",
                alacak: "",
                tebligat: "",
                haciz: "",
                notlar: "",
            });
            this.props.get(this.state.selected_user,res =>{})
        })
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    clientChoice(cli) {
        const foo = () =>{
            this.setState({
                selected_user: cli
            });
            this.props.get(this.state.selected_user,res =>{});
        }
        return foo.bind(this);
    }
    componentWillMount(){
        this.props.get_users();
        this.setState({
            client_list: this.props.user_list
        })
    }
    render(){
        return(
            <div className="container">
            <div className="columns">
            <div className="col-1 col-md-0 "></div>
            <div className="col-10  col-md-12 ">
            <div class="dropdown">
                <a  class="btn btn-success dropdown-toggle" tabindex="0">
                    Müvekkil Seç <i class="icon icon-caret"></i>
                </a>
                <ul class="menu">
                    {this.props.user_list.map(cli => {
                        if( cli !== "OrhunHukuk"){
                            return <li style={{cursor: "pointer"}} onClick={this.clientChoice(cli)}>{cli}</li>
                        }
                    })}
                </ul>
                <h6 className="text-success">{this.state.selected_user}</h6>
            </div>
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
                    <th>Kaldır</th>
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
                                <th><button onClick={this.handleDelete(data.info_id)} className="btn btn-error">Kaldır</button></th>
                            </tr>
                        );
                    })}
                </tbody>
                </table>
                <br/>
                <div class="divider text-center text-success" data-content={"YENİ BİLGİ EKLE Müvekkil:" + this.state.selected_user}></div>
                <div class="input-group">
                    <input type="text" name="borçlu" value={this.state.borçlu} onInput={this.handleChange} class="form-input input-lg" placeholder="Borçlu" />
                    <input type="text" name="icra" value={this.state.icra} onInput={this.handleChange} class="form-input input-lg" placeholder="İcra Dairesi" />
                    <input type="text" name="esas" value={this.state.esas} onInput={this.handleChange} class="form-input input-lg" placeholder="EsasNumarası" />
                    <input type="text" name="takip" value={this.state.takip} onInput={this.handleChange} class="form-input input-lg" placeholder="Takip Tarihi" />
                    <input type="text" name="asıl" value={this.state.asıl} onInput={this.handleChange} class="form-input input-lg" placeholder="Asıl Alacak" />
                </div>
                <div class="input-group">
                    <input type="text" name="alacak" value={this.state.alacak} onInput={this.handleChange} class="form-input input-lg" placeholder="Takip Alacağı" />
                    <input type="text" name="tebligat" value={this.state.tebligat} onInput={this.handleChange} class="form-input input-lg" placeholder="Tebligat Tarihi" />
                    <input type="text" name="haciz" value={this.state.haciz} onInput={this.handleChange} class="form-input input-lg" placeholder="Yapılan Haciz" />
                    <input type="text" name="notlar" value={this.state.notlar} onInput={this.handleChange} class="form-input input-lg" placeholder="Notlar" />
                </div>
                <div className="form-group">
                    <div className="btn-group btn-group-block">
                        <button className="btn btn-success btn-lg" onClick={this.handleSubmit}>EKLE</button>
                    </div>
                </div>
            </div>
            <div className="col-1 col-md-0 "></div>
            </div>
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        user_list: state.user_list,
        list: state.info_list
    }
}

const mapDispatchToProps = dispatch => {
    return {
        get_users: () => {
            dispatch(get_users())
        },
        get: (user_id, callback) => {
            dispatch(get(user_id, callback))
        },
        add: (info, callback) => {
            dispatch(add(info,callback))
        },
        delete: (id, callback) => {
            dispatch(delete_info(id,callback))
        } 
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Admin_Main));
