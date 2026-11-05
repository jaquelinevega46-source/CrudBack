 

<template>

    <div class="card-conteiner">
        <h2>INICIO DE SESION</h2>
        <form @submit.prevent="iniciarSesion">
        <div class="field">
            <label>Correo:</label>
            <input type="email" v-model="correo" placeholder="correo@ex.com" required>
        </div>
        <div class="field">
            <label>CONTRASEÑA:</label>
            <input type="password" v-model="contraseña" placeholder="******" required/>
        </div>
        <button type="submit" class="btn-primary">INGRESAR</button>
        </form>
        <div v-if="mensaje" :class="['alert', esError ? 'alert-error':'alert-success']">
            {{ mensaje }}
        </div>
    </div>
</template>

<script setup>

import {ref} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();
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

        if (!res.ok) {
            esError.value = true;
            mensaje.value = data.mensaje || 'ERROR AL INICIAR SESION';
            return;
        }

        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        router.push('/usuarios');
    } catch (error){
        esError.value = true;
        mensaje.value = 'ERROR DE CONEXION';
    }
};

</script>

<style scoped>
.card-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  font-family: sans-serif;
  background-color: #ffffff;
  color: #333;
}
.field {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}
.field label {
  font-weight: bold;
  margin-bottom: 5px;
}
.field input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.btn-primary {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.alert {
  margin-top: 15px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
}
.alert-error { background-color: #f8d7da; color: #721c24; }
.alert-success { background-color: #d4edda; color: #155724; }
</style>