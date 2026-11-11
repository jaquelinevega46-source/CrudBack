<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" 
  max-width="450px" persistent>
    <v-card>
      <v-card-title class="bg-primary text-white px-4 py-3">
        <v-icon icon="mdi-account-plus" class="mr-2"></v-icon>
        Registrar Nuevo Usuario
      </v-card-title>

      <v-card-text class="pt-4">
        <v-form @submit.prevent="guardar">
          <v-text-field
            v-model="formulario.nombre"
            label="Nombre Completo"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            density="compact"
            required
          ></v-text-field>

          <v-text-field
            v-model="formulario.telefono"
            label="Teléfono"
            prepend-inner-icon="mdi-phone"
            variant="outlined"
            density="compact"
            required
          ></v-text-field>

          <v-text-field
            v-model="formulario.correo"
            label="Correo Electrónico"
            type="email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            density="compact"
            required
          ></v-text-field>

          <v-text-field
            v-model="formulario.contraseña"
            label="Contraseña"
            type="password"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
            density="compact"
            required
          ></v-text-field>

          <v-select
            v-model="formulario.rol"
            label="Rol de Cuenta"
            :items="[
              { title: 'USUARIO ESTÁNDAR', value: 'usuario' },
              { title: 'ADMINISTRADOR', value: 'admin' }
            ]"
            item-title="title"
            item-value="value"
            prepend-inner-icon="mdi-shield-account"
            variant="outlined"
            density="compact"
          ></v-select>

          <v-card-actions class="justify-end px-0 pt-2">
            <v-btn color="grey" variant="text" @click="$emit('update:modelValue', false)">CANCELAR</v-btn>
            <v-btn color="primary" type="submit" variant="elevated">GUARDAR</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  modelValue: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'guardar-usuario']);

const formulario = ref({
  nombre: '',
  telefono: '',
  correo: '',
  contraseña: '',
  rol: 'usuario'
});

const guardar = () => {
  emit('guardar-usuario', { ...formulario.value });
  
  formulario.value = { nombre: '', telefono: '', correo: '', contraseña: '', rol: 'usuario' };
};
</script>