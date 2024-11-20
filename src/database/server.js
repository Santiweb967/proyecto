// Importar dependencias
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

// Crear la aplicación de Express
const app = express();
const port = 3000;

// Configuración del middleware para parsear JSON
app.use(bodyParser.json());
app.use(cors());  // Mover esta línea después de la creación de 'app'

// Crear conexión con MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '200612', // Tu contraseña de MySQL
    database: 'sistema_usuarios'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conexión exitosa a MySQL');
});

// Ruta para registrar un usuario
app.post('/register', (req, res) => {
    const { nombre, email, password, confirm_password, cargo } = req.body;

    // Validar que las contraseñas coinciden
    if (password !== confirm_password) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    // Verificar si el email ya está registrado
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
        }

        // Encriptar la contraseña
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ error: 'Error al encriptar la contraseña' });
            }

            // Insertar el usuario en la base de datos
            const query = 'INSERT INTO usuarios (nombre, email, password, cargo) VALUES (?, ?, ?, ?)';
            db.query(query, [nombre, email, hashedPassword, cargo], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al registrar el usuario' });
                }

                return res.status(201).json({ message: 'Usuario registrado exitosamente' });
            });
        });
    });
});
// Ruta para el inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Buscar el usuario en la base de datos
    db.query('SELECT * FROM usuarios WHERE email = ?', [email ], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Error al verificar la contraseña' });
            }

            if (!isMatch) {
                return res.status(400).json({ error: 'Contraseña incorrecta' });
            }

            // Si las credenciales son correctas
            return res.status(200).json({ message: 'Inicio de sesión exitoso' });
        });
    });
});
// Ruta para obtener el perfil de un usuario
// Ruta para obtener el perfil de un usuario
app.get('/getProfile', (req, res) => {
    const email = req.query.email; // Obtenemos el email como parámetro de consulta

    if (!email) {
        return res.status(400).json({ error: 'El email es requerido' });
    }

    // Consultar los datos del usuario
    db.query('SELECT nombre, email, cargo FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Devolver los datos del usuario
        const user = results[0];
        return res.status(200).json({
            nombre: user.nombre,
            email: user.email,
            cargo: user.cargo,
        });
    });
});
// Ruta para obtener todos los perfiles de usuario
app.get('/getAllProfiles', (req, res) => {
    // Consultar todos los usuarios de la base de datos
    db.query('SELECT nombre, email, cargo FROM usuarios', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        // Verificar si hay usuarios
        if (results.length === 0) {
            return res.status(404).json({ error: 'No se encontraron usuarios' });
        }

        // Devolver los datos de todos los usuarios
        return res.status(200).json(results);
    });
});

app.post('/updateCargo', (req, res) => {
    const { email, newCargo } = req.body;
    db.query('UPDATE usuarios SET cargo = ? WHERE email = ?', [newCargo, email], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al actualizar el cargo' });
        }
        res.status(200).json({ success: true, message: 'Cargo actualizado correctamente' });
    });
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
