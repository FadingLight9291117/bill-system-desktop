// Modules to control application life and create native browser window
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const { app, BrowserWindow } = require('electron')
const { ipcMain } = require("electron")
const { insertBill } = require('./data')
const remote = require('./remote');

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// read yaml
const config = yaml.load(fs.readFileSync('./config/config.yaml', 'utf8'));
// 设置账单item类别
const billClass = config.billClass;
const cls1 = Object.keys(billClass);
const cls2 = Object.values(billClass);

ipcMain.handle("cls", (e, args) => {
    return {
        cls1: cls1,
        cls2: cls2,
    }
});

ipcMain.handle('addBill', (e, args) => {
    const billItem = args.billItem;
    const dateTime = new Date().toLocaleString();
    billItem.dateTime = dateTime;
    insertBill([billItem]);

    return true;
});

ipcMain.handle('sync', (e, args) => {
    remote.mainSync()
        .then(result => console.log(`${result} bills sync done.`))
        .catch(e => console.log(e));
});