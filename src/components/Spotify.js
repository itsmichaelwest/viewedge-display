import '../styles/Spotify.css'
import React, { useState, useEffect } from 'react'

const { ipcRenderer } = window.require('electron')

/**
 * A Spotify now playing widget that is displayed at the bottom of the screen, 
 * showing track, album, and artist information as well as an elapsed time 
 * progress bar.
 * 
 * @returns A rendered Spotify component if the user is playing any content,
 *          otherwise an empty component.
 */
export default function Spotify() {
    const [spotify, setSpotify] = useState()

    // Update the information in the widget from the Spotify API every second.
    useEffect(() => {
        const interval = setInterval(() => {
            setSpotify(ipcRenderer.sendSync('spotify-np'))
        }, 1000)

        // If music is playing, set up the theme of the display to prevent 
        // background artwork from clashing with the text/icon colors.
        if (spotify && spotify !== 1 && spotify !== 0) {
            document.documentElement.style.setProperty('--pri-color', 'white')
            document.documentElement.style.setProperty('--pri-opacity', '0.6')
        } else {
            document.documentElement.style.setProperty('--pri-color', '#00AF90')
            document.documentElement.style.setProperty('--pri-opacity', '1')
        }

        return () => clearInterval(interval)
    })

    function spotifyLogin() {
        ipcRenderer.sendSync('spotify-auth')
    }

    return (
        <>
        { spotify ? 
        <>
            { spotify !== 1 ?
            <div className="spotify">
                <div className="spotify-info">
                    <img className="artwork" src={spotify.item.album.images[0].url} />
                    <div className="spotify-details">
                        <div className="song">
                            {spotify.item.name}
                        </div>
                        <div className="artist">
                            {spotify.item.artists.map((artist) => {
                                return (
                                    <span>
                                        {artist.name}
                                    </span>
                                )
                            })}
                        </div>
                        <div className="album">
                            {spotify.item.album.name}
                        </div>
                        <div className="progress">
                            <div className="progress-elapsed" style={{ width: `${(spotify.progress_ms / spotify.item.duration_ms) * 100}%` }} />
                            <div className="progress-total" />
                        </div>
                    </div>
                    <div className="album-artwork-blur">
                        <img src={spotify.item.album.images[0].url} />
                    </div>
                </div>
            </div>
            :
            <></>
            }
        </>
        :
        <div className="spotify">
            <button className="spotify-login" onClick={spotifyLogin}>
                Click to authorize Spotify
            </button>
        </div>
        }
        </>
    )
}
