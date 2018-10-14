import React, {Component} from "react";
import electron from "electron";
import {IAppProps, ITask, ITasks, IAppState} from "../../interfaces";
import "./App.css";

export default class App extends Component<IAppProps, IAppState>{
    
    constructor(props: IAppProps) {
        super(props);

        this.state = {
            item: {
                task: "",
                date: new Date(),
                done: false
            },
            items: []
        }

        // console.log(this.state.items.map(e => e.task + "sdsd"));
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.buttonHandle = this.buttonHandle.bind(this);
    }

    componentDidMount(){
        // loading data from file before app is render
        electron.ipcRenderer.on("sending", (event: any, arg: ITasks) => {
            let arg_sorted = arg.sort((a: ITask, b:ITask) => new Date(a.date).getTime() - new Date(b.date).getTime());
            console.log(arg_sorted);
            this.setState({
            items: arg_sorted,
            });
        });
    }
    
    handleChange(event: React.ChangeEvent<HTMLInputElement>){

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

    handleSubmit(event: React.FormEvent<HTMLFormElement>){

        event.preventDefault();
        // if input not empty send task to electron and add to list of tasks
        if(this.state.item.task !== ""){
          electron.ipcRenderer.send("task", this.state.item);
          this.setState({
            items: [this.state.item, ...this.state.items]
          });
        }
        // clear item state
        this.setState({
          item: {
            task: "",
            date: new Date(),
            done: false
          },
        });
      }

    buttonHandle(event: React.MouseEvent<HTMLElement>, index: number){
        event.preventDefault();
        let fItems: ITask[] = this.state.items.filter((task, i) => {
          return index !== i;
        });
    
        this.setState({
          items: fItems
        });

        electron.ipcRenderer.send("delete", fItems);

      }
    render() {
        let items_list = this.state.items.map((val, i) => {
          return(
                <li className="list-group-item d-flex justify-content-between align-items-center" key={i}>
                    {val.task} 
    
                    <span className="badge badge-primary badge-pill">
                        {val.date.toString().slice(0, 10)}
                    </span>
    
                    <button 
                    onClick={(e) => this.buttonHandle(e, i)} 
                    type="button" 
                    className="btn btn-outline-danger">X</button>
                    
                </li>);
        });
    
        return (
          <div className="App">
            <header>
                <h1 className="display-3">Electron-React App</h1>
            </header>
    
            <div className="navbar navbar-expand-lg">
                <form className="form-inline my-2 my-lg-0" onSubmit={(e) => this.handleSubmit(e)}>
                    
                    <input 
                    className="form-control mr-sm-2" 
                    placeholder="What needs to be done?" 
                    value={this.state.item.task} 
                    name="item" 
                    type="text" 
                    autoFocus={true}
                    onChange={(e) => this.handleChange(e)} />
        
                </form>
            </div>
    
            <ul className="list-group">
                {items_list}
            </ul>
        </div>
        );
    }
}