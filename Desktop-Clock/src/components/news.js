import React from 'react'
import Axios  from 'axios'
 
const CATEGORY = ["business", "entertainment", "general", "health", "science", "sports", "technology"]
const COUNTRY = {
            "China" : "cn", "Turkey": "tr", "Japan": "jp", "Germany" : "de",
            "India" : "in", "Russia" : "ru", "USA": "us", "Egypt" : "eg"
        }

function fetch_news(country_sel, category_sel, callback) {
    var selected_category = (CATEGORY.includes(category_sel) ? category_sel: null);

    let url = 'https://newsapi.org/v2/top-headlines?' + 
            'country=' + country_sel + 
            (selected_category ? "&category=" + selected_category : "") +
            '&apiKey=5193fda464c94330bd8b1ffd48749cef';

    Axios.get(url).then((res, err) => {
            callback(res.data.articles, err)
    })
}

class News extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            news: [],
            error: "",
            loading: true
        }
    }

    handleClick(url) {
        return (
            () => {
                window.shell.openExternal(url)
            }
        )
    }

    componentDidMount(){
        this.setState({
            loading: true
        })
        fetch_news(this.props.country, this.props.category, (articles, err) => {
            if (err) {
                this.setState({
                    error: err,
                    loading: false
                })
            } else {
                this.setState({
                    news: articles.slice(0,8),
                    loading: false
                })
                console.log(this.state.news)
            }
    
        })
    }

    render() {
           return (this.state.loading ? <div class="loading loading-lg"> </div> :
                 <div style={{fontSize: "18px"}}>
                    <table class="table">
                        <tbody>
                            {
                            this.state.news.map((art, id) =>{ return (
                                <tr className="popover popover-left" key={id}>
                                    <td style={{color: 'white'}}>{art.title}</td>
                                    <a href={this.state.news[id].url} target="_blank">
                                    <div 
                                     onMouseEnter={() => {
                                        document.body.style.cursor = "pointer";
                                      }}
                                      onMouseLeave={() => {
                                        document.body.style.cursor = "default";
                                      }}
                                    
                                    class="popover-container" style={{backgroundColor: "white"}}>
                                    <div class="card-image">
                                        <img  src={this.state.news[id].urlToImage} class="img-responsive" />
                                        <div class="card-header">
                                            <div class="card-title h5">{this.state.news[id].title}</div>
                                            <div class="card-subtitle text-gray">{this.state.news[id].source.name}</div>
                                        </div>
                                        <div class="card-body">
                                            {this.state.news[id].description}
                                        </div>
                                    </div>
                                    </div>
                                    </a>
                                </tr>
                            )})
                            }
                        </tbody>
                     </table>
                 </div>
        )
    }


}

export default News

/*
<div class="card pagination">
                                    <div class="card-image">
                                        <a href={art.url}>
                                            <img src={art.urlToImage} class="img-responsive" />
                                        </a>
                                    </div>
                                    <div class="card-header">
                                        <div class="card-title h5">{art.title}</div>
                                        <div class="card-subtitle text-gray">{art.source.name}</div>
                                    </div>
                                    <div class="card-body">
                                        {art.description}
                                    </div>
                                </div>
*/