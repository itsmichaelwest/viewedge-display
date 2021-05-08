import '../styles/Weather.css'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import WeatherIcon from './atoms/WeatherIcon'
import secrets from '../appSecrets'

import { ReactComponent as WindIcon } from '../icons/Weather_Squalls_24_Regular.svg'
import { ReactComponent as CompassIcon } from '../icons/Compass_24_Regular.svg'

/**
 * 
 * @returns A weather conditions component
 */
export default function Weather() {
    const [weather, setWeather] = useState()

    useEffect(() => {
        checkWeather()

        const interval = setInterval(() => {
            checkWeather()
        }, 900000)
        return () => clearInterval(interval)
    })

    function checkWeather() {
        axios
        .get(`http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/350021?res=3hourly&key=${secrets.MetOfficeAPIKey}`)
        .then(res => {
            setWeather(res.data.SiteRep.DV.Location.Period[0].Rep[0])
        })
    }

    return  (
        <div className="weather">
            <div className="weather-details">
                <div className="weather-icon">
                    {weather &&
                        <WeatherIcon condition={weather.W}/>
                    }
                </div>
                <div className="weather-text">
                    <div className="temperature">
                        {weather && weather.T}°C
                    </div>
                    <div className="condition-atoms">
                        <div>
                            <WindIcon fill="#fff"/>
                            {weather && weather.S} mph
                        </div>
                        <div>
                            <CompassIcon fill="#fff"/>
                            {weather && weather.D}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}