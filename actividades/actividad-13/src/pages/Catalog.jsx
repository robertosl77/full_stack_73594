import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_KEY = '29d19341';

function Catalog() {
  const [peliculas, setPeliculas] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=matrix&type=movie`)
      .then(res => res.json())
      .then(data => {
        if (data.Search) setPeliculas(data.Search);
      });
  }, []);

  const peliculasFiltradas = peliculas.filter(p =>
    p.Title.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <h2>Catálogo de Películas</h2>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Filtrar por título..."
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
      />
      <div className="row">
        {peliculasFiltradas.map(p => (
          <div key={p.imdbID} className="col-md-3 mb-4">
            <div className="card h-100">
              <img src={p.Poster} className="card-img-top" alt={p.Title} />
              <div className="card-body">
                <h5 className="card-title">{p.Title}</h5>
                <Link to={`/pelicula/${p.imdbID}`} className="btn btn-primary btn-sm">
                  Ver Detalles
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalog;
