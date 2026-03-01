const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const isMac = process.platform === 'darwin';

  const win = new BrowserWindow({
    width: 780,
    height: 600,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    titleBarStyle: isMac ? 'hiddenInset' : 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // dev: index.html is at ../web/index.html, packaged: same dir as main.js
  const htmlPath = app.isPackaged
    ? path.join(__dirname, 'index.html')
    : path.join(__dirname, '../web/index.html');

  win.loadFile(htmlPath);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
