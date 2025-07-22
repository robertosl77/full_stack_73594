import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_KEY = '29d19341';

function MovieDetail() {
  const { id } = useParams();
  const [pelicula, setPelicula] = useState(null);

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`)
      .then(res => res.json())
      .then(data => setPelicula(data));
  }, [id]);

  if (!pelicula) return <p>Cargando...</p>;

  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-4">
          <img src={pelicula.Poster} alt={pelicula.Title} className="img-fluid rounded-start" />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h2>{pelicula.Title}</h2>
            <p><strong>Género:</strong> {pelicula.Genre}</p>
            <p><strong>Duración:</strong> {pelicula.Runtime}</p>
            <p><strong>Descripción:</strong> {pelicula.Plot}</p>
            <p><strong>Año:</strong> {pelicula.Year}</p>
            <p><strong>Director:</strong> {pelicula.Director}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
