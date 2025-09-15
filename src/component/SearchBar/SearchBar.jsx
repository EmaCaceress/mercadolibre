import { useState } from "react";
import { Search } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import './SearchBar.scss';

export default function SearchBar() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  // const [products, setProducts] = useState([]);

  const onSubmit = (e) => {
    e.preventDefault();
    const query = q.trim();
    console.log("Buscando:", query);
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    // fetch(`http://localhost:4000/search?q=${encodeURIComponent(query)}`)
    // .then(res => res.json())
    // .then(data => {
    //   setProducts(data.items);
    // })
    // .catch(err => console.error("Error al traer productos:", err));
  };


  return (
    <form onSubmit={onSubmit} className="SearchBar">
    <input
        className="SearchBar__input"
        type="text"
        placeholder="Buscar productos, marcas y más..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Buscar"
    />
        <button>
            <div className='SearchBar__divider'></div>
            <Search size={20} />
        </button>
    </form>
  );
}
