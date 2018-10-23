import React, {Component} from "react";
import {ITask, ITasksListProps, ITasksListState} from "./../../../interfaces";
import "./TasksList.css";


export default class TasksList extends Component<ITasksListProps, ITasksListState>{
    constructor(props: ITasksListProps) {
        super(props);

        this.state = {
            items: []
        }
    }

    render(){
        let items_list = this.props.tasks.map((val: ITask, i: number) => {
            return(
                <li className="list-group-item d-flex justify-content-between align-items-center" key={i}>
                    {val.task} 
      
                    <span className="badge badge-primary badge-pill">
                        {val.date.toString().slice(0, 10)}
                    </span>
      
                    <button 
                    onClick={(e: React.MouseEvent<HTMLElement>) => this.props.onClick(e, i)} 
                    type="button" 
                    className="btn btn-outline-danger">X</button>
                      
                </li>);
            });

        return(
            <ul className="list-group">
                {items_list}
            </ul>
        );
    }
}