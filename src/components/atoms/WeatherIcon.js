import React, { useState, useEffect } from 'react'

import { ReactComponent as Moon } from '../../icons/weather/Moon_24_Regular.svg'
import { ReactComponent as Sun } from '../../icons/weather/Sunny_24_Regular.svg'
import { ReactComponent as PartlyCloudyNight } from '../../icons/weather/PartlyCloudyNight_24_Regular.svg'
import { ReactComponent as PartlyCloudyDay } from '../../icons/weather/PartlyCloudyDay_24_Regular.svg'
import { ReactComponent as Haze } from '../../icons/weather/Haze_24_Regular.svg'
import { ReactComponent as Fog } from '../../icons/weather/Fog_24_Regular.svg'
import { ReactComponent as Cloudy } from '../../icons/weather/Cloudy_24_Regular.svg'
import { ReactComponent as RainNight } from '../../icons/weather/RainNight_24_Regular.svg'
import { ReactComponent as RainDay } from '../../icons/weather/RainDay_24_Regular.svg'
import { ReactComponent as Drizzle } from '../../icons/weather/Drizzle_24_Regular.svg'
import { ReactComponent as Rain } from '../../icons/weather/Rain_24_Regular.svg'
import { ReactComponent as HailNight } from '../../icons/weather/HailNight_24_Regular.svg'
import { ReactComponent as HailDay } from '../../icons/weather/HailDay_24_Regular.svg'
import { ReactComponent as Snow } from '../../icons/weather/Snow_24_Regular.svg'
import { ReactComponent as SnowDay } from '../../icons/weather/SnowDay_24_Regular.svg'
import { ReactComponent as SnowNight } from '../../icons/weather/SnowNight_24_Regular.svg'
import { ReactComponent as Thunderstorm } from '../../icons/weather/Thunderstorm_24_Regular.svg'

export default function WeatherIcon(props) {
    const [component, setComponent] = useState(null)

    useEffect(() => {
        console.log(props.condition)
        switch(props.condition) {
            case 'NA':
                break
            case '0':
                setComponent(<Moon/>)
                document.documentElement.style.setProperty('--pri-color', '#CCCCCC')
                break
            case '1':
                setComponent(<Sun/>)
                document.documentElement.style.setProperty('--pri-color', '#FFBE40')
                break
            case '2':
                setComponent(<PartlyCloudyNight/>)
                document.documentElement.style.setProperty('--pri-color', '#BBBBBB')
                break
            case '3':
                setComponent(<PartlyCloudyDay/>)
                document.documentElement.style.setProperty('--pri-color', '#CCCCCC')
                break
            case '5':
                setComponent(<Haze/>)
                document.documentElement.style.setProperty('--pri-color', '#CCCCCC')
                break
            case '6':
                setComponent(<Fog/>)
                document.documentElement.style.setProperty('--pri-color', '#CCCCCC')
                break
            case '7', '8':
                setComponent(<Cloudy/>)
                document.documentElement.style.setProperty('--pri-color', '#CCCCCC')
                break
            case '9', '13', '16':
                setComponent(<RainNight/>)
                document.documentElement.style.setProperty('--pri-color', '#3877F2')
                break
            case '10', '14', '17':
                setComponent(<RainDay/>)
                document.documentElement.style.setProperty('--pri-color', '#3877F2')
                break
            case '11', '12':
                setComponent(<Drizzle/>)
                document.documentElement.style.setProperty('--pri-color', '#3877F2')
                break
            case '15', '18':
                setComponent(<Rain/>)
                document.documentElement.style.setProperty('--pri-color', '#3877F2')
                break
            case '19':
                setComponent(<HailNight/>)
                document.documentElement.style.setProperty('--pri-color', '#BBBBBB')
                break
            case '20':
                setComponent(<HailDay/>)
                document.documentElement.style.setProperty('--pri-color', '#CCCCCC')
                break
            case '21', '24', '27':
                setComponent(<Snow/>)
                document.documentElement.style.setProperty('--pri-color', '#DDDDDD')
                break
            case '22', '25':
                setComponent(<SnowNight/>)
                document.documentElement.style.setProperty('--pri-color', '#CCCCCC')
                break
            case '23', '26':
                setComponent(<SnowDay/>)
                document.documentElement.style.setProperty('--pri-color', '#DDDDDD')
                break
            case '28', '29', '30':
                setComponent(<Thunderstorm/>)
                document.documentElement.style.setProperty('--pri-color', '#3877F2')
                break
            default:
                setComponent(null)
                document.documentElement.style.setProperty('--pri-color', '#00AF90')
                break
        }
    }, [props.condition])

    return (
        component
    )
}