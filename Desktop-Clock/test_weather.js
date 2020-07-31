
city2offset = {
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
    var offset = city2offset[city]
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000*offset));
    return nd
}