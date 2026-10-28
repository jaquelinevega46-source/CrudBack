// logica del programa


const { Usuario } = require('../models/Usuario');
const { Op } = require('sequelize'); // 👈 Importación correcta de Op
const bcrypt = require('bcryptjs');

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'ERROR AL OBTENER USUARIOS', error: error.message });
    }
};

const obUsuarioId = async (req, res) => {
    try {
        const { id } = req.body;
        const usuario = await Usuario.findByPk(id);
        
        if (!usuario) {
            return res.status(404).json({ mensaje: 'USUARIO NO ENCONTRADO' });
        }
        
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: 'ERROR AL BUSCAR EL USUARIO', error: error.message });
    }
};

const crearUsuario = async (req, res) => {
    try {
        const { telefono, nombre, contraseña, correo } = req.body;

        if (!nombre || !telefono || !correo || !contraseña) {
            return res.status(400).json({ mensaje: 'TODOS LOS CAMPOS SON OBLIGATORIOS' });
        }

        // Buscar si el teléfono O el correo ya están registrados
        const usuarioExiste = await Usuario.findOne({
            where: {
                [Op.or]: [
                    { telefono: telefono },
                    { correo: correo }
                ]
            }
        });

        if (usuarioExiste) {
            return res.status(400).json({
                mensaje: 'EL TELEFONO O EL CORREO YA SE ENCUENTRAN REGISTRADOS'
            });
        }
        //encriptar contraseña

        const salt = await bcrypt.genSalt(10);
        const contraseñaHash = await bcrypt.hash(contraseña, salt);

        const nuevoUsuario = await Usuario.create({ nombre, telefono, correo, contraseña: contraseñaHash });
        res.status(201).json({ mensaje: 'USUARIO CREADO', usuario: nuevoUsuario });

    } catch (error) {
        console.error('ERROR AL CREAR USUARIO:', error);
        res.status(500).json({ mensaje: 'ERROR AL CREAR USUARIO', error: error.message });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const { id, nombre, contraseña, correo, telefono } = req.body;

        if (!id) {
            return res.status(400).json({ mensaje: 'SE REQUIERE ID' });
        }

        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'USUARIO NO EXISTENTE' });
        }
        //cambio de contraseña encriptada
        const datosActualizados = {};
        const nuevaClave = contraseña;
        if(nuevaClave){
            const salt = await bcrypt.genSalt(10);
            datosActualizados.contraseña = await bcrypt.hash(contraseña, salt);
        }

        await usuario.update(datosActualizados);
        res.json({ mensaje: 'DATOS DE USUARIO ACTUALIZADOS', usuario });

    } catch (error) {
        res.status(500).json({ mensaje: 'ERROR AL ACTUALIZAR DATOS', error: error.message });
    }    
};

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ mensaje: 'SE REQUIERE EL ID EN EL BODY' });
        }

        const usuario = await Usuario.findByPk(id);

        console.log('ID EXISTENTE:', id);
        console.log('USUARIO ENCONTRADO:', usuario);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'USUARIO NO ENCONTRADO' });
        }

        await usuario.destroy();
        res.json({ mensaje: 'USUARIO ELIMINADO' });

    } catch (error) {
        res.status(500).json({ mensaje: 'ERROR AL ELIMINAR USUARIO', error: error.message });
    }
};

//front

const cambiarEstatus = async (req, res) => {
    try{
        const { id, estatus } = req.body;
            if(!id || !['ACTIVO', 'INACTIVO'].includes(estatus)){
                return res.status(400).json({ mensaje: 'SE REQUIERE ID'});
            }
        const usuario = await Usuario.findByPk(id);
            if(!usuario){
                return res.status(404).json({mensaje: 'USUARIO NO ENCONTRADO'});
            }

        usuario.estatus = estatus;
        await usuario.save();

        res.json({mensaje: `ESTATUS:${estatus.toUpperCase()}`, usuario});
    } catch(error) {
        res.status(500).json({mensaje:'ERROR DE CAMBIO DE ESTATUS'});
    }
};

module.exports = {
    obtenerUsuarios,
    obUsuarioId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    cambiarEstatus
};