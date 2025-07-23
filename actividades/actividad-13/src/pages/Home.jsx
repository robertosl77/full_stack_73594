"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API_KEY = "29d19341"
const TERM_LIST = ["star", "man", "love", "war", "life"]

function Home() {
  const [pelis, setPelis] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all(
      TERM_LIST.map((term) =>
        fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${term}&type=movie`)
          .then((res) => res.json())
          .then((data) => {
            const valids = data.Search?.filter((p) => p.Poster !== "N/A") || []
            return valids.length ? valids[Math.floor(Math.random() * valids.length)] : null
          }),
      ),
    ).then((resultados) => {
      setPelis(resultados.filter(Boolean).slice(0, 5))
    })

    // Auto-slide
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html, body {
            background: #000;
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }

          .hero-container {
            height: 100vh;
            background: #000;
            color: white;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
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
            background: linear-gradient(to right, #000 0%, rgba(0,0,0,0.8) 50%, transparent 100%);
            z-index: 2;
          }

          .hero-bg::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, #000 0%, transparent 50%, rgba(0,0,0,0.5) 100%);
            z-index: 2;
          }

          .hero-bg img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            opacity: 0.3;
            transition: all 1s ease;
            background: #000;
          }

          .hero-content {
            position: relative;
            z-index: 10;
            height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .main-content {
            display: flex;
            align-items: stretch;
            max-width: 100%;
            margin: 0;
            padding: 2rem 3rem;
            width: 100%;
            height: 80%;
          }

          .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: stretch;
            width: 100%;
            height: 100%;
          }

          .left-content {
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
            justify-content: center;
            padding: 2rem 0;
          }

          .premium-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(220, 38, 38, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 9999px;
            padding: 0.6rem 1.2rem;
            color: #fca5a5;
            font-size: 1rem;
            font-weight: 500;
            width: fit-content;
          }

          .star-icon {
            width: 1.1rem;
            height: 1.1rem;
            fill: currentColor;
          }

          .main-title {
            font-size: 5.5rem;
            font-weight: 900;
            line-height: 0.85;
            margin: 2rem 0;
          }

          .title-line-1 {
            display: block;
            color: white;
          }

          .title-line-2 {
            display: block;
            background: linear-gradient(to right, #ef4444, #ec4899, #a855f7);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .subtitle {
            font-size: 1.4rem;
            color: #d1d5db;
            line-height: 1.6;
            max-width: 35rem;
          }

          .buttons-container {
            display: flex;
            gap: 1.2rem;
            flex-wrap: wrap;
          }

          .btn-primary {
            background: linear-gradient(to right, #dc2626, #db2777);
            color: white;
            padding: 1.2rem 2.5rem;
            border-radius: 0.75rem;
            font-size: 1.2rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.25);
            transition: all 0.3s ease;
          }

          .btn-primary:hover {
            background: linear-gradient(to right, #b91c1c, #be185d);
            transform: scale(1.05);
            box-shadow: 0 20px 40px -12px rgba(239, 68, 68, 0.25);
          }

          .btn-secondary {
            border: 2px solid rgba(255, 255, 255, 0.2);
            color: white;
            background: transparent;
            padding: 1.2rem 2.5rem;
            border-radius: 0.75rem;
            font-size: 1.2rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            backdrop-filter: blur(4px);
            transition: all 0.3s ease;
          }

          .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          .play-icon {
            width: 1.4rem;
            height: 1.4rem;
            fill: currentColor;
          }

          .arrow-icon {
            width: 1.2rem;
            height: 1.2rem;
          }

          .stats-container {
            display: flex;
            gap: 2.5rem;
            padding-top: 1rem;
          }

          .stat-item {
            text-align: center;
          }

          .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            color: white;
          }

          .stat-label {
            font-size: 1rem;
            color: #9ca3af;
          }

          .right-content {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            padding: 2rem 0;
          }

          .featured-movie {
            position: relative;
            cursor: pointer;
          }

          .movie-container {
            position: relative;
            overflow: hidden;
            border-radius: 1.5rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
            transition: transform 0.3s ease;
          }

          .movie-container:hover {
            transform: scale(1.02);
          }

          .movie-poster {
            width: 100%;
            height: 35rem;
            object-fit: contain;
            background: #111;
            transition: transform 0.7s ease;
          }

          .movie-container:hover .movie-poster {
            transform: scale(1.1);
          }

          .movie-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%, transparent 100%);
          }

          .movie-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 2rem;
          }

          .movie-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: white;
            margin-bottom: 0.6rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .movie-details {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            color: #d1d5db;
            font-size: 1.1rem;
          }

          .calendar-icon, .star-icon-small {
            width: 1.1rem;
            height: 1.1rem;
          }

          .star-icon-small {
            fill: #fbbf24;
            color: #fbbf24;
          }

          .play-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .movie-container:hover .play-overlay {
            opacity: 1;
          }

          .play-button {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(4px);
            border-radius: 50%;
            padding: 1.2rem;
          }

          .play-button-icon {
            width: 2.5rem;
            height: 2.5rem;
            color: white;
            fill: currentColor;
          }

          .thumbnails-container {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
            overflow: hidden;
            justify-content: center;
          }

          .thumbnail {
            flex-shrink: 0;
            width: 5rem;
            height: 6.5rem;
            border-radius: 0.6rem;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0.6;
          }

          .thumbnail:hover {
            opacity: 1;
          }

          .thumbnail.active {
            opacity: 1;
            transform: scale(1.15);
            box-shadow: 0 0 0 3px #ef4444;
          }

          .thumbnail img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            background: #111;
          }

          .footer-section {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            flex-shrink: 0;
          }

          .footer-content {
            max-width: 100%;
            margin: 0 auto;
            padding: 1.5rem 3rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1.5rem;
            flex-wrap: wrap;
          }

          .developer-info {
            text-align: left;
          }

          .developer-label {
            font-size: 0.9rem;
            color: #9ca3af;
            margin-bottom: 0.3rem;
          }

          .developer-name {
            font-size: 1.2rem;
            font-weight: 600;
            color: white;
          }

          .developer-role {
            font-size: 0.9rem;
            color: #9ca3af;
          }

          .social-links {
            display: flex;
            gap: 1rem;
          }

          .social-link {
            padding: 0.8rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            transition: all 0.3s ease;
            color: #9ca3af;
          }

          .social-link:hover {
            color: white;
          }

          .social-link.instagram:hover {
            background: rgba(236, 72, 153, 0.2);
            color: #ec4899;
          }

          .social-link.facebook:hover {
            background: rgba(59, 130, 246, 0.2);
            color: #3b82f6;
          }

          .social-link.email:hover {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
          }

          .social-link.github:hover {
            background: rgba(156, 163, 175, 0.2);
            color: #d1d5db;
          }

          .social-icon {
            width: 1.3rem;
            height: 1.3rem;
          }

          .copyright {
            font-size: 0.8rem;
            color: #6b7280;
          }

          .floating-dots {
            position: absolute;
            width: 0.6rem;
            height: 0.6rem;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }

          .dot-1 {
            top: 6rem;
            right: 6rem;
            background: #ef4444;
          }

          .dot-2 {
            top: 12rem;
            right: 12rem;
            background: #ec4899;
            animation-delay: 1s;
          }

          .dot-3 {
            bottom: 12rem;
            left: 6rem;
            background: #a855f7;
            animation-delay: 0.5s;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          @media (max-width: 1024px) {
            .content-grid {
              grid-template-columns: 1fr;
              gap: 2rem;
            }
            
            .main-title {
              font-size: 4rem;
            }
            
            .footer-content {
              flex-direction: column;
              text-align: center;
              padding: 1rem 2rem;
            }

            .movie-poster {
              height: 25rem;
            }

            .main-content {
              padding: 1.5rem 2rem;
            }
          }

          @media (max-width: 768px) {
            .main-content {
              padding: 1rem 1.5rem;
            }
            
            .main-title {
              font-size: 3rem;
            }
            
            .buttons-container {
              flex-direction: column;
            }
            
            .btn-primary, .btn-secondary {
              justify-content: center;
            }
            
            .stats-container {
              justify-content: center;
            }

            .movie-poster {
              height: 20rem;
            }
          }
        `}
      </style>

      <div className="hero-container">
        {/* Background */}
        <div className="hero-bg">
          {pelis.length > 0 && (
            <img src={pelis[currentSlide]?.Poster || "/placeholder.svg?height=600&width=400"} alt="" />
          )}
        </div>

        {/* Main Content */}
        <div className="hero-content">
          <div className="main-content">
            <div className="content-grid">
              {/* Left Content */}
              <div className="left-content">
                <div className="premium-badge">
                  <svg className="star-icon" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Películas Premium
                </div>

                <h1 className="main-title">
                  <span className="title-line-1">STREAMING</span>
                  <span className="title-line-2">EXPERIENCE</span>
                </h1>

                <p className="subtitle">
                  Descubre un universo cinematográfico sin límites. Miles de películas, géneros únicos y experiencias
                  que transformarán tu manera de ver cine.
                </p>

                <div className="buttons-container">
                  <button className="btn-primary" onClick={() => navigate("/catalogo")}>
                    <svg className="play-icon" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Explorar Ahora
                  </button>

                  <button className="btn-secondary">
                    Ver Trailer
                    <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="stats-container">
                  <div className="stat-item">
                    <div className="stat-number">10K+</div>
                    <div className="stat-label">Películas</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">50+</div>
                    <div className="stat-label">Géneros</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">4K</div>
                    <div className="stat-label">Calidad</div>
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="right-content">
                {pelis.length > 0 && (
                  <div>
                    <div
                      className="featured-movie"
                      onClick={() => navigate(`/catalogo?q=${encodeURIComponent(pelis[currentSlide].Title)}`)}
                    >
                      <div className="movie-container">
                        <img
                          src={pelis[currentSlide].Poster || "/placeholder.svg"}
                          alt={pelis[currentSlide].Title}
                          className="movie-poster"
                        />
                        <div className="movie-overlay" />

                        <div className="movie-info">
                          <h3 className="movie-title">{pelis[currentSlide].Title}</h3>
                          <div className="movie-details">
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
                            <span>{pelis[currentSlide].Year}</span>
                            <svg className="star-icon-small" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span>8.5</span>
                          </div>
                        </div>

                        <div className="play-overlay">
                          <div className="play-button">
                            <svg className="play-button-icon" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="thumbnails-container">
                      {pelis.slice(0, 4).map((peli, index) => (
                        <button
                          key={peli.imdbID}
                          onClick={() => setCurrentSlide(index)}
                          className={`thumbnail ${index === currentSlide ? "active" : ""}`}
                        >
                          <img src={peli.Poster || "/placeholder.svg"} alt={peli.Title} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer-section">
            <div className="footer-content">
              <div className="developer-info">
                <div className="developer-label">Desarrollado por</div>
                <div className="developer-name">Roberto Sanchez Leiva</div>
                <div className="developer-role">Full Stack Developer • Actividad 13</div>
              </div>

              <div className="social-links">
                <a href="https://www.instagram.com/robertosl77" className="social-link instagram">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="https://www.facebook.com/RobertoSL77" className="social-link facebook">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="mailto:robertosl77@gmail.com" className="social-link email">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </a>
                <a href="https://github.com/robertosl77" className="social-link github">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>

              <div className="copyright">© {new Date().getFullYear()} Todos los derechos reservados</div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="floating-dots dot-1"></div>
        <div className="floating-dots dot-2"></div>
        <div className="floating-dots dot-3"></div>
      </div>
    </>
  )
}

export default Home
