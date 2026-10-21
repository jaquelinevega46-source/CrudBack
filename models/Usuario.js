
require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, 
    {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false
});

const Usuario = sequelize.define('Usuario',{
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    contraseña: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },

    //front
    estatus: {
        type: DataTypes.STRING,
        allowNull: false
    },
    }, {
        tableName: 'USUARIO',
        timestamps: false
});

sequelize.sync()
    .then(() => console.log('CONEXION EXITOSA - SINCRONIZANDO'))
    .catch(err => console.error('ERROR DE CONEXION A LA BASE',err));

module.exports = {sequelize, Usuario};