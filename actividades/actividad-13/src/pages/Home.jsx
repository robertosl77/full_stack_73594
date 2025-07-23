import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_KEY = '29d19341';
const TERM_LIST = ['star', 'man', 'love', 'war', 'life'];

function Home() {
  const [pelis, setPelis] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all(
      TERM_LIST.map(term =>
        fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${term}&type=movie`)
          .then(res => res.json())
          .then(data => {
            const valids = data.Search?.filter(p => p.Poster !== 'N/A') || [];
            return valids.length ? valids[Math.floor(Math.random() * valids.length)] : null;
          })
      )
    ).then(resultados => {
      setPelis(resultados.filter(Boolean).slice(0, 5));
    });
  }, []);

  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            font-family: 'Inter', sans-serif;
          }
          .bg-gradient {
            background: linear-gradient(135deg, #1e3c72 0%, #00ddeb 100%);
            min-height: 100vh;
          }
          .container {
            background: rgba(0, 0, 0, 0.7);
            border-radius: 15px;
            transition: transform 0.3s ease;
          }
          .container:hover {
            transform: translateY(-5px);
          }
          .display-4 {
            color: #ffffff;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            font-weight: 700;
            letter-spacing: 1px;
          }
          .lead {
            color: #e0e0e0;
            font-size: 1.2rem;
            line-height: 1.6;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
          }
          .btn-custom {
            background-color: #1e3c72;
            color: #ffffff;
            border: none;
            border-radius: 25px;
            padding: 10px 20px;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          .btn-custom:hover {
            background-color: #00ddeb;
            color: #1e3c72;
            transform: scale(1.05);
          }
          .about-box {
            background: rgba(40, 40, 40, 0.85);
            border-radius: 12px;
            color: #d6d6d6;
            padding: 1.5rem 2rem;
            margin-top: 2rem;
            box-shadow: 0 2px 16px rgba(0,0,0,0.2);
            font-size: 1.05rem;
            width: 100%;
            max-width: none;
            margin-left: 0;
            margin-right: 0;
          }
          .about-title {
            color: #ffffff;
            font-weight: 700;
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
            letter-spacing: 0.5px;
          }
          .about-links {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            margin-top: 0.5rem;
          }
          .about-links a {
            color: #00ddeb;
            text-decoration: none;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: color 0.2s;
          }
          .about-links a:hover {
            color: #ffffff;
            text-decoration: underline;
          }
          .about-icon {
            width: 28px;
            height: 28px;
            object-fit: contain;
            background: none;
            border-radius: 50%;
            margin-right: 0.3rem;
            filter: brightness(1.2);
          }
          /* Carousel image fix */
          .carousel-inner {
            aspect-ratio: 16/9;
            width: 100%;
            position: relative;
            overflow: hidden;
          }
          .carousel-item {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }
          .carousel-item img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            position: absolute;
            top: 0;
            left: 0;
          }
          @media (max-width: 768px) {
            .container {
              padding: 1rem;
            }
            .display-4 {
              font-size: 2.5rem;
            }
            .lead {
              font-size: 1rem;
            }
            .about-box {
              padding: 1rem;
              font-size: 0.98rem;
            }
            .about-links {
              gap: 1rem;
            }
            .about-icon {
              width: 22px;
              height: 22px;
            }
            .carousel-inner {
              aspect-ratio: 4/3;
            }
          }
        `}
      </style>
      <div className="min-vh-100 d-flex flex-column align-items-center bg-gradient">
        <div className="container py-3">
          <div className="row align-items-center mb-3">
            <h1 className="display-4 fw-bold mb-3">Bienvenido a StreamingApp</h1>
            <div className="col-12 col-md-9">
              <p className="lead mx-auto mb-1" style={{ maxWidth: '800px' }}>
                Tu plataforma para descubrir, explorar y disfrutar de miles de películas. Navegá nuestro catálogo completo, encontrá tus géneros favoritos y accedé a la ficha de cada película para ver sus detalles, duración y descripción. Todo desde un solo lugar, fácil y rápido.
              </p>
            </div>
            <div className="col-12 col-md-3 d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">
              <button
                className="btn-custom mb-5"
                onClick={() => navigate('/catalogo')}
                style={{ cursor: 'pointer' }}
              >
                Explorar Catálogo
              </button>
            </div>
          </div>

          {pelis.length > 0 && (
            <div
              id="carouselExampleIndicators"
              className="carousel slide mt-5 shadow-lg rounded-3"
              data-bs-ride="carousel"
              style={{ maxWidth: '100%', margin: '0 auto' }}
            >
              <div className="carousel-indicators">
                {pelis.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={i}
                    className={i === 0 ? 'active bg-primary' : 'bg-primary'}
                    aria-current={i === 0 ? 'true' : undefined}
                    aria-label={`Slide ${i + 1}`}
                  ></button>
                ))}
              </div>
              <div className="carousel-inner rounded-3">
                {pelis.map((peli, i) => (
                  <div
                    key={peli.imdbID}
                    className={`carousel-item ${i === 0 ? 'active' : ''}`}
                    onClick={() => navigate(`/catalogo?q=${encodeURIComponent(peli.Title)}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="position-relative h-100 w-100">
                      <img
                        src={peli.Poster}
                        className="d-block"
                        alt={peli.Title}
                      />
                      <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
                        <h5 className="text-white fw-bold">{peli.Title}</h5>
                        <p className="text-light">{peli.Year}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon bg-dark bg-opacity-50 rounded-circle p-3" aria-hidden="true"></span>
                <span className="visually-hidden">Anterior</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon bg-dark bg-opacity-50 rounded-circle p-3" aria-hidden="true"></span>
                <span className="visually-hidden">Siguiente</span>
              </button>
            </div>
          )}

          <div className="about-box mt-5">
            <div className="about-title">Sobre la aplicación</div>
            <div>
              <strong>StreamingApp</strong> fue desarrollada por <span style={{ color: "#ffffff" }}>Roberto Sanchez Leiva</span> como parte de la actividad 13 del curso Full Stack. Su objetivo es facilitar la búsqueda y exploración de películas de manera rápida y visual.
            </div>
            <div className="mt-2">
              <span style={{ color: "#ffffff", fontWeight: 500 }}>Contacto y redes:</span>
              <div className="about-links">
                <a href="https://instagram.com/robertosanchezleiva" target="_blank" rel="noopener noreferrer">
                  <img className="about-icon" src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" />
                  Instagram
                </a>
                <a href="https://facebook.com/robertosanchezleiva" target="_blank" rel="noopener noreferrer">
                  <img className="about-icon" src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook" />
                  Facebook
                </a>
                <a href="mailto:roberto@email.com">
                  <img className="about-icon" src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/gmail.svg" alt="Email" />
                  Email
                </a>
                <a href="https://github.com/robertosanchezleiva" target="_blank" rel="noopener noreferrer">
                  <img className="about-icon" src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg" alt="GitHub" />
                  GitHub
                </a>
              </div>
            </div>
            <div className="mt-2" style={{ fontSize: "0.9rem", color: "#a0a0a0" }}>
              <span>Desarrollado en React, usando la API pública de OMDb. Todos los derechos reservados © {new Date().getFullYear()} Roberto Sanchez Leiva.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;