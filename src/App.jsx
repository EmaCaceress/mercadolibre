import './assets/styles/main.scss';
import Footer from './component/Footer/Footer';
import Main from './component/Main/Main';
import Navbar from './component/Navbar/Narbar';
import { Routes, Route } from "react-router-dom";
import ProductDetail from './component/ProductDetail/ProductDetail';

function App() {
  return (
    <div className="App">
      
      <Navbar/>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
