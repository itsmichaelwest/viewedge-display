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

    const hourStrings = [
        'twelve',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
        'ten',
        'eleven'
    ]

    const minuteStrings = [
        '',
        'oh one',
        'oh two',
        'oh three',
        'oh four',
        'oh five',
        'oh six',
        'oh seven',
        'oh eight',
        'oh nine',
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen',
        'eighteen',
        'nineteen',
        'twenty',
        'twenty one',
        'twenty two',
        'twenty three',
        'twenty four',
        'twenty five',
        'twenty six',
        'twenty seven',
        'twenty eight',
        'twenty nine',
        'thirty',
        'thirty one',
        'thirty two',
        'thirty three',
        'thirty four',
        'thirty five',
        'thirty six',
        'thirty seven',
        'thirty eight',
        'thirty nine',
        'forty',
        'forty one',
        'forty two',
        'forty three',
        'forty four',
        'forty five',
        'forty six',
        'forty seven',
        'forty eight',
        'forty nine',
        'fifty',
        'fifty one',
        'fifty two',
        'fifty three',
        'fifty four',
        'fifty five',
        'fifty six',
        'fifty seven',
        'fifty eight',
        'fifty nine'
    ]

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

    // Helper function to convert a 24-hour time value back to a 12-hour value.
    function convertHour(time) {
        if (time > 12) {
            time -= 12
        }
        return hourStrings[time]
    }

    return (
        <div className="clock">
            <div className="time">
                <span className="hour">
                    {convertHour(hours)}
                </span>
                <span className="minute">
                { minutes === 0 ?
                    <>o'clock</>
                :
                    minuteStrings[minutes]
                }
                </span>
            </div>
            <div className="date">
                {days[day]}, {months[month]} {date}, {year}
            </div>
        </div>
    )
}
