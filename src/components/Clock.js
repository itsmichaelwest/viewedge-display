import React, { useState, useEffect } from 'react'
import '../styles/Clock.css'

/**
 * A simple clock that displays the time in written format, and the date as a 
 * long en-US string.
 * 
 * @returns A rendered clock component.
 */
export default function Clock() {
    const [hours, setHours] = useState()
    const [minutes, setMinutes] = useState()
    const [day, setDay] = useState()
    const [date, setDate] = useState()
    const [month, setMonth] = useState()
    const [year, setYear] = useState()

    // Update all variables once a second.
    useEffect(() => {
        const interval = setInterval(() => {
            let date = new Date()
            setHours(date.getHours())
            setMinutes(date.getMinutes())
            setDay(date.getDay())
            setDate(date.getDate())
            setMonth(date.getMonth())
            setYear(date.getFullYear())
        }, 1000)

        return () => clearInterval(interval)
    }, [hours, minutes])

    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ]

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]

    return (
        <div className="clock">
            <div className="time">
                <span className="hour">
                    {hours}
                </span>
                <span className="time-blink">
                    :
                </span>
                <span className="minute">
                { minutes <= 9 ?
                    "0" + minutes
                :
                    minutes
                }
                </span>
            </div>
            <div className="date">
                {days[day]}, {months[month]} {date}, {year}
            </div>
        </div>
    )
}
