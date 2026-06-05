var express = require('express');
var router = express.Router();
const conexion = require('../db');

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/libros', function (req, res) {

  const sql = "SELECT * FROM libros";

  conexion.query(sql, function (error, resultados) {

    if (error) {
      return res.status(500).json(error);
    }

    res.json(resultados);

  });

});

router.get('/libros/:id', function (req, res) {

  const id = req.params.id;

  const sql = "SELECT * FROM libros WHERE id = ?";

  conexion.query(sql, [id], function (error, resultados) {

    if (error) {
      return res.status(500).json(error);
    }

    res.json(resultados);

  });

});

router.post('/libros', function (req, res) {

  const { titulo, autor, precio, stock } = req.body;

  const sql = `
    INSERT INTO libros (titulo, autor, precio, stock)
    VALUES (?, ?, ?, ?)
  `;

  conexion.query(
    sql,
    [titulo, autor, precio, stock],
    function (error, resultado) {

      if (error) {
        return res.status(500).json(error);
      }

      res.json({
        mensaje: 'Libro agregado correctamente'
      });

    }
  );

});

router.put('/libros/:id', function(req, res) {

  const id = req.params.id;
  const { titulo, autor, precio, stock } = req.body;

  const sql = `
    UPDATE libros
    SET titulo = ?, autor = ?, precio = ?, stock = ?
    WHERE id = ?
  `;

  conexion.query(
    sql,
    [titulo, autor, precio, stock, id],
    function(error, resultado){

      if(error){
        return res.status(500).json(error);
      }

      res.json({
        mensaje: 'Libro modificado correctamente'
      });

    }
  );

});

router.delete('/libros/:id', function(req, res) {

  const id = req.params.id;

  const sql = "DELETE FROM libros WHERE id = ?";

  conexion.query(
    sql,
    [id],
    function(error, resultado){

      if(error){
        return res.status(500).json(error);
      }

      res.json({
        mensaje: 'Libro eliminado correctamente'
      });

    }
  );

});

module.exports = router;