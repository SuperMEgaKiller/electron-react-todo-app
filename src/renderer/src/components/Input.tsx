import React, {Component} from "react";
import {ITask, IInputProps, IInputState} from "./../../../interfaces";

import "./Input.css";


export default class Input extends Component<IInputProps, IInputState>{
    render(){
        return(
            <div className="navbar navbar-expand-lg">
                <form className="form-inline my-2 my-lg-0" onSubmit={(e) => this.props.onSubmit(e)}>
                    <input 
                    className="form-control mr-sm-2" 
                    placeholder="What needs to be done?" 
                    value={this.props.val} 
                    name="item" 
                    type="text" 
                    autoFocus={true}
                    onChange={(e) => this.props.onChange(e)} />
                </form>
            </div>
        );
    }
}

