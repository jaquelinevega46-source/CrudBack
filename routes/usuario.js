

const express = require('express');
const router = express.Router();
const {
    obtenerUsuarios,
    obUsuarioId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    cambiarEStatus
} = require('../controller/usuario');

router.get('/',obtenerUsuarios);
router.get('/:id',obUsuarioId);
router.post('/',crearUsuario);
router.put('/',actualizarUsuario);
router.delete('/us',eliminarUsuario);
router.put('/es',cambiarEStatus);


module.exports = router;
