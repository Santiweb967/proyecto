// Obtener los elementos del DOM
const facturaForm = document.getElementById('facturaForm'); // Obtener el formulario de la factura
const addProductoBtn = document.getElementById('add-producto'); // Obtener el botón para agregar productos
const productosContainer = document.getElementById('productos-container'); // Contenedor donde se agregarán los productos

// Función para agregar un producto al formulario
addProductoBtn.addEventListener('click', () => {
    const productoItem = document.createElement('div'); // Crear un nuevo div para el producto
    productoItem.classList.add('producto-item'); // Asignar clase al nuevo producto

    productoItem.innerHTML = ` 
        <label for="producto">Producto:</label>
        <input type="text" class="producto" name="producto[]" required> 

        <label for="cantidad">Cantidad:</label>
        <input type="number" class="cantidad" name="cantidad[]" required> 

        <label for="precio">Precio por Unidad:</label>
        <input type="number" class="precio" name="precio[]" required>

        <button type="button" class="remove-producto">Eliminar Producto</button> 
    `;

    // Agregar el nuevo producto al contenedor de productos
    productosContainer.appendChild(productoItem);

    // Añadir la funcionalidad para eliminar un producto
    const removeButton = productoItem.querySelector('.remove-producto'); // Obtener el botón de eliminar
    removeButton.addEventListener('click', () => {
        productosContainer.removeChild(productoItem); // Eliminar el producto del contenedor
    });
});

// Función para enviar el formulario y guardar la factura
facturaForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitar que el formulario se envíe de manera predeterminada

    // Obtener los datos del formulario
    const nombre = document.getElementById('nombre').value; // Obtener el nombre del cliente

    const productos = []; // Crear un array para almacenar los productos
    const productoElements = document.querySelectorAll('.producto-item'); // Obtener todos los elementos de productos

    let totalFactura = 0;  // Variable para calcular el total de la factura

    // Iterar sobre cada producto y obtener sus datos
    productoElements.forEach(item => {
        const producto = item.querySelector('.producto').value; // Obtener nombre del producto
        const cantidad = parseFloat(item.querySelector('.cantidad').value); // Obtener la cantidad
        const precio = parseFloat(item.querySelector('.precio').value); // Obtener el precio

        // Validaciones para asegurar que los campos son válidos
        if (!producto || isNaN(cantidad) || isNaN(precio) || cantidad <= 0 || precio <= 0) {
            alert("Por favor, rellena todos los campos del producto correctamente.");
            return;
        }

        const totalProducto = cantidad * precio;  // Calcular el total por producto
        productos.push({ producto, cantidad, precio, total: totalProducto }); // Agregar el producto al array

        totalFactura += totalProducto;  // Sumar el total del producto al total de la factura
    });

    // Validar que haya al menos un producto
    if (productos.length === 0) {
        alert("Por favor, agrega al menos un producto.");
        return;
    }

    // Enviar la factura al backend
    fetch('http://localhost:3000/guardarFactura', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre_cliente: nombre, // Enviar el nombre del cliente
            productos: productos, // Enviar los productos
            total: totalFactura  // Enviar el total de la factura
        })
    })
    .then(response => response.json()) // Convertir la respuesta en formato JSON
    .then(data => {
        if (data.message) {
            alert(data.message);  // Mostrar mensaje de éxito
            cargarFacturas();  // Recargar la lista de facturas
        } else if (data.error) {
            alert(data.error);  // Mostrar mensaje de error
        }
    })
    .catch(err => {
        console.error('Error al guardar la factura:', err);  // Mostrar el error en consola
        alert('Error al guardar la factura.');
    });
});

// Función para cargar todas las facturas generadas
function cargarFacturas() {
    fetch('http://localhost:3000/getAllFacturas') // Obtener todas las facturas desde el backend
        .then(response => response.json()) // Convertir la respuesta en formato JSON
        .then(data => {
            const facturasList = document.getElementById('facturas-list'); // Obtener el contenedor de facturas
            facturasList.innerHTML = '';  // Limpiar la lista de facturas

            // Verificar si hay facturas para mostrar
            if (data.length === 0) {
                facturasList.innerHTML = '<li>No se encontraron facturas.</li>';
            } else {
                // Iterar sobre las facturas y mostrarlas en la lista
                data.forEach(factura => {
                    const li = document.createElement('li'); // Crear un nuevo elemento de lista
                    li.textContent = `Factura ID: ${factura.id}, Cliente: ${factura.nombre_cliente}, Total: $${factura.total}`; // Agregar información de la factura
                    facturasList.appendChild(li); // Agregar la factura al contenedor
                });
            }
        })
        .catch(err => {
            console.error('Error al cargar las facturas:', err); // Mostrar el error en consola
            alert('Error al cargar las facturas.');
        });
}

