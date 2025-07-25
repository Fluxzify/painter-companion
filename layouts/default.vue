<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
   <header class="w-full bg-purple-700 text-white shadow-md">
    <div class="container mx-auto flex justify-between items-center py-4 px-6">
      <!-- Logo o título -->
      <h1 class="text-2xl font-bold">Compañero Interactivo</h1>

      <!-- Botones soft -->
      <nav class="space-x-4">
        <NuxtLink to="/" class="btn btn-soft btn-primary">Inicio</NuxtLink>
        <NuxtLink to="/index-refactorizado" class="btn btn-soft btn-secondary">index nuevo</NuxtLink>
        <button class="btn btn-primary">Link</button>
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

<script setup>
// Aquí podrías agregar lógica si quieres (por ejemplo para navegación dinámica)
</script>

<style scoped>
/* Estilos globales del layout si quieres */
</style>



