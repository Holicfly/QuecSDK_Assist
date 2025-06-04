# AutoPack

现代美观的 Windows 编译工具，基于 Electron + React + Ant Design。

## 功能简介

- 选择文件夹
- 输入编译指令并执行
- 实时输出编译日志
- 支持取消编译
- 右侧展示作者和版本信息
- 现代美观的界面

## 启动方式

1. 安装依赖

   ```bash
   npm install
   ```

2. 开发模式启动

   ```bash
   npm run dev
   ```

3. 构建前端

   ```bash
   npm run build
   ```

4. 生产模式启动

   ```bash
   npm start
   ```

## 目录结构

```
autopack/
├─ main/                # Electron 主进程
│  └─ main.js
├─ src/                 # React 前端
│  ├─ App.jsx
│  ├─ main.jsx
│  ├─ preload.js
│  ├─ components/
│  │   ├─ LeftPanel.jsx
│  │   └─ RightPanel.jsx
│  └─ styles/
│      └─ app.css
├─ package.json
├─ vite.config.js
├─ index.html
└─ README.md
```

## 依赖

- electron
- react
- antd
- vite
- @vitejs/plugin-react
- @electron/remote
- concurrently
- cross-env

---

如需打包为安装程序，可后续集成 electron-builder 或 electron-forge。 