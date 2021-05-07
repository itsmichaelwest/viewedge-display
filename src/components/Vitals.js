import '../styles/Vitals.css'
import React, { useState, useEffect } from 'react'
import { ReactComponent as DeveloperBoard } from '../icons/DeveloperBoard.svg'
import { ReactComponent as Data } from '../icons/Data.svg'
import { ReactComponent as ArrowDownload } from '../icons/ArrowDownload.svg'
import { ReactComponent as ArrowUpload } from '../icons/ArrowUpload.svg'

const { ipcRenderer } = window.require('electron')

/**
 * A system "vitals" component that displays CPU load and memory pressure as 
 * a percentage and network inbound/outbound traffic in units.
 * 
 * @returns A simple system vitals component.
 */
export default function Vitals() {
    const [currentLoad, setCurrentLoad] = useState()
    const [mem, setMem] = useState()
    const [net, setNet] = useState()

    // Update vitals information every second.
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentLoad(ipcRenderer.sendSync('currentLoad'))
            setMem(ipcRenderer.sendSync('mem'))
            setNet(ipcRenderer.sendSync('net'))
        }, 1000)

        return () => clearInterval(interval)
    })

    /**
     * Function to convert from bytes to a more human-readable format, appending 
     * the appropriate unit to the end of the string and trimming to a certain 
     * number of decimal places.
     * 
     * @param {number} bytes The bytes value to be converted.
     * @param {boolean} si Whether to return the value in units based on SI 
     *                     values (1000) or units based on binary values (1024).
     * @param {number} dp Number of decimal places to round the final result to.
     * @returns A string containing the converted value and unit.
     */
    function humanFileSize(bytes, si, dp) {
        const thresh = si ? 1000 : 1024
      
        if (Math.abs(bytes) < thresh) {
            return bytes + ' B'
        }
      
        const units = si 
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
        let u = -1
        const r = 10**dp
      
        do {
            bytes /= thresh
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)
      
        return bytes.toFixed(dp) + ' ' + units[u]
    }
    
    return (
        <div className="vitals">
            <div className="cpu">
                <DeveloperBoard/>
                <div>
                    <p className="title">
                        CPU
                    </p>
                    <p>
                        {currentLoad && Math.round(currentLoad.currentLoad)}%
                    </p>
                </div>
            </div>
            <div className="mem">
                <Data/>
                <div>
                    <p className="title">
                        Memory
                    </p>
                    <p>
                        {mem && `${Math.round(mem.used / mem.free * 100)}%`}
                    </p>
                </div>
            </div>
            <div className="network">
                <ArrowDownload/>
                <div>
                    <p className="title">
                        Network in
                    </p>
                    <p>
                        {net && `${humanFileSize(Math.round(net[0].rx_sec), true, 1)}/s` }
                    </p> 
                </div>
            </div>
            <div className="network">
                <ArrowUpload/>
                <div>
                    <p className="title">
                        Network out
                    </p>
                    <p>
                        {net && `${humanFileSize(Math.round(net[0].tx_sec), true, 1)}/s` }
                    </p>
                </div>
            </div>
        </div>
    )
}
