const productos = [
  { id: 1, nombre: "Blusas", precio: 45.00 },
  { id: 2, nombre: "Jeans", precio: 75.00 },
  { id: 3, nombre: "Zapatos", precio: 80.00 },
  { id: 4, nombre: "Sombreros", precio: 20.00 },
  { id: 5, nombre: "Bolsos", precio: 50.00 },
  { id: 6, nombre: "Accesorios", precio: 10.00 },
  { id: 7, nombre: "Faldas", precio: 50.00 },
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");

function mostrarProductos(productosAMostrar = productos) {
  contenedorProductos.innerHTML = "";
  productosAMostrar.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <h3>${prod.nombre}</h3>
      <p>Precio: $${prod.precio.toFixed(2)}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
    `;
    contenedorProductos.appendChild(div);
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  guardarCarrito();
  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;
  carrito.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio.toFixed(2)}`;
    listaCarrito.appendChild(li);
    total += item.precio;
  });
  totalCarrito.textContent = total.toFixed(2);
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function filtrarProductos() {
  const texto = document.getElementById("filtro").value.toLowerCase();
  const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
  mostrarProductos(filtrados);
}

mostrarProductos();
actualizarCarrito();

// PayPal
paypal.Buttons({
  createOrder: (data, actions) => {
    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: total.toFixed(2)
        }
      }]
    });
  },
  onApprove: (data, actions) => {
    return actions.order.capture().then(function(details) {
      alert("¡Gracias por tu compra, " + details.payer.name.given_name + "!");
      vaciarCarrito();
    });
  }
}).render('#paypal-button-container');
