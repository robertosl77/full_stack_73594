// src/helpers/handlebarsHelpers.js
import Handlebars from 'handlebars';

export default function registerHandlebarsHelpers() {
    // Helper: mayor que
    Handlebars.registerHelper('gt', function(a, b) {
        return a > b;
    });

    // Helper: igual
    Handlebars.registerHelper('eq', function(a, b) {
        return a === b;
    });

    // Helper para convertir a JSON (útil para pasar datos a JavaScript)
    Handlebars.registerHelper('json', function(context) {
        return JSON.stringify(context);
    });

    // Pasa el valor a formato Tipo Titulo
    Handlebars.registerHelper('titleCase', function (str) {
    if (!str) return '';
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    });    

    // Helper adicional para debugging
    Handlebars.registerHelper('debug', function(value) {
        console.log('Debug value:', value, typeof value);
        return '';
    });

    // Helper corregido: ocultar acciones de productos si es solo vista
    Handlebars.registerHelper('ocultarSi', function(condicion) {
        // Asegurarse de que la condición sea evaluada correctamente
        return condicion === true ? 'style="display: none;"' : '';
    });

}


