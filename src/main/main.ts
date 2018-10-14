import electron, { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import Storage from "./storage";
import {ITask, ITasks} from "./../interfaces";

let mainWindow: Electron.BrowserWindow;
let store: Storage = new Storage("tasks.json");

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
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

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        mainWindow = null;
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