const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Ruta para obtener los productos
app.get('/api/productos', (req, res) => {
    fs.readFile(path.join(__dirname, 'productos.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error al leer el archivo de productos' });
        }
        res.json(JSON.parse(data));
    });
});

// Ruta para agregar un producto
app.post('/api/productos', (req, res) => {
    const nuevoProducto = req.body;
    fs.readFile(path.join(__dirname, 'productos.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error al leer el archivo de productos' });
        }
        const productos = JSON.parse(data);
        productos.push(nuevoProducto);

        fs.writeFile(path.join(__dirname, 'productos.json'), JSON.stringify(productos, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al guardar el producto' });
            }
            res.status(201).json({ message: 'Producto añadido correctamente' });
        });
    });
});

// Ruta para eliminar un producto por nombre
app.delete('/api/productos/:nombre', (req, res) => {
    const nombreProducto = req.params.nombre;
    fs.readFile(path.join(__dirname, 'productos.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error al leer el archivo de productos' });
        }
        let productos = JSON.parse(data);
        productos = productos.filter(producto => producto.nombre !== nombreProducto);

        fs.writeFile(path.join(__dirname, 'productos.json'), JSON.stringify(productos, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al guardar los cambios' });
            }
            res.json({ message: 'Producto eliminado correctamente' });
        });
    });
});

module.exports = app;
