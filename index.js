const express = require('express');
const app = express();
const rutaUsuarios = require('./routes/usuario.js');

const puerto = 3000;
app.use(express.json());
app.use('/api/usuarios', rutaUsuarios);
app.listen(puerto, () => {
    console.log('SERVIDOR EJECUTANDOSE');
});
