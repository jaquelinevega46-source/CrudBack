

const express = require('express');
const router = express.Router();
const {
    obtenerUsuarios,
    obUsuarioId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    cambiarEstatus
} = require('../controller/usuario');

router.get('/',obtenerUsuarios);
router.get('/ob',obUsuarioId);
router.post('/',crearUsuario);
router.put('/',actualizarUsuario);
router.delete('/us',eliminarUsuario);
router.put('/es',cambiarEstatus);


module.exports = router;
