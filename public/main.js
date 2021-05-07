const path = require('path')
const { app, BrowserWindow, screen, ipcMain, protocol, dialog } = require('electron')
const si = require('systeminformation')
const SpotifyWebApi = require('spotify-web-api-node')
const opener = require('opener')

// Create a secrets.js file in this directory and export an object containing
// these variables.
const { clientId, clientSecret } = require('./secrets')

// Only allow a single instance of the app to run. Allows us to handle callback
// events on Windows.
const primaryInstance = app.requestSingleInstanceLock()
if (!primaryInstance) {
    app.quit()
    return
}

let window, spotifyApi, spotifyAuthCode

// Create a new Electron window, detecting the ViewEdge display where possible.
function createWindow () {
    const screens = screen.getAllDisplays()
    let viewedge
    
    screens.forEach(scr => {
        // Does the display refresh rate match 89/90Hz? This is the refresh rate
        // of the ViewEdge.
        if (scr.displayFrequency === 89 || scr.displayFrequency === 90) {
            viewedge = scr
        }
    })

    /**
     * SUPER IMPORTANT!
     * Setting nodeIntegration to true and disabling contextIsolation is not
     * recommended by the Electron developers in most circumstances. Ideally, a 
     * preload.js file or similar would be used to expose Node to the renderer 
     * in a safe way. This is work that I'm currently attempting to undertake, 
     * but limited Electron experience is making that slow.
     * 
     * In the meantime, we can set these options to have access to Node in the 
     * renderer, allowing us to communicate vitals information and access 
     * Node-only functions. Because all content loaded within this app is either 
     * local or trusted (in the case of Spotify), we are reasonably safe.
     */
    if (viewedge) {
        window = new BrowserWindow({
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
        // Load the built app. Swap with the commented out line for local development.
        window.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
        // window.loadUrl('http://localhost:3000')
    } else {
        dialog.showErrorBox(
            'ViewEdge Display', 
            'Cannot find the ViewEdge display. This app will now exit.'
        )
        app.exit()
    }
}

// Communication handles between the main and render processes.
// Return current CPU load as a percentage.
ipcMain.on('currentLoad', async (event, arg) => {
    si.currentLoad().then(data => {
        event.returnValue = data
    })
})

// Return memory information, used to determine usage percentage.
ipcMain.on('mem', async (event, arg) => {
    si.mem().then(value => {
        event.returnValue = value
    })
})

// Get the default network interface on the host computer, and return information
// about that network interface.
ipcMain.on('net', async (event, arg) => {
    si.networkInterfaceDefault().then(nid => {
        si.networkStats(nid).then(value => {
            event.returnValue = value
        })
    })
})

// Open a Spotify authentication window. Callback URL will refocus the app.
ipcMain.on('spotify-auth', async (event, arg) => {
    const scopes = 'user-read-currently-playing user-read-playback-state'
    const redirectUri = 'viewedgedisplay://callback'

    opener(`https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${redirectUri}`)
})

// Get Spotify now playing information
ipcMain.on('spotify-np', async (event, arg) => {
    /**
     * If we haven't logged into Spotify, it's useless querying the API. Check 
     * for the authentication code and return 0 if it doesn't exist (used to 
     * tell the renderer that we are not logged in).
     * 
     * TODO: Perhaps rework this?
     */
    if (spotifyAuthCode) {
        spotifyApi.getMyCurrentPlaybackState().then(data => {
            /**
             * Spotify will return a:
             * - 200 OK                 if a track is playing
             * - 204 NO CONTENT         if no track or the user is in private mode
             * - 429 TOO MANY REQUESTS  if we are rate limited
             * See: https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-the-users-currently-playing-track
             * 
             * Check to see if we have a 200 OK response before continuing. Else
             * return 1 to the renderer, which will hide the Spotify widget.
             */
            if (data.statusCode === 200) {
                // Double-verify that the body exists, etc.
                if (data.body && data.body.is_playing) {                    
                    event.returnValue = data.body
                } else {
                    event.returnValue = 1
                }
            } else {
                event.returnValue = 1
            }
        }, (error) => {
            console.error(error)
        })
    } else {
        event.returnValue = 0
    }
})

// Register the viewedgedisplay:// protocol (used for Spotify authentication 
// callback) and create a new instance of the API client.
app.whenReady().then(() => {
    protocol.registerFileProtocol('viewedgedisplay', (request, callback) => {
        console.log('viewedgedisplay stuff: ', request, callback)
    },(error) => {
        if (error) console.error('Failed to register protocol!')
    })

    spotifyApi = new SpotifyWebApi({
        clientId: clientId,
        clientSecret: clientSecret,
        redirectUri: 'viewedgedisplay://callback'
    })
})

// Extra stuff to allow Windows to register the app as a protocol handler when
// in development mode. Don't ask me why we have to do this.
if(process.platform === 'win32' && process.env.NODE_ENV === 'development') {
    app.setAsDefaultProtocolClient('viewedgedisplay', process.execPath, [path.resolve(process.argv[1])])
} else {
    app.setAsDefaultProtocolClient('viewedgedisplay')
}

// Extra stuff for Windows to handle the Spotify API callback. Picking arguments 
// in this way seems messy as heck, but it at least *works*.
app.on('second-instance', (event, args) => {
    event.preventDefault()
    if(process.platform === 'win32' && process.env.NODE_ENV === 'development') {
        setupSpotify(args[3])
    } else {
        setupSpotify(args[2])
    }
})

// The usual way we would handle Spotify API callback events. Verified to work
// on macOS.
app.on('open-url', function (event, url) {
    event.preventDefault()
    setupSpotify(url)
})

// Use the data received from the Spotify API callback to authenticate the client.
function setupSpotify(url) {
    dialog.showErrorBox('viewedge-display', url)
    spotifyAuthCode = url.replace('viewedgedisplay://callback/?code=', '')
    spotifyApi.authorizationCodeGrant(spotifyAuthCode).then(data => {
        spotifyApi.setAccessToken(data.body['access_token'])
        spotifyApi.setRefreshToken(data.body['refresh_token'])
    }, (error) => {
        dialog.showErrorBox('viewedge-display', error)
        console.error('Something went wrong!', error)
    })
}

app.on('ready', createWindow)
