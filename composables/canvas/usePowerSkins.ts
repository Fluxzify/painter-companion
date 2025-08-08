// ~/composables/canvas/usePowerSkins.ts
import { computed } from 'vue'
import type { Ref } from 'vue'
import { Powers } from '~/enums/powers'

const basePath = '../../assets/Canva/Powers/' // Cambia el path si es otro

export function usePowerSkins(power: Powers) {
  const powerSkinUrl = computed(() => {
    switch (power) {
      case 'fire':
        return new URL(`${basePath}Fire.png`, import.meta.url).href
      case 'ice':
        return new URL(`${basePath}Ice.png`, import.meta.url).href
      case 'water':
        return new URL(`${basePath}Water.png`, import.meta.url).href
      case 'spiderweb':
        return new URL(`${basePath}SpiderWeb.png`, import.meta.url).href
         case 'leaf':
        return new URL(`${basePath}Leaf.png`, import.meta.url).href
      default:
        return new URL(`${basePath}Ice.png`, import.meta.url).href
    }
  })

  return { powerSkinUrl }
}
