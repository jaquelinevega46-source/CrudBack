const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('Usuarios', 'root','JaquelineV_04', {
    host: 'localhost',
    dialect: 'mysql',
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
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false
    }
    }, {
        tableName: 'USUARIO',
        timestamps: false
});

sequelize.sync()
    .then(() => console.log('CONEXION EXITOSA - SINCRONIZANDO'))
    .catch(err => console.error('ERROR DE CONEXION A LA BASE',err));

module.exports = {sequelize, Usuario};