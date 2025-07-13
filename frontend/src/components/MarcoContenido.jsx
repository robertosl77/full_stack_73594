import React from "react";

function MarcoContenido({ children, ancho = 2, titulo }) {
  const anchos = {
    1: "100%",
    2: "960px",
    3: "720px",
    4: "540px",
    5: "420px",
  };
  const maxWidth = anchos[ancho] || "960px";

  return (
    <div className="container mb-5" style={{ marginTop: "90px" }}>
      <div
        className="bg-white rounded-3 shadow border border-secondary-subtle mx-auto overflow-hidden"
        style={{ maxWidth }}
      >
        {titulo && (
        <div className="bg-light py-3 px-4 border-bottom">
            <h1 className="h3 text-secondary text-center mb-0">{titulo}</h1>
        </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default MarcoContenido;
