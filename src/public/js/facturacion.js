
document.getElementById("facturaForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    // Obtener la librería jsPDF
    const { jsPDF } = window.jspdf;

    // Capturar los valores del formulario
    const nombre = document.getElementById("nombre").value;
    const rfc = document.getElementById("rfc").value;
    const producto = document.getElementById("producto").value;
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const precio = parseFloat(document.getElementById("precio").value);

    // Validar los campos
    if (!nombre || !rfc || !producto || isNaN(cantidad) || isNaN(precio) || cantidad <= 0 || precio <= 0) {
        alert("Por favor, rellena todos los campos correctamente.");
        return;
    }

    const total = cantidad * precio;

    // Crear una nueva instancia de jsPDF
    const doc = new jsPDF();

    // Título de la factura
    doc.setFontSize(20);
    doc.text("Factura Electrónica", 105, 20, null, null, "center");

    // Información del emisor
    doc.setFontSize(12);
    doc.text("Emisor: Empresa XYZ S.A.S.", 10, 40);
    doc.text("NIT: 1234567890", 10, 50);
    doc.text("Dirección: Calle 123, Bogotá, Colombia", 10, 60);

    // Información del receptor (cliente)
    doc.text(`Receptor: ${nombre}`, 10, 80);
    doc.text(`RFC: ${rfc}`, 10, 90);
    doc.text("Dirección: Calle 456, Medellín, Colombia", 10, 100);

    // Detalles de la factura en una tabla
    let y = 120;
    doc.setFontSize(12);
    doc.text("Descripción", 10, y);
    doc.text("Cantidad", 100, y);
    doc.text("Precio", 130, y);
    doc.text("Total", 160, y);

    // Dibujar una línea de separación
    y += 10;
    doc.setLineWidth(0.5);
    doc.line(10, y, 200, y);

    // Agregar los detalles del producto
    y += 10;
    doc.text(producto, 10, y);
    doc.text(cantidad.toString(), 100, y);
    doc.text(`$${precio.toFixed(2)}`, 130, y);
    doc.text(`$${total.toFixed(2)}`, 160, y);

    // Total de la factura
    y += 20;
    doc.setFontSize(14);
    doc.text(`Total: $${total.toFixed(2)}`, 130, y);

    // Fecha de emisión
    doc.setFontSize(10);
    doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 10, y + 10);

    // Descargar el archivo PDF
    doc.save("factura.pdf");
});
