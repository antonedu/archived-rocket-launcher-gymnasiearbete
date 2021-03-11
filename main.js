const {app, BrowserWindow, globalShortcut} = require("electron");
const game = require("./gameFunctions");
const path = require('path');
const fs = require("fs");
var settings = fs.readFileSync(
  // process.resourcesPath + '\\app' + '\\databases\\settings.json'
  path.join(__dirname, '/databases/settings.json')
  , 'utf8');

// creates a electron window with index.html
function createWindow () {
  const win = new BrowserWindow({
    backgroundColor: '#121212',
    webPreferences: {
      nodeIntegration: true,
      devtools: true, // This one should be set to false before packaging
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png')
  });
  // makes the html file that is loaded to index.html
  win.loadFile('index.html');
};

app.whenReady().then(createWindow).then(() => {
  // Disables devTools
  // globalShortcut.register('Control+Shift+I', () => {
  //     return false;
  // });
  game.addInstalledGamesToLibrary();
});

// function that closes the electron process if all electron windows get closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
