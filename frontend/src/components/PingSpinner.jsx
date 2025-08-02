import React, { useState, useEffect } from 'react';

const PingSpinner = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const basedir = process.env.REACT_APP_BASEDIR;
  const url = process.env.REACT_APP_URL;

  useEffect(() => {
    const pingServer = async () => {
      try {
        const res = await fetch(`${url}/${basedir}/api/ping`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Falla al hacer ping');
        }

        setLoading(false);
      } catch (err) {
        // console.error('Error al hacer ping al servidor:', err);
        setError('Error al conectar con el servidor.');
      }
    };

    pingServer();

    const interval = setInterval(pingServer, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [url, basedir]);

  if (loading)
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Activando servidor...</span>
        </div>
        <p className="mt-3">Activando servidor, por favor espera...</p>
      </div>
    );

  if (error)
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  return children;
};

export default PingSpinner;
