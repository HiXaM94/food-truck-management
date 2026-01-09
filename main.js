const { app, BrowserWindow } = require('electron');
const path = require('path');
const serverApp = require('./backend/server.js');
const startServer = serverApp.startServer;

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        icon: path.join(__dirname, 'frontend/images/logo.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.setMenuBarVisibility(false);

    // Load the local server
    // We use a timeout to give the server a second to start
    setTimeout(() => {
        win.loadURL('http://localhost:3000');
    }, 1500);

    // Open DevTools automatically (optional, good for debugging)
    // win.webContents.openDevTools();
}

app.whenReady().then(async () => {
    // Start the backend server
    console.log('Starting backend server...');
    try {
        await startServer();
        console.log('Backend server started successfully');
    } catch (err) {
        console.error('Failed to start backend server:', err);
    }

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
