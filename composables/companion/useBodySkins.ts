import { computed, type Ref } from 'vue'
import { Powers } from '~/enums/powers'

const basePath = '../../assets/Companion/Sprites/Body/'

export function useBodySkins(power: Ref<Powers | null>) {
  const bodySkinUrl = computed(() => {
    switch (power.value) {
    
      case Powers.SpiderWeb:
        return new URL(`${basePath}Spider.png`, import.meta.url).href


          default:

        return new URL(`${basePath}Wizard.png`, import.meta.url).href
    }
  })

  return { bodySkinUrl }
}
