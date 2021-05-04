import './styles/App.css';
import Clock from './components/Clock';
import Vitals from './components/Vitals';
import Background from './icons/Background.png'

function App() {
  return (
    <div className="app">
      <Clock/>
      <Vitals/>
      <img src={Background} style={{ position: 'absolute', left: '-5vw', top: '-5vh', zIndex: '-1', width: '110vw', height: '110vh' }} />
    </div>
  );
}

export default App;
