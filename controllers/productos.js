// controllers/productos.js
const productos = [
    { id: 1, nombre: 'Funko POP Jujutsu Kaisen Sukuna especial Edition Exclusivo Funkoween 2023 Limited Edition', descripcion: 'Todos nuestros Funkos son originales, nuevos y mint condition.', cantidad: 10, precio: 1948.00, imagen: 'producto1.jpg' },
    { id: 2, nombre: 'Funko Pop Mahito 1121 Special Edition Exclusivo Funkoween 2022 Limited Edition', descripcion: 'Gracias a Funko tenemos esta increíble figura. Ven por los pops de tus personajes favoritos a Limited Edition donde Todos Somos Coleccionistas.', cantidad: 15, precio: 319, imagen: 'producto2.jpg' },
    { id: 3, nombre: 'Funko Pop Animation: Jujutsu Kaisen - Satoru Gojo Resplandor Rojo Boxlunch Exc', descripcion: 'Todos nuestros Funkos son originales, nuevos y mint condition.', cantidad: 5, precio: 599, imagen: 'producto3.jpg' },
    { id: 4, nombre: 'Funko POP Animation: Hunter x Hunter ULTRAMEGAESPECIAL UNICO EN MÉXICO- Kurapika', descripcion: 'Todos nuestros Funkos son originales, nuevos y mint condition.', cantidad: 10, precio: 294, imagen: 'producto4.jpg' },
    { id: 5, nombre: 'Funko Pop Hunter x Hunter Killua Zoldyck (GITD) Chase Figura (AAA Anime Exclusive)', descripcion: 'Todos nuestros Funkos son originales, nuevos y mint condition.', cantidad: 15, precio: 899, imagen: 'producto5.jpg' },
    { id: 6, nombre: '¡Funko Pop! Pokemon - Paquete de 4 unidades Eevee, Vaporeon, Jolteon, Flareon', descripcion: 'Todos nuestros Funkos son originales, nuevos y mint condition.', cantidad: 5, precio: 2800, imagen: 'producto6.jpg' },
    { id: 7, nombre: 'Figura De Acción Pokémon Mewtwo De Funko Pop! Games, ORIGINAL DESDE JAPÓN', descripcion: 'Todos nuestros Funkos son originales, nuevos y mint condition.', cantidad: 5, precio: 689, imagen: 'producto7.jpg' },
    { id: 8, nombre: 'Funko 0889698742276 - Figurita Pokemon Lapras  UNIT /  #864 Lokhlass Pop 10cm', descripcion: 'Todos nuestros Funkos son originales, nuevos y mint condition.', cantidad: 5, precio: 319, imagen: 'producto8.jpg' }
  ];
  
  function getProductos() {
    return productos;
  }
  
  function getProductoPorId(id) {
    return productos.find(producto => producto.id === parseInt(id));
  }
  
  module.exports = {
    getProductos,
    getProductoPorId
  };
  