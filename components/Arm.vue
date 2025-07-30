<template>
  <img src="@/assets/Companion/Sprites/Arm/Arm Base.png" :style="{ transform: `rotate(${rotation}deg)` }" />
</template>

<script setup lang="ts">
defineProps<{ rotation: number }>()
</script>