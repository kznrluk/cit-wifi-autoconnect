const {app, BrowserWindow} = require('electron');
let mainWindow = null;

module.exports = class UserInterface {
    initView(){
        app.on('ready', () => {
            mainWindow = new BrowserWindow({
                "width": 250,
                "height": 250,
                "resizable": false
            });
        
            mainWindow.setMenu(null);
            mainWindow.loadURL(`file://${__dirname}/ui_src/index.html`);
        });
    }
}