"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ImagenNoDisponible } from "../Utils/Funciones.jsx"

const API_KEY = "29d19341"

function MovieDetail() {
  const { id } = useParams()
  const [pelicula, setPelicula] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    setImageError(false)

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`)
      .then((res) => res.json())
      .then((data) => {
        if (data.Response === "True") {
          setPelicula(data)
        } else {
          setError(true)
        }
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [id])

  const handleImageError = () => {
    setImageError(true)
  }

  if (loading) {
    return (
      <>
        <style>
          {`
            .loading-detail {
              min-height: 100vh;
              background: linear-gradient(135deg, #000 0%, #1a0a1a 50%, #000 100%);
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              gap: 1rem;
            }

            .loading-spinner-detail {
              width: 4rem;
              height: 4rem;
              border: 4px solid rgba(239, 68, 68, 0.3);
              border-top: 4px solid #ef4444;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }

            .loading-text-detail {
              color: #9ca3af;
              font-size: 1.2rem;
              font-family: 'Inter', sans-serif;
            }

            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div className="loading-detail">
          <div className="loading-spinner-detail"></div>
          <p className="loading-text-detail">Cargando detalles de la película...</p>
        </div>
      </>
    )
  }

  if (error || !pelicula) {
    return (
      <>
        <style>
          {`
            .error-detail {
              min-height: 100vh;
              background: linear-gradient(135deg, #000 0%, #1a0a1a 50%, #000 100%);
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              gap: 2rem;
              padding: 2rem;
              text-align: center;
            }

            .error-icon {
              width: 5rem;
              height: 5rem;
              color: #ef4444;
            }

            .error-title {
              font-size: 2.5rem;
              font-weight: 700;
              color: white;
              margin-bottom: 1rem;
            }

            .error-text {
              font-size: 1.2rem;
              color: #9ca3af;
              margin-bottom: 2rem;
            }

            .back-button {
              background: linear-gradient(135deg, #ef4444, #ec4899);
              color: white;
              border: none;
              padding: 1rem 2rem;
              border-radius: 0.75rem;
              font-weight: 600;
              font-size: 1rem;
              cursor: pointer;
              transition: all 0.3s ease;
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
            }

            .back-button:hover {
              background: linear-gradient(135deg, #dc2626, #db2777);
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
            }
          `}
        </style>
        <div className="error-detail">
          <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <h1 className="error-title">Película no encontrada</h1>
          <p className="error-text">Lo sentimos, no pudimos encontrar los detalles de esta película.</p>
          <Link to="/catalogo" className="back-button">
            ← Volver al Catálogo
          </Link>
        </div>
      </>
    )
  }

  // Verificar si la imagen existe y no es "N/A"
  const hasValidImage = pelicula.Poster && pelicula.Poster !== "N/A" && !imageError

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

          .movie-detail-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #000 0%, #1a0a1a 50%, #000 100%);
            position: relative;
            overflow-x: hidden;
          }

          .movie-hero {
            position: relative;
            height: 60vh;
            display: flex;
            align-items: center;
            overflow: hidden;
          }

          .hero-bg {
            position: absolute;
            inset: 0;
            z-index: 1;
          }

          .hero-bg::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to right, #000 0%, rgba(0,0,0,0.7) 50%, transparent 100%);
            z-index: 2;
          }

          .hero-bg::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, #000 0%, transparent 50%, rgba(0,0,0,0.8) 100%);
            z-index: 2;
          }

          .hero-bg img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.4;
          }

          .hero-bg-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d1b2e 50%, #1a1a1a 100%);
          }

          .hero-content {
            position: relative;
            z-index: 10;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
            width: 100%;
          }

          .hero-grid {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 3rem;
            align-items: center;
          }

          .poster-container {
            position: relative;
            width: 100%;
            height: 450px;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            background: linear-gradient(135deg, #1a1a1a 0%, #2d1b2e 50%, #1a1a1a 100%);
          }

          .movie-poster-large {
            width: 100%;
            height: 100%;
            object-fit: contain;
            transition: transform 0.3s ease;
            background: #111;
          }

          .movie-poster-large:hover {
            transform: scale(1.05);
          }

          .poster-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .movie-info-hero {
            space-y: 1.5rem;
          }

          .movie-title-large {
            font-size: 3.5rem;
            font-weight: 900;
            background: linear-gradient(45deg, #ef4444, #ec4899, #a855f7);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
            line-height: 1.1;
          }

          .movie-meta {
            display: flex;
            gap: 2rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
          }

          .meta-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #d1d5db;
            font-size: 1.1rem;
          }

          .meta-icon {
            width: 1.2rem;
            height: 1.2rem;
            color: #ef4444;
          }

          .rating-stars {
            display: flex;
            align-items: center;
            gap: 0.3rem;
          }

          .star {
            width: 1.2rem;
            height: 1.2rem;
            fill: #fbbf24;
            color: #fbbf24;
          }

          .rating-text {
            margin-left: 0.5rem;
            font-weight: 600;
          }

          .movie-plot {
            font-size: 1.2rem;
            line-height: 1.7;
            color: #e5e7eb;
            margin-bottom: 2rem;
          }

          .action-buttons {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .btn-watch {
            background: linear-gradient(135deg, #ef4444, #ec4899);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 0.75rem;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .btn-watch:hover {
            background: linear-gradient(135deg, #dc2626, #db2777);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
          }

          .btn-back {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.2);
            padding: 1rem 2rem;
            border-radius: 0.75rem;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            backdrop-filter: blur(4px);
          }

          .btn-back:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(239, 68, 68, 0.5);
          }

          .movie-details-section {
            max-width: 1400px;
            margin: 0 auto;
            padding: 4rem 2rem;
          }

          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }

          .detail-card {
            background: linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1.5rem;
            padding: 2rem;
            backdrop-filter: blur(10px);
          }

          .detail-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #ef4444;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .detail-content {
            color: #e5e7eb;
            line-height: 1.6;
          }

          .genre-tags {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
          }

          .genre-tag {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(236, 72, 153, 0.2));
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #fca5a5;
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            font-size: 0.9rem;
            font-weight: 500;
          }

          .cast-list {
            display: grid;
            gap: 0.5rem;
          }

          .cast-member {
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .cast-member:last-child {
            border-bottom: none;
          }

          @media (max-width: 1024px) {
            .hero-grid {
              grid-template-columns: 1fr;
              text-align: center;
              gap: 2rem;
            }

            .movie-title-large {
              font-size: 2.5rem;
            }

            .details-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 768px) {
            .movie-hero {
              height: auto;
              padding: 2rem 0;
            }

            .hero-content {
              padding: 0 1rem;
            }

            .movie-title-large {
              font-size: 2rem;
            }

            .movie-meta {
              justify-content: center;
            }

            .action-buttons {
              justify-content: center;
            }

            .movie-details-section {
              padding: 2rem 1rem;
            }

            .poster-container {
              height: 400px;
            }
          }
        `}
      </style>

      <div className="movie-detail-container">
        {/* Hero Section */}
        <div className="movie-hero">
          <div className="hero-bg">
            {hasValidImage ? (
              <img src={pelicula.Poster || "/placeholder.svg"} alt={pelicula.Title} onError={handleImageError} />
            ) : (
              <div className="hero-bg-placeholder">
                <ImagenNoDisponible width={800} height={400} title="Fondo no disponible" />
              </div>
            )}
          </div>

          <div className="hero-content">
            <div className="hero-grid">
              <div className="poster-container">
                {hasValidImage ? (
                  <img
                    src={pelicula.Poster || "/placeholder.svg"}
                    alt={pelicula.Title}
                    className="movie-poster-large"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="poster-placeholder">
                    <ImagenNoDisponible width={300} height={450} title="Poster no disponible" />
                  </div>
                )}
              </div>

              <div className="movie-info-hero">
                <h1 className="movie-title-large">{pelicula.Title}</h1>

                <div className="movie-meta">
                  <div className="meta-item">
                    <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {pelicula.Year}
                  </div>

                  <div className="meta-item">
                    <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                    {pelicula.Runtime}
                  </div>

                  {pelicula.imdbRating && pelicula.imdbRating !== "N/A" && (
                    <div className="meta-item">
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="star" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                        <span className="rating-text">{pelicula.imdbRating}/10</span>
                      </div>
                    </div>
                  )}
                </div>

                <p className="movie-plot">{pelicula.Plot}</p>

                <div className="action-buttons">
                  <button className="btn-watch">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Ver Película
                  </button>

                  <Link to="/catalogo" className="btn-back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Volver al Catálogo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="movie-details-section">
          <div className="details-grid">
            <div className="detail-card">
              <h3 className="detail-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Géneros
              </h3>
              <div className="genre-tags">
                {pelicula.Genre &&
                  pelicula.Genre.split(", ").map((genre, index) => (
                    <span key={index} className="genre-tag">
                      {genre}
                    </span>
                  ))}
              </div>
            </div>

            <div className="detail-card">
              <h3 className="detail-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Información Técnica
              </h3>
              <div className="detail-content">
                <p>
                  <strong>Director:</strong> {pelicula.Director}
                </p>
                <p>
                  <strong>Escritor:</strong> {pelicula.Writer}
                </p>
                <p>
                  <strong>Idioma:</strong> {pelicula.Language}
                </p>
                <p>
                  <strong>País:</strong> {pelicula.Country}
                </p>
                <p>
                  <strong>Clasificación:</strong> {pelicula.Rated}
                </p>
              </div>
            </div>

            <div className="detail-card">
              <h3 className="detail-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
                Reparto Principal
              </h3>
              <div className="cast-list">
                {pelicula.Actors &&
                  pelicula.Actors.split(", ").map((actor, index) => (
                    <div key={index} className="cast-member">
                      {actor}
                    </div>
                  ))}
              </div>
            </div>

            <div className="detail-card">
              <h3 className="detail-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Premios y Reconocimientos
              </h3>
              <div className="detail-content">
                <p>{pelicula.Awards || "No hay información de premios disponible."}</p>
                {pelicula.BoxOffice && (
                  <p>
                    <strong>Taquilla:</strong> {pelicula.BoxOffice}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MovieDetail
