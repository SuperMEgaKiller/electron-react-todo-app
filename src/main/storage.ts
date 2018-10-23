import electron from "electron";
import fs from "fs";
import path from "path";
import {ITask, ITasks} from "../interfaces";

export default class Storage{
    Path: string;
    
    constructor(file: string) {
        const userDataPath = (electron.app || electron.remote.app).getPath("userData");
        this.Path = path.join(userDataPath, file);
        const userDataFile = fs.openSync(this.Path, "a+");
        fs.closeSync(userDataFile);
    }
 
    parseFile(): ITasks{
        try {
            let data: ITasks = JSON.parse(fs.readFileSync(this.Path, "utf-8")).tasks;
            return data;
        } catch (error) {
            return;
        }
    }
    append(doc: ITask){
        // doc = {
        // task: ....
        // done: ...
        // time: ...
        //} 
        fs.readFile(this.Path, "utf-8", (err: Error, data: string) => {
            if(err) throw err;
            // if file is empty
            if(data.length === 0){
                let template = {
                    tasks: [doc]
                };
                fs.writeFile(this.Path, JSON.stringify(template, null, 2), (err) => {
                    if(err) throw err;
                });
            }
            else {
                let json = JSON.parse(data);
                json.tasks.push(doc);
                fs.writeFile(this.Path, JSON.stringify(json, null, 2), (err) => {
                    if(err) throw err;
                });
            }
        });
    }

    update(docs: ITasks){
        // as input take docs after filtering them
        fs.readFile(this.Path, "utf-8", (err: Error, data: string) => {
            if(err) throw err;
    
            let json = JSON.parse(data);
            json.tasks.length = 0;
            json.tasks.push(...docs);
            fs.writeFile(this.Path, JSON.stringify(json, null, 2), (err) => {
                if(err) throw err;
            });
        });
    }
}