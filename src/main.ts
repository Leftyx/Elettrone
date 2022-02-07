import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as os from 'os';

if (!app.requestSingleInstanceLock()) {
   app.quit();
   process.exit(0);
}

const createWindow = async (): Promise<BrowserWindow> => {
   // Create the browser window.
   const mainWindow = new BrowserWindow({
      height: 600,
      webPreferences: {
         preload: path.join(__dirname, 'preload.js'),
      },
      width: 800,
   });

   // and load the index.html of the app.
   mainWindow.loadFile(path.join(__dirname, '../index.html'));

   if (!app.isPackaged) {
      mainWindow.webContents.openDevTools();
   }

   return mainWindow;
};

const restoreOrCreateWindow = async () => {
   let window = BrowserWindow.getAllWindows().find((window) => !window.isDestroyed());

   if (window === undefined) {
      window = await createWindow();
   }

   if (window.isMinimized()) {
      window.restore();
   }

   window.focus();
};


app.whenReady()
   .then(restoreOrCreateWindow)
   .catch((reason) => console.error('Failed create window:', reason));

// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on('activate', restoreOrCreateWindow);

app.on('second-instance', restoreOrCreateWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
   if (os.platform() !== 'darwin') {
      app.quit();
   }
});



// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
