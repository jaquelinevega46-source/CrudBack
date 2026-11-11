<template>
  <v-card-text class="pa-4">
    <v-data-table
      :headers="headers"
      :items="usuarios"
      :loading="cargando"
      loading-text="Cargando usuarios..."
      no-data-text="No se encontraron usuarios registrados"
      class="elevation-1 rounded"
    >
      <!-- Formato de Columna Estatus -->
      <template v-slot:item.estatus="{ item }">
        <v-chip
          :color="item.estatus?.toUpperCase() === 'ACTIVO' ? 'success' : 'error'"
          size="small"
          font-weight="bold"
        >
          <v-icon 
            start 
            :icon="item.estatus?.toUpperCase() === 'ACTIVO' ? 'mdi-check-circle' : 'mdi-close-circle'"
          ></v-icon>
          {{ item.estatus?.toUpperCase() || 'N/A' }}
        </v-chip>
      </template>

      <!-- Formato de Columna Rol -->
      <template v-slot:item.rol="{ item }">
        <v-chip
          :color="item.rol?.toLowerCase() === 'admin' ? 'purple' : 'info'"
          size="small"
          variant="tonal"
        >
          {{ item.rol ? item.rol.toUpperCase() : 'USUARIO' }}
        </v-chip>
      </template>

      <!-- Acciones del Administrador -->
      <template v-slot:item.acciones="{ item }" v-if="esAdmin">
        <div class="d-flex gap-2">
          <v-btn
            size="small"
            :color="item.estatus?.toUpperCase() === 'ACTIVO' ? 'warning' : 'success'"
            :prepend-icon="item.estatus?.toUpperCase() === 'ACTIVO' ? 'mdi-account-off' : 'mdi-account-check'"
            @click="$emit('toggle-estatus', item)"
          >
            {{ item.estatus?.toUpperCase() === 'ACTIVO' ? 'DESACTIVAR' : 'ACTIVAR' }}
          </v-btn>

          <v-btn
            size="small"
            color="error"
            prepend-icon="mdi-delete"
            class="ml-2"
            @click="$emit('eliminar-usuario', item)"
          >
            ELIMINAR
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card-text>
</template>

<script setup>
import { computed } from 'vue';

// Definición de PROPS recibidas desde el padre (UsuarioView)
const props = defineProps({
  usuarios: { type: Array, required: true },
  cargando: { type: Boolean, default: false },
  esAdmin: { type: Boolean, default: false }
});

// Definición de EVENTOS emitidos hacia el padre (UsuarioView)
defineEmits(['toggle-estatus', 'eliminar-usuario']);

// Definición de Encabezados
const headers = computed(() => {
  const baseHeaders = [
    { title: 'ID', key: 'id', sortable: true },
    { title: 'NOMBRE', key: 'nombre', sortable: true },
    { title: 'TELÉFONO', key: 'telefono' },
    { title: 'CORREO', key: 'correo' },
    { title: 'ESTATUS', key: 'estatus', align: 'center' },
    { title: 'ROL', key: 'rol', align: 'center' }
  ];

  if (props.esAdmin) {
    baseHeaders.push({ title: 'ACCIONES', key: 'acciones', align: 'center', sortable: false });
  }

  return baseHeaders;
});
</script>