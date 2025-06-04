const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const iconv = require('iconv-lite');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let compileProcess = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 500,
    minWidth: 700,
    minHeight: 400,
    frame: true,
    icon: path.join(__dirname, '../df.png'),
    title: '移远SDK辅助工具',
    webPreferences: {
      preload: path.join(__dirname, '../src/preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.removeMenu();
  mainWindow.setTitle('移远SDK辅助工具');

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  // 自动更新：局域网服务器
  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdates();

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '发现新版本',
      message: '检测到新版本，是否现在更新？',
      buttons: ['是', '否']
    }).then(result => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
  });

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '更新就绪',
      message: '新版本已下载，是否现在安装并重启？',
      buttons: ['是', '否']
    }).then(result => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.canceled ? '' : result.filePaths[0];
});

ipcMain.handle('start-compile', (event, { folder, command }) => {
  if (!folder || !command) return;
  compileProcess = spawn(command, { cwd: folder, shell: true, windowsHide: true });
  compileProcess.stdout.on('data', data => {
    const text = iconv.decode(Buffer.from(data), 'gbk');
    mainWindow.webContents.send('compile-output', text);
  });
  compileProcess.stderr.on('data', data => {
    const text = iconv.decode(Buffer.from(data), 'gbk');
    mainWindow.webContents.send('compile-output', text);
  });
  compileProcess.on('close', code => {
    mainWindow.webContents.send('compile-output', `\n进程已退出，代码：${code}\n[__END__]`);
    compileProcess = null;
  });
});

ipcMain.handle('cancel-compile', () => {
  if (compileProcess) {
    compileProcess.kill('SIGINT');
  }
}); 