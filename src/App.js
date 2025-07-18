import './assets/styles/main.scss';
import Footer from './component/Footer/Footer';
import Main from './component/Main/Main';
import Navbar from './component/Navbar/Narbar';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Main/>
      <Footer/>
    </div>
  );
}

export default App;
