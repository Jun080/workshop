import './App.css';
import Menu from './components/menu.jsx'
import Accueil from './pages/accueil.jsx'


function App() {
  return (
    <div>
      <Menu/>
      <div className='container'>
        <Accueil />
      </div>
    </div>
  );
}

export default App;
