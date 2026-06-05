const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'apiuser',
    password: '1234',
    database: 'libreria'
});

conexion.connect((error) => {
    if (error) {
        console.log('Error de conexión:', error);
        return;
    }

    console.log('Conectado a MySQL');
});

module.exports = conexion;