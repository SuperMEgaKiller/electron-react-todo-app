import React, {Component} from "react";
import electron from "electron";
import {IAppProps, ITask, ITasks, IAppState} from "../../interfaces";
// import {Switch, Route} from "react-router-dom";
import TasksList from "./components/TasksList";
import Input from "./components/Input";
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

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.buttonHandle = this.buttonHandle.bind(this);
    }

    componentDidMount(){
        // loading data from file before app is render
        electron.ipcRenderer.on("sending", (event: any, arg: ITasks) => {
            let arg_sorted = arg.sort((a: ITask, b:ITask) => new Date(a.date).getTime() - new Date(b.date).getTime());
            this.setState({
            items: arg_sorted,
            });
        });
    }
    
    handleChange(event: React.ChangeEvent<HTMLInputElement>){

        event.preventDefault();
        this.setState({
          item: {
            task: event.target.value,
            date: new Date(),
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
        return (
          <div className="App">
            <header>
                <h1 className="display-3">Electron-React App</h1>
            </header>
            <Input onChange={this.handleChange} onSubmit={this.handleSubmit} val={this.state.item.task}/>
            <TasksList onClick={this.buttonHandle} tasks={this.state.items}/>
        </div>
        );
    }
}