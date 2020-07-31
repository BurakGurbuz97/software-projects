import React from 'react';
import './App.css';
import Welcome from "./welcome"

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            auth: false
        }
    }

    render() {
        return (
            <div className="container">
   
                        {this.state.auth ? <Welcome/> : <Welcome/>}

                
            </div>
        )
    }

}

export default App;
