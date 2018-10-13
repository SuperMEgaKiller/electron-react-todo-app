const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const Storage = require('./storage');

let mainWindow;
let taskFileName = "tasks.json";
const store = new Storage(taskFileName);

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
            width: 800, 
            height: 600,
    });
    
    mainWindow.webContents.on('dom-ready', () => {
        let data = store.parseFile();
        mainWindow.webContents.send('sending', data)
    });
    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    mainWindow.setMenu(null);
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null
    });

    // const MainMenu = Menu.buildFromTemplate(MainWindowMenu);
    // Menu.setApplicationMenu(MainMenu);
}

ipcMain.on("task", (event, arg) => {
    store.append(arg);
});

ipcMain.on("delete", (event, arg) =>{
    store.update(arg);
});
app.on('ready', createWindow);


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
