import '../styles/Vitals.css'
import React, { useState, useEffect } from 'react'
import { ReactComponent as DeveloperBoard } from '../icons/DeveloperBoard.svg'
import { ReactComponent as Data } from '../icons/Data.svg'
import { ReactComponent as ArrowDownload } from '../icons/ArrowDownload.svg'
import { ReactComponent as ArrowUpload } from '../icons/ArrowUpload.svg'
import { ReactComponent as Clock } from '../icons/Clock.svg'

const { ipcRenderer } = window.require("electron")

export default function Cpu() {
    const [currentLoad, setCurrentLoad] = useState()
    const [mem, setMem] = useState()
    const [net, setNet] = useState()
    const [uptime, setUptime] = useState()

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentLoad(ipcRenderer.sendSync('currentLoad'))
            setMem(ipcRenderer.sendSync('mem'))
            setNet(ipcRenderer.sendSync('net'))
            setUptime(ipcRenderer.sendSync('uptime'))
        }, 1000)

        return () => clearInterval(interval)
    })

    function humanFileSize(bytes, si=true, dp=1) {
        const thresh = si ? 1000 : 1024;
      
        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
      
        const units = si 
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10**dp;
      
        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
      
      
        return bytes.toFixed(dp) + ' ' + units[u];
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
                        {net && `${humanFileSize(Math.round(net[0].rx_sec))}/s` }
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
                        {net && `${humanFileSize(Math.round(net[0].tx_sec))}/s` }
                    </p>
                </div>
            </div>
        </div>
    )
}