// logica del programa


const { Usuario } = require('../models/Usuario');



const obtenerUsuarios = async(req, res) => {
    try{
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({mensaje: ' ERROR AL OBTENER USUARIO',error:error.message});
    }
};

const obUsuarioId = async(req, res) => {
    try{
        const {id} = req.params;
        const usuario = await Usuario.findByPk(id);
        if(!usuario){
            return res.status(404).json({mensaje: 'USUARIO NO ENCONTRADO', error: error.message});
        }
        res.json(usuario);
    }catch( error ){
        res.status(404).json({mensaje: 'NO SE ENCUENTRA EL USUARIO',error: error.message});
    }
};

const crearUsuario = async(req, res) => {
    try {
        const {telefono, nombre, contraseña, correo } = req.body;
        const nuevoUsuario = await Usuario.create({nombre, telefono, correo, contraseña});
        res.status(201).json({mensaje: 'USUARIO CREADO', usuario: nuevoUsuario });
    } catch(error){
        res.status(500).json({mensaje: 'ERROR AL CREAR USUARIO', error: error.menssaje});
    }
};

const actualizarUsuario = async(req, res) => {
    try{
        const {id} = req.params;
        const {nombre, contraseña, correo} = req.body;
        
        const usuario = await Usuario.findByPk(id);
        console.log('Usuario',usuario);
        if(!usuario){
            return res.status(404).json({mensaje: ' USUARIO NO EXISTENTE'});
        }
        await usuario.update({nombre, contraseña, correo});
        res.json({mensaje: 'DATOS DE USUARIO ACTUALIZADOS', usuario});
    }catch (error){
        res.status(404).json({mensaje: 'ERROR AL ACTUALIZAR DATOS', error: error.mensaje});
    }    
};

const eliminarUsuario = async(req, res) => {
    try{
        const {id} = req.body;
        const usuario = await Usuario.findByPk(id);

        console.log('ID EXISTENTE', id);
        console.log('USUARIO ENCONTRADO', usuario);

        if(!id){
            return res.status(404),json({mensaje: 'SE REQUIERE EL ID'});
        }
        
        if(!usuario){
            return res.status(400).json({mensaje: 'USUARIO NO ENCONTRADO'});
        }
        await usuario.destroy();
        res.json({mensaje: 'USUARIO ELIMINADO'});
    }catch(error){
        res.status(404).json({mensaje:'ERROR AL ELIMINAR USUARIO'});
    }
};

module.exports = {
    obtenerUsuarios,
    obUsuarioId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};