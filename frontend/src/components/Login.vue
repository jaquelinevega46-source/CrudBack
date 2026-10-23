<template>
    <div class="card-container">
        <h2>INICIO DE SESION</h2>
        <form @submit.prevent=""iniciarSesion>
            <div class="field">
                <label>COOREO:</label>
                <input type="email" v-model="correo" placeholder="correo@ejemplo.com" required />
            </div>

            <div class="field">
                <label>CONTRASEÑA:</label>
                <input type="passwprd" v-model="contraseña" placeholder="******" require />
            </div>

            <button type="submit" class="btn-primary">INGRESAR</button>
        </form>
        <div v-if="mensaje" :class="['alert', esError ? 'alert-error' : 'alert-success']">
            {{ mensaje }}
        </div>

        <div v-if="usuario" class="user-card">
            <h3>DATOS DEL USUARIO</h3>
            <p><strong>ID:</strong>{{ usuario.id }}</p>
            <p><strong>NOMBRE:</strong>{{ usuario.nombre }}</p>
            <p><strong>CORREO:</strong>{{ usuario.correo }}</p>
            <p><strong>ESTATUS:</strong>
            <span :class="usuario.estatus">{{ usuario.estatus.toUpperCase() }}</span>
            </p>

            <button @click="toggleEstatus" :class="usuario.estatus == 'activo' ? 'btn-danger' :'btn-succes'"
            > {{ usuario.estatus == 'activo' ? 'DESACTIVAR CUENTA' : 'ACTIVAR CUENTA' }} 
            </button>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue';

const correo = ref('');
const contraseña = ref('');
const mensaje = ref('');
const esError = ref(false);
const usuario = ref(null);

const API_URL = 'http://localhost:3000/api';

const iniciarSesion = async () => {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo: correo.value,
                contraseña: contraseña.value
            })
        });

        if(!res.ok) {
            esError.value = true;
            mensaje.value = data.mensaje;
            usuario.value = null;
            return;
        }

        esError.value = false;
        mensaje.value = data.mensaje;
        usuario.value = data.usuario;
    } catch (error){
        esError.value = true;
        mensaje.value = 'ERROR DE CONEXION CON EL SERVIDOR';
    }
};

const toggleEstatus = async () => {
    const nuevoEstatus = usuario.value.estatus === 'activo' ? 'inactivo' : 'activo';

    try{
        const res = await fetch(`${API_URL}/usuarios/estatus`,{
            method: 'PUT',
            headers: { 'Content-TYpe' : 'application/json' },
            body: JSON.stringify({
                id: usuario.value.id,
                estatus: nuevoEstatus
            })
        });

        const data = await res.json();

        if(res.ok){
            usuario.value.estatus = nuevoEstatus;
            esError.value = false;
            mensaje.value = data.mensaje;
        } else {
            esError.value = true;
            mensaje.value = data.mensaje;
        }
    } catch (error){
        esError.value = true;
        mensaje.value = 'ERROR DE ACTUALIZACION';
    }
};

</script>
