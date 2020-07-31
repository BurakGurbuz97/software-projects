const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');

var mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 1500,
                                  height: 920});

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
  mainWindow.webContents.on("new-window", function(event, url) {
      event.preventDefault();
      electron.shell.openExternal(url);
  });
}

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
//view.setAutoResize({ width: false, height: false });
/*
var resizeTimeout;
mainWindow.on('resize', (e) => {
    console.log("girdi");
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        var size = mainWindow.getSize();
        mainWindow.setSize(size[0], parseInt(size[0] * 1 / 1));
      
    }, 100);
});
*/