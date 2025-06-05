const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const iconv = require('iconv-lite');
const { autoUpdater } = require('electron-updater');
const fs = require('fs');

// 控制台开关配置
const CONFIG = {
  // 是否在生产环境中显示开发者控制台
  showDevToolsInProduction: false
};

// 添加日志函数
function logInfo(message) {
  console.log(`[INFO] ${message}`);
  try {
    const logPath = path.join(app.getPath('userData'), 'logs.txt');
    fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
  } catch (e) {
    console.error('写入日志失败:', e);
  }
}

let mainWindow;
let compileProcess = null;

// 检查更新函数
function checkForUpdates() {
  if (process.env.NODE_ENV === 'development') {
    logInfo('开发环境不检查更新');
    return;
  }
  
  try {
    logInfo('手动检查更新');
    autoUpdater.checkForUpdates();
  } catch (error) {
    logInfo(`检查更新失败: ${error.message}`);
    console.error('检查更新失败:', error);
  }
}

// 检查更新函数
function checkForUpdates() {
  if (process.env.NODE_ENV === 'development') {
    logInfo('开发环境不检查更新');
    return;
  }
  
  try {
    logInfo('手动检查更新');
    autoUpdater.checkForUpdates();
  } catch (error) {
    logInfo(`检查更新失败: ${error.message}`);
    console.error('检查更新失败:', error);
  }
}

function createWindow() {
  logInfo('开始创建窗口');
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

  const isDev = process.env.NODE_ENV === 'development';
  logInfo(`应用运行在${isDev ? '开发' : '生产'}环境`);
  
  // 记录重要路径
  logInfo(`__dirname: ${__dirname}`);
  logInfo(`应用路径: ${app.getAppPath()}`);
  logInfo(`用户数据路径: ${app.getPath('userData')}`);

  if (isDev) {
    logInfo('加载开发服务器URL');
    mainWindow.loadURL('http://localhost:5173');
    // 开发环境自动打开开发者工具
    mainWindow.webContents.openDevTools();
  } else {
    try {
      const indexPath = path.join(__dirname, '../dist/index.html');
      logInfo(`加载生产环境页面: ${indexPath}`);
      logInfo(`该文件是否存在: ${fs.existsSync(indexPath)}`);
      mainWindow.loadFile(indexPath);
      
      // 根据配置决定是否在生产环境打开开发者工具
      if (CONFIG.showDevToolsInProduction) {
        mainWindow.webContents.openDevTools();
      }
    } catch (error) {
      logInfo(`加载页面出错: ${error.message}`);
      dialog.showErrorBox('加载错误', `无法加载应用页面: ${error.message}`);
    }
  }
  
  // 监听页面加载完成事件
  mainWindow.webContents.on('did-finish-load', () => {
    logInfo('页面加载完成');
  });
  
  // 监听页面加载失败事件
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    logInfo(`页面加载失败: ${errorDescription} (${errorCode})`);
    dialog.showErrorBox('加载失败', `页面加载失败: ${errorDescription}`);
  });
}

app.whenReady().then(() => {
  logInfo('应用准备就绪');
  createWindow();
  
  // 只在生产环境启用自动更新
  if (process.env.NODE_ENV !== 'development') {
    try {
      logInfo('初始化自动更新');
      // 自动更新：局域网服务器
      autoUpdater.autoDownload = false;
      autoUpdater.checkForUpdates();

      autoUpdater.on('update-available', () => {
        logInfo('检测到新版本');
        if (mainWindow) {
          mainWindow.webContents.send('update-available');
        }
        dialog.showMessageBox({
          type: 'info',
          title: '发现新版本',
          message: '检测到新版本，是否现在更新？',
          buttons: ['是', '否']
        }).then(result => {
          if (result.response === 0) {
            logInfo('用户选择下载更新');
            autoUpdater.downloadUpdate();
          }
        });
      });

      autoUpdater.on('update-downloaded', () => {
        logInfo('更新已下载');
        if (mainWindow) {
          mainWindow.webContents.send('update-downloaded');
        }
        dialog.showMessageBox({
          type: 'info',
          title: '更新就绪',
          message: '新版本已下载，是否现在安装并重启？',
          buttons: ['是', '否']
        }).then(result => {
          if (result.response === 0) {
            logInfo('用户选择安装更新');
            autoUpdater.quitAndInstall();
          }
        });
      });
      
      // 错误处理
      autoUpdater.on('error', (err) => {
        logInfo(`自动更新错误: ${err.message}`);
        console.error('自动更新错误:', err);
        if (mainWindow) {
          mainWindow.webContents.send('update-error', err.message);
        }
      });
    } catch (error) {
      logInfo(`自动更新初始化失败: ${error.message}`);
      console.error('自动更新初始化失败:', error);
    }
  }
});

// 处理所有未捕获的异常
process.on('uncaughtException', (error) => {
  logInfo(`未捕获的异常: ${error.message}`);
  console.error('未捕获的异常:', error);
});

// 添加IPC处理程序来检查更新
ipcMain.handle('check-for-updates', () => {
  logInfo('收到检查更新请求');
  checkForUpdates();
  return { success: true };
});

// 添加IPC处理程序来检查更新
ipcMain.handle('check-for-updates', () => {
  logInfo('收到检查更新请求');
  checkForUpdates();
  return { success: true };
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