require('dotenv').config()

const path = require('path')
const { app, BrowserWindow, screen, ipcMain, protocol, dialog } = require('electron')
const si = require('systeminformation')
const SpotifyWebApi = require('spotify-web-api-node')
const opener = require('opener')

let spotifyApi, win, spotifyAuthCode, spotifyAccessToken, spotifyRefreshToken

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
ipcMain.on('spotify-auth', async (event, arg) => {
    let scopes = 'user-read-currently-playing user-read-playback-state'
    let redirectUri = 'viewedgedisplay://callback'

    opener(`https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${redirectUri}`)
})
ipcMain.on('spotify-np', async (event, arg) => {
    if (spotifyAuthCode) {
        spotifyApi.getMyCurrentPlaybackState().then(data => {
            if (data.statusCode === 200) {
                if (data.body && data.body.is_playing) {                    
                    event.returnValue = data.body
                } else {
                    event.returnValue = 'no'
                }
            } else {
                event.returnValue = 1
            }
        }, (error) => {
            console.error(error)
        })
    } else {
        event.returnValue = null
    }
})

app.whenReady().then(() => {
    protocol.registerFileProtocol('viewedgedisplay', (request, callback) => {
        console.log('viewedgedisplay stuff: ', request, callback)
        if (!app.isDefaultProtocolClient('viewedgedisplay')) {
            app.setAsDefaultProtocolClient('viewedgedisplay')
        }
    },(error) => {
        if (error) console.error('Failed to register protocol!')
    })

    spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: 'viewedgedisplay://callback'
    })
})

app.on('open-url', function (event, url) {
    event.preventDefault();
    spotifyAuthCode = url.replace('viewedgedisplay://callback/?code=', '')
    spotifyApi.authorizationCodeGrant(spotifyAuthCode).then(data => {
        spotifyAccessToken = data.body['access_token']
        spotifyRefreshToken = data.body['refresh_token']

        spotifyApi.setAccessToken(data.body['access_token'])
        spotifyApi.setRefreshToken(data.body['refresh_token'])
    }, (error) => {
        console.error('Something went wrong!', error)
    })
})

app.on('ready', createWindow)