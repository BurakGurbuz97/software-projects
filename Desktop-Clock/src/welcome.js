import React from 'react';
import uuid from "uuid";

import './App.css';
import './welcome.css';
import News from "./components/news.js"
import Todos from "./components/todo.js"
import Weather from './components/weather';


const city2offset = {
    "Amsterdam": 1,
    "Barcelona": 1,
    "Tokyo": 9,
    "Dubai": 4,
    "New York": -5,
    "Mumbai":  5.5,
    "Prague":  1,
    "Mecca": 3,
    "Miami": -5,
    "Seoul": 9,
    "Shanghai": 8,
    "Taipei": 8,
    "Hong Kong": 8,
    "London": 1,
    "Paris": 1,
    "Singapore": 8,
    "Delhi": 5.5,
    "Istanbul": 3,
    "Rome": 1,
    "Guangzhou": 8,
    "Bangkok": 7,
    "Los Angeles": -8
}

function calcTime(city) {
    if (city) {
        var offset = city2offset[city]
        var d = new Date();
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var nd = new Date(utc + (3600000*offset));
        return nd
    } else {
        return new Date()
    }
    
}


const default_state = {
            date: calcTime(null),
            day: 0,
            contentBody: "",
            contentVisible: false,
            currentLocation: "Istanbul/Turkey",
            theme: "Night",
            fontName: "Gill Sans",
            languageIcon: "url('./languages/tr.png')",
            language: "tr",
            settingsVisible: false
        }

