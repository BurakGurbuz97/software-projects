import {Component} from "inferno";
import {withRouter} from "inferno-router";

class Footer  extends Component {
    render(){
        return(
            <div>
            <div class="my_footer container">
            <div class="columns">
                <div class="column col-6 text-left">
                    <a class="text-secondary" href="http://www.orhunhukuk.com/">
                        <i class="icon icon-forward"/>
                        {' '} Anasayfa {' '}
                    </a>
                    <a class="text-secondary" href="mailto:info@orhunhukuk.com">
                    <i class="icon icon-mail"/> {"  "} info@orhunhukuk.com {"  "}
                    </a>
                </div>
                <div class="column col-6 text-right">
                    <div class="popover">
                    <a class="text-secondary" href="mailto:mustafaburakgurbuz@gmail.com">
                    <i class="icon icon-people" /> {"  "} Web Tasarımı ve Veri tabanı yönetimi {"  "}
                    </a>
                    <div class="popover-container" stlye={{backgroundColor: "#FF0000"}}>
                        <div class="card pop_over_info">
                            <div class="card-header text-center">
                                Mustafa Burak Gürbüz
                            </div>
                            <div class="card-body text-left ">
                                <i class="icon icon-mail"/> mustafaburakgurbuz@gmail.com<br/>
                                <i class="icon icon-message"/> +905385685318
                            </div>
                            <div class="card-footer text-left text-ellipsis">
                               Projeleriniz için iletişime geçebilirsiniz
                            </div>
                        </div>
                    </div>
                    </div>
                    {' '}&copy; Tüm Hakları Saklıdır {' '}
                </div>
                </div>
            </div>
            </div>
        )
    }
}

export default withRouter(Footer); 