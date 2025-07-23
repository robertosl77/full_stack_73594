"use client"

// Componente para generar imagen placeholder
export function ImagenNoDisponible({ width = 300, height = 400, title = "Imagen no disponible" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d1b2e 50%, #1a1a1a 100%)" }}
    >
      {/* Fondo con patrón */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(239,68,68,0.1)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Icono de imagen */}
      <g transform={`translate(${width / 2}, ${height / 2 - 20})`}>
        <circle cx="0" cy="0" r="40" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.4)" strokeWidth="2" />
        <path
          d="M-20,-10 L-20,10 L20,10 L20,-10 Z M-15,-5 L-15,5 L15,5 L15,-5 Z M-10,0 L-5,-5 L0,0 L5,-5 L10,0 L10,5 L-10,5 Z"
          fill="rgba(239,68,68,0.6)"
        />
        <circle cx="-8" cy="-2" r="2" fill="rgba(239,68,68,0.8)" />
      </g>

      {/* Texto */}
      <text
        x={width / 2}
        y={height / 2 + 40}
        textAnchor="middle"
        fill="rgba(255,255,255,0.7)"
        fontSize="14"
        fontFamily="Inter, sans-serif"
        fontWeight="500"
      >
        {title}
      </text>
    </svg>
  )
}
