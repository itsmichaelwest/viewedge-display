import './styles/App.css';
import Clock from './components/Clock';
import Vitals from './components/Vitals';
import Background from './icons/Background.png'
import Spotify from './components/Spotify';

function App() {
  return (
    <div className="app">
      <Clock/>
      <div className="data">
        <Vitals/>
        <Spotify/>
      </div>
      <img src={Background} style={{ position: 'absolute', left: 0, top: 0, zIndex: '-10', width: '100vw', height: '100vh' }} />
    </div>
  );
}

export default App;
