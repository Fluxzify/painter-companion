<template>
  <img src="~/assets/Companion/Sprites/Weapon/Ice Staff.png" :style="{ transform: `rotate(${rotation}deg)` }" />
</template>
a
<script setup lang="ts">
defineProps<{ rotation: number }>()
</script>