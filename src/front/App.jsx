import React, { Component } from 'react';
import './App.css';

const { ipcRenderer } = window.require('electron');



class App extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.buttonHandle = this.buttonHandle.bind(this);
    this.state = {
      item: {
        task: "",
        date: {},
        done: false
      },
      items: [],
    };
  }

  dateSord(a, b){
    return new Date(b) - new Date(a);
  }
  componentDidMount(){
    // loading data from file before app is render
    // ipcRenderer.send("loading", "go");
    
    ipcRenderer.on("sending", (event, arg) => {
      let arg_sorted = arg.tasks.sort((a,b) => this.dateSord(a.date, b.date));
      this.setState({
        items: arg_sorted,
      });
    });
  }

  handleChange(event){
    event.preventDefault();
    console.log(event.target.value);
    let date = new Date();
    this.setState({
      item: {
        task: event.target.value,
        date: date,
        done: false
      }
    });
  }
  handleSubmit(event){
    event.preventDefault();
    // if input not empty send task to electron and add to list of tasks
    if(this.state.item.task !== ""){
      ipcRenderer.send("task", this.state.item);
      this.setState({
        items: [this.state.item, ...this.state.items]
      });
    }
    // clear item state
    this.setState({
      item: {
        task: "",
        date: {},
        done: false
      },
    });
  }

  buttonHandle(event, index){
    event.preventDefault();
    
    let fItems = this.state.items.filter((task, i) => {
      return index !== i;
    });

    this.setState({
      items: fItems
    });
    ipcRenderer.send("delete", fItems);
  }

  render() {
    // generating based on list of elements in state 
    let items_list = this.state.items.map((val, i) => {
      // let task_done = check is done
      return  (<li className="list-group-item d-flex justify-content-between align-items-center" key={i}>
                {val.task} 
                <span className="badge badge-primary badge-pill">
                  {val.date.toString().slice(0, 10)}
                </span>
                <button onClick={(e) => this.buttonHandle(e, i)} type="button" className="btn btn-outline-danger">X</button>
              </li>);
    });

    return (
      <div className="container">
        <header>
          <h1 className="display-3">Electron-React App</h1>
        </header>

        <div className="navbar navbar-expand-lg">
          <form className="form-inline my-2 my-lg-0" onSubmit={(e) => this.handleSubmit(e)}>
            <input className="form-control mr-sm-2" placeholder="What needs to be done?" value={this.state.item.task} name="item" type="text" autoFocus={true} onChange={(e) => this.handleChange(e)} />
            {/* <button type="submit" className="btn btn-secondary my-2 my-sm-0">Add</button> */}
          </form>
        </div>

        <ul className="list-group">
          {items_list}
        </ul>
      </div>
    );
  }
}

export default App;
