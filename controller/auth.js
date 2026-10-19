const { Usuario } = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    try{
        const{ correo, contraseña } = req.body;
        const passwordIngresada = cpntraseña;

        if(!correo || contraseña)
            return res.status(400).json({mensaje:'DATOS OBLIGATORIOS'});
    }

    
}