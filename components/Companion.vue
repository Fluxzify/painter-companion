<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, reactive } from 'vue'
import { useArmSkins } from '@/composables/companion/useArmSkins'
import { useBodySkins } from '@/composables/companion/useBodySkins'
import { useWeaponSkins } from '@/composables/companion/useWeaponSkins'
import { useArm } from '@/composables/companion/useArm'
import { useBody } from '@/composables/companion/useBody'
import { useWeapon } from '@/composables/companion/useWeapon'
import { useRotation } from '~/composables/companion/useRotation'
import { useMousePosCanva } from '~/composables/canvas/useMousePosCanva'
import { Powers } from '~/enums/powers'
import { toRef } from 'vue'

const props = defineProps<{ canvas: HTMLCanvasElement | null; power: Powers | null }>()
console.log('Canvas Companion Props:', props)

const powerRef = toRef(props, 'power')

const { weaponSkinUrl } = useWeaponSkins(powerRef)
const { armSkinUrl } = useArmSkins(powerRef)
const { bodySkinUrl } = useBodySkins(powerRef)

const canvasWidth = ref(700)
const canvasHeight = ref(700)
const mousePosition = reactive({ x: 0, y: 0 })

let updateMouse: ((event: MouseEvent) => void) | null = null

const loadedArmImg = ref<HTMLImageElement | null>(null)
const loadedBodyImg = ref<HTMLImageElement | null>(null)
const loadedWeaponImg = ref<HTMLImageElement | null>(null)

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Watch para cargar y actualizar la imagen del arma
watch(
  () => weaponSkinUrl.value,
  async (newUrl) => {
    if (!newUrl) {
      loadedWeaponImg.value = null
      return
    }
    try {
      loadedWeaponImg.value = await loadImage(newUrl)
      console.log('Weapon skin updated:', newUrl)
    } catch (error) {
      console.error('Failed to load weapon skin:', error)
      loadedWeaponImg.value = null
    }
  },
  { immediate: true }
)

// Watch para cargar y actualizar la imagen del brazo
watch(
  () => armSkinUrl.value,
  async (newUrl) => {
    if (!newUrl) {
      loadedArmImg.value = null
      return
    }
    try {
      loadedArmImg.value = await loadImage(newUrl)
      console.log('Arm skin updated:', newUrl)
    } catch (error) {
      console.error('Failed to load arm skin:', error)
      loadedArmImg.value = null
    }
  },
  { immediate: true }
)

// Watch para cargar y actualizar la imagen del cuerpo
watch(
  () => bodySkinUrl.value,
  async (newUrl) => {
    if (!newUrl) {
      loadedBodyImg.value = null
      return
    }
    try {
      loadedBodyImg.value = await loadImage(newUrl)
      console.log('Body skin updated:', newUrl)
    } catch (error) {
      console.error('Failed to load body skin:', error)
      loadedBodyImg.value = null
    }
  },
  { immediate: true }
)

const canvasCompanionRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null

let arm: ReturnType<typeof useArm> | null = null
let body: ReturnType<typeof useBody> | null = null
let weapon: ReturnType<typeof useWeapon> | null = null

function initializeCharacter() {
  const centerX = canvasWidth.value / 2
  const centerY = canvasHeight.value / 2

  const rotation = useRotation({ x: centerX, y: centerY }, mousePosition)

  arm = useArm(centerX / 1.8, centerY / 1.2, rotation.angle.value)
  body = useBody(centerX, centerY)
  weapon = useWeapon(centerX / 1.3, centerY / 1.3, rotation.angle.value)
}

function renderLoop() {
  if (!ctx || !arm || !body || !weapon) return

  const origin = {
    x: canvasWidth.value / 2,
    y: canvasHeight.value / 2,
  }

  const rotation = useRotation(origin, mousePosition)
  arm.rotation.value = rotation.angle.value
  weapon.rotation.value = rotation.angle.value

  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

  arm.draw(ctx, loadedArmImg.value, canvasWidth.value / 3, canvasHeight.value / 3)
  weapon.draw(ctx, loadedWeaponImg.value, canvasWidth.value, canvasHeight.value)
  body.draw(ctx, loadedBodyImg.value, canvasWidth.value, canvasHeight.value)

  requestAnimationFrame(renderLoop)
}

onMounted(async () => {
  const canvas = canvasCompanionRef.value
  if (!canvas) return

  ctx = canvas.getContext('2d')
  if (!ctx) return

  canvasWidth.value = canvas.width
  canvasHeight.value = canvas.height

  // Cargar imágenes iniciales
  if (armSkinUrl.value) {
    loadedArmImg.value = await loadImage(armSkinUrl.value)
  }
  if (bodySkinUrl.value) {
    loadedBodyImg.value = await loadImage(bodySkinUrl.value)
  }
  if (weaponSkinUrl.value) {
    loadedWeaponImg.value = await loadImage(weaponSkinUrl.value)
  }

  initializeCharacter()
  renderLoop()
})

watch(
  () => props.canvas,
  (newCanvasElement, oldCanvasElement) => {
    if (oldCanvasElement && updateMouse) {
      oldCanvasElement.removeEventListener('mousemove', updateMouse)
    }

    if (newCanvasElement) {
      const result = useMousePosCanva(newCanvasElement, mousePosition)
      updateMouse = result.updateMouse

      newCanvasElement.addEventListener('mousemove', (e) => {
        if (updateMouse) {
          updateMouse(e)
        }
      })
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (props.canvas && updateMouse) {
    props.canvas.removeEventListener('mousemove', updateMouse)
  }
})
</script>


<template>
  <canvas
    ref="canvasCompanionRef"
    :width="canvasWidth"
    :height="canvasHeight"
    :style="{ top: '109px', left: '0px' }"
  />
</template>

<style scoped>

</style>
