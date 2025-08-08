<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="w-full bg-purple-700 text-white shadow-md">
      <div class="container mx-auto flex justify-between items-center py-4 px-6">
        <!-- Logo o título -->
        <h1 class="text-2xl font-bold">Paint Like a Wiz</h1>

        <!-- Botones -->
        <nav class="space-x-4">
          <NuxtLink to="/" class="btn btn-soft btn-primary">Home</NuxtLink>
          <NuxtLink to="Canvas" class="btn btn-soft btn-primary">Draw here!</NuxtLink>
          
          <template v-if="!auth.isLoggedIn">
            <NuxtLink to="register" class="btn btn-soft btn-primary">Sign up!</NuxtLink>
          </template>
          <template v-else>
            <button @click="logout" class="btn btn-soft btn-danger">Logout</button>
          </template>

        </nav>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="flex-grow p-6">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-purple-900 text-gray-300 p-4 text-center">
      &copy; 2025 Mago Interactivo. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push('/login'); // Opcional: redirige a la página de login después de cerrar sesión
}
</script>

<style scoped>
/* Estilos globales del layout si quieres */
</style>
