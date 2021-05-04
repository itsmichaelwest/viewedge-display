const path = require('path')
const {app, BrowserWindow, screen, ipcMain} = require('electron')
const si = require('systeminformation')

let win

function createWindow () {
    const screens = screen.getAllDisplays()
    let viewedge, isDev
    
    screens.forEach(screen2 => {
        if (screen2.displayFrequency === 89 || screen2.displayFrequency === 90) {
            viewedge = screen2
        } else {
            // Get the primary display for dev mode
            viewedge = screen.getPrimaryDisplay()
            isDev = true
        }
    })

    if (viewedge) {
        if (!isDev) {
            win = new BrowserWindow({
                width: viewedge.bounds.width,
                height: viewedge.bounds.height,
                webPreferences: { 
                    nodeIntegration: true,
                    contextIsolation: false
                },
                frame: false,
                x: viewedge.bounds.x,
                y: viewedge.bounds.y,
                hasShadow: false,
                thickFrame: false,
                kiosk: true,
                skipTaskbar: true
            })
            win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
        } else {
            win = new BrowserWindow({
                width: 800,
                height: 720,
                webPreferences: { 
                    nodeIntegration: true,
                    contextIsolation: false
                }
            })
            win.loadURL('http://localhost:3000')
        }
    }
}

ipcMain.on('currentLoad', async (event, arg) => {
    si.currentLoad().then(data => {
        event.returnValue = data
    })
})
ipcMain.on('mem', async (event, arg) => {
    si.mem().then(value => {
        event.returnValue = value
    })
})
ipcMain.on('net', async (event, arg) => {
    si.networkInterfaceDefault().then(nid => {
        si.networkStats(nid).then(value => {
            event.returnValue = value
        })
    })
})
ipcMain.on('uptime', async (event, arg) => {
    event.returnValue = si.time().uptime
})

app.on('ready', createWindow)