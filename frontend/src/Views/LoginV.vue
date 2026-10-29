

<template>

    <div class="card-conteiner">
        <h2>INICIO DE SESION</h2>
        <form @submit.prevent="iniciarSesion">
        <div class="field">
            <label>Correo:</label>
            <input type="email" v-model="correo"
             placeholder="correo@ex.com" required>
        </div>
        <div class="field">
            <label>CONTRASEÑA:</label>
            <input type="password" v-model="contraseña" placeholder="******" require/>
        </div>
        <button type="submit" class="btn-primary">INGRESAR</button>
        </form>
        <div v-if="mensaje" :class="[alert, esError ? 'alert-error':'alert-success']">
            {{ mensaje }}
        </div>
    </div>
</template>

<script setup>

import {ref} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter;
const correo = ref('');
const contraseña = ref('');
const mensaje = ref('');
const esError = ref(false);

const API_URL = 'http://localhost:3000/api';

const iniciarSesion = async() => {
    try{
        const res = await fetch(`${API_URL}/auth/login`, {
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({
                correo: correo.value,
                password: contraseña.value
            })
        });

        const data = await res.json();
        if (!res.ok {
            esError.value = true;
            mensaje.value = data.mensaje || 'ERROR AL INICIAR SESION';
            return;
        }
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        router.push('/perfil');
    } catch (error){
        esError.value = true;
        mensaje.value = 'ERROR DE CONEXION':
    }
};

</script>