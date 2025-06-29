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

    // Helper: convertir a JSON
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
}
