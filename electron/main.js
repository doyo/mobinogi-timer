const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const isMac = process.platform === 'darwin';

  const win = new BrowserWindow({
    width: 780,
    height: 600,
    minWidth: 320,
    minHeight: 340,
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

  // Inject drag region so the window can be moved (titlebar is hidden)
  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(`
      body { -webkit-app-region: drag; }
      button, input, a, select { -webkit-app-region: no-drag; }
    `);
  });
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
