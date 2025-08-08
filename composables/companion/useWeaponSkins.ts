import { computed, ref, watch, type Ref } from 'vue'
import { Powers } from '~/enums/powers'

const basePath = '../../assets/Companion/Sprites/Weapon/'

export function useWeaponSkins(power: Ref<Powers | null>) {

  const weaponSkinUrl = computed(() => {
    if (!power.value) return null

    switch (power.value) {
      case Powers.Fire:
        return new URL(`${basePath}Fire Staff.png`, import.meta.url).href
      case Powers.Ice:
        return new URL(`${basePath}Ice Staff.png`, import.meta.url).href
      case Powers.Water:
        return new URL(`${basePath}Water Staff.png`, import.meta.url).href
      case Powers.SpiderWeb:
        return null
      case Powers.Leaf:
        return new URL(`${basePath}Leaf Staff.png`, import.meta.url).href
      default:
        return null
    }
  })

  return { weaponSkinUrl }
}
