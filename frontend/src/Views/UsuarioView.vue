<template>
  <v-container class="py-6" max-width="1200px">
    <v-card elevation="4" class="rounded-lg">
      
      <v-card-title class="d-flex align-center justify-space-between bg-primary text-white px-6 py-4">
        <div class="d-flex align-center gap-2">
          <v-icon icon="mdi-account-group" size="large" class="mr-2"></v-icon>
          <span class="text-h6 font-weight-bold">GESTIÓN DE USUARIOS</span>
        </div>
        
        <div class="d-flex align-center gap-3">
          <span class="text-body-2 mr-3">
            Bienvenido: <strong>{{ usuarioActual?.nombre }}</strong> 
            <v-chip size="small" color="white" text-color="primary" class="ml-2 font-weight-bold">
              {{ usuarioActual?.rol?.toUpperCase() }}
            </v-chip>
          </span>

          <v-btn 
            v-if="esAdmin" 
            color="success" 
            prepend-icon="mdi-account-plus" 
            variant="elevated"
            @click="mostrarModal = true"
          >
            CREAR USUARIO
          </v-btn>

          <v-btn 
            color="error" 
            prepend-icon="mdi-logout" 
            variant="outlined" 
            class="ml-2"
            @click="cerrarSesion"
          >
            SALIR
          </v-btn>
        </div>
      </v-card-title>

      <!-- Tabla de Usuarios -->
      <UserTable 
        :usuarios="listaUsuarios" 
        :cargando="cargando" 
        :es-admin="esAdmin" 
        @toggle-estatus="toggleEstatus"
        @eliminar-usuario="confirmarEliminacion"
      />
    </v-card>

    <!-- Modal Crear Usuario -->
    <UserModal 
      v-model="mostrarModal" 
      @guardar-usuario="guardarUsuario"
    />

    
    <v-snackbar v-model="mostrarSnackbar" :color="esError ? 'error' : 'success'" timeout="3000">
      {{ mensaje }}
      <template v-slot:actions>
        <v-btn color="red" variant="text" @click="mostrarSnackbar = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// componentes independientes
import UserTable from '../components/UserTable.vue';
import UserModal from '../components/UserModal.vue';

const router = useRouter();
const listaUsuarios = ref([]);
const usuarioActual = ref(null);
const cargando = ref(false);
const mensaje = ref('');
const esError = ref(false);
const mostrarSnackbar = ref(false);
const mostrarModal = ref(false);

const API_URL = 'http://localhost:3000/api';

const esAdmin = computed(() => {
  return usuarioActual.value && usuarioActual.value.rol?.toLowerCase() === 'admin';
});

onMounted(() => {
  const sesion = localStorage.getItem('usuario');
  if (!sesion) {
    router.push('/login');
    return;
  }
  usuarioActual.value = JSON.parse(sesion);
  obtenerUsuarios();
});

const notificar = (msg, error = false) => {
  mensaje.value = msg;
  esError.value = error;
  mostrarSnackbar.value = true;
};

const obtenerUsuarios = async () => {
  cargando.value = true;
  try {
    const res = await fetch(`${API_URL}/usuarios`);
    const data = await res.json();
    if (res.ok) {
      listaUsuarios.value = data;
    } else {
      notificar('Error al obtener la lista de usuarios', true);
    }
  } catch (error) {
    notificar('ERROR DE CONEXIÓN CON EL SERVIDOR', true);
  } finally {
    cargando.value = false;
  }
};

const toggleEstatus = async (user) => {
  if (!esAdmin.value) return;

  const estatusActual = user.estatus ? user.estatus.toUpperCase() : 'INACTIVO';
  const nuevoEstatus = estatusActual === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

  try {
    const res = await fetch(`${API_URL}/usuarios/es`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: user.id,
        estatus: nuevoEstatus
      })
    });

    const data = await res.json();

    if (res.ok) {
      user.estatus = nuevoEstatus;
      notificar(`Estatus de ${user.nombre} cambiado a ${nuevoEstatus}`);
    } else {
      notificar(data.mensaje || 'Error al cambiar estatus', true);
    }
  } catch (error) {
    notificar('ERROR AL COMUNICAR CON EL SERVIDOR', true);
  }
};

const guardarUsuario = async (datosNuevoUsuario) => {
  try {
    const res = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosNuevoUsuario)
    });

    const data = await res.json();

    if (res.ok) {
      notificar(`Usuario ${datosNuevoUsuario.nombre} creado con éxito`);
      mostrarModal.value = false;
      obtenerUsuarios();
    } else {
      notificar(data.mensaje || 'Error al crear usuario', true);
    }
  } catch (error) {
    notificar('ERROR AL CONECTAR CON EL SERVIDOR', true);
  }
};

const confirmarEliminacion = async (user) => {
  if (!confirm(`¿Estás seguro de que deseas eliminar a ${user.nombre}?`)) {
    return;
  }

  try {
    const res = await fetch(`${API_URL}/usuarios`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id })
    });

    const data = await res.json();

    if (res.ok) {
      notificar(`Usuario ${user.nombre} eliminado correctamente`);
      obtenerUsuarios();
    } else {
      notificar(data.mensaje || 'Error al eliminar usuario', true);
    }
  } catch (error) {
    notificar('ERROR AL COMUNICAR CON EL SERVIDOR', true);
  }
};

const cerrarSesion = () => {
  localStorage.removeItem('usuario');
  router.push('/login');
};
</script>