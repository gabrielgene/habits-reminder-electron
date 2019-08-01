const { app, BrowserWindow, Tray, ipcMain } = require('electron');
const path = require('path');

const isDev = require('electron-is-dev');
let mainWindow = undefined;
let tray = undefined;

// Don't show the app in the doc
app.dock.hide();

app.on('ready', () => {
  createWindow();
  createTray();
});

const createTray = () => {
  const icon = `${path.join(__dirname, 'icon.png')}`;
  console.log(icon);
  tray = new Tray(icon);
  tray.on('click', function(event) {
    toggleWindow();
  });
};

const toggleWindow = () => {
  mainWindow.isVisible() ? mainWindow.hide() : showWindow();
};

const showWindow = () => {
  const position = getWindowPosition();
  console.log({ position });
  mainWindow.setPosition(position.x, position.y, false);
  mainWindow.show();
};

const getWindowPosition = () => {
  const windowBounds = mainWindow.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2,
  );
  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);
  return { x: x, y: y };
};

const createWindow = () => {
  const icon = `${path.join(__dirname, 'icon.png')}`;
  mainWindow = new BrowserWindow({
    width: 420,
    height: 460,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    icon,
  });
  // mainWindow.setAspectRatio();
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  );
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    // mainWindow.webContents.openDevTools();
  }
  mainWindow.on('closed', () => (mainWindow = null));
  mainWindow.on('blur', () => {
    if (!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
    }
  });
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('task-updated', (event, tasks) => {
  tray.setTitle(`${tasks}`);
});
