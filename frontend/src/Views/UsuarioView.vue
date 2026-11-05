<template>
  <div class="admin-container">
    <header class="header">
      <h2>GESTIÓN DE USUARIOS</h2>
      <div class="user-info">
       <span>Bienvenido: <strong>{{ usuarioActual?.nombre }}</strong> 
        ({{ usuarioActual?.rol?.toUpperCase() }})
      </span> 
      </div>
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
             <th>ROL</th>


            <!-- control de administrador -->
            <th v-if="esAdmin">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in listaUsuarios" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.nombre }}</td>
            <td>{{ user.telefono }}</td>
            <td>{{ user.correo }}</td>
            <td>{{ user.rol ? user.rol.toUpperCase(): 'USUARIO' }}</td>
            <td>
              <span :class="['badge', user.estatus ? user.estatus.toLowerCase() : '']">
                {{ user.estatus ? user.estatus.toUpperCase() : 'N/A' }}
              </span>
            </td>
            <!-- CAMBIO DE ESTATUS -->
            <td v-if="esAdmin">
              <button 
                @click="toggleEstatus(user)" 
                :class="['btn-action', user.estatus && user.estatus.toUpperCase() === 'ACTIVO' ? 'btn-danger' : 'btn-success']"
              >
                {{ user.estatus && user.estatus.toUpperCase() === 'ACTIVO' ? 'DESACTIVAR' : 'ACTIVAR' }}
              </button>

              <!-- ELIMINAR USUARIO -->
               <button @click="confirmarEliminacion(user)" class="btn-action btn-delete">
                ELIMINAR
               </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CREAR USUARIO -->
    <div v-if="mostrarModal" class=""modal-overlay>
      <div class="modal-content">
        <h3>REGISTRAR NUEVO USUARIO</h3>
        <form @submit.prevent="guardarUsuario">
          <div class="form-group">
            <label>NOMBRE:</label>
            <input type="text" v-model="nuevoUsuario.nombre" required placeholder="Ej. Carlos Ruiz" />
          </div>
          <div class="form-group">
            <label>TELEFONO:</label>
            <input type="text" v-model="nuevoUsuario.telefono" required placeholder="Ej. 5512345678" />
          </div>
          <div class="form group">
            <label>CORREO:</label>
            <input type="email" v-model="nuevoUsuario.correo" required placeholder="correo@ejemplo.com" />
          </div>
          <div class="form-group">
            <label>CONTRASEÑA:</label>
            <input type="password" v-model="nuevoUsuario.contraseña" required placeholder="******" />
          </div>
          <div class="form-group">
            <label>ROL:</label>
            <select v-model="nuevoUsuario.rol">
              <option value="usuario">USUARIO</option>
              <option value="admin">ADMINISTRADOR</option>
            </select>
          </div>

          <div class="modal-buttons">
            <button type="submit" class="btn-success">GUARDAR</button>
            <button type="button" @click="cerrarModal" class="btn-logout">CANCELAR</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const listaUsuarios = ref([]);
const mensaje = ref('');
const esError = ref(false);
const usuarioActual = ref(null);

// CONTROL
const mostrarModal = ref(false);
const nuevoUsuario = ref({
  nombre: '',
  telefono: '',
  correo: '',
  contraseña: '',
  rol: 'usuario'
});

const API_URL = 'http://localhost:3000/api';

// verificacion del rol de la cuenta
const esAdmin = computed(() => {
  return usuarioActual.value && usuarioActual.value.rol === 'admin';
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

const toggleEstatus = async (user) => { //solicitud de acciones denegada
  if (!esAdmin.value){
    alert('NO TIENES PERMISOS PARA REALIZAR ESTA ACCION');
    return;
  }
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


//GUARDAR USUARIO
const guardarUsuario = async () => {
  try{
    const res = await fetch(`${API_URL}/usuarios`,{
      method: 'POST',
      headers:{ 'Content-Type':'application/json'},
      body: JSON.stringify(nuevoUsuario.value)
    });
    const data = await res.json();

    if(res.ok){
      esError.value = false;
      mensaje.value = `USUARIO ${nuevoUsuario.value.nombre} CREADO`;
      cerrarModal();
      obtenerUsuarios();
    }else {
      esError.value = true;
      mensaje.value = data.mensaje || 'ERROR AL CREAR USUARIO';
    }
  }catch (error){
    esError.value = true;
    mensaje.value = 'ERROR DE CONEXION';
  }
};

//ELIMINAR USUARIO
const confirmarEliminacion = async (user) => {
  if (!confirm(`ESTAS SEGURO DE QUE QUIERES ELIMINAR ESTE USUARIO ${user.nombre}`)){
    return;
  }
  try {
    const res = await fetch(`${API_URL}/usuarios`,{
      method: 'DELETE',
      headers: { 'Content-TYpe': 'application/json'},
      body: JSON.stringify({id: user.id})
    });

    const data = await res.json();

    if (res.ok){
      esError.value = false;
      mensaje.value = 'USUARIO ELIMINADO';
      obtenerUsuarios();
    } else {
      esError.value = true;
      mensaje.value = data.mensaje || 'ERROR AL ELIMINAR';
    }
  } catch (error){
    esError.value = true;
    mensaje.value = 'ERROR DE CONEXION';
  }
};

const cerrarModal = ()=> {
  mostrarModal.value = false;
  nuevoUsuario.value = {
    nombre:'',
    telefono:'',
    correo:'',
    contraseña:'',
    rol: 'usuario'
  };
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