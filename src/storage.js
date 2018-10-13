const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Storage{
    constructor(file) {
        const userDataPath = (electron.app || electron.remote.app).getPath("userData");
        this.Path = path.join(userDataPath, file);
        // console.log(this.Path);
        const userDataFile = fs.openSync(this.Path, "a+");
        fs.closeSync(userDataFile);
    }
 
    parseFile(){
        try {
            return JSON.parse(fs.readFileSync(this.Path));
        } catch (error) {
            return;
        }
    }
    append(doc){
        // doc = {
        // task: ....
        // done: ...
        // time: ...
        //} 
        try {
            fs.readFile(this.Path, (err, data) => {
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
            
        } catch (error) {
            console.log("Error append: ");
            console.error(error);
        }
    }

    update(docs){
        // as input take docs after filtering them
        try {
            fs.readFile(this.Path, (err, data) => {
                if(err) throw err;
        
                let json = JSON.parse(data);
                json.tasks.length = 0;
                json.tasks.push(...docs);
                fs.writeFile(this.Path, JSON.stringify(json, null, 2), (err) => {
                    if(err) throw err;
                });
            });
        } catch (error) {
            console.log("Error : ");
            console.error(error);
        }
    }
}


module.exports = Storage;