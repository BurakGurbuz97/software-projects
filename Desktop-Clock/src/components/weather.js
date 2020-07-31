import React from "react"
const Axios = require("axios")

function getRandomItem(set) {
    let items = Array.from(set);
    return items[Math.floor(Math.random() * items.length)];
}

const country2iso = {
    "Netherlands": "nl", "Spain": "es", "Japan": "jp", "United Arab Emirates": "ae",
    "USA": "us", "India": "in", "Czechia": "cz",  "Saudi Arabia": "sa", "South Korea": "KR",
    "China": "cn", "Taiwan": "tw", "Hong Kong": "hk", "United Kingdom": "gb", "France": "fr",
    "Singapore": "sg",  "Turkey": "tr", "Italy": "it",  "Thailand": "th"
}

const num2day = {
    1 : "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday",
    5: "Friday", 6: "Saturday", 0: "Sunday"
}

function fetch_weekly_forecast(city, country, callback) {
    var day2weather = {}
    var apiId = "58f46e0fda1c1d4da743943c656bcfe3"
    var city = city
    var code = country2iso[country]
    var mode = "json"
    var url =  `http://api.openweathermap.org/data/2.5/forecast?appid=${apiId}&q=${city},${code}&mode=${mode}`
    Axios.get(url).then( (res, err) => {
        if (err) {
            callback(null , err)
        } else {
            var time_reference = res.data.list[0].dt_txt.split(" ")[1]
            var average = 0
            var weather_set  = new Set()
            res.data.list.map((data) => {
                if (data.dt_txt.split(" ")[1] === time_reference) {
                    var date = new Date(data.dt_txt)
                    var min  = Math.round(data.main["temp_min"] - 273.15)
                    var max  = Math.round(data.main["temp_max"] - 273.15)
                    var temp = Math.round(data.main["temp"] - 273.15)
                    var weather = data.weather[0]["main"]
                    var day = num2day[date.getDay()]
                    day2weather[day] = {
                        "min": min,
                        "max": max,
                        "temp": temp,
                        "weather": weather,
                    }
                    average = average + temp
                    weather_set.add(weather)
                }
            })
            average = Math.round(average / 5)
            Object.keys(num2day).forEach((key) => {
                key = num2day[key]
                if(day2weather[key] === undefined ) {
                    var randomize_average = average //can add some staff
                    day2weather[key] = {
                        "min": Math.round(randomize_average),
                        "max": Math.round(randomize_average),
                        "temp": Math.round(randomize_average),
                        "weather": getRandomItem(weather_set)
                    }
                }
            })
            console.log(day2weather)
            callback(day2weather, null)
        }
    })
}

class Weather extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            temp: 20,
            weather: "Clear",
            err: null
        }
    }

    componentDidMount() {
        fetch_weekly_forecast(this.props.city, this.props.country, (day2weather, err) => {
            if (err) {
                this.setState({
                    loading: false,
                    err: true
                })
            } else {
                this.setState({
                    loading: false,
                    temp: day2weather[num2day[this.props.dayId]].temp,
                    weather: day2weather[num2day[this.props.dayId]].weather,
                })
                console.log(this.state)
            }
        })

    }

    render() {
        var icon_src = "";
        if (this.state.weather === "Clear") {
            icon_src = "./sunny.png"
        } else if  (this.state.weather === "Snow") {
            icon_src = "./snow.png"
        }
        else if  (this.state.weather === "Rain") {
            icon_src = "./rain.jpg"
        }
        else if  (this.state.weather === "Clouds") {
            icon_src = "./cloud.png"
        }

        return (
            <div  style={{textAlign: "center"}}>
                    <div style = {{ color: "white",  backgroundColor: 'rgba(0, 0, 0, 0.0)'}} class="card">
                    <div class="card-header">
                        <div class="card-title h3">
                            {num2day[this.props.dayId] + " (" + this.props.city + ")"}
                        </div>
                    </div>
                    <div class="card-body">
                        <img  width="128" height="128" src = {icon_src}/>
                    </div>
                    <div class="card-footer">
                        {this.state.temp.toString()+ "°" + " Celsius"} 
                    </div>
                    </div>
            </div>
        )
    }
}

export default Weather