const CATEGORY = ["business", "entertainment", "general", "health", "science", "sports", "technology"]

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = default_state;
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.closeContent = this.closeContent.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
    }

    componentDidMount() {
        var obj = JSON.parse(window.localStorage.getItem("settings"))
        console.log(obj)
        if (obj) {
            this.setState({
                currentLocation: obj.currentLocation,
                theme: obj.theme,
                fontName: obj.fontName,
                languageIcon: obj.languageIcon,
                language: obj.language,
            }, () => {
                this.handleOptionChange({"target": { "value": this.state.theme}})
                this.changeLocation(null, this.state.currentLocation )
                this.changeLanguage(null, this.state.language)
                this.changeFont(null,this.state.fontName )
            })
           
        }

        this.timerID = setInterval(() => this.tick(), 1000);
        this.timerID = setInterval(() => this.dayOfWeek(), 1000);

        /*
        const circleType = new CircleType(document.getElementById('monday'));
        circleType.radius(360);
        
        const circleType2 = new CircleType(document.getElementById('tuesday'));
        circleType2.radius(360);
        */
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    
    }

    tick() {
        this.setState({
            date: calcTime(this.state.currentLocation.split("/")[0])
        });
        
    }

    dayOfWeek() {
        var day = this.state.date.getDay();
        this.setState({
            day: day
        });
        var color;
        if (this.state.theme === "Night") {
            color = "#0a8dd2";
        }
        if (this.state.theme === "Pinky") {
            color = "#ff3399";
        }
        if (this.state.theme === "Forest") {
            color = "#33cc33";
        }

        var child = document.querySelectorAll("div.sector");

        if (this.state.day === 0) { child[4].style.backgroundColor = color; child[3].style.backgroundColor = "transparent";}
        else if (this.state.day === 1) { child[5].style.background = color; child[4].style.backgroundColor = "transparent";}
        else if (this.state.day === 2) { child[6].style.background = color; child[5].style.backgroundColor = "transparent";}
        else if (this.state.day === 3) { child[0].style.background = color; child[6].style.backgroundColor = "transparent";}
        else if (this.state.day === 4) { child[1].style.background = color; child[0].style.backgroundColor = "transparent";}
        else if (this.state.day === 5) { child[2].style.background = color; child[1].style.backgroundColor = "transparent";}
        else if (this.state.day === 6) { child[3].style.background = color; child[2].style.backgroundColor = "transparent";}
    }
    newsList(event, someParameter) {
        var element;
        if (this.state.settingsVisible === true) {
            element = document.getElementsByClassName("settings");
            element[0].style.display = 'none';

            this.setState({
                settingsVisible: false
            });
        }

        //if (this.state.contentVisible === false) {
            element = document.getElementsByClassName("content");
            element[0].style.display = 'block';

            element = document.getElementsByClassName("clock-container");
            element[0].style.float = "left";

            let placed_component = ""
            if (someParameter["SectorID"] === "News") {
                placed_component = <News key={uuid.v4()} country={this.state.language} category={CATEGORY[someParameter["DayID"]]} />
            } else if (someParameter["SectorID"] === "Todos") {
                placed_component = <Todos key={uuid.v4()} DayID={someParameter["DayID"]} />
            } else if (someParameter["SectorID"] === "Weather") {
                placed_component = <Weather key={uuid.v4()}
                country={this.state.currentLocation.split("/")[1]}
                city={this.state.currentLocation.split("/")[0]}
                dayId={someParameter["DayID"]} />
            }

            this.setState({
                contentBody: placed_component,
                contentVisible: true
            });
        //}
        /*
        else {

            element = document.getElementsByClassName("content");
            element[0].style.display = 'none';

            element = document.getElementsByClassName("clock-container");
            element[0].style.float = "none";

            this.setState({
                contentVisible: false
            });
        }
        */


    }
    closeContent() {

        var element = document.getElementsByClassName("content");
        element[0].style.display = 'none';

        element = document.getElementsByClassName("clock-container");
        element[0].style.float = "none";

        this.setState({
            contentVisible: false
        });
    }

    settings(event, someParameter) {
  
        var element;
        if (this.state.contentVisible === true) {
            element = document.getElementsByClassName("content");
            element[0].style.display = 'none';

            element = document.getElementsByClassName("clock-container");
            element[0].style.float = "none";

            this.setState({
                contentVisible: false
            });
        }
        if (this.state.settingsVisible === false) {
            element = document.getElementsByClassName("settings");
            element[0].style.display = 'block';

            this.setState({
                settingsVisible: true
            });
        }
        else {

            element = document.getElementsByClassName("settings");
            element[0].style.display = 'none';

            this.setState({
                settingsVisible: false
            });
        }
      
    }

    saveChanges() {
        var obj = {
            currentLocation: this.state.currentLocation,
            theme: this.state.theme,
            fontName: this.state.fontName,
            languageIcon: this.state.languageIcon,
            language: this.state.language,
        }
        window.localStorage.setItem("settings", JSON.stringify(obj))
        console.log(obj)
    }

    handleOptionChange(e) {
        this.setState({
            theme: e.target.value
        }, this.saveChanges);

        var element;
        if (e.target.value === "Night") {        
            document.body.style.backgroundImage = "url('./background.jpg')";
            element = document.getElementsByClassName("clock-container")[0];
            element.style.backgroundColor = 'rgb(' + [0, 14, 41, 0.7].join(',') + ')';
            document.getElementsByClassName("digital")[0].style.color = "white";
            element = document.getElementsByClassName("content")[0];
            element.style.backgroundColor = 'rgb(' + [0, 14, 41, 0.7].join(',') + ')';
            document.getElementById("seconds-indicator").style.backgroundColor = "#b3e3e3";
            document.getElementById("minutes-indicator").style.backgroundColor = "#0261a9";
            document.getElementById("hours-indicator").style.backgroundColor = "#02e3e3";

            
        }
        if (e.target.value === "Pinky") {
            document.body.style.backgroundImage = "url('./pinkBackground.jpg')"; 
            element = document.getElementsByClassName("clock-container")[0];
            element.style.backgroundColor = 'rgb(' + [179, 0, 0, 0.5].join(',') + ')';     
            document.getElementsByClassName("digital")[0].style.color = "#b30000";
            element = document.getElementsByClassName("content")[0];
            element.style.backgroundColor = 'rgb(' + [179, 0, 0, 0.5].join(',') + ')';
            document.getElementById("seconds-indicator").style.backgroundColor = "#ffccff";
            document.getElementById("minutes-indicator").style.backgroundColor = "#ff0066";
            document.getElementById("hours-indicator").style.backgroundColor = "#ff00ff";
            
        }
        if (e.target.value === "Forest") {
            document.body.style.backgroundImage = "url('./greenBackground.jpg')";
            element = document.getElementsByClassName("clock-container")[0];
            element.style.backgroundColor = 'rgb(' + [2, 75, 2, 0.5].join(',') + ')';
            document.getElementsByClassName("digital")[0].style.color = "#026402";
            element = document.getElementsByClassName("content")[0];
            element.style.backgroundColor = 'rgb(' + [2, 75, 2, 0.5].join(',') + ')';
            document.getElementById("seconds-indicator").style.backgroundColor = "#ccffdd";
            document.getElementById("minutes-indicator").style.backgroundColor = "#00b300";
            document.getElementById("hours-indicator").style.backgroundColor = "#80ff80"; 
        }

        
    }

    changeFont(event, someParameter) {

        document.getElementsByTagName("body")[0].style.fontFamily = someParameter;
        document.querySelectorAll('option').forEach(e => e.style.fontFamily = someParameter);
        this.setState({
            fontName: someParameter,
        },  this.saveChanges);
    }

    changeLocation(event, someParameter) {
         this.setState({
             currentLocation: someParameter
            },  this.saveChanges);
    }
    changeLanguage(event, someParameter) {
     
        var url = './languages/' + someParameter + '.png';
        console.log(url);

        var element = document.getElementsByClassName("language")[0];
        element.style.backgroundImage = "url(" + url + ")";
        this.setState({
            languageIcon: "url('./languages/tr.png')",
            language: someParameter
        },  this.saveChanges); 
    }


    render() {

        
        const hoursDegrees = this.state.date.getHours() * 30 + this.state.date.getMinutes() / 2;
        const minutesDegrees = this.state.date.getMinutes() * 6 + this.state.date.getSeconds() / 10;
        const secondsDegrees = this.state.date.getSeconds() * 6;

        const divStyleHours = {
            transform: "rotateZ(" + hoursDegrees + "deg)"
        };

        const divStyleMinutes = {
            transform: "rotateZ(" + minutesDegrees + "deg)"
        };

        const divStyleSeconds = {
            transform: "rotateZ(" + secondsDegrees + "deg)"
        };
       


        return (
            <div >
                {<div className="digital"> {this.state.date.toLocaleTimeString()} <br /> {this.state.currentLocation}</div>}

                <div className = "language">  </div>

                <div className="settings">
                    <div className="settingsContent">
                        <text className="header">Select a Theme </text>
                        <br/>
                        <table>
                            <tr onChange={this.handleOptionChange.bind(this)}>
                                <td>
                                <div className="radio">
                                        <label><input type="radio" id='regular'
                                            name="theme"
                                            checked={this.state.theme === 'Night'}
                                            value="Night"/><text className="themeName">Night</text>
                                            <div className="DarkBlueClock"><div className="line1"></div> <div className="line2"></div></div>
                                        </label>
                                 </div>
                                </td>
                                <td>
                                    <div className="radio">
                                        <label><input type="radio" id='regular'
                                            name="theme"
                                            checked={this.state.theme === 'Pinky'}
                                            value="Pinky"
                                            /><text className="themeName">Pinky</text>
                                            <div className="PinkClock"><div className="line1"></div> <div className="line2"></div></div>
                                       </label>
                                    </div>
                                </td>
                                <td>
                                    <div className="radio">
                                        <label><input type="radio" id='regular'
                                            name="theme"
                                            checked={this.state.theme === 'Forest'}
                                            value="Forest"/><text className="themeName">Forest</text>
                                            <div className="GreenClock"><div className="line1"></div> <div className="line2"></div></div>
                                        </label>
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <text className="header">Select a Font Family</text>
                        <br />
                        <table>
                            <tr>
                                <td className="tableCell" onClick={(e) => { this.changeFont(e, "Times New Roman") }}>
                                    <p className="a">Times New Roman</p>
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeFont(e, "Arial") }}>
                                   <p className="b">Arial</p>
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeFont(e, "Comic Sans MS") }}>
                                    <p className="c">Comic Sans MS</p>
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeFont(e, "Impact") }}>
                                   <p className="d">Impact</p>
                                </td>

                            </tr>

                            <tr>
                                <td className="tableCell" onClick={(e) => { this.changeFont(e, "Courier New") }}>
                                    <p className="e">Courier New</p>
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeFont(e, "Brush Script MT") }}>
                                    <p className="f">Brush Script MT</p>
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeFont(e, "Papyrus") }}>
                                    <p className="g">Papyrus</p>
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeFont(e, "Copperplate") }}>
                                    <p className="h">Copperplate</p>
                                </td>

                            </tr>

                            <tr>
                                <td className="tableCell" onClick={(e) => { this.changeFont(e, "Goudy Old Style") }}>
                                    <p className="i">Goudy Old Style</p>
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeFont(e, "Baskerville") }}>
                                    <p className="j">Baskerville</p>
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeFont(e, "Rockwell") }}>
                                    <p className="k">Rockwell</p>
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeFont(e, "Lucida Bright") }}>
                                    <p className="l">Lucida Bright</p>
                                </td>

                            </tr>
                            

                        </table>
                        <text className="header">Select a Location</text>
                        <br />
                        <div class="form-group">
                           
                            <select multiple class="form-control" id="exampleFormControlSelect2">
                                <option onClick={(e) => { this.changeLocation(e, "Amsterdam/Netherlands") }}>Amsterdam</option> <option onClick={(e) => { this.changeLocation(e, "Taipei/Taiwan") }}>Taipei</option>
                                <option onClick={(e) => { this.changeLocation(e, "Barcelona/Spain") }}>Barcelona</option> <option onClick={(e) => { this.changeLocation(e, "Hong Kong") }}>Hong Kong</option>
                                <option onClick={(e) => { this.changeLocation(e, "Tokyo/Japan") }}>Tokyo</option> <option onClick={(e) => { this.changeLocation(e, "London/United Kingdom") }}>London</option>
                                <option onClick={(e) => { this.changeLocation(e, "Dubai/United Arab Emirates") }}>Dubai</option> <option onClick={(e) => { this.changeLocation(e, "Paris/France") }}>Paris</option>
                                <option onClick={(e) => { this.changeLocation(e, "New York/USA") }}>New York City</option> <option onClick={(e) => { this.changeLocation(e, "Singapore") }}>Singapore</option>
                                <option onClick={(e) => { this.changeLocation(e, "Mumbai/India") }}>Mumbai</option> <option onClick={(e) => { this.changeLocation(e, "Delhi/India") }}>Delhi</option>
                                <option onClick={(e) => { this.changeLocation(e, "Prague/Czechia") }}>Prague</option> <option onClick={(e) => { this.changeLocation(e, "Istanbul/Turkey") }}>Istanbul</option>
                                <option onClick={(e) => { this.changeLocation(e, "Mecca/Saudi Arabia") }}>Mecca</option> <option onClick={(e) => { this.changeLocation(e, "Rome/Italy") }}>Rome</option>
                                <option onClick={(e) => { this.changeLocation(e, "Miami/USA") }}>Miami</option> <option onClick={(e) => { this.changeLocation(e, "Guangzhou/China") }}>Guangzhou</option>
                                <option onClick={(e) => { this.changeLocation(e, "Seoul/South Korea") }}>Seoul</option> <option onClick={(e) => { this.changeLocation(e, "Bangkok/Thailand") }}>Bangkok</option>
                                <option onClick={(e) => { this.changeLocation(e, "Shanghai/China") }}>Shanghai</option> <option onClick={(e) => { this.changeLocation(e, "Los Angeles/USA") }}>Los Angeles</option>
                            </select>
                            
                        </div>

                        <text className="header">Select News Language</text>
                        <br />
                       
                        <table>
                            <tr>
                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "tr") }}>
                                    <img alt="Turkish" title="Turkish" src="./languages/tr.png" />
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "au") }}>
                                    <img alt="Australian" title="Australian" src="./languages/au.png" />
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "jp") }}>
                                    <img alt="Japanese" title="Japanese" src="./languages/jp.png" />
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "ca") }}>
                                    <img alt="Canadian" title="Canadian" src="./languages/ca.png" />
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "cn") }}>
                                    <img alt="China" title="China" src="./languages/cn.png" />
                                </td>

                            </tr>

                            <tr>
                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "de") }}>
                                    <img alt="Deutsch" title="Deutsch" src="./languages/de.png" />
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "it") }}>
                                    <img alt="Italian" title="Italian" src="./languages/it.png" />
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "cz") }}>
                                    <img alt="Czech" title="Czech" src="./languages/cz.png" />
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "eg") }}>
                                    <img alt="Egyptian" title="Egyptian" src="./languages/eg.png" />
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "fr") }}>
                                    <img alt="French" title="French" src="./languages/fr.png" />
                                </td>

                            </tr>

                            <tr>
                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "gb") }}>
                                    <img alt="The UK" title="The UK" src="./languages/gb.png" />
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "gr") }}>
                                    <img alt="Greek" title="Greek" src="./languages/gr.png" />
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "hu") }}>
                                    <img alt="Hungarian" title="Hungarian" src="./languages/hu.png" />
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "in") }}>
                                    <img alt="Indian" title="Indian" src="./languages/in.png" />
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "kr") }}>
                                    <img alt="Korean" title="Korean" src="./languages/kr.png" />
                                </td>
                            </tr>
                            <tr>
                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "nl") }}>
                                    <img alt="Dutch" title="Dutch" src="./languages/nl.png" />
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "rs") }}>
                                    <img alt="Serbia" title="Serbia" src="./languages/rs.png" />
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "br") }}>
                                    <img alt="Brazilian" title="Brazilian" src="./languages/br.png" />
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "ru") }}>
                                    <img alt="Russia" title="Russia" src="./languages/ru.png" />
                                </td>

                                <td className="tableCell" onClick={(e) => { this.changeLanguage(e, "us") }}>
                                    <img alt="The USA" title="The USA" src="./languages/us.png" />
                                </td>
                            </tr>


                        </table>

                    </div>
                    
                    
                </div>

                <div className="clock-container styling">
                    <div id="clock" className="clock-content">

                        <div className="icons"><img alt="todo" title="todo" src="./icons/checklist.png" /> </div>
                        <div className="icons"><img alt="todo" title="todo" src="./icons/checklist.png" /> </div>
                        <div className="icons"><img alt="todo" title="todo" src="./icons/checklist.png" /> </div>
                        <div className="icons"><img alt="todo" title="todo" src="./icons/checklist.png" /> </div>
                        <div className="icons"><img alt="todo" title="todo" src="./icons/checklist.png" /> </div>
                        <div className="icons"><img alt="todo" title="todo" src="./icons/checklist.png" /> </div>
                        <div className="icons"><img alt="todo" title="todo" src="./icons/checklist.png" /> </div>

                        <div className="icons"><img alt="business" title="business" src="./icons/business.png" /> </div>
                        <div className="icons"><img alt="entertainment" title="icons/entertainment" src="./icons/entertainment.png" /> </div>
                        <div className="icons"><img alt="general" title="general" src="./icons/general.png" /> </div>
                        <div className="icons"><img alt="health" title="health" src="./icons/health.png" /> </div>
                        <div className="icons"><img alt="science" title="science" src="./icons/science.png" /> </div>
                        <div className="icons"><img alt="sports" title="sports" src="./icons/sports.png" /> </div>
                        <div className="icons"><img alt="technology" title="technology" src="./icons/technology.png" /> </div>

                        <div className="icons"><img alt="weather" title="weather" src="./icons/weather.png" /> </div>
                        <div className="icons"><img alt="weather" title="weather" src="./icons/weather.png" /> </div>
                        <div className="icons"><img alt="weather" title="weather" src="./icons/weather.png" /> </div>
                        <div className="icons"><img alt="weather" title="weather" src="./icons/weather.png" /> </div>
                        <div className="icons"><img alt="weather" title="weather" src="./icons/weather.png" /> </div>
                        <div className="icons"><img alt="weather" title="weather" src="./icons/weather.png" /> </div>
                        <div className="icons"><img alt="weather" title="weather" src="./icons/weather.png" /> </div>
                    

                        <div className="surface">
                            <div className="sector"></div>
                            <div className="sector"></div>
                            <div className="sector"></div>
                            <div className="sector"></div>
                            <div className="sector"></div>
                            <div className="sector"></div>
                            <div className="sector"></div>
                        </div>

                        <div className="activity">
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "Todos", "DayID": 2})}}></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "Todos", "DayID": 3})}}></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "Todos", "DayID": 4})}}></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "Todos", "DayID": 5})}}></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "Todos", "DayID": 6})}}></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "Todos", "DayID": 0})}}></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "Todos", "DayID": 1})}}></div>
                        </div>

                        <div className="news">
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "News", "DayID": 2})}}></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "News", "DayID": 3})}}></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "News", "DayID": 4})}}></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "News", "DayID": 5})}}></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "News", "DayID": 6})}}></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "News", "DayID": 0})}}></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "News", "DayID": 1})}}></div>
                        </div>

                        <div className="weather">
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "Weather", "DayID": 3})}} ></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "Weather", "DayID": 4})}} ></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "Weather", "DayID": 5})}} ></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "Weather", "DayID": 6})}} ></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "Weather", "DayID": 0})}}></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "Weather", "DayID": 1})}}></div>
                            <div className="sector" onClick={(e) => { this.newsList(e, {"SectorID": "Weather", "DayID": 2})}} ></div>
                        </div>
                        
                        
                   
                        <text className="monday" id="monday">Monday</text>
                        <text className="tuesday" id="tuesday">Tuesday</text>
                        <text className="wednesday" id="wednesday">Wednesday</text>
                        <text className="thursday" id="thursday">Thursday</text>
                        <text className="friday" id="friday">Friday</text>
                        <text className="saturday" id="saturday">Saturday</text>
                        <text className="sunday" id="sunday">Sunday</text>
                            
                        

                        <div
                            id="hours-indicator"
                            className={
                                "indicator hours-indicator " +
                                (this.state.date.getHours() === 0 ? "" : "transition-effect")
                            }
                            style={divStyleHours}></div>
                        <div
                            id="minutes-indicator"
                            className={
                                "indicator minutes-indicator " +
                                (this.state.date.getMinutes() === 0 ? "" : "transition-effect")
                            }
                            style={divStyleMinutes}></div>
                        <div
                            id="seconds-indicator"
                            className={
                                "indicator seconds-indicator " +
                                (this.state.date.getSeconds() === 0 ? "" : "transition-effect")
                            }
                            style={divStyleSeconds}></div>
                        <div className="indicator-cover" onClick={(e) => { this.settings(e, 1) }}></div>
                    </div>
                    

                </div>
                <div className="content">
                    {this.state.contentBody}
                    <button className="closeButton" onClick={this.closeContent}>
                      Close
                    </button>
                </div>
            </div>
        );
    }
}


export default Welcome;
