import { computed, type Ref } from 'vue'
import { Powers } from '~/enums/powers'

const basePath = '../../assets/Companion/Sprites/Arm/'

export function useArmSkins(power: Ref<Powers | null>) {
  const armSkinUrl = computed(() => {
    switch (power.value) {
     
      case Powers.SpiderWeb:
        return new URL(`${basePath}Spider.png`, import.meta.url).href
   
      default:
        // Skin por defecto si power.value es null o no reconocido
        return new URL(`${basePath}Wizard.png`, import.meta.url).href
    }
  })

  return { armSkinUrl }
}
