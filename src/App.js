import './styles/App.css'
import Clock from './components/Clock'
import Vitals from './components/Vitals'
import Weather from './components/Weather'
import Spotify from './components/Spotify'

function App() {
    return (
        <div className="app">
            <Clock/>
            <div className="data">
                <Vitals/>
                <Weather/>
                <Spotify/>
            </div>
            <div className="background">
                <div className="blur-effect"></div>
            </div>
        </div>
    )
}

export default App
