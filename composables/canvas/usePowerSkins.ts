import { computed } from 'vue'
import type { Ref } from 'vue'
import { Powers } from '~/enums/powers'

const basePath = '../../assets/Canva/Powers/' // Cambia el path si es otro

export function usePowerSkins(power: Powers) {
  const powerSkinUrl = computed(() => {
    switch (power) {
      case Powers.Fire:
        return new URL(`${basePath}Fire.png`, import.meta.url).href
      case Powers.Ice:
        return new URL(`${basePath}Ice.png`, import.meta.url).href
      case Powers.Water:
        return new URL(`${basePath}Water.png`, import.meta.url).href
      case Powers.SpiderWeb:
        return new URL(`${basePath}SpiderWeb.png`, import.meta.url).href
      case Powers.Leaf:
        return new URL(`${basePath}Leaf.png`, import.meta.url).href
      default:
        // Por si acaso, devuelve Ice como fallback
        return new URL(`${basePath}Ice.png`, import.meta.url).href
    }
  })

  return { powerSkinUrl }
}
