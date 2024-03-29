const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const productosController = require('./controllers/productos');

// Comenzamos configurando el middleware para manejo de sesiones
//session de express para poder utilizar frimar la cookie de sesion porcurando sea mas segura
app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  res.locals.carrito = req.session.carrito || [];
  next();
});

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use('/css/imagenes', express.static(path.join(__dirname, 'public/css/imagenes')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Ruta para mostrar el formulario de recuperar contraseña (GET)
app.get('/recuperar-contrasena', (req, res) => {
  res.render('recuperar-contrasena', { title: 'Recuperar Contraseña' });
});

// Ruta para manejar la solicitud POST del formulario de recuperación de contraseña
app.post('/recuperar-contrasena', (req, res) => {
  res.redirect('/correo-restablecimiento');
});

// Registro nuevo ruta
app.get('/registro', (req, res) => {
  res.render('registro', { title: '¡Regístrate ahora!' });
});

// Configuración de la plantilla Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


// Middleware para procesar archivos estáticos en la carpeta 'public'
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para mostrar el formulario de inicio de sesión
app.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar sesión' });
});

// Lógica para manejar la autenticación
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "12345") {
    req.session.isLoggedIn = true;
    req.session.username = username;
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

// Ruta para mostrar la página principal
app.get('/', (req, res) => {
  const username = req.session.username;
  res.render('index', { title: 'Página de Inicio', username });
});



// Ruta para la página de inicio
app.get('/', (req, res) => {
  if (req.session.isLoggedIn) {
    res.render('index', { title: 'Página de Bienvenida' });
  } else {
    res.redirect('/login'); 
  }
});

// Ruta para el catálogo de productos
app.get('/catalogo', (req, res) => {
  const productos = productosController.getProductos();
  res.render('catalogo', { title: 'Catálogo de Productos', productos });
});

// Ruta para buscar productos
app.get('/buscar-producto', (req, res) => {
  const query = req.query.q.toLowerCase();
  const productos = productosController.getProductos();
  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(query) || producto.descripcion.toLowerCase().includes(query)
  );
  res.render('catalogo', { title: 'Resultados de la Búsqueda', productos: productosFiltrados });
});

// Ruta para el detalle de producto
app.get('/producto/:id', (req, res) => {
  const idProducto = req.params.id;
  const producto = productosController.getProductoPorId(idProducto);
  res.render('producto', { title: 'Detalle del Producto', producto });
});

// Ruta para el carrito de compra
app.get('/carrito', (req, res) => {
  let carrito = req.session.carrito || [];
  res.render('carrito', { title: 'Carrito de Compra', carrito });
});

// Ruta para agregar un producto al carrito
app.post('/agregar-al-carrito/:id', (req, res) => {
  const idProducto = req.params.id;
  const producto = productosController.getProductoPorId(idProducto);
  if (producto && producto.cantidad > 0) {
    let carrito = req.session.carrito || [];
    let productoEnCarrito = carrito.find(item => item.id === idProducto);
    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      carrito.push({ id: idProducto, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    }
    producto.cantidad--;
    req.session.carrito = carrito;
    res.redirect('/catalogo');
  } else {
    res.status(404).send('Producto no encontrado o no disponible');
  }
});

// Ruta para el detalle de compra
app.get('/detalle-compra', (req, res) => {
  let carrito = req.session.carrito || [];
  res.render('detalle-compra', { title: 'Detalle de Compra', carrito });
});

// Ruta para actualizar la cantidad de un producto en el carrito
app.post('/actualizar-cantidad/:id/:cantidad', (req, res) => {
  const idProducto = req.params.id;
  const cantidad = parseInt(req.params.cantidad);
  let carrito = req.session.carrito || [];
  const item = carrito.find(item => item.id === idProducto);
  const producto = productosController.getProductoPorId(idProducto);
  if (item) {
    const cantidadNueva = item.cantidad + cantidad;
    if (cantidadNueva > 0 && cantidad <= producto.cantidad) {
      item.cantidad = cantidadNueva;
      //Habia un bug aqui a la hora de agregar productos se multiplicaba por la cantidad y deberia ser fijo.//
      item.precio = producto.precio;
      producto.cantidad -= cantidad;
      if (item.cantidad === 0) {
        carrito = carrito.filter(item => item.id !== idProducto);
      }
    }
  }
  req.session.carrito = carrito;
  res.redirect('/carrito');
});

// Ruta para eliminar un producto del carrito
app.post('/eliminar-del-carrito/:id', (req, res) => {
  const idProducto = req.params.id;
  let carrito = req.session.carrito || [];
  const itemIndex = carrito.findIndex(item => item.id === idProducto);
  if (itemIndex !== -1) {
    const removedItem = carrito.splice(itemIndex, 1)[0];
    const producto = productosController.getProductoPorId(idProducto);
    if (producto) {
      producto.cantidad += removedItem.cantidad;
    }
  }
  req.session.carrito = carrito;
  res.redirect('/carrito');
});

// Middleware para procesar la compra
app.post('/procesar-compra', (req, res) => {
  // Lógica para procesar la compra...
  const carrito = req.session.carrito || [];
  // Vaciar el carrito después de procesar la compra
  req.session.carrito = [];
  res.render('confirmacion-compra', { title: 'Compra Exitosa' });
});

// Puerto en el que escucha el servidor
const port = 3002;
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
