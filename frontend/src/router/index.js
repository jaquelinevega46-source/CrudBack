import { createRouter, createWebHistory } from 'vue-router';
import LoginV from '../Views/LoginV.vue'; 
import UsuarioView from '../Views/UsuarioView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginV },
  { path: '/usuarios', name: 'Usuarios', component: UsuarioView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;