import React from 'react';


class Todos extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dayoffset: 0,
            date: 0,
            todos: [],
            text: ""
        }

        this.handleAdd = this.handleAdd.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    save = () => {
        var store_date = this.state.date.toLocaleString().substring(0,10)
        var stored_obj = this.state.todos.map((todo) => ({"todo": todo, "date": store_date}))
        window.localStorage.setItem("todos" + this.props.DayID.toString(), JSON.stringify(stored_obj))
    }

    handleRemove(id) {
        return (
            () => {
                let array = this.state.todos
                array.splice(id, 1)
                this.setState({
                    todos: array
                }, this.save)
            }
        )
    }

    //Input values are kept in the local states
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleAdd(e) {
        e.preventDefault()
        let array = this.state.todos
        array.push(this.state.text)
        this.setState({
            text: "",
            todos: array
        }, this.save)
    }
    
    componentDidMount() {
        //Compute Date
        var date = new Date()
        var dayoffset = this.props.DayID -  date.getDay()
        console.log(this.props.DayID)
        date.setDate(date.getDate() + dayoffset + 1)

        var todos = JSON.parse(window.localStorage.getItem("todos" + this.props.DayID.toString())) || [];

        console.log(todos)
        var filter_date = this.state.date.toLocaleString().substring(0,10)
        todos = todos.filter(obj => {return obj.date !== filter_date}).map(obj => obj.todo)
        console.log(todos)

        this.setState({
            date: date,
            todos: todos
        })
        
    }
    
    

    render() {
        return (
            <div style= {{textAlign: "center",  color: 'white', fontSize: "18px"}}>
                <h1>{this.state.date.toLocaleString().substring(0,10)}</h1>
                <table class="table">
                    <tbody>
                        {this.state.todos.map((item, id) => {
                            return (
                                <tr key={id}>
                                    <td>{item}</td>
                                    <td style={{textAlign: "right"}}><button class="btn btn-action" onClick={this.handleRemove(id)}><h5>X</h5></button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div class="input-group">
                    <input style={{color: "purple"}} class="form-input"
                        onChange={this.handleChange}
                        value={this.state.text}
                        name="text"
                     placeholder="...."/>
                    <button onClick={this.handleAdd} class="btn btn-primary input-group-btn">Add Todo</button>
                </div>
            </div>
            
        )
    }


}

export default Todos