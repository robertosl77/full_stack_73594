# Proyecto Integrador 2 - Firebase Auth

Este proyecto es una aplicación web construida con **Node.js**, **Express**, **Handlebars** y **MongoDB**, que ahora utiliza **Firebase Authentication** para el inicio de sesión con Google.

---

## 🔧 Instalación

```bash
npm install
```

---

## 🚀 Ejecución local

```bash
npm run dev
```

El servidor corre por defecto en [http://localhost:8081](http://localhost:8081)

---

## 🧠 Tecnologías utilizadas

- Node.js
- Express
- Handlebars
- MongoDB + Mongoose
- Firebase Authentication (login con Google)
- Express-session

---

## 📂 Variables de entorno (.env)

```env
PORT=8081
MONGODB_URI=mongodb+srv://<usuario>:<clave>@cluster.mongodb.net/educacionit
SESSION_SECRET=clave_secreta_generada
BASEDIR=/integrador2
NODE_ENV=production
```

> 🔥 Las variables de Auth0 fueron eliminadas tras migrar a Firebase.

---

## ✅ Flujo de login

1. Usuario hace clic en “Iniciar sesión con Google”.
2. Firebase muestra el popup de autenticación.
3. El frontend obtiene los datos del usuario autenticado.
4. Se envían al backend por `POST /loginFirebase`.
5. Si el usuario no existe en MongoDB, se crea automáticamente.
6. Se guarda sesión y se redirige a `/productos`.

---

## 👤 Autor

Desarrollado por **robertosl77@gmail.com**