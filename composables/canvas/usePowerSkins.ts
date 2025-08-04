// ~/composables/canvas/usePowerSkins.ts
import { computed } from 'vue'
import type { Ref } from 'vue'

const basePath = '../../assets/Canva/Powers/' // Cambia el path si es otro

export function usePowerSkins(power: Ref<string>) {
  const powerSkinUrl = computed(() => {
    switch (power.value) {
      case 'fire':
        return new URL(`${basePath}Fire.png`, import.meta.url).href
      case 'ice':
        return new URL(`${basePath}Ice.png`, import.meta.url).href
      case 'water':
        return new URL(`${basePath}Water.png`, import.meta.url).href
      case 'cobweb':
        return new URL(`${basePath}Cobweb.png`, import.meta.url).href
      default:
        return new URL(`${basePath}Default.png`, import.meta.url).href
    }
  })

  return { powerSkinUrl }
}
