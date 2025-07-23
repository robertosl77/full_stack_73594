"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ImagenNoDisponible } from "../Utils/Funciones.jsx"

const API_KEY = "29d19341"

function Catalog() {
  const [peliculas, setPeliculas] = useState([])
  const [filtro, setFiltro] = useState("")
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState({})

  useEffect(() => {
    setLoading(true)
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=matrix&type=movie`)
      .then((res) => res.json())
      .then((data) => {
        if (data.Search) setPeliculas(data.Search)
        setLoading(false)
      })
  }, [])

  const handleImageError = (imdbID) => {
    setImageErrors((prev) => ({ ...prev, [imdbID]: true }))
  }

  const peliculasFiltradas = peliculas.filter((p) => p.Title.toLowerCase().includes(filtro.toLowerCase()))

  return (
    <>
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            background: #000;
            color: white;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }

          .catalog-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #000 0%, #1a0a1a 50%, #000 100%);
            padding: 2rem 0;
          }

          .catalog-content {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
          }

          .catalog-header {
            text-align: center;
            margin-bottom: 3rem;
          }

          .catalog-title {
            font-size: 3.5rem;
            font-weight: 900;
            background: linear-gradient(45deg, #ef4444, #ec4899, #a855f7);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
            letter-spacing: -1px;
          }

          .catalog-subtitle {
            font-size: 1.2rem;
            color: #9ca3af;
            margin-bottom: 2rem;
          }

          .search-container {
            position: relative;
            max-width: 600px;
            margin: 0 auto 3rem;
          }

          .search-input {
            width: 100%;
            padding: 1.2rem 1.5rem 1.2rem 3.5rem;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(239, 68, 68, 0.3);
            border-radius: 1rem;
            color: white;
            font-size: 1.1rem;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            outline: none;
          }

          .search-input::placeholder {
            color: #9ca3af;
          }

          .search-input:focus {
            border-color: rgba(239, 68, 68, 0.6);
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
            transform: translateY(-2px);
          }

          .search-icon {
            position: absolute;
            left: 1.2rem;
            top: 50%;
            transform: translateY(-50%);
            width: 1.5rem;
            height: 1.5rem;
            color: #ef4444;
          }

          .movies-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
          }

          .movie-card {
            background: linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1.5rem;
            overflow: hidden;
            transition: all 0.4s ease;
            backdrop-filter: blur(10px);
            position: relative;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            height: 100%;
          }

          .movie-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(239,68,68,0.1), transparent);
            transition: left 0.6s ease;
            z-index: 1;
          }

          .movie-card:hover::before {
            left: 100%;
          }

          .movie-card:hover {
            transform: translateY(-10px) scale(1.02);
            border-color: rgba(239, 68, 68, 0.4);
            box-shadow: 0 20px 40px rgba(239, 68, 68, 0.2);
          }

          .movie-poster-container {
            position: relative;
            width: 100%;
            height: 400px;
            overflow: hidden;
            flex-shrink: 0;
          }

          .movie-poster {
            width: 100%;
            height: 100%;
            object-fit: contain;
            background: #111;
            transition: transform 0.4s ease;
          }

          .movie-card:hover .movie-poster {
            transform: scale(1.05);
          }

          .placeholder-container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .movie-info {
            padding: 1.5rem;
            position: relative;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .movie-content {
            flex: 1;
          }

          .movie-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: white;
            margin-bottom: 0.8rem;
            line-height: 1.3;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            min-height: 3.4rem;
          }

          .movie-year {
            color: #9ca3af;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .calendar-icon {
            width: 1rem;
            height: 1rem;
          }

          .movie-button {
            background: linear-gradient(135deg, #ef4444, #ec4899);
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 0.75rem;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            width: 100%;
            justify-content: center;
            margin-top: auto;
          }

          .movie-button:hover {
            background: linear-gradient(135deg, #dc2626, #db2777);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
          }

          .play-icon {
            width: 1rem;
            height: 1rem;
            fill: currentColor;
          }

          .no-results {
            text-align: center;
            padding: 4rem 2rem;
            background: linear-gradient(145deg, rgba(239,68,68,0.1), rgba(236,72,153,0.1));
            border: 2px dashed rgba(239, 68, 68, 0.3);
            border-radius: 2rem;
            margin: 2rem 0;
            backdrop-filter: blur(10px);
          }

          .no-results-icon {
            width: 4rem;
            height: 4rem;
            color: #ef4444;
            margin: 0 auto 1.5rem;
          }

          .no-results-title {
            font-size: 2rem;
            font-weight: 700;
            color: white;
            margin-bottom: 1rem;
          }

          .no-results-text {
            font-size: 1.1rem;
            color: #9ca3af;
            line-height: 1.6;
            max-width: 400px;
            margin: 0 auto;
          }

          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 400px;
            flex-direction: column;
            gap: 1rem;
          }

          .loading-spinner {
            width: 3rem;
            height: 3rem;
            border: 3px solid rgba(239, 68, 68, 0.3);
            border-top: 3px solid #ef4444;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .loading-text {
            color: #9ca3af;
            font-size: 1.1rem;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .floating-particles {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: -1;
          }

          .particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(239, 68, 68, 0.2);
            border-radius: 50%;
            animation: float 8s infinite linear;
          }

          .particle:nth-child(1) { left: 10%; animation-delay: 0s; }
          .particle:nth-child(2) { left: 30%; animation-delay: 2s; }
          .particle:nth-child(3) { left: 50%; animation-delay: 4s; }
          .particle:nth-child(4) { left: 70%; animation-delay: 1s; }
          .particle:nth-child(5) { left: 90%; animation-delay: 3s; }

          @keyframes float {
            0% {
              transform: translateY(100vh) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100px) scale(1);
              opacity: 0;
            }
          }

          @media (max-width: 768px) {
            .catalog-content {
              padding: 0 1rem;
            }

            .catalog-title {
              font-size: 2.5rem;
            }

            .movies-grid {
              grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
              gap: 1.5rem;
            }

            .movie-poster-container {
              height: 350px;
            }
          }

          @media (max-width: 480px) {
            .movies-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="catalog-container">
        <div className="floating-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className="catalog-content">
          <div className="catalog-header">
            <h1 className="catalog-title">CATÁLOGO PREMIUM</h1>
            <p className="catalog-subtitle">Descubre nuestra colección exclusiva de películas en alta definición</p>

            <div className="search-container">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Buscar películas por título..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Cargando películas...</p>
            </div>
          ) : peliculasFiltradas.length > 0 ? (
            <div className="movies-grid">
              {peliculasFiltradas.map((p) => (
                <div
                  key={p.imdbID}
                  className="movie-card"
                  onClick={() => (window.location.href = `/pelicula/${p.imdbID}`)}
                >
                  <div className="movie-poster-container">
                    {imageErrors[p.imdbID] || p.Poster === "N/A" ? (
                      <div className="placeholder-container">
                        <ImagenNoDisponible width={280} height={400} title="Imagen no disponible" />
                      </div>
                    ) : (
                      <img
                        src={p.Poster || "/placeholder.svg"}
                        className="movie-poster"
                        alt={p.Title}
                        onError={() => handleImageError(p.imdbID)}
                      />
                    )}
                  </div>
                  <div className="movie-info">
                    <div className="movie-content">
                      <h3 className="movie-title">{p.Title}</h3>
                      <div className="movie-year">
                        <svg
                          className="calendar-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {p.Year}
                      </div>
                    </div>
                    <Link to={`/pelicula/${p.imdbID}`} className="movie-button">
                      <svg className="play-icon" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <svg className="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
                <line x1="11" y1="8" x2="11" y2="12" />
                <line x1="11" y1="16" x2="11.01" y2="16" />
              </svg>
              <h2 className="no-results-title">¡Oops! No encontramos nada</h2>
              <p className="no-results-text">
                No pudimos encontrar películas que coincidan con "{filtro}". Intenta con otro término de búsqueda o
                explora nuestro catálogo completo.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Catalog
