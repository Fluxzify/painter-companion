import { computed } from 'vue'
import type { Ref } from 'vue'

const basePath = '../../assets/Companion/Sprites/Weapon/'

export function useWeaponSkins(skin: Ref<string>) {
  const weaponSkinUrl = computed(() => {
    switch (skin.value) {
      case 'iceStaff':
        return new URL(`${basePath}Ice Staff.png`, import.meta.url).href
      case 'fireStaff':
        return new URL(`${basePath}Fire Staff.png`, import.meta.url).href
      case 'dynamiteStaff':
        return new URL(`${basePath}Dynamite Staff.png`, import.meta.url).href
      default:
        return new URL(`${basePath}Ice Staff.png`, import.meta.url).href
    }
  })

  return { weaponSkinUrl }
}