import electron, { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import Storage from "./storage";
import {ITask, ITasks} from "./../interfaces";
import { func } from 'prop-types';

let mainWindow: Electron.BrowserWindow;
let childrenWindow: Electron.BrowserWindow;

let store: Storage = new Storage("tasks.json");

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        minHeight: 600,
        minWidth: 800,
        title: "To Do"
    });


    mainWindow.webContents.on('dom-ready', () => {
        let data: ITasks = store.parseFile();
        mainWindow.webContents.send('sending', data);
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, './index.html'),
            protocol: 'file:',
            slashes: true,
        })
    );

    // mainWindow.webContents.openDevTools();
    mainWindow.setMenu(null);

    // end of session when computer restarts etc
    mainWindow.on("session-end", () => {
        mainWindow = null;
    });
    
    mainWindow.on("minimize", () => {
        createChildrenWindow();
        mainWindow.hide();
    });

    // when window not responding
    // mainWindow.on("unresponsive", () => {
    //     mainWindow.close();
    // });
    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        mainWindow = null;
        app.quit();
    });
}

function createChildrenWindow(){
    childrenWindow = new BrowserWindow({
        height: 600,
        width: 800,
        minHeight: 600,
        minWidth: 800,
        title: "To Do"
    });


    childrenWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, './index.html?tasks'),
            protocol: 'file:',
            slashes: true,
        })
    );

    // mainWindow.webContents.openDevTools();
    childrenWindow.setMenu(null);

    // end of session when computer restarts etc
    childrenWindow.on("session-end", () => {
        childrenWindow = null;
    });
    
    // when window not responding
    // childrenWindow.on("unresponsive", () => {
    //     childrenWindow.close();
    // });
    // Emitted when the window is closed.

    childrenWindow.on("minimize", () => {
        childrenWindow = null;
        mainWindow.show();
    });
    childrenWindow.on('closed', () => {
        childrenWindow = null;
        mainWindow.show();
    });
}

electron.ipcMain.on("task", (event: any, arg: ITask) => {
    store.append(arg);
});

electron.ipcMain.on("delete", (event: any, arg: ITasks) =>{
    store.update(arg);
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});