// src/utils/funciones.js

export function tiempoTranscurrido(fecha) {
    if (!fecha) return '';

    const now = new Date();
    const then = new Date(fecha);
    const diffMs = now - then; // Diferencia en milisegundos
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return `${diffSec} segundos`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minutos`;
    const diffHoras = Math.floor(diffMin / 60);
    if (diffHoras < 24) return `${diffHoras} horas`;
    const diffDias = Math.floor(diffHoras / 24);
    if (diffDias < 7) return `${diffDias} días`;
    const diffSemanas = Math.floor(diffDias / 7);
    if (diffSemanas < 4) return `${diffSemanas} semanas`;
    const diffMeses = Math.floor(diffDias / 30);
    if (diffMeses < 12) return `${diffMeses} meses`;
    const diffAnios = Math.floor(diffDias / 365);
    return `${diffAnios} años`;
}
