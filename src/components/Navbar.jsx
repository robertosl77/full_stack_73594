"use client"

import { Link, useLocation } from "react-router-dom"

function Navbar() {
  const location = useLocation()

  return (
    <>
      <style>
        {`
          .cinema-navbar {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d1b2e 50%, #1a1a1a 100%);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(239, 68, 68, 0.2);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            position: sticky;
            top: 0;
            z-index: 1000;
            padding: 0;
          }

          .navbar-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .navbar-brand {
            font-size: 1.8rem;
            font-weight: 900;
            background: linear-gradient(45deg, #ef4444, #ec4899, #a855f7);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            text-decoration: none;
            letter-spacing: -0.5px;
            transition: all 0.3s ease;
            position: relative;
          }

          .navbar-brand::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(45deg, #ef4444, #ec4899);
            transition: width 0.3s ease;
          }

          .navbar-brand:hover::after {
            width: 100%;
          }

          .navbar-brand:hover {
            transform: scale(1.05);
            filter: brightness(1.2);
          }

          .navbar-nav {
            display: flex;
            gap: 1rem;
            list-style: none;
            margin: 0;
            padding: 0;
            align-items: center;
            flex-direction: row;
          }

          .nav-item {
            position: relative;
          }

          .nav-link {
            color: #ffffff;
            text-decoration: none;
            padding: 0.8rem 1.5rem;
            border-radius: 0.75rem;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(4px);
            display: inline-block;
            white-space: nowrap;
          }

          .nav-link::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s ease;
          }

          .nav-link:hover::before {
            left: 100%;
          }

          .nav-link:hover {
            color: #ffffff;
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(236, 72, 153, 0.3));
            border: 1px solid rgba(239, 68, 68, 0.5);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
          }

          .nav-link.active {
            color: #ffffff;
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(236, 72, 153, 0.4));
            border: 1px solid rgba(239, 68, 68, 0.6);
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
          }

          .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            transform: translateX(-50%);
            width: 6px;
            height: 6px;
            background: #ef4444;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }

          .navbar-toggler {
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(239, 68, 68, 0.4);
            border-radius: 0.5rem;
            padding: 0.6rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: none;
          }

          .navbar-toggler:hover {
            border-color: rgba(239, 68, 68, 0.8);
            background: rgba(239, 68, 68, 0.2);
          }

          .navbar-toggler-icon {
            width: 1.5rem;
            height: 1.5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
          }

          .navbar-toggler-icon span {
            display: block;
            height: 2px;
            width: 100%;
            background: #ffffff;
            border-radius: 1px;
            transition: all 0.3s ease;
          }

          .floating-particles {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            overflow: hidden;
          }

          .particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(239, 68, 68, 0.3);
            border-radius: 50%;
            animation: float 6s infinite linear;
          }

          .particle:nth-child(1) { left: 10%; animation-delay: 0s; }
          .particle:nth-child(2) { left: 30%; animation-delay: 2s; }
          .particle:nth-child(3) { left: 50%; animation-delay: 4s; }
          .particle:nth-child(4) { left: 70%; animation-delay: 1s; }
          .particle:nth-child(5) { left: 90%; animation-delay: 3s; }

          @keyframes float {
            0% {
              transform: translateY(100px) scale(0);
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

          @keyframes pulse {
            0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
            50% { opacity: 0.5; transform: translateX(-50%) scale(1.2); }
          }

          @media (max-width: 768px) {
            .navbar-container {
              padding: 0.8rem 1rem;
            }

            .navbar-toggler {
              display: block;
            }

            .navbar-nav {
              display: none;
              position: absolute;
              top: 100%;
              left: 0;
              right: 0;
              background: linear-gradient(135deg, #1a1a1a 0%, #2d1b2e 50%, #1a1a1a 100%);
              backdrop-filter: blur(10px);
              border-top: 1px solid rgba(239, 68, 68, 0.2);
              flex-direction: column;
              gap: 0.5rem;
              padding: 1rem;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }

            .navbar-nav.show {
              display: flex;
            }

            .nav-link {
              width: 100%;
              text-align: center;
              padding: 1rem;
              margin: 0;
            }

            .navbar-brand {
              font-size: 1.5rem;
            }
          }

          @media (min-width: 769px) {
            .navbar-nav {
              display: flex !important;
              position: static !important;
              flex-direction: row !important;
              background: none !important;
              box-shadow: none !important;
              border: none !important;
              padding: 0 !important;
            }
          }
        `}
      </style>

      <nav className="cinema-navbar">
        <div className="floating-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className="navbar-container">
          <Link className="navbar-brand" to="/">
            StreamingApp
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={(e) => {
              const nav = e.target.closest(".cinema-navbar").querySelector(".navbar-nav")
              nav.classList.toggle("show")
            }}
          >
            <div className="navbar-toggler-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/catalogo" ? "active" : ""}`} to="/catalogo">
                Catálogo
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Navbar
