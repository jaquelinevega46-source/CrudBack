// const express = require('express');
// const app = express();
// const rutaUsuarios = require('./routes/usuario.js');

// const puerto = 3000;
// app.use(express.json());
// app.use('/api/usuarios', rutaUsuarios);
// app.listen(puerto, () => {
//     console.log('SERVIDOR EJECUTANDOSE');
// });


require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const usuarioRutas = require('./routes/usuario');
const authRutas = require('./routes/auth'); // 👈 Nueva ruta de login

app.use('/api/usuarios', usuarioRutas);
app.use('/api/auth', authRutas); // 👈 Endpoint base para autenticación

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SERVIDOR EJECUTANDOSE EN EL PUERTO ${PORT}`);
});