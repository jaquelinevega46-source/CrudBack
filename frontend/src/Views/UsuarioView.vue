<template>
  <div class="admin-container">
    <header class="header">
      <h2>GESTIÓN DE USUARIOS</h2>
      <button @click="cerrarSesion" class="btn-logout">CERRAR SESIÓN</button>
    </header>

    <div v-if="mensaje" :class="['alert', esError ? 'alert-error' : 'alert-success']">
      {{ mensaje }}
    </div>

    <div class="table-wrapper">
      <table class="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>NOMBRE</th>
            <th>TELÉFONO</th>
            <th>CORREO</th>
            <th>ESTATUS</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in listaUsuarios" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.nombre }}</td>
            <td>{{ user.telefono }}</td>
            <td>{{ user.correo }}</td>
            <td>
              <span :class="['badge', user.estatus ? user.estatus.toLowerCase() : '']">
                {{ user.estatus ? user.estatus.toUpperCase() : 'N/A' }}
              </span>
            </td>
            <td>
              <button 
                @click="toggleEstatus(user)" 
                :class="['btn-action', user.estatus && user.estatus.toUpperCase() === 'ACTIVO' ? 'btn-danger' : 'btn-success']"
              >
                {{ user.estatus && user.estatus.toUpperCase() === 'ACTIVO' ? 'DESACTIVAR' : 'ACTIVAR' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const listaUsuarios = ref([]);
const mensaje = ref('');
const esError = ref(false);

const API_URL = 'http://localhost:3000/api';

onMounted(() => {
  const sesion = localStorage.getItem('usuario');
  if (!sesion) {
    router.push('/login');
    return;
  }
  obtenerUsuarios();
});

const obtenerUsuarios = async () => {
  try {
    const res = await fetch(`${API_URL}/usuarios`);
    const data = await res.json();
    if (res.ok) {
      listaUsuarios.value = data;
    } else {
      esError.value = true;
      mensaje.value = 'Error al obtener la lista de usuarios';
    }
  } catch (error) {
    esError.value = true;
    mensaje.value = 'ERROR DE CONEXIÓN CON EL SERVIDOR';
  }
};

const toggleEstatus = async (user) => {
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
      esError.value = false;
      mensaje.value = `Estatus de ${user.nombre} cambiado a ${nuevoEstatus}`;
    } else {
      esError.value = true;
      mensaje.value = data.mensaje || 'Error al cambiar estatus';
    }
  } catch (error) {
    esError.value = true;
    mensaje.value = 'ERROR AL COMUNICAR CON EL SERVIDOR';
  }
};

const cerrarSesion = () => {
  localStorage.removeItem('usuario');
  router.push('/login');
};
</script>

<style scoped>
.admin-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.btn-logout {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.table-wrapper {
  overflow-x: auto;
}
.users-table {
  width: 100%;
  border-collapse: collapse;
}
.users-table th, .users-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}
.users-table th {
  background-color: #f4f4f4;
}
.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
}
.activo { color: #28a745; background-color: #e6f4ea; }
.inactivo { color: #dc3545; background-color: #fce8e6; }
.btn-action {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-weight: bold;
}
.btn-danger { background-color: #dc3545; }
.btn-success { background-color: #28a745; }
.alert {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
}
.alert-error { background-color: #f8d7da; color: #721c24; }
.alert-success { background-color: #d4edda; color: #155724; }
</style>