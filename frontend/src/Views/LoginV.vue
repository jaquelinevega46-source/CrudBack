<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="3">
        <!-- Tarjeta del Formulario centrada con Vuetify -->
        <v-card elevation="8" class="rounded-lg pa-4">
          <v-card-title class="text-center text-h5 font-weight-bold my-3">
            INICIO DE SESIÓN
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="iniciarSesion">
              <!-- Campo Correo -->
              <v-text-field
                v-model="correo"
                label="Correo Electrónico"
                prepend-inner-icon="mdi-email"
                type="email"
                variant="outlined"
                density="compact"
                required
              ></v-text-field>

              <!-- Campo Contraseña -->
              <v-text-field
                v-model="contraseña"
                label="Contraseña"
                prepend-inner-icon="mdi-lock"
                type="password"
                variant="outlined"
                density="compact"
                required
              ></v-text-field>

              <!-- Botón de Ingreso -->
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                class="mt-4 font-weight-bold"
                :loading="cargando"
              >
                INGRESAR
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Notificación Flotante para Alertas (v-snackbar) -->
    <v-snackbar 
      v-model="mostrarSnackbar" 
      :color="esError ? 'error' : 'success'" 
      timeout="3000"
      location="top"
    >
      {{ mensaje }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="mostrarSnackbar = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 👈 Hook de navegación[cite: 5]

const router = useRouter(); // 👈 Inicialización del enrutador
const correo = ref('');
const contraseña = ref('');
const mensaje = ref('');
const esError = ref(false);
const cargando = ref(false);
const mostrarSnackbar = ref(false);

const API_URL = 'http://localhost:3000/api';

const notificar = (msg, error = false) => {
  mensaje.value = msg;
  esError.value = error;
  mostrarSnackbar.value = true;
};

const iniciarSesion = async () => {
  cargando.value = true;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        correo: correo.value,
        password: contraseña.value
      })
    });

    const data = await res.json();

    if (!res.ok) {
      notificar(data.mensaje || 'ERROR AL INICIAR SESIÓN', true);
      return;
    }

    // 1. Guardar datos del usuario en la sesión del navegador[cite: 5]
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    // 2. Redirigir a la vista de la tabla de administración (/usuarios)[cite: 5, 9]
    router.push('/usuarios');

  } catch (error) {
    notificar('ERROR DE CONEXIÓN CON EL SERVIDOR', true);
  } finally {
    cargando.value = false;
  }
};
</script>