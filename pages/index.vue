<script setup>  
import  InteractiveCanvas  from '~/components/InteractiveCanvas.vue'
import CompanionRefactor from '~/components/Companion-refactor.vue'
</script>


<template>



<InteractiveCanvas/>
  <div class="parent-wrapper">
    <CompanionRefactor />
  </div>

</template>

<style>
.parent-wrapper {
  display: flex;
  justify-content: center; /* centro horizontal */
  align-items: flex-end;   /* al fondo vertical */
  height: 100vh;
}
</style>