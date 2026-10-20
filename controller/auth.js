

const { Usuario } = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;
        const passwordIngresada = contraseña;

        // 1. Validar datos obligatorios
        if (!correo || !passwordIngresada) {
            return res.status(400).json({ mensaje: 'DATOS OBLIGATORIOS' });
        }

        // 2. Buscar usuario por correo
        const usuario = await Usuario.findOne({ where: { correo } });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'USUARIO INEXISTENTE' });
        }

        // 3. Comparar contraseña encriptada
        const uValido = await bcrypt.compare(passwordIngresada, usuario.contraseña);

        if (!uValido) {
            return res.status(401).json({ mensaje: 'CONTRASEÑA INCORRECTA' });
        }

        // 4. Respuesta correcta
        return res.json({
            mensaje: 'INICIO DE SESION EXITOSO',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                telefono: usuario.telefono
            }
        });

    } catch (error) {
        console.error('ERROR DE INICIO:', error);
        return res.status(500).json({
            mensaje: 'ERROR AL INICIAR SESION',
            error: error.message
        });
    }
};

module.exports = { login };