// Cargar facturas al inicio
cargarFacturas();

// Evento cuando el contenido de la página se haya cargado
document.addEventListener("DOMContentLoaded", function () {
    // Añadir evento para agregar más productos
    document.getElementById("add-producto").addEventListener("click", function () {
        const productoItem = document.querySelector(".producto-item"); // Obtener el primer producto
        const newProductoItem = productoItem.cloneNode(true); // Clonar el producto
        document.getElementById("productos-container").appendChild(newProductoItem); // Agregar el nuevo producto al contenedor

        // Limpiar los valores de los campos clonados
        newProductoItem.querySelector(".producto").value = "";
        newProductoItem.querySelector(".cantidad").value = "";
        newProductoItem.querySelector(".precio").value = "";

        // Añadir funcionalidad para eliminar un producto
        newProductoItem.querySelector(".remove-producto").addEventListener("click", function () {
            newProductoItem.remove(); // Eliminar el producto del contenedor
        });
    });

    // Evento para generar la factura en formato PDF
    document.getElementById("facturaForm").addEventListener("submit", function (e) {
        e.preventDefault(); // Evitar que el formulario se envíe de manera tradicional

        // Obtener la librería jsPDF para generar el PDF
        const { jsPDF } = window.jspdf;

        // Capturar los valores del formulario
        const nombre = document.getElementById("nombre").value;

        // Capturar los productos
        const productos = [];
        const productosElements = document.querySelectorAll(".producto-item");

        // Recopilar los productos con sus detalles
        productosElements.forEach(item => {
            const producto = item.querySelector(".producto").value;
            const cantidad = parseFloat(item.querySelector(".cantidad").value);
            const precio = parseFloat(item.querySelector(".precio").value);

            // Validar los campos de cada producto
            if (!producto || isNaN(cantidad) || isNaN(precio) || cantidad <= 0 || precio <= 0) {
                alert("Por favor, rellena todos los campos del producto correctamente.");
                return;
            }

            const total = cantidad * precio;
            productos.push({ producto, cantidad, precio, total });
        });

        // Validar que haya al menos un producto
        if (productos.length === 0) {
            alert("Por favor, agrega al menos un producto.");
            return;
        }

        // Crear el documento PDF con jsPDF
        const doc = new jsPDF();
        doc.setFontSize(20); // Establecer el tamaño de fuente
        doc.text("Factura Electrónica", 105, 20, null, null, "center"); // Título centrado

        doc.setFontSize(12); // Establecer el tamaño de fuente para el resto del texto
        doc.text("Emisor: Empresa XYZ S.A.S.", 10, 40);
        doc.text("NIT: 1234567890", 10, 50);
        doc.text("Dirección: Calle 123, Cali, Colombia", 10, 60);

        doc.text(`Receptor: ${nombre}`, 10, 80);
        doc.text("Dirección: Calle 456, Cali, Colombia", 10, 100);

        let y = 120; // Posición vertical para las tablas
        doc.setFontSize(12);
        doc.text("Descripción", 10, y);
        doc.text("Cantidad", 100, y);
        doc.text("Precio", 130, y);
        doc.text("Total", 160, y);

        y += 10;
        doc.setLineWidth(0.5); // Establecer grosor de línea
        doc.line(10, y, 200, y); // Dibujar una línea separadora

        // Iterar sobre los productos y agregarlos al PDF
        productos.forEach(item => {
            y += 10;
            doc.text(item.producto, 10, y);
            doc.text(item.cantidad.toString(), 100, y);
            doc.text(`$${item.precio.toFixed(2)}`, 130, y);
            doc.text(`$${item.total.toFixed(2)}`, 160, y);
        });

        const totalFactura = productos.reduce((acc, item) => acc + item.total, 0); // Calcular el total de la factura
        y += 20;
        doc.setFontSize(14); // Establecer tamaño de fuente para el total
        doc.text(`Total: $${totalFactura.toFixed(2)}`, 130, y); // Agregar el total de la factura

        doc.setFontSize(10); // Establecer tamaño de fuente para la fecha
        doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 10, y + 10); // Agregar la fecha

        doc.save("factura.pdf"); // Guardar el archivo PDF con nombre "factura.pdf"
    });
});
