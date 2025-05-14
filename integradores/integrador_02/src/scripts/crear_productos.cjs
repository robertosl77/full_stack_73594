const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión a MongoDB establecida');

    const datos = productos().map(({ id, ...resto }) => resto); // eliminar campo 'id'

    Producto.insertMany(datos)
        .then(() => {
            console.log('Datos cargados correctamente en la colección productos');
            mongoose.disconnect();
        })
        .catch(err => {
            console.error('Error al insertar los datos', err);
            mongoose.disconnect();
        });
    

})
  .catch(err => {
    console.error('Error al conectar a MongoDB', err);
  });

const productoSchema = new mongoose.Schema({
    imagen: String,
    categoria: String,
    bodega: String,
    tipo: String,
    nombre: String,
    precio_original: Number,
    descuento: Number,
    stock: Number,
    estado: Boolean
});

const Producto = mongoose.model('Producto', productoSchema, 'productos'); // <- nombre exacto de colección


function productos() {
    return [
        {
            id: 1,
            imagen: "img_productos/cha_ar_punco_sc_1370x2400_1.webp",
            categoria: "vinos",
            bodega: "El Esteco",
            tipo: "Blend",
            nombre: "Chañar Punco",
            precio_original: 69614.50,
            descuento: 30,
            stock: 0,
            estado: true,
        },
        {
            id: 2,
            imagen: "img_productos/mascota_estuche_x_2_botellas_1.webp",
            categoria: "vinos",
            bodega: "Mascota Vineyards",
            tipo: "Mix",
            nombre: "Estuche Unánime",
            precio_original: 81939.00,
            descuento: 40,
            stock: 2,
            estado: true,
        },
        {
            id: 3,
            imagen: "img_productos/altimus_sc_1370x2400_1.webp",
            categoria: "vinos",
            bodega: "El Esteco",
            tipo: "Blend",
            nombre: "Altimus",
            precio_original: 80254.00,
            descuento: 0,
            stock: 32,
            estado: true,
        },
        {
            id: 4,
            imagen: "img_productos/15_-_trapiche_tesoro_bolsa_inter_miami.webp",
            categoria: "vinos",
            bodega: "Trapiche",
            tipo: "Malbec",
            nombre: "Trapiche Tesoro",
            precio_original: 11966.46,
            descuento: 0,
            stock: 32,
            estado: true,
        },
        {
            id: 5,
            imagen: "img_productos/dada_caramel.webp",
            categoria: "vinos",
            bodega: "Finca Las Moras",
            tipo: "Blend",
            nombre: "DADÁ #9 Caramel",
            precio_original: 7140.00,
            descuento: 30,
            stock: 32,
            estado: true,
        },
        {
            id: 6,
            imagen: "img_productos/3_combo_degustacion_blancos.webp",
            categoria: "vinos",
            bodega: "Caja Combinada",
            tipo: "Mix",
            nombre: "Combo Degustación Blancos",
            precio_original: 103377.00,
            descuento: 35,
            stock: 11,
            estado: true,
        },
        {
            id: 7,
            imagen: "img_productos/combo_inter_campeon.webp",
            categoria: "vinos",
            bodega: "Trapiche",
            tipo: "Malbec",
            nombre: "Combo Inter Campeón",
            precio_original: 81450.00,
            descuento: 35,
            stock: 1,
            estado: true,
        },
        {
            id: 8,
            imagen: "img_productos/51943.webp",
            categoria: "vinos",
            bodega: "Mascota Vineyards",
            tipo: "Malbec",
            nombre: "La Mascota",
            precio_original: 15259.00,
            descuento: 45,
            stock: 33,
            estado: true,
        },
        {
            id: 9,
            imagen: "img_productos/coleccion_privada_chardonnay_80020_1.webp",
            categoria: "vinos",
            bodega: "Navarro Correas",
            tipo: "Chardonnay",
            nombre: "Colección Privada",
            precio_original: 8850.00,
            descuento: 40,
            stock: 1,
            estado: true,
        },
        {
            id: 10,
            imagen: "img_productos/1_combo_dulzura_.webp",
            categoria: "spirits",
            bodega: "Caja Combinada",
            tipo: "Mix",
            nombre: "Combo Dulzura",
            precio_original: 77838.00,
            descuento: 30,
            stock: 5,
            estado: true,
        },
        {
            id: 11,
            imagen: "img_productos/whatsapp_image_2024-05-29_at_15.39.54.webp",
            categoria: "spirits",
            bodega: "Gordon’s",
            tipo: "Gin",
            nombre: "Gordon´s Pink Gin",
            precio_original: 17543.00,
            descuento: 30,
            stock: 19,
            estado: true,
        },
        {
            id: 12,
            imagen: "img_productos/30008_8.webp",
            categoria: "spirits",
            bodega: "Johnnie Walker",
            tipo: "Whisky",
            nombre: "Johnnie Walker Swing",
            precio_original: 125226.00,
            descuento: 0,
            stock: 125,
            estado: true,
        }
    ];
}

