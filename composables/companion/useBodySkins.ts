import { computed } from 'vue'
import type { Ref } from 'vue'

const basePath = '../../assets/Companion/Sprites/Body/'

export function useBodySkins(skin: Ref<string>) {
  const bodySkinUrl = computed(() => {
    switch (skin.value) {
      case 'wizard':
        return new URL(`${basePath}Wizard.png`, import.meta.url).href
      case 'knight':
        return new URL(`${basePath}Knight.png`, import.meta.url).href
      default:
        return new URL(`${basePath}Default.png`, import.meta.url).href
    }
  })

  return { bodySkinUrl }
}