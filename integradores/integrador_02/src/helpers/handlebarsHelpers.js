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
}
