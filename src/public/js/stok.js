// Variable para saber si estamos editando un producto, -1 indica que no estamos editando
let editIndex = -1; 

// Array para almacenar los productos
const products = []; 

// Agregar un evento al formulario para manejar el envío
document.getElementById('product-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

    // Obtener los valores del formulario
    const productName = document.getElementById('product-name').value;
    const productQuantity = document.getElementById('product-quantity').value;
    const productPrice = document.getElementById('product-price').value;

    // Si estamos editando un producto, actualizarlo; si no, agregar uno nuevo
    if (editIndex === -1) {
        addProduct(productName, productQuantity, productPrice);
    } else {
        updateProduct(productName, productQuantity, productPrice);
    }

    // Limpiar el formulario después de procesarlo
    this.reset();
    editIndex = -1; // Reiniciar el índice de edición, indicando que no estamos editando
});

// Función para agregar un nuevo producto a la tabla y al array
function addProduct(name, quantity, price) {
    // Obtener el cuerpo de la tabla donde se mostrarán los productos
    const tableBody = document.querySelector('#product-table tbody');
    
    // Crear una nueva fila de tabla
    const row = document.createElement('tr');

    // Definir el contenido de la nueva fila
    row.innerHTML = `
        <td>${name}</td>
        <td>${quantity}</td>
        <td>$${parseFloat(price).toFixed(2)}</td> <!-- Formatear el precio a dos decimales -->
        <td>
            <!-- Botones para editar y eliminar el producto -->
            <button class="edit" onclick="editProduct(this)">Editar</button>
            <button class="delete" onclick="deleteProduct(this)">Eliminar</button>
        </td>
    `;

    // Agregar la nueva fila a la tabla
    tableBody.appendChild(row);

    // Agregar el nuevo producto al array 'products'
    products.push({ name, quantity, price });
}

// Función para editar un producto
function editProduct(button) {
    // Obtener la fila de la tabla donde se encuentra el botón de editar
    const row = button.parentNode.parentNode;

    // Obtener los valores de las celdas de la fila
    const name = row.cells[0].innerText;
    const quantity = row.cells[1].innerText;
    const price = row.cells[2].innerText.replace('$', ''); // Eliminar el símbolo de dólar para obtener el valor numérico

    // Rellenar el formulario con los valores del producto a editar
    document.getElementById('product-name').value = name;
    document.getElementById('product-quantity').value = quantity;
    document.getElementById('product-price').value = price;

    // Establecer el índice del producto que estamos editando
    editIndex = Array.from(row.parentNode.children).indexOf(row); // Obtener el índice de la fila seleccionada
}

// Función para actualizar un producto en la tabla
function updateProduct(name, quantity, price) {
    // Obtener el cuerpo de la tabla
    const tableBody = document.querySelector('#product-table tbody');
    
    // Obtener la fila correspondiente al producto que estamos editando
    const row = tableBody.children[editIndex];

    // Actualizar las celdas de la fila con los nuevos valores
    row.cells[0].innerText = name;
    row.cells[1].innerText = quantity;
    row.cells[2].innerText = `$${parseFloat(price).toFixed(2)}`; // Formatear el precio con dos decimales
}

// Función para eliminar un producto de la tabla
function deleteProduct(button) {
    // Obtener la fila de la tabla que contiene el botón de eliminar
    const row = button.parentNode.parentNode;

    // Eliminar la fila de la tabla
    row.parentNode.removeChild(row);
}
